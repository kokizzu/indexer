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
