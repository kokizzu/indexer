package model

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"testing"
	"time"

	"indexer/conf"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (r roundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return r(req)
}

func TestInsertSendsQueryAndJSONEachRowBody(t *testing.T) {
	var gotURL string
	var gotBody string
	client := &http.Client{
		Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
			raw, err := io.ReadAll(req.Body)
			if err != nil {
				t.Fatal(err)
			}
			gotURL = req.URL.String()
			gotBody = string(raw)
			return &http.Response{
				StatusCode: http.StatusOK,
				Status:     "200 OK",
				Header:     make(http.Header),
				Body:       io.NopCloser(bytes.NewReader(nil)),
				Request:    req,
			}, nil
		}),
	}
	store := NewStore(conf.Config{
		ClickHouseURL:  "http://127.0.0.1:8127",
		ClickHouseDB:   "indexer",
		ClickHouseUser: "userC",
		ClickHousePass: "passC",
	}, client)
	body := "{\"path\":\"/tmp/a\"}\n"
	if err := store.Insert("INSERT INTO entries FORMAT JSONEachRow", body); err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(gotURL, "database=indexer") {
		t.Fatalf("expected database in URL, got %q", gotURL)
	}
	if !strings.HasPrefix(gotBody, "INSERT INTO entries FORMAT JSONEachRow\n") {
		t.Fatalf("expected insert query prefix, got %q", gotBody)
	}
	if !strings.Contains(gotBody, body) {
		t.Fatalf("expected json body after query, got %q", gotBody)
	}
}

func TestExecAndQuerySendSQLInRequestBody(t *testing.T) {
	var seen []string
	client := &http.Client{
		Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
			raw, err := io.ReadAll(req.Body)
			if err != nil {
				t.Fatal(err)
			}
			seen = append(seen, string(raw))
			respBody := []byte{}
			if strings.Contains(string(raw), "SELECT version FROM schema_migrations") {
				respBody = []byte("{\"version\":\"001_entries.sql\"}\n")
			}
			return &http.Response{
				StatusCode: http.StatusOK,
				Status:     "200 OK",
				Header:     make(http.Header),
				Body:       io.NopCloser(bytes.NewReader(respBody)),
				Request:    req,
			}, nil
		}),
	}
	store := NewStore(conf.Config{
		ClickHouseURL:  "http://127.0.0.1:8127",
		ClickHouseDB:   "indexer",
		ClickHouseUser: "userC",
		ClickHousePass: "passC",
	}, client)
	if err := store.Exec("TRUNCATE TABLE entries"); err != nil {
		t.Fatal(err)
	}
	rows, err := store.Query("SELECT version FROM schema_migrations FORMAT JSONEachRow")
	if err != nil {
		t.Fatal(err)
	}
	if len(rows) != 1 || rows[0]["version"] != "001_entries.sql" {
		t.Fatalf("unexpected query rows: %#v", rows)
	}
	if len(seen) < 2 {
		t.Fatalf("expected exec and query requests, got %d", len(seen))
	}
	if seen[0] != "TRUNCATE TABLE entries" {
		t.Fatalf("unexpected exec payload: %q", seen[0])
	}
	if seen[1] != "SELECT version FROM schema_migrations FORMAT JSONEachRow" {
		t.Fatalf("unexpected query payload: %q", seen[1])
	}
}

func TestMarshalEntryForClickHouseUsesClickHouseTimeFormat(t *testing.T) {
	entry := FileEntry{
		Path:        "/tmp/a",
		Dir:         "/tmp",
		Base:        "a",
		Ext:         ".mkv",
		Root:        "/tmp",
		RootKind:    "unsorted",
		IsDir:       0,
		Size:        123,
		ModifiedAt:  time.Date(2026, 5, 20, 12, 34, 56, 789000000, time.UTC),
		Fingerprint: "fp",
		Content:     "a mkv",
	}
	raw, err := marshalEntryForClickHouse(entry)
	if err != nil {
		t.Fatal(err)
	}
	var row map[string]any
	if err := json.Unmarshal(raw, &row); err != nil {
		t.Fatal(err)
	}
	if got := row["modified_at"]; got != "2026-05-20 12:34:56.789" {
		t.Fatalf("unexpected modified_at: %#v", got)
	}
}

