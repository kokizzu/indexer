package domain

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"

	"indexer/conf"
	"indexer/model"
)

func TestSuggestName(t *testing.T) {
	got := SuggestName("katainaka.no.ossan.kensei.ni.naru.S01.[12Ew0].[unc]")
	if got == "" || got == "katainaka.no.ossan.kensei.ni.naru.S01.[12Ew0].[unc]" {
		t.Fatalf("got=%q", got)
	}
}

func TestSuggestDetails(t *testing.T) {
	got := SuggestDetails("katainaka.no.ossan.kensei.ni.naru.S01.[12Ew0].[unc]")
	if got.CleanTitle == "" {
		t.Fatal("expected clean title")
	}
	if got.Season != "S01" {
		t.Fatalf("season=%q", got.Season)
	}
	if got.Episode != "12EW0" {
		t.Fatalf("episode=%q", got.Episode)
	}
	if got.Extras != "[12Ew0] [unc]" {
		t.Fatalf("extras=%q", got.Extras)
	}
	if !got.Changed {
		t.Fatal("expected changed suggestion")
	}
}

func TestSuggestPathFromEpisodeFiles(t *testing.T) {
	root := t.TempDir()
	dir := filepath.Join(root, "messy")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	for _, name := range []string{
		"Show.Name.S01E01.mkv",
		"Show.Name.S01E02.mkv",
		"Show.Name.S01E04.mkv",
	} {
		if err := os.WriteFile(filepath.Join(dir, name), []byte("x"), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	dom := New(conf.Config{MoviesExts: []string{"mkv"}})
	got := dom.SuggestPath(dir)
	if got.RuleSource == "basename heuristic" {
		t.Fatalf("expected directory rule source, got=%q", got.RuleSource)
	}
	if got.Suggested == "" || !strings.Contains(got.Suggested, "Show Name S01") {
		t.Fatalf("suggested=%q", got.Suggested)
	}
}

func TestValidateSortedMoveRequiresFinalOfPattern(t *testing.T) {
	root := t.TempDir()
	sorted := filepath.Join(root, "sorted")
	if err := os.MkdirAll(sorted, 0o755); err != nil {
		t.Fatal(err)
	}
	dom := New(conf.Config{SortedRoots: []string{sorted}})
	err := dom.ValidateSortedMove(filepath.Join(root, "Show Name S01 [12Ew0]"), sorted)
	if err == nil {
		t.Fatal("expected validation error for Ew form")
	}
	err = dom.ValidateSortedMove(filepath.Join(root, "Show Name S01 [12of_w0]"), sorted)
	if err != nil {
		t.Fatalf("unexpected error for final sorted form: %v", err)
	}
}

func TestQueueCategorizeRejectsOutsideRoots(t *testing.T) {
	root := t.TempDir()
	dom := New(conf.Config{
		Password:      "secret",
		UnsortedRoots: []string{root},
		MoviesExts:    []string{"mkv"},
	})
	_, err := dom.QueueCategorize("secret", filepath.Join(root, "..", "outside"), CategorizeOptions{})
	if err == nil {
		t.Fatal("expected outside-roots validation error")
	}
}

func TestStartReindexFailsWithoutAccessibleRoots(t *testing.T) {
	dom := New(conf.Config{
		Password:      "secret",
		UnsortedRoots: []string{"/definitely/not/there"},
	})
	res, started := dom.StartReindex("")
	if started {
		t.Fatal("expected reindex not to start")
	}
	if res.OK || !strings.Contains(strings.ToLower(res.Message), "no configured roots") {
		t.Fatalf("unexpected response: %+v", res)
	}
}

func TestLoadResumeStateSkipsBlankAndTruncatedLines(t *testing.T) {
	dir := t.TempDir()
	oldWd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = os.Chdir(oldWd) }()
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll("_tmpdb", 0o755); err != nil {
		t.Fatal(err)
	}
	lines := "\n" +
		`{"path":"/root/a.mkv","dir":"/root","base":"a.mkv","ext":".mkv","root":"/root","rootKind":"unsorted","is_dir":0,"size":1,"modified_at":"2026-05-21T00:00:00Z","fingerprint":"x","content":"a mkv"}` + "\n" +
		"{"
	if err := os.WriteFile(filepath.Join("_tmpdb", "reindex_entries.jsonl"), []byte(lines), 0o644); err != nil {
		t.Fatal(err)
	}
	dom := New(conf.Config{Password: "secret"})
	entries, processed, _, err := dom.loadResumeState("", nil)
	if err != nil {
		t.Fatal(err)
	}
	if len(entries) != 1 || len(processed) != 1 {
		t.Fatalf("entries=%d processed=%d", len(entries), len(processed))
	}
}

func TestBootstrapLoadsLastStatus(t *testing.T) {
	dir := t.TempDir()
	oldWd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = os.Chdir(oldWd) }()
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll("_tmpdb", 0o755); err != nil {
		t.Fatal(err)
	}
	want := Status{
		WorkerCount:    4,
		ActiveWorkers:  0,
		EstimatedRoots: 42,
		TotalRoots:     42,
		Files:          123,
		Directories:    45,
		TotalBytes:     987654321,
		ProcessedBytes: 987654321,
		ProgressPct:    100,
		Running:        false,
		Resumed:        false,
	}
	raw, err := json.Marshal(want)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join("_tmpdb", "last_reindex_status.json"), raw, 0o644); err != nil {
		t.Fatal(err)
	}
	got := New(conf.Config{Password: "secret"}).Status()
	if got.TotalRoots != want.TotalRoots || got.WorkerCount != want.WorkerCount || got.TotalBytes != want.TotalBytes {
		t.Fatalf("got=%+v want=%+v", got, want)
	}
}

