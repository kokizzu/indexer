package presentation

import (
	"bytes"
	"encoding/json"
	"io"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
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
	res := doAppJSONRequest(t, ws, http.MethodPost, "/api/suggest", map[string]string{"path": target})
	if res.StatusCode != http.StatusOK {
		t.Fatalf("status=%d body=%s", res.StatusCode, readHTTPBody(t, res))
	}
}

func TestServeIndexAndBuiltAssets(t *testing.T) {
	ws := &WebServer{Domain: domain.New(conf.Config{})}

	indexRes := doAppRequest(t, ws, http.MethodGet, "/", nil)
	indexBody := readHTTPBody(t, indexRes)
	if indexRes.StatusCode != http.StatusOK {
		t.Fatalf("index status=%d body=%s", indexRes.StatusCode, indexBody)
	}
	if !strings.Contains(indexBody, `href="/app.css`) || !strings.Contains(indexBody, `src="./index.js`) || !strings.Contains(indexBody, `href="/favicon.svg`) {
		t.Fatalf("index missing built asset references: %s", indexBody)
	}

	jsRes := doAppRequest(t, ws, http.MethodGet, "/index.js", nil)
	jsBody := readHTTPBody(t, jsRes)
	if jsRes.StatusCode != http.StatusOK {
		t.Fatalf("index.js status=%d body=%s", jsRes.StatusCode, jsBody)
	}
	if !strings.Contains(jsBody, "initAppController") {
		t.Fatalf("index.js did not look like built app bundle")
	}

	cssRes := doAppRequest(t, ws, http.MethodGet, "/app.css", nil)
	cssBody := readHTTPBody(t, cssRes)
	if cssRes.StatusCode != http.StatusOK {
		t.Fatalf("app.css status=%d body=%s", cssRes.StatusCode, cssBody)
	}
	if !strings.Contains(cssBody, ":root") && !strings.Contains(cssBody, "body") {
		t.Fatalf("app.css did not look like built stylesheet")
	}

	faviconRes := doAppRequest(t, ws, http.MethodGet, "/favicon.ico", nil)
	faviconBody := readHTTPBody(t, faviconRes)
	if faviconRes.StatusCode != http.StatusTemporaryRedirect {
		t.Fatalf("favicon.ico status=%d body=%s", faviconRes.StatusCode, faviconBody)
	}
	if got := faviconRes.Header.Get("Location"); got != "/favicon.svg" {
		t.Fatalf("favicon.ico redirect location=%q", got)
	}

	svgRes := doAppRequest(t, ws, http.MethodGet, "/favicon.svg", nil)
	svgBody := readHTTPBody(t, svgRes)
	if svgRes.StatusCode != http.StatusOK {
		t.Fatalf("favicon.svg status=%d body=%s", svgRes.StatusCode, svgBody)
	}
	if !strings.Contains(svgBody, "<svg") {
		t.Fatalf("favicon.svg did not look like svg content")
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
	res := doAppJSONRequest(t, ws, http.MethodPost, "/api/suggest-subtitle", map[string]string{"path": target})
	body := readHTTPBody(t, res)
	if res.StatusCode != http.StatusOK {
		t.Fatalf("status=%d body=%s", res.StatusCode, body)
	}
	if !strings.Contains(body, `.en.srt`) {
		t.Fatalf("expected language-normalized subtitle rename, got %s", body)
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
	res := doAppJSONRequest(t, ws, http.MethodPost, "/api/scan-subtitles", domain.SubtitleScanIn{Path: root, Limit: 20})
	body := readHTTPBody(t, res)
	if res.StatusCode != http.StatusOK {
		t.Fatalf("status=%d body=%s", res.StatusCode, body)
	}
	if !strings.Contains(body, `.en.srt`) {
		t.Fatalf("expected subtitle scan result, got %s", body)
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
	res := doAppJSONRequest(t, ws, http.MethodPost, "/api/categorize/preview", domain.CategorizePreviewIn{Path: target, PreviewLimit: 20})
	body := readHTTPBody(t, res)
	if res.StatusCode != http.StatusOK {
		t.Fatalf("status=%d body=%s", res.StatusCode, body)
	}
	if !strings.Contains(body, `"operations"`) {
		t.Fatalf("expected structured operations in response: %s", body)
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
	queueRes := doAppJSONRequest(t, ws, http.MethodPost, "/api/manage/queue", domain.ManageQueueIn{
		Action:          "categorize",
		Password:        "secret",
		SrcPath:         target,
		WatchedCount:    2,
		RemoveEmptyDirs: true,
	})
	if queueRes.StatusCode != http.StatusOK {
		t.Fatalf("queue status=%d body=%s", queueRes.StatusCode, readHTTPBody(t, queueRes))
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

	moveRes := doAppJSONRequest(t, ws, http.MethodPost, "/api/move", domain.MoveIn{
		Password: "secret", SrcPath: original, DstDir: dstDir, Confirm: "CONFIRM",
	})
	if moveRes.StatusCode != http.StatusOK {
		t.Fatalf("move status=%d body=%s", moveRes.StatusCode, readHTTPBody(t, moveRes))
	}

	moved := filepath.Join(dstDir, "Show Name S01 [12of_w0].txt")
	renamed := filepath.Join(dstDir, "Show Name S01 [12of_w0]-renamed.txt")
	renameRes := doAppJSONRequest(t, ws, http.MethodPost, "/api/rename", domain.RenameIn{
		Password: "secret", OldPath: moved, NewPath: renamed, Confirm: "CONFIRM",
	})
	if renameRes.StatusCode != http.StatusOK {
		t.Fatalf("rename status=%d body=%s", renameRes.StatusCode, readHTTPBody(t, renameRes))
	}

	deleteRes := doAppJSONRequest(t, ws, http.MethodPost, "/api/delete", domain.DeleteIn{
		Password: "secret", Path: renamed, Confirm: "CONFIRM",
	})
	if deleteRes.StatusCode != http.StatusOK {
		t.Fatalf("delete status=%d body=%s", deleteRes.StatusCode, readHTTPBody(t, deleteRes))
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
	queueRes := doAppJSONRequest(t, ws, http.MethodPost, "/api/manage/queue", domain.ManageQueueIn{
		Action:   "move",
		Password: "secret",
		SrcPath:  srcFile,
		DstDir:   dstDir,
	})
	if queueRes.StatusCode != http.StatusOK {
		t.Fatalf("queue status=%d body=%s", queueRes.StatusCode, readHTTPBody(t, queueRes))
	}
	dstFile := filepath.Join(dstDir, "Show Name S01 [12of_w0].txt")
	waitForFileState(t, dstFile, true)
	statusRes := doAppRequest(t, ws, http.MethodGet, "/api/manage/status", nil)
	if statusRes.StatusCode != http.StatusOK {
		t.Fatalf("status=%d body=%s", statusRes.StatusCode, readHTTPBody(t, statusRes))
	}
}

func TestManageCancelQueuedTask(t *testing.T) {
	root := t.TempDir()
	srcDir := filepath.Join(root, "unsorted")
	if err := os.MkdirAll(srcDir, 0o755); err != nil {
		t.Fatal(err)
	}
	srcPathA := filepath.Join(srcDir, "Show Name S01 [12of_w0]")
	if err := os.MkdirAll(srcPathA, 0o755); err != nil {
		t.Fatal(err)
	}
	for i := 0; i < 4000; i++ {
		if err := os.WriteFile(filepath.Join(srcPathA, "file"+strconv.Itoa(i)+".txt"), []byte("hello"), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	srcPathB := filepath.Join(srcDir, "Show Name S02 [12of_w0]")
	if err := os.MkdirAll(srcPathB, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(srcPathB, "keep.txt"), []byte("hello"), 0o644); err != nil {
		t.Fatal(err)
	}
	ws := &WebServer{Domain: domain.New(conf.Config{
		Password:      "secret",
		UnsortedRoots: []string{srcDir},
	})}
	queueRes := doAppJSONRequest(t, ws, http.MethodPost, "/api/manage/queue", domain.ManageQueueIn{
		Action:   "delete",
		Password: "secret",
		SrcPath:  srcPathA,
	})
	if queueRes.StatusCode != http.StatusOK {
		t.Fatalf("queue status=%d body=%s", queueRes.StatusCode, readHTTPBody(t, queueRes))
	}
	queueRes = doAppJSONRequest(t, ws, http.MethodPost, "/api/manage/queue", domain.ManageQueueIn{
		Action:   "delete",
		Password: "secret",
		SrcPath:  srcPathB,
	})
	if queueRes.StatusCode != http.StatusOK {
		t.Fatalf("queue status=%d body=%s", queueRes.StatusCode, readHTTPBody(t, queueRes))
	}
	var lastStatusBody string
	for i := 0; i < 50; i++ {
		statusRes := doAppRequest(t, ws, http.MethodGet, "/api/manage/status", nil)
		statusBody := readHTTPBody(t, statusRes)
		lastStatusBody = statusBody
		if statusRes.StatusCode != http.StatusOK {
			t.Fatalf("status=%d body=%s", statusRes.StatusCode, statusBody)
		}
		var status struct {
			Queued []struct {
				ID string `json:"id"`
			} `json:"queued"`
		}
		if err := json.Unmarshal([]byte(statusBody), &status); err != nil {
			t.Fatalf("decode status: %v body=%s", err, statusBody)
		}
		if len(status.Queued) == 0 || status.Queued[0].ID == "" {
			time.Sleep(10 * time.Millisecond)
			continue
		}
		cancelRes := doAppJSONRequest(t, ws, http.MethodPost, "/api/manage/cancel", domain.ManageQueueIn{
			ID: status.Queued[0].ID,
		})
		cancelBody := readHTTPBody(t, cancelRes)
		if cancelRes.StatusCode == http.StatusOK {
			return
		}
		time.Sleep(10 * time.Millisecond)
		lastStatusBody = cancelBody
	}
	t.Fatalf("cancel did not succeed, last=%s", lastStatusBody)
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
		res := doAppRequest(t, ws, http.MethodGet, "/api/manage/status", nil)
		body := readHTTPBody(t, res)
		if res.StatusCode != http.StatusOK {
			t.Fatalf("manage status=%d body=%s", res.StatusCode, body)
		}
		var status struct {
			Running struct {
				ID string `json:"id"`
			} `json:"running"`
			RunningTasks []struct {
				ID string `json:"id"`
			} `json:"runningTasks"`
			Queued []struct {
				ID string `json:"id"`
			} `json:"queued"`
		}
		if err := json.Unmarshal([]byte(body), &status); err != nil {
			t.Fatalf("decode manage status: %v body=%s", err, body)
		}
		if len(status.Queued) == 0 && len(status.RunningTasks) == 0 && status.Running.ID == "" {
			return
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatal("manage queue did not drain")
}

func errorsIsNotExist(err error) bool {
	return err != nil && (err == fs.ErrNotExist || os.IsNotExist(err))
}

func doAppRequest(t *testing.T, ws *WebServer, method, target string, body []byte) *http.Response {
	t.Helper()
	req, err := http.NewRequest(method, "http://localhost"+target, bytes.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	if len(body) > 0 {
		req.Header.Set("Content-Type", "application/json")
	}
	res, err := ws.App().Test(req, 10_000)
	if err != nil {
		t.Fatal(err)
	}
	return res
}

func doAppJSONRequest(t *testing.T, ws *WebServer, method, target string, body any) *http.Response {
	t.Helper()
	raw, err := json.Marshal(body)
	if err != nil {
		t.Fatal(err)
	}
	return doAppRequest(t, ws, method, target, raw)
}

func readHTTPBody(t *testing.T, res *http.Response) string {
	t.Helper()
	defer res.Body.Close()
	byt, err := io.ReadAll(res.Body)
	if err != nil {
		t.Fatal(err)
	}
	return string(byt)
}
