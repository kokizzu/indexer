package presentation

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
	"indexer/domain"
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
				"path":          entry.Path,
				"dir":           entry.Dir,
				"base":          entry.Base,
				"ext":           entry.Ext,
				"root":          entry.Root,
				"rootKind":      entry.RootKind,
				"is_dir":        entry.IsDir,
				"size":          entry.Size,
				"subtree_size":  entry.SubtreeSize,
				"subtree_files": entry.SubtreeFiles,
				"subtree_dirs":  entry.SubtreeDirs,
				"modifiedAt":    entry.ModifiedAt.Format("2006-01-02 15:04:05.999"),
				"fingerprint":   entry.Fingerprint,
				"content":       entry.Content,
			})
			_, _ = rw.Write(raw)
			_, _ = rw.Write([]byte("\n"))
		}
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
				Path:         row["path"].(string),
				Dir:          row["dir"].(string),
				Base:         row["base"].(string),
				Ext:          row["ext"].(string),
				Root:         row["root"].(string),
				RootKind:     row["rootKind"].(string),
				IsDir:        uint8(row["is_dir"].(float64)),
				Size:         int64(row["size"].(float64)),
				SubtreeSize:  int64(row["subtree_size"].(float64)),
				SubtreeFiles: int(row["subtree_files"].(float64)),
				SubtreeDirs:  int(row["subtree_dirs"].(float64)),
				ModifiedAt:   modifiedAt.UTC(),
				Fingerprint:  row["fingerprint"].(string),
				Content:      row["content"].(string),
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
				"path":          entry.Path,
				"base":          entry.Base,
				"is_dir":        entry.IsDir,
				"size":          entry.Size,
				"subtree_size":  entry.SubtreeSize,
				"subtree_files": entry.SubtreeFiles,
				"subtree_dirs":  entry.SubtreeDirs,
				"modifiedAt":    entry.ModifiedAt.Format("2006-01-02 15:04:05.999"),
			})
			_, _ = rw.Write(raw)
			_, _ = rw.Write([]byte("\n"))
		}
	case strings.Contains(query, "TRUNCATE TABLE entries"):
		f.entries = nil
		rw.WriteHeader(http.StatusOK)
	case strings.Contains(query, "SELECT count() AS total FROM entries"):
		total := 0
		needle := extractNeedle(query)
		compact := extractCompactNeedle(query)
		dirFilter := extractIsDirFilter(query)
		for _, entry := range f.entries {
			content := strings.ToLower(entry.Content)
			if dirFilter >= 0 && int(entry.IsDir) != dirFilter {
				continue
			}
			if compact != "" {
				if !strings.Contains(compactContent(content), compact) {
					continue
				}
			} else if needle != "" && !strings.Contains(content, needle) {
				continue
			}
			total++
		}
		raw, _ := json.Marshal(map[string]any{"total": total})
		_, _ = rw.Write(raw)
		_, _ = rw.Write([]byte("\n"))
	case strings.Contains(query, "SELECT path, base, root, rootKind"):
		needle := extractNeedle(query)
		compact := extractCompactNeedle(query)
		dirFilter := extractIsDirFilter(query)
		for _, entry := range f.entries {
			content := strings.ToLower(entry.Content)
			if dirFilter >= 0 && int(entry.IsDir) != dirFilter {
				continue
			}
			if compact != "" {
				if !strings.Contains(compactContent(content), compact) {
					continue
				}
			} else if !strings.Contains(content, needle) {
				continue
			}
			raw, _ := json.Marshal(map[string]any{
				"path":     entry.Path,
				"base":     entry.Base,
				"root":     entry.Root,
				"rootKind": entry.RootKind,
				"is_dir":   entry.IsDir,
				"effectiveSize": func() int64 {
					if entry.IsDir == 1 && entry.SubtreeSize > 0 {
						return entry.SubtreeSize
					}
					return entry.Size
				}(),
				"subtree_files": entry.SubtreeFiles,
				"subtree_dirs":  entry.SubtreeDirs,
				"modifiedAt":    entry.ModifiedAt.Format("2006-01-02 15:04:05.999"),
				"fingerprint":   entry.Fingerprint,
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

func extractIsDirFilter(query string) int {
	switch {
	case strings.Contains(query, "AND is_dir = 1"), strings.Contains(query, "WHERE is_dir = 1"):
		return 1
	case strings.Contains(query, "AND is_dir = 0"), strings.Contains(query, "WHERE is_dir = 0"):
		return 0
	default:
		return -1
	}
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

type responseRecorder struct {
	header http.Header
	body   bytes.Buffer
	code   int
}

func (r *responseRecorder) Header() http.Header { return r.header }
func (r *responseRecorder) Write(b []byte) (int, error) {
	if r.code == 0 {
		r.code = http.StatusOK
	}
	return r.body.Write(b)
}
func (r *responseRecorder) WriteHeader(statusCode int) { r.code = statusCode }
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

func newDummyDomain(t *testing.T) (*domain.Domain, string) {
	t.Helper()
	oldWd, _ := os.Getwd()
	projectDir := t.TempDir()
	t.Cleanup(func() { _ = os.Chdir(oldWd) })
	if err := os.Chdir(projectDir); err != nil {
		t.Fatal(err)
	}

	root := filepath.Join(projectDir, "library")
	migrationsDir := filepath.Join(projectDir, "migrations")
	showDir := filepath.Join(root, "Dummy.Show.S01.[12Ew0]")
	if err := os.MkdirAll(migrationsDir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(showDir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(showDir, "episode-01.mkv"), []byte("video"), 0o644); err != nil {
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

	fakeCH := &fakeClickHouse{}
	client := &http.Client{
		Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
			rec := &responseRecorder{header: make(http.Header)}
			fakeCH.ServeHTTP(rec, req)
			return rec.response(req), nil
		}),
	}

	dom := domain.New(conf.Config{
		Password:       "secret",
		SortedRoots:    []string{root},
		ClickHouseURL:  "http://fake-clickhouse",
		ClickHouseDB:   "indexer",
		ClickHouseUser: "userC",
		ClickHousePass: "passC",
		MoviesExts:     conf.ParseSpaceList(conf.DefaultMoviesExts),
		SubtitleExts:   conf.ParseSpaceList(conf.DefaultSubtitleExts),
	})
	dom.Store = model.NewStore(dom.Cfg, client)
	if err := dom.EnsureProjectDirs(); err != nil {
		t.Fatal(err)
	}
	if err := dom.ApplyMigrations(); err != nil {
		t.Fatal(err)
	}
	return dom, root
}

func TestCLIReindexAndSearch(t *testing.T) {
	dom, root := newDummyDomain(t)
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cli := &CLI{Domain: dom, Stdout: &stdout, Stderr: &stderr}
	if code := cli.Run([]string{"reindex", root}); code != 0 {
		t.Fatalf("reindex code=%d stderr=%s", code, stderr.String())
	}
	stdout.Reset()
	stderr.Reset()
	if code := cli.Run([]string{"search", "dummy"}); code != 0 {
		t.Fatalf("search code=%d stderr=%s", code, stderr.String())
	}
	if !strings.Contains(strings.ToLower(stdout.String()), "dummy") {
		t.Fatalf("search output=%s", stdout.String())
	}
	if !strings.Contains(stdout.String(), `"displayPath": "library/Dummy.Show.S01.[12Ew0]"`) {
		t.Fatalf("cli search missing relative display path: %s", stdout.String())
	}
	if !strings.Contains(stdout.String(), root) {
		t.Fatalf("cli search should include absolute path for scripting/copy use: %s", stdout.String())
	}
}

func TestCLIActionDispatch(t *testing.T) {
	dom, root := newDummyDomain(t)
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cli := &CLI{Domain: dom, Stdout: &stdout, Stderr: &stderr}

	if code := cli.Run([]string{"action", domain.ReindexAction, `{"priority":"` + root + `"}`}); code != 0 {
		t.Fatalf("action reindex code=%d stderr=%s", code, stderr.String())
	}
	deadline := time.Now().Add(3 * time.Second)
	for time.Now().Before(deadline) {
		st := dom.Status()
		if !st.Running && st.Indexed > 0 {
			break
		}
		time.Sleep(20 * time.Millisecond)
	}

	stdout.Reset()
	stderr.Reset()
	if code := cli.Run([]string{"action", domain.SearchAction, `{"q":"dummy","limit":10}`}); code != 0 {
		t.Fatalf("action search code=%d stderr=%s", code, stderr.String())
	}
	if !strings.Contains(strings.ToLower(stdout.String()), "dummy") {
		t.Fatalf("action search output=%s", stdout.String())
	}
	if !strings.Contains(stderr.String(), `"statusCode"`) {
		t.Fatalf("action search stderr metadata missing: %s", stderr.String())
	}
}

func TestCLIManageFlow(t *testing.T) {
	dom, root := newDummyDomain(t)
	renameDir := filepath.Join(root, "bad.show season 1 12Ew0")
	moveReadyDir := filepath.Join(root, "Good Show S01 [12of_w0]")
	subsDir := filepath.Join(root, "Summer Strike S01 KOREAN [12Ew0]", "Subs", "Summer.Strike.S01E01.KOREAN.WEBRip.x264-KOREA[eztv.re]")
	subtitlePath := filepath.Join(subsDir, "2_English.srt")
	for _, dir := range []string{renameDir, moveReadyDir, subsDir} {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	if err := os.WriteFile(filepath.Join(renameDir, "Bad.Show.S01E01.mkv"), []byte("video"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(moveReadyDir, "episode-01.mkv"), []byte("video"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(subtitlePath, []byte("subtitle"), 0o644); err != nil {
		t.Fatal(err)
	}

	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cli := &CLI{Domain: dom, Stdout: &stdout, Stderr: &stderr, Stdin: strings.NewReader("secret\n")}

	if code := cli.Run([]string{"reindex", root}); code != 0 {
		t.Fatalf("reindex code=%d stderr=%s", code, stderr.String())
	}

	stdout.Reset()
	stderr.Reset()
	if code := cli.Run([]string{"manage", "namefix", "scan", root}); code != 0 {
		t.Fatalf("namefix scan code=%d stderr=%s", code, stderr.String())
	}
	if !strings.Contains(stdout.String(), "bad.show season 1 12Ew0") {
		t.Fatalf("namefix scan output=%s", stdout.String())
	}

	stdout.Reset()
	stderr.Reset()
	if code := cli.Run([]string{"manage", "apply-rename", "preview", renameDir}); code != 0 {
		t.Fatalf("rename preview code=%d stderr=%s", code, stderr.String())
	}
	if !strings.Contains(stdout.String(), `"action": "rename"`) || !strings.Contains(stdout.String(), `"preview": true`) {
		t.Fatalf("rename preview output=%s", stdout.String())
	}

	stdout.Reset()
	stderr.Reset()
	if code := cli.Run([]string{"manage", "sorted-move", "scan", root}); code != 0 {
		t.Fatalf("move scan code=%d stderr=%s", code, stderr.String())
	}
	if !strings.Contains(stdout.String(), "Good Show S01 [12of_w0]") || !strings.Contains(stdout.String(), "MOVE READY") {
		t.Fatalf("move scan output=%s", stdout.String())
	}

	stdout.Reset()
	stderr.Reset()
	if code := cli.Run([]string{"manage", "subtitle-rename", "scan", filepath.Join(root, "Summer Strike S01 KOREAN [12Ew0]")}); code != 0 {
		t.Fatalf("subtitle scan code=%d stderr=%s", code, stderr.String())
	}
	if !strings.Contains(stdout.String(), "2_English.srt") || !strings.Contains(stdout.String(), ".en.srt") {
		t.Fatalf("subtitle scan output=%s", stdout.String())
	}

	stdout.Reset()
	stderr.Reset()
	if code := cli.Run([]string{"manage", "subtitle-rename", "queue", subtitlePath, "--password", "secret"}); code != 0 {
		t.Fatalf("subtitle queue code=%d stderr=%s", code, stderr.String())
	}
	waitForManageQueueDrainDomain(t, dom)
	newSubtitlePath := filepath.Join(subsDir, "Summer.Strike.S01E01.KOREAN.WEBRip.x264-KOREA[eztv.re].en.srt")
	if _, err := os.Stat(newSubtitlePath); err != nil {
		t.Fatalf("expected queued subtitle rename to complete: %v", err)
	}
}

func TestCLIBatchQueueHelpers(t *testing.T) {
	root := t.TempDir()
	sorted := filepath.Join(root, "sorted")
	if err := os.MkdirAll(sorted, 0o755); err != nil {
		t.Fatal(err)
	}
	renameOld := filepath.Join(root, "old-name")
	renameNew := filepath.Join(root, "New Name S01 [1of_w0]")
	moveSrc := filepath.Join(root, "Batch Show S01 [12of_w0]")
	for _, dir := range []string{renameOld, moveSrc} {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	dom := domain.New(conf.Config{
		Password:      "secret",
		SortedRoots:   []string{sorted},
		UnsortedRoots: []string{root},
	})
	cli := &CLI{Domain: dom}
	renameRes := cli.batchQueueRenames([]manageCandidate{{
		Path:    renameOld,
		NewPath: renameNew,
	}}, "secret")
	if renameRes["queued"].(int) != 1 {
		t.Fatalf("unexpected rename batch result: %+v", renameRes)
	}
	moveRes := cli.batchQueueMoves([]manageCandidate{{
		Path: moveSrc,
	}}, sorted, "secret")
	if moveRes["queued"].(int) != 1 {
		t.Fatalf("unexpected move batch result: %+v", moveRes)
	}
	waitForManageQueueDrainDomain(t, dom)
	if _, err := os.Stat(renameNew); err != nil {
		t.Fatalf("expected queued batch rename to complete: %v", err)
	}
	if _, err := os.Stat(filepath.Join(sorted, filepath.Base(moveSrc))); err != nil {
		t.Fatalf("expected queued batch move to complete: %v", err)
	}
}

func TestCLIBatchQueueCategorizeHelper(t *testing.T) {
	root := t.TempDir()
	catA := filepath.Join(root, "bad.show season 1 12Ew0")
	catB := filepath.Join(root, "another.bad.show season 1 12Ew0")
	for _, dir := range []string{catA, catB} {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(filepath.Join(dir, "Episode.S01E01.mkv"), []byte("video"), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	dom := domain.New(conf.Config{
		Password:      "secret",
		UnsortedRoots: []string{root},
		MoviesExts:    []string{"mkv"},
	})
	cli := &CLI{Domain: dom}
	rows := []manageCandidate{
		{Path: catA, IsDir: true},
		{Path: catB, IsDir: true},
	}
	res := cli.batchQueueCategorize(rows, "secret", domain.CategorizeOptions{
		VideosOnly:      true,
		WatchedCount:    2,
		RemoveEmptyDirs: true,
	})
	if res["queued"].(int) != 2 {
		t.Fatalf("unexpected categorize batch result: %+v", res)
	}
	status := dom.ManageStatus()
	if len(status.Queued) != 2 {
		t.Fatalf("expected queued categorize tasks, got %+v", status)
	}
	for _, task := range status.Queued {
		if !task.VideosOnly || task.WatchedCount != 2 || !task.RemoveEmptyDirs {
			t.Fatalf("categorize options not preserved on queued task: %+v", task)
		}
	}
}

func TestCLIBatchQueueDeleteHelper(t *testing.T) {
	root := t.TempDir()
	dirA := filepath.Join(root, "delete-a")
	dirB := filepath.Join(root, "delete-b")
	for _, dir := range []string{dirA, dirB} {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(filepath.Join(dir, "x.txt"), []byte("x"), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	dom := domain.New(conf.Config{
		Password:      "secret",
		UnsortedRoots: []string{root},
	})
	cli := &CLI{Domain: dom}
	res := cli.batchQueueDeletes([]manageCandidate{
		{Path: dirA, IsDir: true},
		{Path: dirB, IsDir: true},
	}, "secret")
	if res["queued"].(int) != 2 {
		t.Fatalf("unexpected delete batch result: %+v", res)
	}
	waitForManageQueueDrainDomain(t, dom)
	for _, path := range []string{dirA, dirB} {
		if _, err := os.Stat(path); !os.IsNotExist(err) {
			t.Fatalf("expected queued batch delete to remove %s, err=%v", path, err)
		}
	}
}

func TestCLIBatchCancelManageTasks(t *testing.T) {
	root := t.TempDir()
	dirA := filepath.Join(root, "cancel-a")
	dirB := filepath.Join(root, "cancel-b")
	for _, dir := range []string{dirA, dirB} {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	dom := domain.New(conf.Config{
		Password:      "secret",
		UnsortedRoots: []string{root},
	})
	if _, err := dom.QueueDelete("secret", dirA); err != nil {
		t.Fatal(err)
	}
	if _, err := dom.QueueDelete("secret", dirB); err != nil {
		t.Fatal(err)
	}
	status := dom.ManageStatus()
	if len(status.Queued) < 2 {
		t.Fatalf("expected queued tasks, got %+v", status)
	}
	cli := &CLI{Domain: dom}
	res := cli.batchCancelManageTasks([]string{status.Queued[0].ID, status.Queued[1].ID})
	if res["cancelled"].(int) != 2 {
		t.Fatalf("unexpected batch cancel result: %+v", res)
	}
	status = dom.ManageStatus()
	if len(status.Queued) != 0 {
		t.Fatalf("expected empty queue after cancel, got %+v", status)
	}
}

func waitForManageQueueDrainDomain(t *testing.T, dom *domain.Domain) {
	t.Helper()
	deadline := time.Now().Add(3 * time.Second)
	for time.Now().Before(deadline) {
		status := dom.ManageStatus()
		if len(status.RunningTasks) == 0 && status.Running.ID == "" && len(status.Queued) == 0 {
			return
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatal("manage queue did not drain")
}

func TestWebAPIReindexAndSearch(t *testing.T) {
	dom, root := newDummyDomain(t)
	ws := &WebServer{Domain: dom}

	reindexRes := doAppRequest(t, ws, http.MethodPost, "/api/reindex?priority="+root, nil)
	if reindexRes.StatusCode != http.StatusOK {
		t.Fatalf("reindex status=%d body=%s", reindexRes.StatusCode, readHTTPBody(t, reindexRes))
	}

	deadline := time.Now().Add(2 * time.Second)
	for dom.Status().Running && time.Now().Before(deadline) {
		time.Sleep(20 * time.Millisecond)
	}

	searchRes := doAppRequest(t, ws, http.MethodGet, "/api/search?q=dummy", nil)
	searchBody := readHTTPBody(t, searchRes)
	if searchRes.StatusCode != http.StatusOK {
		t.Fatalf("search status=%d body=%s", searchRes.StatusCode, searchBody)
	}
	var page model.SearchPage
	if err := json.Unmarshal([]byte(searchBody), &page); err != nil {
		t.Fatalf("search unmarshal: %v body=%s", err, searchBody)
	}
	if page.Total == 0 || len(page.Rows) == 0 {
		t.Fatalf("expected paged search results, got %+v", page)
	}
	if !strings.Contains(strings.ToLower(page.Rows[0].Base), "dummy") {
		t.Fatalf("unexpected row=%+v", page.Rows[0])
	}
	if !strings.Contains(page.Rows[0].DisplayPath, "library/Dummy.Show.S01.[12Ew0]") {
		t.Fatalf("web search missing relative display path: %+v", page.Rows[0])
	}
	if page.Rows[0].Path == "" || !strings.Contains(page.Rows[0].Path, root) {
		t.Fatalf("web search should keep absolute path for copy action: %+v", page.Rows[0])
	}
	fileSearchRes := doAppRequest(t, ws, http.MethodGet, "/api/search?q=dummy&kind=file", nil)
	fileSearchBody := readHTTPBody(t, fileSearchRes)
	if fileSearchRes.StatusCode != http.StatusOK {
		t.Fatalf("file search status=%d body=%s", fileSearchRes.StatusCode, fileSearchBody)
	}
	var filePage model.SearchPage
	if err := json.Unmarshal([]byte(fileSearchBody), &filePage); err != nil {
		t.Fatalf("file search unmarshal: %v body=%s", err, fileSearchBody)
	}
	if filePage.Total == 0 || len(filePage.Rows) == 0 {
		t.Fatalf("expected file search results, got %+v", filePage)
	}
	for _, row := range filePage.Rows {
		if row.IsDir != 0 {
			t.Fatalf("expected file search row, got %+v", row)
		}
	}

	browseRes := doAppRequest(t, ws, http.MethodGet, "/api/browse?path="+root, nil)
	browseBody := readHTTPBody(t, browseRes)
	if browseRes.StatusCode != http.StatusOK {
		t.Fatalf("browse status=%d body=%s", browseRes.StatusCode, browseBody)
	}
	if strings.Contains(strings.ToLower(browseBody), "password") {
		t.Fatalf("browse leaked sensitive content: %s", browseBody)
	}

	deniedRes := doAppRequest(t, ws, http.MethodGet, "/api/browse?path="+filepath.Dir(root), nil)
	deniedBody := readHTTPBody(t, deniedRes)
	if deniedRes.StatusCode == http.StatusOK {
		t.Fatalf("browse should reject project dir, got body=%s", deniedBody)
	}
}