func TestManageQueueStateRoundTrip(t *testing.T) {
	dir := t.TempDir()
	oldWd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = os.Chdir(oldWd) }()
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll("_tmpdb", 0o755); err != nil {
		t.Fatal(err)
	}
	dom := &Domain{Cfg: conf.Config{Password: "secret"}}
	dom.manageCond = sync.NewCond(&dom.manageMu)
	dom.manageQueue = []*ManageTask{
		{ID: "q1", Action: "rename", Status: "queued", SrcPath: "/a", DstPath: "/b"},
		{ID: "q2", Action: "move", Status: "queued", SrcPath: "/c", DstDir: "/dst", DstPath: "/dst/c"},
	}
	dom.manageRunning = map[string]*ManageTask{
		"r1": {ID: "r1", Action: "categorize", Status: "running", SrcPath: "/x", WatchedCount: 2},
		"r2": {ID: "r2", Action: "rename", Status: "running", SrcPath: "/m", DstPath: "/n"},
	}
	if err := dom.saveManageQueueStateLocked(); err != nil {
		t.Fatal(err)
	}

	loaded := &Domain{Cfg: conf.Config{Password: "secret"}}
	loaded.manageCond = sync.NewCond(&loaded.manageMu)
	if err := loaded.loadManageQueueState(); err != nil {
		t.Fatal(err)
	}
	status := loaded.ManageStatus()
	if status.Running.ID != "" {
		t.Fatalf("expected no running task after restore, got %+v", status.Running)
	}
	if len(status.RunningTasks) != 0 {
		t.Fatalf("expected no running tasks after restore, got %+v", status.RunningTasks)
	}
	if len(status.Queued) != 4 {
		t.Fatalf("expected 4 queued tasks after restore, got %+v", status.Queued)
	}
	if status.Queued[0].ID != "r1" || status.Queued[0].Status != "queued" {
		t.Fatalf("expected previous running task to be requeued first, got %+v", status.Queued[0])
	}
	if status.Queued[1].ID != "r2" || status.Queued[1].Status != "queued" {
		t.Fatalf("expected second running task to be requeued next, got %+v", status.Queued[1])
	}
}

