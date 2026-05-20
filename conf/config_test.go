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
