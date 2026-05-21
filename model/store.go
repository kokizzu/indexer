package model

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/kokizzu/gotro/X"
	"indexer/conf"
)

type Store struct {
	cfg    conf.Config
	client *http.Client
}

const clickHouseTimeLayout = "2006-01-02 15:04:05.999"

func NewStore(cfg conf.Config, client *http.Client) *Store {
	return &Store{cfg: cfg, client: client}
}

func (s *Store) EnsureSchema() error {
	if err := s.ExecRaw("CREATE DATABASE IF NOT EXISTS "+quoteIdent(s.cfg.ClickHouseDB), ""); err != nil {
		return err
	}
	return s.ApplyMigrations("migrations")
}

func (s *Store) ApplyMigrations(dir string) error {
	if err := s.Exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
  version String,
  applied_at DateTime DEFAULT now()
) ENGINE = MergeTree
ORDER BY version`); err != nil {
		return err
	}

	appliedRows, err := s.Query("SELECT version FROM schema_migrations FORMAT JSONEachRow")
	if err != nil {
		return err
	}
	applied := map[string]struct{}{}
	for _, row := range appliedRows {
		applied[X.ToS(row["version"])] = struct{}{}
	}

	entries, err := os.ReadDir(dir)
	if err != nil {
		return err
	}
	names := make([]string, 0, len(entries))
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".sql") {
			names = append(names, entry.Name())
		}
	}
	sort.Strings(names)
	for _, name := range names {
		if _, done := applied[name]; done {
			continue
		}
		path := filepath.Join(dir, name)
		raw, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		for _, stmt := range splitSQLStatements(string(raw)) {
			if strings.TrimSpace(stmt) == "" {
				continue
			}
			if err := s.Exec(stmt); err != nil {
				return fmt.Errorf("%s: %w", name, err)
			}
		}
		if err := s.Exec("INSERT INTO schema_migrations (version, applied_at) VALUES (" + quoteSQL(name) + ", now())"); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) LoadExistingEntries() (map[string]string, error) {
	entries, err := s.LoadEntries()
	if err != nil {
		return nil, err
	}
	out := make(map[string]string, len(entries))
	for _, entry := range entries {
		out[entry.Path] = entry.Fingerprint
	}
	return out, nil
}

func (s *Store) LoadEntries() ([]FileEntry, error) {
	rows, err := s.Query("SELECT path, dir, base, ext, root, rootKind, is_dir, size, subtree_size, subtree_files, subtree_dirs, toString(modified_at) AS modifiedAt, fingerprint, content FROM entries FORMAT JSONEachRow")
	if err != nil {
		if strings.Contains(err.Error(), "doesn't exist") {
			return []FileEntry{}, nil
		}
		return nil, err
	}
	out := make([]FileEntry, 0, len(rows))
	for _, row := range rows {
		modifiedAt, _ := time.Parse(clickHouseTimeLayout, X.ToS(row["modifiedAt"]))
		out = append(out, FileEntry{
			Path:        X.ToS(row["path"]),
			Dir:         X.ToS(row["dir"]),
			Base:        X.ToS(row["base"]),
			Ext:         X.ToS(row["ext"]),
			Root:        X.ToS(row["root"]),
			RootKind:    X.ToS(row["rootKind"]),
			IsDir:       uint8(X.ToI(row["is_dir"])),
			Size:        X.ToI(row["size"]),
			SubtreeSize: X.ToI(row["subtree_size"]),
			SubtreeFiles: int(X.ToI(row["subtree_files"])),
			SubtreeDirs:  int(X.ToI(row["subtree_dirs"])),
			ModifiedAt:  modifiedAt.UTC(),
			Fingerprint: X.ToS(row["fingerprint"]),
			Content:     X.ToS(row["content"]),
		})
	}
	return out, nil
}

func (s *Store) ReplaceEntries(entries []FileEntry) error {
	if err := s.Exec("TRUNCATE TABLE entries"); err != nil {
		return err
	}
	if len(entries) == 0 {
		return nil
	}
	const batchSize = 500
	for start := 0; start < len(entries); start += batchSize {
		end := start + batchSize
		if end > len(entries) {
			end = len(entries)
		}
		var b strings.Builder
		for _, entry := range entries[start:end] {
			raw, err := marshalEntryForClickHouse(entry)
			if err != nil {
				return err
			}
			b.Write(raw)
			b.WriteByte('\n')
		}
		if err := s.Insert("INSERT INTO entries FORMAT JSONEachRow", b.String()); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) BackupEntries(path string) error {
	entries, err := s.LoadEntries()
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	w := bufio.NewWriter(f)
	defer w.Flush()
	for _, entry := range entries {
		raw, err := json.Marshal(entry)
		if err != nil {
			return err
		}
		if _, err := w.Write(raw); err != nil {
			return err
		}
		if err := w.WriteByte('\n'); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) RestoreEntries(path string) error {
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	entries := make([]FileEntry, 0, 1024)
	for scanner.Scan() {
		line := bytes.TrimSpace(scanner.Bytes())
		if len(line) == 0 {
			continue
		}
		var entry FileEntry
		if err := json.Unmarshal(line, &entry); err != nil {
			return err
		}
		entries = append(entries, entry)
	}
	if err := scanner.Err(); err != nil {
		return err
	}
	return s.ReplaceEntries(entries)
}

func (s *Store) InsertManageHistory(entry ManageHistoryEntry) error {
	payload := map[string]any{
		"id":          entry.ID,
		"action":      entry.Action,
		"status":      entry.Status,
		"src_path":    entry.SrcPath,
		"dst_path":    entry.DstPath,
		"message":     entry.Message,
		"created_at":  entry.CreatedAt,
		"started_at":  entry.StartedAt,
		"finished_at": entry.FinishedAt,
	}
	raw, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	return s.Insert("INSERT INTO manage_history FORMAT JSONEachRow", string(raw)+"\n")
}

func (s *Store) ListManageHistory(limit int) ([]ManageHistoryEntry, error) {
	if limit <= 0 {
		limit = 100
	}
	rows, err := s.Query("SELECT id, action, status, src_path, dst_path, message, toString(created_at) AS createdAt, toString(started_at) AS startedAt, toString(finished_at) AS finishedAt FROM manage_history ORDER BY created_at DESC LIMIT " + strconv.Itoa(limit) + " FORMAT JSONEachRow")
	if err != nil {
		if strings.Contains(err.Error(), "doesn't exist") {
			return []ManageHistoryEntry{}, nil
		}
		return nil, err
	}
	out := make([]ManageHistoryEntry, 0, len(rows))
	for _, row := range rows {
		out = append(out, ManageHistoryEntry{
			ID:         X.ToS(row["id"]),
			Action:     X.ToS(row["action"]),
			Status:     X.ToS(row["status"]),
			SrcPath:    X.ToS(row["src_path"]),
			DstPath:    X.ToS(row["dst_path"]),
			Message:    X.ToS(row["message"]),
			CreatedAt:  X.ToS(row["createdAt"]),
			StartedAt:  X.ToS(row["startedAt"]),
			FinishedAt: X.ToS(row["finishedAt"]),
		})
	}
	return out, nil
}

func searchWhere(q, kind string) []string {
	var where []string
	tokens := searchTokens(q)
	compact := compactSearchToken(q)
	useCompact := shouldUseCompactSearch(q, tokens, compact)
	if useCompact {
		where = append(where, "positionCaseInsensitiveUTF8(replaceRegexpAll(content, '[^0-9A-Za-z]+', ''), "+quoteSQL(compact)+") > 0")
	} else if len(tokens) > 0 {
		tokenClauses := make([]string, 0, len(tokens))
		for _, token := range tokens {
			tokenClauses = append(tokenClauses, "(hasTokenCaseInsensitive(content, "+quoteSQL(token)+") OR positionCaseInsensitiveUTF8(lowerUTF8(content), "+quoteSQL(strings.ToLower(token))+") > 0)")
		}
		where = append(where, strings.Join(tokenClauses, " AND "))
	}
	kind = strings.TrimSpace(strings.ToLower(kind))
	if kind == "" {
		kind = "dir"
	}
	switch kind {
	case "dir":
		where = append(where, "is_dir = 1")
	case "file":
		where = append(where, "is_dir = 0")
	}
	return where
}

func (s *Store) Search(q, kind string, limit int) ([]SearchResult, error) {
	page, err := s.SearchPage(q, kind, limit, 0)
	if err != nil {
		return nil, err
	}
	return page.Rows, nil
}

func (s *Store) SearchPage(q, kind string, limit, offset int) (SearchPage, error) {
	where := searchWhere(q, kind)
	baseQuery := " FROM entries"
	if len(where) > 0 {
		baseQuery += " WHERE " + strings.Join(where, " AND ")
	}
	countRows, err := s.Query("SELECT count() AS total" + baseQuery + " FORMAT JSONEachRow")
	if err != nil {
		return SearchPage{}, err
	}
	total := 0
	if len(countRows) > 0 {
		total = int(X.ToI(countRows[0]["total"]))
	}
	query := "SELECT path, base, root, rootKind, is_dir, if(is_dir = 1, subtree_size, size) AS effectiveSize, subtree_files, subtree_dirs, toString(modified_at) AS modifiedAt, fingerprint" + baseQuery +
		" ORDER BY modified_at DESC LIMIT " + strconv.Itoa(limit) + " OFFSET " + strconv.Itoa(offset) + " FORMAT JSONEachRow"

	rows, err := s.Query(query)
	if err != nil {
		return SearchPage{}, err
	}
	res := make([]SearchResult, 0, len(rows))
	for _, row := range rows {
		isDir := uint8(X.ToI(row["is_dir"]))
		fileCount := 1
		dirCount := 0
		if isDir == 1 {
			fileCount = int(X.ToI(row["subtree_files"]))
			dirCount = int(X.ToI(row["subtree_dirs"]))
		}
		res = append(res, SearchResult{
			Path:        X.ToS(row["path"]),
			DisplayPath: displayPath(X.ToS(row["root"]), X.ToS(row["path"])),
			Base:        X.ToS(row["base"]),
			Root:        filepath.Base(filepath.Clean(X.ToS(row["root"]))),
			RootKind:    X.ToS(row["rootKind"]),
			IsDir:       isDir,
			Size:        X.ToI(row["effectiveSize"]),
			FileCount:   fileCount,
			DirCount:    dirCount,
			ModifiedAt:  X.ToS(row["modifiedAt"]),
			Fingerprint: X.ToS(row["fingerprint"]),
		})
	}
	return SearchPage{Rows: res, Total: total}, nil
}

func (s *Store) Browse(path string, roots []string) ([]BrowseEntry, error) {
	var query string
	if strings.TrimSpace(path) == "" {
		parts := make([]string, 0, len(roots))
		for _, root := range roots {
			root = filepath.Clean(strings.TrimSpace(root))
			if root != "" {
				parts = append(parts, quoteSQL(root))
			}
		}
		if len(parts) == 0 {
			return nil, nil
		}
		query = "SELECT path, base, is_dir, size, subtree_size, subtree_files, subtree_dirs, toString(modified_at) AS modifiedAt FROM entries WHERE path IN (" + strings.Join(parts, ",") + ") ORDER BY path FORMAT JSONEachRow"
	} else {
		query = "SELECT path, base, is_dir, size, subtree_size, subtree_files, subtree_dirs, toString(modified_at) AS modifiedAt FROM entries WHERE dir = " + quoteSQL(filepath.Clean(path)) + " ORDER BY is_dir DESC, base ASC FORMAT JSONEachRow"
	}
	rows, err := s.Query(query)
	if err != nil {
		return nil, err
	}
	out := make([]BrowseEntry, 0, len(rows))
	for _, row := range rows {
		isDir := uint8(X.ToI(row["is_dir"])) == 1
		size := X.ToI(row["size"])
		fileCount := 1
		dirCount := 0
		if isDir {
			size = X.ToI(row["subtree_size"])
			fileCount = int(X.ToI(row["subtree_files"]))
			dirCount = int(X.ToI(row["subtree_dirs"]))
		}
		out = append(out, BrowseEntry{
			Path:       X.ToS(row["path"]),
			Base:       X.ToS(row["base"]),
			IsDir:      isDir,
			Size:       size,
			FileCount:  fileCount,
			DirCount:   dirCount,
			ModifiedAt: X.ToS(row["modifiedAt"]),
		})
	}
	return out, nil
}

func searchTokens(q string) []string {
	q = strings.ToLower(strings.TrimSpace(q))
	if q == "" {
		return nil
	}
	fields := strings.Fields(strings.NewReplacer(
		"/", " ",
		"_", " ",
		".", " ",
		"-", " ",
		"[", " ",
		"]", " ",
		"(", " ",
		")", " ",
		"=", " ",
	).Replace(q))
	out := make([]string, 0, len(fields))
	for _, field := range fields {
		if len(field) >= 2 {
			out = append(out, field)
		}
	}
	return out
}

func compactSearchToken(q string) string {
	var b strings.Builder
	for _, r := range strings.ToLower(q) {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
		}
	}
	return b.String()
}

func shouldUseCompactSearch(q string, tokens []string, compact string) bool {
	if compact == "" {
		return false
	}
	if strings.ContainsAny(q, "-_/.:") {
		return true
	}
	for _, token := range strings.Fields(strings.ToLower(q)) {
		token = strings.TrimSpace(token)
		if len(token) == 1 {
			return true
		}
	}
	return len(tokens) == 0
}

func displayPath(root, path string) string {
	root = filepath.Clean(root)
	path = filepath.Clean(path)
	rel, err := filepath.Rel(root, path)
	if err != nil || rel == "." || rel == "" || strings.HasPrefix(rel, "..") {
		return filepath.Base(path)
	}
	return filepath.ToSlash(filepath.Join(filepath.Base(root), rel))
}

func (s *Store) Duplicates() ([]DuplicateGroup, error) {
	query := `
