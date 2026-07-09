package conf

import (
	"os"
	"path/filepath"
	"testing"
)

func TestParseEnvFile(t *testing.T) {
	dir := t.TempDir()
	envPath := filepath.Join(dir, ".env")
	content := `PASSWORD=secret
WEB_ADDR=:9999
SORTED_MOVIES="
/mnt/sorted/a
/mnt/sorted/b
"
UNSORTED_MOVIES="
/mnt/unsorted
"`
	if err := os.WriteFile(envPath, []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}
	values, err := ParseEnvFile(envPath)
	if err != nil {
		t.Fatal(err)
	}
	if values["PASSWORD"] != "secret" {
		t.Fatalf("PASSWORD=%q", values["PASSWORD"])
	}
	if values["SORTED_MOVIES"] != "/mnt/sorted/a\n/mnt/sorted/b" {
		t.Fatalf("SORTED_MOVIES=%q", values["SORTED_MOVIES"])
	}
}

func TestParseMultilineList(t *testing.T) {
	got := ParseMultilineList("\n /a/b \n\n/c/d \n")
	if len(got) != 2 || got[0] != "/a/b" || got[1] != "/c/d" {
		t.Fatalf("got=%#v", got)
	}
}

func TestParseEnvFilesOverrideWins(t *testing.T) {
	dir := t.TempDir()
	basePath := filepath.Join(dir, ".env")
	overridePath := filepath.Join(dir, ".env.override")
	if err := os.WriteFile(basePath, []byte("PASSWORD=base\nWEB_ADDR=:18080\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(overridePath, []byte("PASSWORD=secret\nWEB_ADDR=:19090\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	values, err := ParseEnvFiles(basePath, overridePath)
	if err != nil {
		t.Fatal(err)
	}
	if values["PASSWORD"] != "secret" || values["WEB_ADDR"] != ":19090" {
		t.Fatalf("merged=%#v", values)
	}
}

func TestLoadConfigBackupEnv(t *testing.T) {
	dir := t.TempDir()
	envPath := filepath.Join(dir, ".env")
	content := `PASSWORD=secret
BACKUP_SOURCES="
/media/a
/media/b
"
EXCLUDE_SOURCES="
/media/a/tmp
*.cache
"
BACKUP_TARGET=/backup/indexer
`
	if err := os.WriteFile(envPath, []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}
	cfg, err := LoadConfig(envPath)
	if err != nil {
		t.Fatal(err)
	}
	if len(cfg.BackupSources) != 2 || cfg.BackupSources[0] != "/media/a" || cfg.BackupSources[1] != "/media/b" {
		t.Fatalf("unexpected backup sources: %#v", cfg.BackupSources)
	}
	if cfg.BackupTarget != "/backup/indexer" {
		t.Fatalf("unexpected backup target: %q", cfg.BackupTarget)
	}
	if len(cfg.ExcludeSources) != 2 || cfg.ExcludeSources[0] != "/media/a/tmp" || cfg.ExcludeSources[1] != "*.cache" {
		t.Fatalf("unexpected exclude sources: %#v", cfg.ExcludeSources)
	}
}

func TestParseSpaceList(t *testing.T) {
	got := ParseSpaceList(".mkv avi MP4")
	if len(got) != 3 || got[0] != "mkv" || got[1] != "avi" || got[2] != "mp4" {
		t.Fatalf("got=%#v", got)
	}
}
