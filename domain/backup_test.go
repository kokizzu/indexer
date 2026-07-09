package domain

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
	"time"

	"indexer/conf"
	"indexer/model"
)

func TestBackupEstimateComputesIncrementAndSortsLargest(t *testing.T) {
	root := t.TempDir()
	source := filepath.Join(root, "source")
	target := filepath.Join(root, "target")
	if err := os.MkdirAll(filepath.Join(source, "nested"), 0o755); err != nil {
		t.Fatal(err)
	}
	a := filepath.Join(source, "a.bin")
	b := filepath.Join(source, "nested", "b.bin")
	if err := os.WriteFile(a, []byte("1234567890"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(b, []byte("12345"), 0o644); err != nil {
		t.Fatal(err)
	}
	targetA := backupTargetPath(target, a)
	if err := os.MkdirAll(filepath.Dir(targetA), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(targetA, []byte("1234567890"), 0o644); err != nil {
		t.Fatal(err)
	}
	future := time.Now().Add(time.Hour)
	if err := os.Chtimes(targetA, future, future); err != nil {
		t.Fatal(err)
	}

	dom := New(conf.Config{Password: "secret", BackupSources: []string{source}, BackupTarget: target})
	got, err := dom.BackupEstimate(0)
	if err != nil {
		t.Fatal(err)
	}
	if got.SourceSize != 15 {
		t.Fatalf("source size=%d", got.SourceSize)
	}
	if got.EstimatedIncrement != 5 {
		t.Fatalf("estimated increment=%d", got.EstimatedIncrement)
	}
	if got.CurrentBackupSize != 10 {
		t.Fatalf("current backup size=%d", got.CurrentBackupSize)
	}
	if got.Elapsed == "" || got.CompletedAt.IsZero() || got.ElapsedSeconds <= 0 {
		t.Fatalf("expected estimate timing fields, got elapsed=%q seconds=%f completed=%v", got.Elapsed, got.ElapsedSeconds, got.CompletedAt)
	}
	if len(got.Entries) < 2 {
		t.Fatalf("expected entries, got=%d", len(got.Entries))
	}
	for _, entry := range got.Entries {
		if entry.Path == source && entry.IncrementBytes != 5 {
			t.Fatalf("source dir increment=%d", entry.IncrementBytes)
		}
	}
	for i := 1; i < len(got.Entries); i++ {
		if got.Entries[i-1].Size < got.Entries[i].Size {
			t.Fatalf("entries are not sorted largest first: %#v", got.Entries)
		}
	}
}

func TestBackupEstimateAppliesEntryLimitAfterSorting(t *testing.T) {
	root := t.TempDir()
	source := filepath.Join(root, "source")
	target := filepath.Join(root, "target")
	if err := os.MkdirAll(source, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(source, "small.bin"), []byte("1"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(source, "large.bin"), []byte("1234567890"), 0o644); err != nil {
		t.Fatal(err)
	}
	dom := New(conf.Config{Password: "secret", BackupSources: []string{source}, BackupTarget: target})
	got, err := dom.BackupEstimate(1)
	if err != nil {
		t.Fatal(err)
	}
	if got.EntryCount <= len(got.Entries) {
		t.Fatalf("expected total entry count to exceed returned rows: count=%d rows=%d", got.EntryCount, len(got.Entries))
	}
	if !got.Truncated {
		t.Fatal("expected truncated estimate")
	}
	if len(got.Entries) != 1 || filepath.Base(got.Entries[0].Path) != "source" {
		t.Fatalf("expected largest source directory first, got %#v", got.Entries)
	}
	if got.SourceSize != 11 || got.EstimatedIncrement != 11 {
		t.Fatalf("unexpected totals: source=%d increment=%d", got.SourceSize, got.EstimatedIncrement)
	}
	if got.Entries[0].Size != got.Entries[0].IncrementBytes {
		t.Fatalf("fresh target should have equal size and increment for dir row: size=%d increment=%d", got.Entries[0].Size, got.Entries[0].IncrementBytes)
	}
}

func TestBackupConfigResultReturnsConfiguredSources(t *testing.T) {
	root := t.TempDir()
	sourceA := filepath.Join(root, "source-a")
	sourceB := filepath.Join(root, "source-b")
	for _, dir := range []string{sourceB, sourceA} {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	dom := New(conf.Config{
		Password:       "secret",
		BackupSources:  []string{sourceB, sourceA},
		ExcludeSources: []string{"*.cache", filepath.Join(sourceA, "tmp")},
		BackupTarget:   filepath.Join(root, "target"),
	})
	got, rc := dom.BackupConfigResult()
	if rc.HasError() {
		t.Fatalf("unexpected response error: %#v", rc)
	}
	if len(got.Sources) != 2 || got.Sources[0] != sourceA || got.Sources[1] != sourceB {
		t.Fatalf("unexpected sources: %#v", got.Sources)
	}
	if got.Target != filepath.Join(root, "target") {
		t.Fatalf("target=%q", got.Target)
	}
	if got.Runtime.EUID != os.Geteuid() || got.Runtime.IsRoot != (os.Geteuid() == 0) {
		t.Fatalf("unexpected runtime: %#v", got.Runtime)
	}
	if !got.Runtime.SudoHelper {
		t.Fatalf("expected sudo helper flag in runtime: %#v", got.Runtime)
	}
	if len(got.Excludes) != 2 || got.Excludes[0] != "*.cache" || got.Excludes[1] != filepath.Join(sourceA, "tmp") {
		t.Fatalf("unexpected excludes: %#v", got.Excludes)
	}
}

func TestBackupApiOutMarshalsBackupStatus(t *testing.T) {
	status := BackupStatus{
		LastEstimateAt:       "2026-07-01T09:32:44+08:00",
		LastEstimateDuration: "1m4s",
		LastBackupAt:         "2026-07-01T05:00:42+08:00",
		LastBackupDuration:   "42s",
	}
	cases := []struct {
		name string
		out  any
	}{
		{name: "config", out: BackupConfigOut{BackupConfig: BackupConfig{Status: status}}},
		{name: "estimate", out: BackupEstimateOut{BackupEstimate: BackupEstimate{Status: status}}},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			raw, err := json.Marshal(tc.out)
			if err != nil {
				t.Fatal(err)
			}
			var got map[string]any
			if err := json.Unmarshal(raw, &got); err != nil {
				t.Fatal(err)
			}
			if _, ok := got["backupStatus"]; !ok {
				t.Fatalf("backupStatus missing from %s", raw)
			}
			if _, ok := got["status"]; ok {
				t.Fatalf("unexpected conflicting status field in %s", raw)
			}
		})
	}
}

func TestBackupEstimateExpandsSourceGlobs(t *testing.T) {
	root := t.TempDir()
	target := filepath.Join(root, "target")
	a := filepath.Join(root, "a.conf")
	b := filepath.Join(root, "b.conf")
	if err := os.WriteFile(a, []byte("a"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(b, []byte("bb"), 0o644); err != nil {
		t.Fatal(err)
	}
	dom := New(conf.Config{Password: "secret", BackupSources: []string{filepath.Join(root, "*.conf")}, BackupTarget: target})
	got, err := dom.BackupEstimate(0)
	if err != nil {
		t.Fatal(err)
	}
	if len(got.Sources) != 2 || got.Sources[0] != a || got.Sources[1] != b {
		t.Fatalf("unexpected expanded sources: %#v", got.Sources)
	}
	if got.SourceSize != 3 || got.EstimatedIncrement != 3 {
		t.Fatalf("unexpected estimate: source=%d increment=%d", got.SourceSize, got.EstimatedIncrement)
	}
}

func TestBackupSourcesSortAscendingAndRemoveOverlaps(t *testing.T) {
	root := t.TempDir()
	parent := filepath.Join(root, "parent")
	child := filepath.Join(parent, "child")
	sibling := filepath.Join(root, "sibling")
	for _, dir := range []string{child, sibling} {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	dom := New(conf.Config{
		Password: "secret",
		BackupSources: []string{
			sibling,
			child,
			parent,
			parent,
		},
		BackupTarget: filepath.Join(root, "target"),
	})
	sources, warnings, err := dom.backupSources()
	if err != nil {
		t.Fatal(err)
	}
	want := []string{parent, sibling}
	if len(sources) != len(want) {
		t.Fatalf("sources=%#v warnings=%#v", sources, warnings)
	}
	for i := range want {
		if sources[i] != want[i] {
			t.Fatalf("sources=%#v want=%#v", sources, want)
		}
	}
	if len(warnings) < 2 {
		t.Fatalf("expected duplicate and overlap warnings, got %#v", warnings)
	}
}

func TestBackupEstimateExcludesInnerPathAndWildcard(t *testing.T) {
	root := t.TempDir()
	source := filepath.Join(root, "source")
	keep := filepath.Join(source, "keep.txt")
	excludedDir := filepath.Join(source, "tmp")
	excludedFile := filepath.Join(source, "drop.cache")
	if err := os.MkdirAll(excludedDir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(keep, []byte("keep"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(excludedDir, "nested.txt"), []byte("skip"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(excludedFile, []byte("skip"), 0o644); err != nil {
		t.Fatal(err)
	}
	dom := New(conf.Config{
		Password:       "secret",
		BackupSources:  []string{source},
		ExcludeSources: []string{excludedDir, "*.cache"},
		BackupTarget:   filepath.Join(root, "target"),
	})
	got, err := dom.BackupEstimate(0)
	if err != nil {
		t.Fatal(err)
	}
	if got.SourceSize != int64(len("keep")) || got.EstimatedIncrement != int64(len("keep")) {
		t.Fatalf("unexpected included size: source=%d increment=%d", got.SourceSize, got.EstimatedIncrement)
	}
	for _, entry := range got.Entries {
		if entry.Path == excludedDir || entry.Path == excludedFile || isPathWithin(entry.Path, excludedDir) {
			t.Fatalf("excluded path present in estimate: %#v", entry)
		}
	}
}

func TestBackupSourcesExcludeTopLevelSource(t *testing.T) {
	root := t.TempDir()
	a := filepath.Join(root, "a")
	b := filepath.Join(root, "b")
	for _, dir := range []string{a, b} {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	dom := New(conf.Config{
		Password:       "secret",
		BackupSources:  []string{b, a},
		ExcludeSources: []string{a},
		BackupTarget:   filepath.Join(root, "target"),
	})
	sources, warnings, err := dom.backupSources()
	if err != nil {
		t.Fatal(err)
	}
	if len(sources) != 1 || sources[0] != b {
		t.Fatalf("sources=%#v warnings=%#v", sources, warnings)
	}
	if len(warnings) == 0 {
		t.Fatalf("expected exclude warning")
	}
}

func TestBackupRsyncExcludeArgs(t *testing.T) {
	got := backupRsyncExcludeArgs([]string{"/home/me/tmp", "*.cache"})
	want := map[string]bool{
		"home/me/tmp":     false,
		"home/me/tmp/***": false,
		"*.cache":         false,
	}
	for _, item := range got {
		if _, ok := want[item]; ok {
			want[item] = true
		}
	}
	for item, seen := range want {
		if !seen {
			t.Fatalf("missing rsync exclude %q from %#v", item, got)
		}
	}
}

func TestBackupEstimateWarnsForUnmatchedGlobsWithValidSources(t *testing.T) {
	root := t.TempDir()
	target := filepath.Join(root, "target")
	a := filepath.Join(root, "a.conf")
	if err := os.WriteFile(a, []byte("a"), 0o644); err != nil {
		t.Fatal(err)
	}
	dom := New(conf.Config{
		Password:      "secret",
		BackupSources: []string{a, filepath.Join(root, "*.missing")},
		BackupTarget:  target,
	})
	got, err := dom.BackupEstimate(0)
	if err != nil {
		t.Fatal(err)
	}
	if len(got.Sources) != 1 || got.Sources[0] != a {
		t.Fatalf("unexpected sources: %#v", got.Sources)
	}
	if len(got.Warnings) != 1 || got.Warnings[0] == "" {
		t.Fatalf("expected unmatched glob warning, got %#v", got.Warnings)
	}
}

func TestBackupEstimateWarnsForMissingLiteralWithValidSources(t *testing.T) {
	root := t.TempDir()
	target := filepath.Join(root, "target")
	a := filepath.Join(root, "a.conf")
	missing := filepath.Join(root, "missing.conf")
	if err := os.WriteFile(a, []byte("a"), 0o644); err != nil {
		t.Fatal(err)
	}
	dom := New(conf.Config{
		Password:      "secret",
		BackupSources: []string{a, missing},
		BackupTarget:  target,
	})
	got, err := dom.BackupEstimate(0)
	if err != nil {
		t.Fatal(err)
	}
	if len(got.Sources) != 1 || got.Sources[0] != a {
		t.Fatalf("unexpected sources: %#v", got.Sources)
	}
	if len(got.Warnings) != 1 || got.Warnings[0] == "" {
		t.Fatalf("expected missing source warning, got %#v", got.Warnings)
	}
}

func TestBackupEstimateWarnsForUnreadableSubtree(t *testing.T) {
	if os.Geteuid() == 0 {
		t.Skip("root can read unreadable test directories")
	}
	root := t.TempDir()
	target := filepath.Join(root, "target")
	source := filepath.Join(root, "source")
	unreadable := filepath.Join(source, "unreadable")
	if err := os.MkdirAll(unreadable, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(source, "ok.txt"), []byte("ok"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.Chmod(unreadable, 0); err != nil {
		t.Fatal(err)
	}
	defer os.Chmod(unreadable, 0o755)

	dom := New(conf.Config{Password: "secret", BackupSources: []string{source}, BackupTarget: target})
	got, err := dom.BackupEstimate(0)
	if err != nil {
		t.Fatal(err)
	}
	if got.SourceSize != 2 {
		t.Fatalf("source size=%d", got.SourceSize)
	}
	if len(got.Warnings) == 0 {
		t.Fatalf("expected unreadable subtree warning")
	}
}

func TestBackupRunPreservesOriginalDirectoryStructure(t *testing.T) {
	if _, err := exec.LookPath("rsync"); err != nil {
		t.Skip("rsync not installed")
	}
	root := t.TempDir()
	source := filepath.Join(root, "source")
	target := filepath.Join(root, "target")
	if err := os.MkdirAll(filepath.Join(source, "nested"), 0o755); err != nil {
		t.Fatal(err)
	}
	file := filepath.Join(source, "nested", "file.txt")
	if err := os.WriteFile(file, []byte("backup me"), 0o644); err != nil {
		t.Fatal(err)
	}
	dom := New(conf.Config{Password: "secret", BackupSources: []string{source}, BackupTarget: target})
	if _, err := dom.BackupRun(); err != nil {
		t.Fatal(err)
	}
	run, err := dom.BackupRun()
	if err != nil {
		t.Fatal(err)
	}
	if run.Elapsed == "" || run.ElapsedSeconds <= 0 {
		t.Fatalf("expected backup run timing, got %#v", run)
	}
	backedUp := backupTargetPath(target, file)
	raw, err := os.ReadFile(backedUp)
	if err != nil {
		t.Fatalf("expected backed up file at %s: %v", backedUp, err)
	}
	if string(raw) != "backup me" {
		t.Fatalf("backup content=%q", string(raw))
	}
}

func TestBackupRunReplacesConflictingTargetDirectoryWithSymlink(t *testing.T) {
	if _, err := exec.LookPath("rsync"); err != nil {
		t.Skip("rsync not installed")
	}
	root := t.TempDir()
	source := filepath.Join(root, "source")
	target := filepath.Join(root, "target")
	linkPath := filepath.Join(source, "node_modules", "pkg")
	if err := os.MkdirAll(filepath.Dir(linkPath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(".pnpm/pkg", linkPath); err != nil {
		t.Fatal(err)
	}
	staleTargetDir := backupTargetPath(target, linkPath)
	if err := os.MkdirAll(staleTargetDir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(staleTargetDir, "stale.txt"), []byte("stale"), 0o644); err != nil {
		t.Fatal(err)
	}

	dom := New(conf.Config{Password: "secret", BackupSources: []string{source}, BackupTarget: target})
	if _, err := dom.BackupRun(); err != nil {
		t.Fatal(err)
	}
	info, err := os.Lstat(staleTargetDir)
	if err != nil {
		t.Fatal(err)
	}
	if info.Mode()&os.ModeSymlink == 0 {
		t.Fatalf("expected conflicting target to be replaced by symlink, mode=%v", info.Mode())
	}
	got, err := os.Readlink(staleTargetDir)
	if err != nil {
		t.Fatal(err)
	}
	if got != ".pnpm/pkg" {
		t.Fatalf("symlink target=%q", got)
	}
}

func TestBackupRunReplacesConflictingTargetFileWithSymlink(t *testing.T) {
	if _, err := exec.LookPath("rsync"); err != nil {
		t.Skip("rsync not installed")
	}
	root := t.TempDir()
	source := filepath.Join(root, "source")
	target := filepath.Join(root, "target")
	linkPath := filepath.Join(source, ".codex", "tmp", "arg0", "apply_patch")
	linkTarget := "/home/kyz/.codex/packages/standalone/releases/current/bin/codex"
	if err := os.MkdirAll(filepath.Dir(linkPath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(linkTarget, linkPath); err != nil {
		t.Fatal(err)
	}
	staleTargetFile := backupTargetPath(target, linkPath)
	if err := os.MkdirAll(filepath.Dir(staleTargetFile), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(staleTargetFile, []byte("stale"), 0o644); err != nil {
		t.Fatal(err)
	}

	dom := New(conf.Config{Password: "secret", BackupSources: []string{source}, BackupTarget: target})
	if _, err := dom.BackupRun(); err != nil {
		t.Fatal(err)
	}
	info, err := os.Lstat(staleTargetFile)
	if err != nil {
		t.Fatal(err)
	}
	if info.Mode()&os.ModeSymlink == 0 {
		t.Fatalf("expected conflicting target to be replaced by symlink, mode=%v", info.Mode())
	}
	got, err := os.Readlink(staleTargetFile)
	if err != nil {
		t.Fatal(err)
	}
	if got != linkTarget {
		t.Fatalf("symlink target=%q", got)
	}
}

func TestNextDailyBackupTime(t *testing.T) {
	loc := time.FixedZone("test", 8*60*60)
	before := time.Date(2026, 6, 30, 4, 59, 0, 0, loc)
	got := nextDailyBackupTime(before)
	want := time.Date(2026, 6, 30, 5, 0, 0, 0, loc)
	if !got.Equal(want) {
		t.Fatalf("before 05:00 got %v want %v", got, want)
	}

	after := time.Date(2026, 6, 30, 5, 0, 0, 0, loc)
	got = nextDailyBackupTime(after)
	want = time.Date(2026, 7, 1, 5, 0, 0, 0, loc)
	if !got.Equal(want) {
		t.Fatalf("at 05:00 got %v want %v", got, want)
	}
}

func TestRecordBackupRunFillsMissingCompletedAt(t *testing.T) {
	root := t.TempDir()
	oldWd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Chdir(root); err != nil {
		t.Fatal(err)
	}
	defer os.Chdir(oldWd)

	target := filepath.Join(root, "target")
	if err := os.MkdirAll(target, 0o755); err != nil {
		t.Fatal(err)
	}
	dom := New(conf.Config{Password: "secret", BackupTarget: target})
	dom.recordBackupRun(model.ActionResponse{
		OK:             true,
		Message:        "backup completed in 2s",
		Elapsed:        "2s",
		ElapsedSeconds: 2,
	}, "")
	status := dom.loadBackupStatus()
	if status.LastBackupAt == "" {
		t.Fatalf("expected fallback last backup time: %#v", status)
	}
	if status.LastBackupDuration != "2s" {
		t.Fatalf("duration=%q", status.LastBackupDuration)
	}
	if status.LastBackupStartedAt == "" {
		t.Fatalf("expected fallback start time: %#v", status)
	}
}

func TestRecordBackupEstimatePersistsMetadata(t *testing.T) {
	root := t.TempDir()
	oldWd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Chdir(root); err != nil {
		t.Fatal(err)
	}
	defer os.Chdir(oldWd)

	started := time.Date(2026, 7, 1, 9, 31, 40, 0, time.Local)
	completed := started.Add(64*time.Second + 48*time.Millisecond)
	dom := New(conf.Config{Password: "secret"})
	dom.recordBackupEstimate(BackupEstimate{
		StartedAt:         started,
		CompletedAt:       completed,
		Elapsed:           "1m4.048s",
		ElapsedSeconds:    completed.Sub(started).Seconds(),
		CurrentBackupSize: 123,
	})

	status := dom.loadBackupStatus()
	if status.LastEstimateAt != completed.Format(time.RFC3339) {
		t.Fatalf("last estimate at=%q", status.LastEstimateAt)
	}
	if status.LastEstimateDuration != "1m4.048s" {
		t.Fatalf("last estimate duration=%q", status.LastEstimateDuration)
	}
	if status.LastEstimateStartedAt != started.Format(time.RFC3339) {
		t.Fatalf("last estimate started at=%q", status.LastEstimateStartedAt)
	}
	if status.CurrentBackupSize != 123 {
		t.Fatalf("current backup size=%d", status.CurrentBackupSize)
	}
}

func TestLoadBackupStatusBackfillsOldMissingBackupAt(t *testing.T) {
	root := t.TempDir()
	oldWd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Chdir(root); err != nil {
		t.Fatal(err)
	}
	defer os.Chdir(oldWd)

	if err := os.MkdirAll("_tmpdb", 0o755); err != nil {
		t.Fatal(err)
	}
	raw := []byte(`{"lastBackupDuration":"3s","lastBackupSeconds":3,"lastBackupMessage":"backup completed in 3s"}`)
	path := filepath.Join("_tmpdb", "backup_status.json")
	if err := os.WriteFile(path, raw, 0o644); err != nil {
		t.Fatal(err)
	}
	mod := time.Date(2026, 7, 1, 5, 1, 2, 0, time.Local)
	if err := os.Chtimes(path, mod, mod); err != nil {
		t.Fatal(err)
	}

	dom := New(conf.Config{Password: "secret"})
	status := dom.loadBackupStatus()
	if status.LastBackupAt == "" {
		t.Fatalf("expected last backup at fallback: %#v", status)
	}
	if status.LastBackupStartedAt == "" {
		t.Fatalf("expected last backup start fallback: %#v", status)
	}
}