func TestManageTaskMountKeys(t *testing.T) {
	dom := &Domain{}
	task := &ManageTask{
		SrcPath: "/mnt/a/src/show",
		DstDir:  "/mnt/b/dst",
		DstPath: "/mnt/b/dst/show",
	}
	got := dom.taskMountKeys(task, map[string][]string{
		"/mnt/a": {"rw"},
		"/mnt/b": {"rw"},
	})
	if len(got) != 2 || got[0] != "/mnt/a" || got[1] != "/mnt/b" {
		t.Fatalf("unexpected mount keys: %+v", got)
	}
}

func TestCanRunManageTaskLocked(t *testing.T) {
	dom := &Domain{manageMounts: map[string]int{"/mnt/a": 1}}
	mounts := map[string][]string{
		"/mnt/a": {"rw"},
		"/mnt/b": {"rw"},
	}
	if dom.canRunManageTaskLocked(&ManageTask{SrcPath: "/mnt/a/file"}, mounts) {
		t.Fatal("expected same-mount task to be blocked")
	}
	if !dom.canRunManageTaskLocked(&ManageTask{SrcPath: "/mnt/b/file"}, mounts) {
		t.Fatal("expected different-mount task to be allowed")
	}
}

func TestCancelManageTask(t *testing.T) {
	dom := &Domain{}
	dom.manageCond = sync.NewCond(&dom.manageMu)
	dom.manageQueue = []*ManageTask{
		{ID: "q1", Action: "rename", Status: "queued", SrcPath: "/a", DstPath: "/b"},
		{ID: "q2", Action: "delete", Status: "queued", SrcPath: "/c"},
	}
	res, err := dom.CancelManageTask("q1")
	if err != nil {
		t.Fatal(err)
	}
	if !res.OK || len(dom.manageQueue) != 1 || dom.manageQueue[0].ID != "q2" {
		t.Fatalf("unexpected cancel result: %+v queue=%+v", res, dom.manageQueue)
	}
}

func TestParseCategorizePreview(t *testing.T) {
	raw := "Detected episodic video files: 3\nDetected groups: 1\nPlanned moves/renames: 2\n\nA.mkv -> Folder/A.mkv\nB.srt -> Folder/B.srt\n\nAmbiguous subtitles skipped:\nV.mkv :: Subs/1.srt, Subs/2.srt\n... preview truncated ...\n"
	got := parseCategorizePreview("/root/x", raw)
	if got.DetectedVideoFiles != 3 || got.DetectedGroups != 1 || got.PlannedMoves != 2 {
		t.Fatalf("unexpected summary: %+v", got)
	}
	if len(got.Operations) != 2 {
		t.Fatalf("operations=%d", len(got.Operations))
	}
	if got.VideoMoves != 1 || got.SubtitleMoves != 1 || got.AuxiliaryMoves != 0 {
		t.Fatalf("unexpected move-kind counts: %+v", got)
	}
	if len(got.Groups) != 1 || got.Groups[0].TargetDir != "Folder" || got.Groups[0].Count != 2 {
		t.Fatalf("unexpected groups: %+v", got.Groups)
	}
	if got.Operations[0].Kind != "video" || got.Operations[1].Kind != "subtitle" {
		t.Fatalf("unexpected operation kinds: %+v", got.Operations)
	}
	if !got.Truncated {
		t.Fatal("expected truncated=true")
	}
	if len(got.AmbiguousSubtitles) != 1 || got.AmbiguousSubtitles[0].Video != "V.mkv" {
		t.Fatalf("unexpected ambiguous subtitles: %+v", got.AmbiguousSubtitles)
	}
}

func TestParseCategorizeApplySummary(t *testing.T) {
	raw := "Removed auxiliary files: 4\nRemoved Screens directories: 2\nCreating target directories...\nMoving files...\nCompleted. moved=15 skipped_existing=3\nRemoved empty directories: 7\n"
	got := parseCategorizeApplySummary(raw)
	if got.RemovedAuxFiles != 4 || got.RemovedScreensDirs != 2 || got.Moved != 15 || got.SkippedExisting != 3 || got.RemovedEmptyDirs != 7 {
		t.Fatalf("unexpected apply summary: %+v", got)
	}
	msg := formatCategorizeApplySummary("/root/x", got, raw)
	if !strings.Contains(msg, "moved=15") || !strings.Contains(msg, "removed_empty_dirs=7") {
		t.Fatalf("unexpected formatted message: %s", msg)
	}
}

