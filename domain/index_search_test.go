package domain

import (
	"bufio"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"

	"indexer/conf"
	"indexer/model"
)

type fakeClickHouse struct {
	mu      sync.Mutex
	entries []model.FileEntry
}

func (f *fakeClickHouse) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	body, _ := io.ReadAll(r.Body)
	query := string(body)

	f.mu.Lock()
	defer f.mu.Unlock()

	switch {
	case strings.Contains(query, "CREATE DATABASE IF NOT EXISTS"):
		rw.WriteHeader(http.StatusOK)
	case strings.Contains(query, "CREATE TABLE IF NOT EXISTS schema_migrations"):
		rw.WriteHeader(http.StatusOK)
	case strings.Contains(query, "SELECT version FROM schema_migrations"):
		rw.WriteHeader(http.StatusOK)
	case strings.Contains(query, "CREATE TABLE IF NOT EXISTS entries"):
		rw.WriteHeader(http.StatusOK)
	case strings.Contains(query, "SELECT path, dir, base, ext, root, rootKind"):
		for _, entry := range f.entries {
			raw, _ := json.Marshal(map[string]any{
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
				"modifiedAt":  entry.ModifiedAt.Format("2006-01-02 15:04:05.999"),
				"fingerprint": entry.Fingerprint,
				"content":     entry.Content,
			})
			_, _ = rw.Write(raw)
			_, _ = rw.Write([]byte("\n"))
		}
	case strings.Contains(query, "TRUNCATE TABLE entries"):
		f.entries = nil
		rw.WriteHeader(http.StatusOK)
	case strings.Contains(query, "INSERT INTO entries FORMAT JSONEachRow"):
		lines := bytes.SplitN(body, []byte{'\n'}, 2)
		payload := body
		if len(lines) == 2 {
			payload = lines[1]
		}
		scanner := bufio.NewScanner(bytes.NewReader(payload))
		for scanner.Scan() {
			line := scanner.Bytes()
			if len(bytes.TrimSpace(line)) == 0 {
				continue
			}
			var row map[string]any
			_ = json.Unmarshal(line, &row)
			modifiedAt, _ := time.Parse("2006-01-02 15:04:05.999", row["modified_at"].(string))
			entry := model.FileEntry{
				Path:        row["path"].(string),
				Dir:         row["dir"].(string),
				Base:        row["base"].(string),
				Ext:         row["ext"].(string),
				Root:        row["root"].(string),
				RootKind:    row["rootKind"].(string),
				IsDir:       uint8(row["is_dir"].(float64)),
				Size:        int64(row["size"].(float64)),
				SubtreeSize: int64(row["subtree_size"].(float64)),
				SubtreeFiles: int(row["subtree_files"].(float64)),
				SubtreeDirs:  int(row["subtree_dirs"].(float64)),
				ModifiedAt:  modifiedAt.UTC(),
				Fingerprint: row["fingerprint"].(string),
				Content:     row["content"].(string),
			}
			f.entries = append(f.entries, entry)
		}
		rw.WriteHeader(http.StatusOK)
	case strings.Contains(query, "SELECT path, base, is_dir, size, subtree_size, subtree_files, subtree_dirs"):
		for _, entry := range f.entries {
			if strings.Contains(query, " WHERE dir = ") && !strings.Contains(query, entry.Dir) {
				continue
			}
			if strings.Contains(query, " WHERE path IN (") && !strings.Contains(query, entry.Path) {
				continue
			}
			raw, _ := json.Marshal(map[string]any{
				"path":         entry.Path,
				"base":         entry.Base,
				"is_dir":       entry.IsDir,
				"size":         entry.Size,
				"subtree_size": entry.SubtreeSize,
				"subtree_files": entry.SubtreeFiles,
				"subtree_dirs":  entry.SubtreeDirs,
				"modifiedAt":   entry.ModifiedAt.Format("2006-01-02 15:04:05.999"),
			})
			_, _ = rw.Write(raw)
			_, _ = rw.Write([]byte("\n"))
		}
	case strings.Contains(query, "SELECT path, base, root, rootKind"):
		needle := extractNeedle(query)
		compact := extractCompactNeedle(query)
		for _, entry := range f.entries {
			content := strings.ToLower(entry.Content)
			if compact != "" {
				if !strings.Contains(compactContent(content), compact) {
					continue
				}
			} else if !strings.Contains(content, needle) {
				continue
			}
			raw, _ := json.Marshal(map[string]any{
				"path":        entry.Path,
				"base":        entry.Base,
				"root":        entry.Root,
				"rootKind":    entry.RootKind,
				"is_dir":      entry.IsDir,
				"size":        entry.Size,
				"modifiedAt":  entry.ModifiedAt.Format("2006-01-02 15:04:05.999"),
				"fingerprint": entry.Fingerprint,
			})
			_, _ = rw.Write(raw)
			_, _ = rw.Write([]byte("\n"))
		}
	default:
		rw.WriteHeader(http.StatusOK)
	}
}

func extractNeedle(query string) string {
	const prefix = "hasTokenCaseInsensitive(content, '"
	idx := strings.Index(query, prefix)
	if idx < 0 {
		return ""
	}
	rest := query[idx+len(prefix):]
	end := strings.Index(rest, "')")
	if end < 0 {
		return ""
	}
	return strings.ToLower(rest[:end])
}