func TestRenameEntriesRewritesPaths(t *testing.T) {
	var insertBody string
	client := &http.Client{
		Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
			raw, err := io.ReadAll(req.Body)
			if err != nil {
				t.Fatal(err)
			}
			sql := string(raw)
			switch {
			case strings.HasPrefix(sql, "SELECT path, dir, base, ext, root, rootKind, is_dir, size, subtree_size, subtree_files, subtree_dirs, toString(modified_at) AS modifiedAt, fingerprint, content FROM entries FORMAT JSONEachRow"):
				body := strings.Join([]string{
					`{"path":"/root/old","dir":"/root","base":"old","ext":"","root":"/root","rootKind":"unsorted","is_dir":1,"size":0,"subtree_size":10,"subtree_files":1,"subtree_dirs":1,"modifiedAt":"2026-05-20 12:34:56.789","fingerprint":"","content":"old"}`,
					`{"path":"/root/old/movie.mkv","dir":"/root/old","base":"movie.mkv","ext":".mkv","root":"/root","rootKind":"unsorted","is_dir":0,"size":10,"subtree_size":0,"subtree_files":0,"subtree_dirs":0,"modifiedAt":"2026-05-20 12:34:56.789","fingerprint":"fp","content":"movie"}`,
					"",
				}, "\n")
				return &http.Response{
					StatusCode: http.StatusOK,
					Status:     "200 OK",
					Header:     make(http.Header),
					Body:       io.NopCloser(strings.NewReader(body)),
					Request:    req,
				}, nil
			case strings.HasPrefix(sql, "TRUNCATE TABLE entries"):
				return &http.Response{
					StatusCode: http.StatusOK,
					Status:     "200 OK",
					Header:     make(http.Header),
					Body:       io.NopCloser(strings.NewReader("")),
					Request:    req,
				}, nil
			case strings.HasPrefix(sql, "INSERT INTO entries FORMAT JSONEachRow"):
				insertBody = sql
				return &http.Response{
					StatusCode: http.StatusOK,
					Status:     "200 OK",
					Header:     make(http.Header),
					Body:       io.NopCloser(strings.NewReader("")),
					Request:    req,
				}, nil
			default:
				t.Fatalf("unexpected sql: %s", sql)
			}
			return nil, nil
		}),
	}
	store := NewStore(conf.Config{
		ClickHouseURL:  "http://127.0.0.1:8127",
		ClickHouseDB:   "indexer",
		ClickHouseUser: "userC",
		ClickHousePass: "passC",
	}, client)
	if err := store.RenameEntries("/root/old", "/root/new"); err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(insertBody, `"/root/new"`) || !strings.Contains(insertBody, `"/root/new/movie.mkv"`) {
		t.Fatalf("expected renamed paths in insert body, got %s", insertBody)
	}
	if !strings.Contains(insertBody, `"dir":"/root/new"`) || !strings.Contains(insertBody, `"dir":"/root"`) {
		t.Fatalf("expected updated dirs in insert body, got %s", insertBody)
	}
}

func TestSearchPageOrdersByBasenameRelevanceBeforeModifiedTime(t *testing.T) {
	var seen []string
	client := &http.Client{
		Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
			raw, err := io.ReadAll(req.Body)
			if err != nil {
				t.Fatal(err)
			}
			sql := string(raw)
			seen = append(seen, sql)
			respBody := []byte("{\"total\":0}\n")
			if strings.Contains(sql, "SELECT path, base, root, rootKind") {
				respBody = nil
			}
			return &http.Response{
				StatusCode: http.StatusOK,
				Status:     "200 OK",
				Header:     make(http.Header),
				Body:       io.NopCloser(bytes.NewReader(respBody)),
				Request:    req,
			}, nil
		}),
	}
	store := NewStore(conf.Config{
		ClickHouseURL:  "http://127.0.0.1:8127",
		ClickHouseDB:   "indexer",
		ClickHouseUser: "userC",
		ClickHousePass: "passC",
	}, client)
	if _, err := store.SearchPage("zaka", "dir", 100, 0); err != nil {
		t.Fatal(err)
	}
	if len(seen) < 2 {
		t.Fatalf("expected count and data queries, got %d", len(seen))
	}
	query := seen[1]
	if !strings.Contains(query, "positionCaseInsensitiveUTF8(lowerUTF8(base), 'zaka')") {
		t.Fatalf("expected basename relevance in query, got %q", query)
	}
	if !strings.Contains(query, "ORDER BY") || !strings.Contains(query, "modified_at DESC") {
		t.Fatalf("expected ordered search query, got %q", query)
	}
}

