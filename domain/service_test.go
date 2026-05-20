package domain

import (
	"bytes"
	"os"
	"path/filepath"
	"testing"
	"time"

	"indexer/model"
)

func TestSuggestName(t *testing.T) {
	got := SuggestName("katainaka.no.ossan.kensei.ni.naru.S01.[12Ew0].[unc]")
	if got == "" || got == "katainaka.no.ossan.kensei.ni.naru.S01.[12Ew0].[unc]" {
		t.Fatalf("got=%q", got)
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