func extractCompactNeedle(query string) string {
	const prefix = "positionCaseInsensitiveUTF8(replaceRegexpAll(content, '[^0-9A-Za-z]+', ''), '"
	idx := strings.Index(query, prefix)
	if idx < 0 {
		return ""
	}
	rest := query[idx+len(prefix):]
	end := strings.Index(rest, "')")
	if end < 0 {
		return ""
	}
	return strings.ToLower(rest[:end])
}

func compactContent(s string) string {
	var b strings.Builder
	for _, r := range strings.ToLower(s) {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
		}
	}
	return b.String()
}

type roundTripFunc func(*http.Request) (*http.Response, error)

func (r roundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return r(req)
}

func TestDummyDirectoryCanBeIndexedAndSearched(t *testing.T) {
	dom, root, _, _ := newDummyDomain(t)
	resp := dom.Reindex(root)
	if !resp.OK {
		t.Fatalf("reindex failed: %+v", resp)
	}
	results, err := dom.Search("dummy", "", 20)
	if err != nil {
		t.Fatal(err)
	}
	if len(results) == 0 {
		t.Fatal("expected search results after indexing")
	}
	if got, want := results[0].DisplayPath, "library/Dummy.Show.S01.[12Ew0]"; got != want {
		t.Fatalf("displayPath mismatch: got %q want %q", got, want)
	}
	entries, err := dom.Store.LoadEntries()
	if err != nil {
		t.Fatal(err)
	}
	for _, entry := range entries {
		if strings.Contains(strings.ToLower(entry.Content), strings.ToLower(root)) {
			t.Fatalf("search content leaked root path: root=%q content=%q", root, entry.Content)
		}
	}
	dirResults, err := dom.Search("unchanged.show.s01.[12ew0]", "dir", 20)
	if err != nil {
		t.Fatal(err)
	}
	if len(dirResults) == 0 {
		t.Fatal("expected directory search result by folder name")
	}
	compactResults, err := dom.Search("dummy-show", "", 20)
	if err != nil {
		t.Fatal(err)
	}
	if len(compactResults) == 0 || compactResults[0].IsDir != 1 {
		t.Fatalf("expected compact directory search result, got %#v", compactResults)
	}
	for _, entry := range entries {
		if strings.HasSuffix(entry.Path, ".txt") {
			t.Fatalf("non-video file should not be indexed: %s", entry.Path)
		}
	}

	status := dom.Status()
	if status.ProgressPct > 100.0001 {
		t.Fatalf("progress should not exceed 100%%, got %.4f", status.ProgressPct)
	}
}

func newDummyDomain(t *testing.T) (*Domain, string, string, string) {
	t.Helper()
	oldWd, _ := os.Getwd()
	projectDir := t.TempDir()
	if err := os.Chdir(projectDir); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.Chdir(oldWd) })

	root := filepath.Join(projectDir, "library")
	migrationsDir := filepath.Join(projectDir, "migrations")
	unchangedDir := filepath.Join(root, "Unchanged.Show.S01.[12Ew0]")
	changingDir := filepath.Join(root, "Dummy.Show.S01.[12Ew0]")
	changingFile := filepath.Join(changingDir, "episode-01.mkv")
	if err := os.MkdirAll(migrationsDir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(migrationsDir, "001_entries.sql"), []byte(`CREATE TABLE IF NOT EXISTS entries (
  path String,
  dir String,
  base String,
  ext String,
  root String,
  rootKind LowCardinality(String),
  is_dir UInt8,
  size Int64,
  modified_at DateTime64(3),
  fingerprint String,
  content String
) ENGINE = ReplacingMergeTree(modified_at)
ORDER BY path;`), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(unchangedDir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(changingDir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(unchangedDir, "episode-01.mkv"), []byte("stable-video"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(unchangedDir, "notes.txt"), []byte("ignore-me"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(changingFile, []byte("video"), 0o644); err != nil {
		t.Fatal(err)
	}

	fakeCH := &fakeClickHouse{}
	client := &http.Client{
		Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
			rec := &responseRecorder{header: make(http.Header)}
			fakeCH.ServeHTTP(rec, req)
			return rec.response(req), nil
		}),
	}
	dom := New(conf.Config{
		Password:       "secret",
		SortedRoots:    []string{root},
		ClickHouseURL:  "http://fake-clickhouse",
		ClickHouseDB:   "indexer",
		ClickHouseUser: "userC",
		ClickHousePass: "passC",
	})
	dom.Store = model.NewStore(dom.Cfg, client)
	if err := dom.EnsureProjectDirs(); err != nil {
		t.Fatal(err)
	}
	if err := dom.ApplyMigrations(); err != nil {
		t.Fatal(err)
	}
	return dom, root, unchangedDir, changingFile
}

type responseRecorder struct {
	header http.Header
	body   bytes.Buffer
	code   int
}

func (r *responseRecorder) Header() http.Header {
	return r.header
}

func (r *responseRecorder) Write(b []byte) (int, error) {
	if r.code == 0 {
		r.code = http.StatusOK
	}
	return r.body.Write(b)
}

func (r *responseRecorder) WriteHeader(statusCode int) {
	r.code = statusCode
}

func (r *responseRecorder) response(req *http.Request) *http.Response {
	if r.code == 0 {
		r.code = http.StatusOK
	}
	return &http.Response{
		StatusCode: r.code,
		Status:     http.StatusText(r.code),
		Header:     r.header,
		Body:       io.NopCloser(bytes.NewReader(r.body.Bytes())),
		Request:    req,
	}
}
