package presentation

import (
	"bufio"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
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
				"path":        entry.Path,
				"dir":         entry.Dir,
				"base":        entry.Base,
				"ext":         entry.Ext,
				"root":        entry.Root,
				"rootKind":    entry.RootKind,
				"is_dir":      entry.IsDir,
				"size":        entry.Size,
				"modifiedAt":  entry.ModifiedAt.Format("2006-01-02 15:04:05.999"),
				"fingerprint": entry.Fingerprint,
				"content":     entry.Content,
			})
			_, _ = rw.Write(raw)
			_, _ = rw.Write([]byte("\n"))
		}
	case bytes.HasPrefix(bytes.TrimSpace(body), []byte("{")):
		scanner := bufio.NewScanner(bytes.NewReader(body))
		for scanner.Scan() {
			line := scanner.Bytes()
			if len(bytes.TrimSpace(line)) == 0 {
				continue
			}
			var entry model.FileEntry
			_ = json.Unmarshal(line, &entry)
			f.entries = append(f.entries, entry)
		}
		rw.WriteHeader(http.StatusOK)
	case strings.Contains(query, "TRUNCATE TABLE entries"):
		f.entries = nil
		rw.WriteHeader(http.StatusOK)
	case strings.Contains(query, "SELECT path, base, root, rootKind"):
		needle := extractNeedle(query)
		for _, entry := range f.entries {
			if !strings.Contains(strings.ToLower(entry.Content), needle) {
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
	if strings.Contains(stdout.String(), root) {
		t.Fatalf("cli search should not expose absolute root path in display output: %s", stdout.String())
	}
	if !strings.Contains(stdout.String(), `"displayPath": "library/Dummy.Show.S01.[12Ew0]"`) {
		t.Fatalf("cli search missing relative display path: %s", stdout.String())
	}
}

func TestWebAPIReindexAndSearch(t *testing.T) {
	dom, root := newDummyDomain(t)
	ws := &WebServer{Domain: dom}

	reindexReq := httptest.NewRequest(http.MethodPost, "/api/reindex?priority="+root, nil)
	reindexRes := httptest.NewRecorder()
	ws.handleReindex(reindexRes, reindexReq)
	if reindexRes.Code != http.StatusOK {
		t.Fatalf("reindex status=%d body=%s", reindexRes.Code, reindexRes.Body.String())
	}

	deadline := time.Now().Add(2 * time.Second)
	for dom.Status().Running && time.Now().Before(deadline) {
		time.Sleep(20 * time.Millisecond)
	}

	searchReq := httptest.NewRequest(http.MethodGet, "/api/search?q=dummy", nil)
	searchRes := httptest.NewRecorder()
	ws.handleSearch(searchRes, searchReq)
	if searchRes.Code != http.StatusOK {
		t.Fatalf("search status=%d body=%s", searchRes.Code, searchRes.Body.String())
	}
	if !strings.Contains(strings.ToLower(searchRes.Body.String()), "dummy") {
		t.Fatalf("search body=%s", searchRes.Body.String())
	}
	if strings.Contains(searchRes.Body.String(), root) {
		t.Fatalf("web search should not expose absolute root path in display output: %s", searchRes.Body.String())
	}
	if !strings.Contains(searchRes.Body.String(), `"displayPath": "library/Dummy.Show.S01.[12Ew0]"`) {
		t.Fatalf("web search missing relative display path: %s", searchRes.Body.String())
	}

	browseReq := httptest.NewRequest(http.MethodGet, "/api/browse?path="+root, nil)
	browseRes := httptest.NewRecorder()
	ws.handleBrowse(browseRes, browseReq)
	if browseRes.Code != http.StatusOK {
		t.Fatalf("browse status=%d body=%s", browseRes.Code, browseRes.Body.String())
	}
	if strings.Contains(strings.ToLower(browseRes.Body.String()), "password") {
		t.Fatalf("browse leaked sensitive content: %s", browseRes.Body.String())
	}

	deniedReq := httptest.NewRequest(http.MethodGet, "/api/browse?path="+filepath.Dir(root), nil)
	deniedRes := httptest.NewRecorder()
	ws.handleBrowse(deniedRes, deniedReq)
	if deniedRes.Code == http.StatusOK {
		t.Fatalf("browse should reject project dir, got body=%s", deniedRes.Body.String())
	}
}
