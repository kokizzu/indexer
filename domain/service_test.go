package domain

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
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
	_, err := dom.QueueCategorize("secret", filepath.Join(root, "..", "outside"))
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

func TestParseCategorizePreview(t *testing.T) {
	raw := "Detected episodic video files: 3\nDetected groups: 1\nPlanned moves/renames: 2\n\nA.mkv -> Folder/A.mkv\nB.srt -> Folder/B.srt\n... preview truncated ...\n"
	got := parseCategorizePreview("/root/x", raw)
	if got.DetectedVideoFiles != 3 || got.DetectedGroups != 1 || got.PlannedMoves != 2 {
		t.Fatalf("unexpected summary: %+v", got)
	}
	if len(got.Operations) != 2 {
		t.Fatalf("operations=%d", len(got.Operations))
	}
	if !got.Truncated {
		t.Fatal("expected truncated=true")
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