func TestSuggestSubtitleRename(t *testing.T) {
	root := t.TempDir()
	dir := filepath.Join(root, "Summer Strike S01 KOREAN [12Ew0]", "Subs", "Summer.Strike.S01E01.KOREAN.WEBRip.x264-KOREA[eztv.re]")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	sub := filepath.Join(dir, "2_English.srt")
	if err := os.WriteFile(sub, []byte("1"), 0o644); err != nil {
		t.Fatal(err)
	}
	dom := New(conf.Config{
		Password:      "secret",
		UnsortedRoots: []string{root},
		SubtitleExts:  []string{"srt"},
	})
	got, err := dom.SuggestSubtitleRename(sub)
	if err != nil {
		t.Fatal(err)
	}
	want := filepath.Join(dir, "Summer.Strike.S01E01.KOREAN.WEBRip.x264-KOREA[eztv.re].en.srt")
	if got != want {
		t.Fatalf("got=%q want=%q", got, want)
	}
}

func TestScanSubtitleRenameCandidates(t *testing.T) {
	root := t.TempDir()
	dir := filepath.Join(root, "Summer Strike S01 KOREAN [12Ew0]", "Subs", "Summer.Strike.S01E01.KOREAN.WEBRip.x264-KOREA[eztv.re]")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	for _, name := range []string{"2_English.srt", "already.ok.en.srt"} {
		if err := os.WriteFile(filepath.Join(dir, name), []byte("1"), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	dom := New(conf.Config{
		Password:      "secret",
		UnsortedRoots: []string{root},
		SubtitleExts:  []string{"srt"},
	})
	rows, err := dom.ScanSubtitleRenameCandidates(root, 50)
	if err != nil {
		t.Fatal(err)
	}
	if len(rows) == 0 {
		t.Fatal("expected subtitle rename candidates")
	}
	if rows[0].Suggested == "" || !strings.HasSuffix(rows[0].Suggested, ".srt") {
		t.Fatalf("unexpected row=%+v", rows[0])
	}
}

func TestQuickFingerprintStable(t *testing.T) {
	dir := t.TempDir()
	path1 := filepath.Join(dir, "a.bin")
	path2 := filepath.Join(dir, "b.bin")
	data := bytes.Repeat([]byte("abc123XYZ"), 300000)
	if err := os.WriteFile(path1, data, 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path2, data, 0o644); err != nil {
		t.Fatal(err)
	}
	fp1 := QuickFingerprint(path1, int64(len(data)))
	fp2 := QuickFingerprint(path2, int64(len(data)))
	if fp1 == "" || fp1 != fp2 {
		t.Fatalf("fp1=%q fp2=%q", fp1, fp2)
	}
}

func TestDiffCounts(t *testing.T) {
	added, removed, renamed := DiffCounts(
		map[string]string{"/old/a": "fp1", "/old/b": "fp2"},
		map[string]string{"/new/a": "fp1", "/old/b": "fp2", "/old/c": "fp3"},
	)
	if added != 2 || removed != 1 || renamed != 1 {
		t.Fatalf("added=%d removed=%d renamed=%d", added, removed, renamed)
	}
}

func TestCollectSubtree(t *testing.T) {
	entries := []model.FileEntry{
		{Path: "/root", Dir: "/", IsDir: 1},
		{Path: "/root/sub", Dir: "/root", IsDir: 1},
		{Path: "/root/sub/file.mkv", Dir: "/root/sub", IsDir: 0},
	}
	got := collectSubtree(indexEntries(entries), "/root")
	if len(got) != 3 {
		t.Fatalf("len=%d", len(got))
	}
}

func TestSameModTime(t *testing.T) {
	now := time.Now().UTC().Truncate(time.Millisecond)
	if !sameModTime(now, now) {
		t.Fatal("expected same modtime")
	}
}