func TestSearchPageRepeatedTokensRequireRepeatedMatches(t *testing.T) {
	var seen []string
	client := &http.Client{
		Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
			raw, err := io.ReadAll(req.Body)
			if err != nil {
				t.Fatal(err)
			}
			sql := string(raw)
			seen = append(seen, sql)
			respBody := []byte("{\"total\":0}\n")
			if strings.Contains(sql, "SELECT path, base, root, rootKind") {
				respBody = nil
			}
			return &http.Response{
				StatusCode: http.StatusOK,
				Status:     "200 OK",
				Header:     make(http.Header),
				Body:       io.NopCloser(bytes.NewReader(respBody)),
				Request:    req,
			}, nil
		}),
	}
	store := NewStore(conf.Config{
		ClickHouseURL:  "http://127.0.0.1:8127",
		ClickHouseDB:   "indexer",
		ClickHouseUser: "userC",
		ClickHousePass: "passC",
	}, client)
	if _, err := store.SearchPage("cha cha cha", "all", 100, 0); err != nil {
		t.Fatal(err)
	}
	if len(seen) < 2 {
		t.Fatalf("expected count and data queries, got %d", len(seen))
	}
	query := seen[1]
	if !strings.Contains(query, "countSubstrings(lowerUTF8(content), 'cha') >= 3") {
		t.Fatalf("expected repeated-token count in query, got %q", query)
	}
	if strings.Contains(query, "hasTokenCaseInsensitive(content, 'cha') OR positionCaseInsensitiveUTF8(lowerUTF8(content), 'cha') > 0") {
		t.Fatalf("expected repeated-token query not to use single-token clause, got %q", query)
	}
	if !strings.Contains(query, "is_dir = 0 AND countSubstrings(lowerUTF8(base), 'cha') >= 3") {
		t.Fatalf("expected file repeated-token count to use base, got %q", query)
	}
	if !strings.Contains(query, "is_dir = 1 AND countSubstrings(lowerUTF8(content), 'cha') >= 3") {
		t.Fatalf("expected dir repeated-token count to use content, got %q", query)
	}
}

func TestSearchPageRepeatedTokensForFileKindUseBasename(t *testing.T) {
	var seen []string
	client := &http.Client{
		Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
			raw, err := io.ReadAll(req.Body)
			if err != nil {
				t.Fatal(err)
			}
			sql := string(raw)
			seen = append(seen, sql)
			respBody := []byte("{\"total\":0}\n")
			if strings.Contains(sql, "SELECT path, base, root, rootKind") {
				respBody = nil
			}
			return &http.Response{
				StatusCode: http.StatusOK,
				Status:     "200 OK",
				Header:     make(http.Header),
				Body:       io.NopCloser(bytes.NewReader(respBody)),
				Request:    req,
			}, nil
		}),
	}
	store := NewStore(conf.Config{
		ClickHouseURL:  "http://127.0.0.1:8127",
		ClickHouseDB:   "indexer",
		ClickHouseUser: "userC",
		ClickHousePass: "passC",
	}, client)
	if _, err := store.SearchPage("cha cha cha", "file", 100, 0); err != nil {
		t.Fatal(err)
	}
	if len(seen) < 2 {
		t.Fatalf("expected count and data queries, got %d", len(seen))
	}
	query := seen[1]
	if !strings.Contains(query, "countSubstrings(lowerUTF8(base), 'cha') >= 3") {
		t.Fatalf("expected repeated-token file query to use basename, got %q", query)
	}
	if strings.Contains(query, "countSubstrings(lowerUTF8(content), 'cha') >= 3") {
		t.Fatalf("expected file query not to use content for repeated tokens, got %q", query)
	}
}
