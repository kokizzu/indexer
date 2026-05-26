//go:build integration

package domain

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"testing"
	"time"

	"github.com/ory/dockertest/v3"

	"indexer/conf"
	"indexer/model"
)

func TestRetryManageTaskIntegration(t *testing.T) {
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

	tmp := t.TempDir()
	oldWd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = os.Chdir(oldWd) }()
	if err := os.Chdir(tmp); err != nil {
		t.Fatal(err)
	}

	root := filepath.Join(tmp, "unsorted")
	if err := os.MkdirAll(root, 0o755); err != nil {
		t.Fatal(err)
	}
	oldPath := filepath.Join(root, "old-name")
	newPath := filepath.Join(root, "New Name S01 [1of_w0]")
	if err := os.MkdirAll(oldPath, 0o755); err != nil {
		t.Fatal(err)
	}

	cfg := conf.Config{
		Password:       "secret",
		UnsortedRoots:  []string{root},
		ClickHouseURL:  "http://127.0.0.1:" + resource.GetPort("8123/tcp"),
		ClickHouseDB:   fmt.Sprintf("indexer_retry_%d", time.Now().UnixNano()),
		ClickHouseUser: "default",
		ClickHousePass: "",
	}
	dom := New(cfg)
	dom.Store = model.NewStore(cfg, &http.Client{Timeout: 30 * time.Second})
	if err := pool.Retry(func() error {
		return dom.Store.ExecRaw("SELECT 1", "")
	}); err != nil {
		t.Fatalf("clickhouse not ready: %v", err)
	}
	if err := dom.EnsureProjectDirs(); err != nil {
		t.Fatal(err)
	}
	if err := dom.Store.ExecRaw("CREATE DATABASE IF NOT EXISTS "+cfg.ClickHouseDB, ""); err != nil {
		t.Fatal(err)
	}
	if err := dom.Store.ApplyMigrations(integrationMigrationsDir(t)); err != nil {
		t.Fatal(err)
	}

	historyEntry := model.ManageHistoryEntry{
		ID:         "retry-rename-1",
		Action:     "rename",
		Status:     "error",
		SrcPath:    oldPath,
		DstPath:    newPath,
		Message:    "simulated previous failure",
		CreatedAt:  "2026-05-20 12:34:56.789",
		StartedAt:  "2026-05-20 12:35:00.000",
		FinishedAt: "2026-05-20 12:35:05.000",
	}
	if err := dom.Store.InsertManageHistory(historyEntry); err != nil {
		t.Fatal(err)
	}

	res, err := dom.RetryManageTask("secret", historyEntry.ID)
	if err != nil {
		t.Fatal(err)
	}
	if !res.OK {
		t.Fatalf("unexpected retry response: %+v", res)
	}

	waitForManageQueueDrainIntegration(t, dom)
	if _, err := os.Stat(newPath); err != nil {
		t.Fatalf("expected retried rename to complete: %v", err)
	}
	if _, err := os.Stat(oldPath); !os.IsNotExist(err) {
		t.Fatalf("expected old path to disappear after retry, err=%v", err)
	}
}

func waitForManageQueueDrainIntegration(t *testing.T, dom *Domain) {
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

func integrationMigrationsDir(t *testing.T) string {
	t.Helper()
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("cannot resolve caller path")
	}
	return filepath.Join(filepath.Dir(file), "..", "migrations")
}