SELECT fingerprint, size, groupArray(path) AS paths
FROM entries
WHERE is_dir = 0 AND fingerprint != ''
GROUP BY fingerprint, size
HAVING count() > 1
ORDER BY size DESC
LIMIT 200
FORMAT JSONEachRow`
	rows, err := s.Query(query)
	if err != nil {
		return nil, err
	}
	out := make([]DuplicateGroup, 0, len(rows))
	for _, row := range rows {
		group := DuplicateGroup{
			Fingerprint: X.ToS(row["fingerprint"]),
			Size:        X.ToI(row["size"]),
			Paths:       toStringSlice(row["paths"]),
		}
		out = append(out, group)
	}
	return out, nil
}

func (s *Store) Exec(query string) error {
	return s.ExecRaw(query, s.cfg.ClickHouseDB)
}

func (s *Store) ExecRaw(query, db string) error {
	req, err := s.newRequest(query, db)
	if err != nil {
		return err
	}
	resp, err := s.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return fmt.Errorf("clickhouse %s: %s", resp.Status, strings.TrimSpace(string(body)))
	}
	return nil
}

func (s *Store) Insert(query, body string) error {
	req, err := s.newRequestWithBody(query, body, s.cfg.ClickHouseDB)
	if err != nil {
		return err
	}
	resp, err := s.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return fmt.Errorf("clickhouse %s: %s", resp.Status, strings.TrimSpace(string(raw)))
	}
	return nil
}

func (s *Store) Query(query string) ([]map[string]any, error) {
	req, err := s.newRequest(query, s.cfg.ClickHouseDB)
	if err != nil {
		return nil, err
	}
	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("clickhouse %s: %s", resp.Status, strings.TrimSpace(string(body)))
	}
	if len(bytes.TrimSpace(body)) == 0 {
		return nil, nil
	}
	lines := bytes.Split(bytes.TrimSpace(body), []byte{'\n'})
	out := make([]map[string]any, 0, len(lines))
	for _, line := range lines {
		var row map[string]any
		if err := json.Unmarshal(line, &row); err != nil {
			return nil, err
		}
		out = append(out, row)
	}
	return out, nil
}

func (s *Store) newRequest(query, db string) (*http.Request, error) {
	return s.newRequestWithBody(query, "", db)
}

func (s *Store) newRequestWithBody(query, body, db string) (*http.Request, error) {
	chURL := s.cfg.ClickHouseURL + "/?wait_end_of_query=1"
	if db != "" {
		chURL += "&database=" + db
	}
	payload := query
	if body != "" {
		payload += "\n" + body
	}
	req, err := http.NewRequest(http.MethodPost, chURL, strings.NewReader(payload))
	if err != nil {
		return nil, err
	}
	req.SetBasicAuth(s.cfg.ClickHouseUser, s.cfg.ClickHousePass)
	req.Header.Set("Content-Type", "text/plain; charset=utf-8")
	return req, nil
}

func splitSQLStatements(raw string) []string {
	parts := strings.Split(raw, ";")
	out := make([]string, 0, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		out = append(out, part)
	}
	return out
}

func quoteSQL(s string) string {
	return "'" + strings.ReplaceAll(s, "'", "''") + "'"
}

func quoteIdent(s string) string {
	return "`" + strings.ReplaceAll(s, "`", "") + "`"
}

func toStringSlice(v any) []string {
	raw, ok := v.([]any)
	if !ok {
		return nil
	}
	out := make([]string, 0, len(raw))
	for _, item := range raw {
		out = append(out, X.ToS(item))
	}
	return out
}

func marshalEntryForClickHouse(entry FileEntry) ([]byte, error) {
	return json.Marshal(map[string]any{
		"path":        entry.Path,
		"dir":         entry.Dir,
		"base":        entry.Base,
		"ext":         entry.Ext,
		"root":        entry.Root,
		"rootKind":    entry.RootKind,
		"is_dir":      entry.IsDir,
		"size":        entry.Size,
		"subtree_size": entry.SubtreeSize,
		"subtree_files": entry.SubtreeFiles,
		"subtree_dirs":  entry.SubtreeDirs,
		"modified_at": entry.ModifiedAt.UTC().Format(clickHouseTimeLayout),
		"fingerprint": entry.Fingerprint,
		"content":     entry.Content,
	})
}
