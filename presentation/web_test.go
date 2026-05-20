package presentation

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"indexer/conf"
	"indexer/domain"
)

func TestHandleSuggest(t *testing.T) {
	root := t.TempDir()
	target := filepath.Join(root, "Series.Name.S01.[12Ew0]")
	if err := os.MkdirAll(target, 0o755); err != nil {
		t.Fatal(err)
	}
	ws := &WebServer{Domain: domain.New(conf.Config{Password: "secret", SortedRoots: []string{root}})}
	body := `{"path":"` + target + `"}`
	req := httptest.NewRequest(http.MethodPost, "/api/suggest", strings.NewReader(body))
	w := httptest.NewRecorder()
	ws.handleSuggest(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("status=%d body=%s", w.Code, w.Body.String())
	}
}

func TestMoveRenameDelete(t *testing.T) {
	root := t.TempDir()
	srcDir := filepath.Join(root, "unsorted")
	dstDir := filepath.Join(root, "sorted")
	_ = os.MkdirAll(srcDir, 0o755)
	_ = os.MkdirAll(dstDir, 0o755)
	original := filepath.Join(srcDir, "show.txt")
	if err := os.WriteFile(original, []byte("hello"), 0o644); err != nil {
		t.Fatal(err)
	}
	ws := &WebServer{Domain: domain.New(conf.Config{
		Password:      "secret",
		SortedRoots:   []string{dstDir},
		UnsortedRoots: []string{srcDir},
	})}

	moveRes := doJSONRequest(t, http.MethodPost, "/api/move", moveRequest{
		Password: "secret", SrcPath: original, DstDir: dstDir, Confirm: "CONFIRM",
	}, ws.handleMove)
	if moveRes.Code != http.StatusOK {
		t.Fatalf("move status=%d body=%s", moveRes.Code, moveRes.Body.String())
	}

	moved := filepath.Join(dstDir, "show.txt")
	renamed := filepath.Join(dstDir, "show-renamed.txt")
	renameRes := doJSONRequest(t, http.MethodPost, "/api/rename", renameRequest{
		Password: "secret", OldPath: moved, NewPath: renamed, Confirm: "CONFIRM",
	}, ws.handleRename)
	if renameRes.Code != http.StatusOK {
		t.Fatalf("rename status=%d body=%s", renameRes.Code, renameRes.Body.String())
	}

	deleteRes := doJSONRequest(t, http.MethodPost, "/api/delete", deleteRequest{
		Password: "secret", Path: renamed, Confirm: "CONFIRM",
	}, ws.handleDelete)
	if deleteRes.Code != http.StatusOK {
		t.Fatalf("delete status=%d body=%s", deleteRes.Code, deleteRes.Body.String())
	}
}

func doJSONRequest(t *testing.T, method, target string, body any, handler http.HandlerFunc) *httptest.ResponseRecorder {
	t.Helper()
	raw, err := json.Marshal(body)
	if err != nil {
		t.Fatal(err)
	}
	req := httptest.NewRequest(method, target, bytes.NewReader(raw))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	handler(w, req)
	return w
}
