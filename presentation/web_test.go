package presentation

import (
	"bytes"
	"encoding/json"
	"io/fs"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

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

func TestHandleSuggestSubtitle(t *testing.T) {
	root := t.TempDir()
	targetDir := filepath.Join(root, "Summer Strike S01 KOREAN [12Ew0]", "Subs", "Summer.Strike.S01E01.KOREAN.WEBRip.x264-KOREA[eztv.re]")
	if err := os.MkdirAll(targetDir, 0o755); err != nil {
		t.Fatal(err)
	}
	target := filepath.Join(targetDir, "2_English.srt")
	if err := os.WriteFile(target, []byte("1"), 0o644); err != nil {
		t.Fatal(err)
	}
	ws := &WebServer{Domain: domain.New(conf.Config{
		Password:      "secret",
		UnsortedRoots: []string{root},
		SubtitleExts:  []string{"srt"},
	})}
	body := `{"path":"` + target + `"}`
	req := httptest.NewRequest(http.MethodPost, "/api/suggest-subtitle", strings.NewReader(body))
	w := httptest.NewRecorder()
	ws.handleSuggestSubtitle(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("status=%d body=%s", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), `.en.srt`) {
		t.Fatalf("expected language-normalized subtitle rename, got %s", w.Body.String())
	}
}

func TestHandleScanSubtitles(t *testing.T) {
	root := t.TempDir()
	targetDir := filepath.Join(root, "Summer Strike S01 KOREAN [12Ew0]", "Subs", "Summer.Strike.S01E01.KOREAN.WEBRip.x264-KOREA[eztv.re]")
	if err := os.MkdirAll(targetDir, 0o755); err != nil {
		t.Fatal(err)
	}
	target := filepath.Join(targetDir, "2_English.srt")
	if err := os.WriteFile(target, []byte("1"), 0o644); err != nil {
		t.Fatal(err)
	}
	ws := &WebServer{Domain: domain.New(conf.Config{
		Password:      "secret",
		UnsortedRoots: []string{root},
		SubtitleExts:  []string{"srt"},
	})}
	body := `{"path":"` + root + `","limit":20}`
	req := httptest.NewRequest(http.MethodPost, "/api/scan-subtitles", strings.NewReader(body))
	w := httptest.NewRecorder()
	ws.handleScanSubtitles(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("status=%d body=%s", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), `.en.srt`) {
		t.Fatalf("expected subtitle scan result, got %s", w.Body.String())
	}
}

func TestHandleCategorizePreview(t *testing.T) {
	root := t.TempDir()
	target := filepath.Join(root, "preview")
	if err := os.MkdirAll(target, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(target, "Show.Name.S01E01.mkv"), []byte("x"), 0o644); err != nil {
		t.Fatal(err)
	}
	ws := &WebServer{Domain: domain.New(conf.Config{Password: "secret", SortedRoots: []string{root}, MoviesExts: []string{"mkv"}})}
	body := `{"path":"` + target + `","previewLimit":20}`
	req := httptest.NewRequest(http.MethodPost, "/api/categorize/preview", strings.NewReader(body))
	w := httptest.NewRecorder()
	ws.handleCategorizePreview(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("status=%d body=%s", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), `"operations"`) {
		t.Fatalf("expected structured operations in response: %s", w.Body.String())
	}
}

func TestManageQueueCategorize(t *testing.T) {
	root := t.TempDir()
	target := filepath.Join(root, "preview")
	if err := os.MkdirAll(target, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(target, "Show.Name.S01E01.mkv"), []byte("x"), 0o644); err != nil {
		t.Fatal(err)
	}
	ws := &WebServer{Domain: domain.New(conf.Config{
		Password:      "secret",
		UnsortedRoots: []string{root},
		MoviesExts:    []string{"mkv"},
	})}
	queueRes := doJSONRequest(t, http.MethodPost, "/api/manage/queue", manageQueueRequest{
		Action:   "categorize",
		Password: "secret",
		SrcPath:  target,
	}, ws.handleManageQueue)
	if queueRes.Code != http.StatusOK {
		t.Fatalf("queue status=%d body=%s", queueRes.Code, queueRes.Body.String())
	}
	waitForManageQueueDrain(t, ws)
}

func TestMoveRenameDelete(t *testing.T) {
	root := t.TempDir()
	srcDir := filepath.Join(root, "unsorted")
	dstDir := filepath.Join(root, "sorted")
	_ = os.MkdirAll(srcDir, 0o755)
	_ = os.MkdirAll(dstDir, 0o755)
	original := filepath.Join(srcDir, "Show Name S01 [12of_w0].txt")
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

	moved := filepath.Join(dstDir, "Show Name S01 [12of_w0].txt")
	renamed := filepath.Join(dstDir, "Show Name S01 [12of_w0]-renamed.txt")
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

func TestManageQueueMove(t *testing.T) {
	root := t.TempDir()
	srcDir := filepath.Join(root, "unsorted")
	dstDir := filepath.Join(root, "sorted")
	_ = os.MkdirAll(srcDir, 0o755)
	_ = os.MkdirAll(dstDir, 0o755)
	srcFile := filepath.Join(srcDir, "Show Name S01 [12of_w0].txt")
	if err := os.WriteFile(srcFile, []byte("hello"), 0o644); err != nil {
		t.Fatal(err)
	}
	ws := &WebServer{Domain: domain.New(conf.Config{
		Password:      "secret",
		SortedRoots:   []string{dstDir},
		UnsortedRoots: []string{srcDir},
	})}
	queueRes := doJSONRequest(t, http.MethodPost, "/api/manage/queue", manageQueueRequest{
		Action:   "move",
		Password: "secret",
		SrcPath:  srcFile,
		DstDir:   dstDir,
	}, ws.handleManageQueue)
	if queueRes.Code != http.StatusOK {
		t.Fatalf("queue status=%d body=%s", queueRes.Code, queueRes.Body.String())
	}
	dstFile := filepath.Join(dstDir, "Show Name S01 [12of_w0].txt")
	waitForFileState(t, dstFile, true)
	statusReq := httptest.NewRequest(http.MethodGet, "/api/manage/status", nil)
	statusRes := httptest.NewRecorder()
	ws.handleManageStatus(statusRes, statusReq)
	if statusRes.Code != http.StatusOK {
		t.Fatalf("status=%d body=%s", statusRes.Code, statusRes.Body.String())
	}
}

func waitForFileState(t *testing.T, path string, wantExists bool) {
	t.Helper()
	for i := 0; i < 50; i++ {
		_, err := os.Stat(path)
		exists := err == nil
		if exists == wantExists {
			return
		}
		if err != nil && !errorsIsNotExist(err) {
			t.Fatalf("stat %s: %v", path, err)
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatalf("path %s existence did not become %v", path, wantExists)
}

func waitForManageQueueDrain(t *testing.T, ws *WebServer) {
	t.Helper()
	for i := 0; i < 100; i++ {
		req := httptest.NewRequest(http.MethodGet, "/api/manage/status", nil)
		w := httptest.NewRecorder()
		ws.handleManageStatus(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("manage status=%d body=%s", w.Code, w.Body.String())
		}
		if strings.Contains(w.Body.String(), `"queued": []`) && strings.Contains(w.Body.String(), `"id": ""`) {
			return
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatal("manage queue did not drain")
}

func errorsIsNotExist(err error) bool {
	return err != nil && (err == fs.ErrNotExist || os.IsNotExist(err))
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
