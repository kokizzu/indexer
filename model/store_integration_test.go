//go:build integration

package model

import (
	"fmt"
	"net/http"
	"path/filepath"
	"testing"
	"time"

	"github.com/ory/dockertest/v3"

	"indexer/conf"
)

func TestStoreIntegrationWithClickHouse(t *testing.T) {
	pool, err := dockertest.NewPool("")
	if err != nil {
		t.Skipf("docker unavailable: %v", err)
	}
	resource, err := pool.Run("clickhouse/clickhouse-server", "22.8", []string{})
	if err != nil {
		t.Skipf("cannot start clickhouse docker: %v", err)
	}
	t.Cleanup(func() {
		_ = pool.Purge(resource)
	})

	cfg := conf.Config{
		ClickHouseURL:  "http://127.0.0.1:" + resource.GetPort("8123/tcp"),
		ClickHouseDB:   fmt.Sprintf("indexer_test_%d", time.Now().UnixNano()),
		ClickHouseUser: "default",
		ClickHousePass: "",
	}
	store := NewStore(cfg, &http.Client{Timeout: 30 * time.Second})
	if err := pool.Retry(func() error {
		return store.ExecRaw("SELECT 1", "")
	}); err != nil {
		t.Fatalf("clickhouse not ready: %v", err)
	}
	if err := store.ExecRaw("CREATE DATABASE IF NOT EXISTS "+quoteIdent(cfg.ClickHouseDB), ""); err != nil {
		t.Fatal(err)
	}
	if err := store.ApplyMigrations(filepath.Join("..", "migrations")); err != nil {
		t.Fatal(err)
	}

	ts := time.Date(2026, 5, 20, 12, 34, 56, 789000000, time.UTC)
	entries := []FileEntry{
		{
			Path:        "/library/_ws/Scream 3 [w0]",
			Dir:         "/library/_ws",
			Base:        "Scream 3 [w0]",
			Ext:         "",
			Root:        "/library/_ws",
			RootKind:    "sorted",
			IsDir:       1,
			Size:        0,
			ModifiedAt:  ts,
			Fingerprint: "",
			Content:     "scream 3 w0",
		},
		{
			Path:        "/library/_ws/Scream 3 [w0]/movie.mkv",
			Dir:         "/library/_ws/Scream 3 [w0]",
			Base:        "movie.mkv",
			Ext:         ".mkv",
			Root:        "/library/_ws",
			RootKind:    "sorted",
			IsDir:       0,
			Size:        12345,
			ModifiedAt:  ts,
			Fingerprint: "dup-fp",
			Content:     "movie mkv",
		},
		{
			Path:        "/library/_ws/Scream 3 [w0]/movie-copy.mkv",
			Dir:         "/library/_ws/Scream 3 [w0]",
			Base:        "movie-copy.mkv",
			Ext:         ".mkv",
			Root:        "/library/_ws",
			RootKind:    "sorted",
			IsDir:       0,
			Size:        12345,
			ModifiedAt:  ts,
			Fingerprint: "dup-fp",
			Content:     "movie copy mkv",
		},
	}
	if err := store.ReplaceEntries(entries); err != nil {
		t.Fatal(err)
	}

	gotEntries, err := store.LoadEntries()
	if err != nil {
		t.Fatal(err)
	}
	if len(gotEntries) != 3 {
		t.Fatalf("expected 3 entries, got %d", len(gotEntries))
	}
	if gotEntries[1].ModifiedAt.UTC().Format(clickHouseTimeLayout) != "2026-05-20 12:34:56.789" {
		t.Fatalf("unexpected modified_at roundtrip: %s", gotEntries[1].ModifiedAt.UTC().Format(clickHouseTimeLayout))
	}

	results, err := store.Search("scream", "dir", 10)
	if err != nil {
		t.Fatal(err)
	}
	if len(results) == 0 {
		t.Fatal("expected directory search result")
	}

	dups, err := store.Duplicates()
	if err != nil {
		t.Fatal(err)
	}
	if len(dups) == 0 || len(dups[0].Paths) < 2 {
		t.Fatalf("expected duplicate group, got %#v", dups)
	}
}
