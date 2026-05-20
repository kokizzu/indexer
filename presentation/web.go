package presentation

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"indexer/domain"
	"indexer/model"
)

type WebServer struct {
	Domain *domain.Domain
}

type moveRequest struct {
	Password string `json:"password"`
	SrcPath  string `json:"srcPath"`
	DstDir   string `json:"dstDir"`
	Confirm  string `json:"confirm"`
}

type renameRequest struct {
	Password string `json:"password"`
	OldPath  string `json:"oldPath"`
	NewPath  string `json:"newPath"`
	Confirm  string `json:"confirm"`
}

type deleteRequest struct {
	Password string `json:"password"`
	Path     string `json:"path"`
	Confirm  string `json:"confirm"`
}

type suggestRequest struct {
	Path string `json:"path"`
}

func (w *WebServer) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/", w.handleIndex)
	mux.HandleFunc("/api/status", w.handleStatus)
	mux.HandleFunc("/api/reindex", w.handleReindex)
	mux.HandleFunc("/api/search", w.handleSearch)
	mux.HandleFunc("/api/browse", w.handleBrowse)
	mux.HandleFunc("/api/duplicates", w.handleDuplicates)
	mux.HandleFunc("/api/suggest", w.handleSuggest)
	mux.HandleFunc("/api/move", w.handleMove)
	mux.HandleFunc("/api/rename", w.handleRename)
	mux.HandleFunc("/api/delete", w.handleDelete)
	return logRequests(mux)
}

func (w *WebServer) handleIndex(rw http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(rw, r)
		return
	}
	data, err := os.ReadFile("svelte/index.html")
	if err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}
	rw.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = rw.Write(data)
}

func (w *WebServer) handleStatus(rw http.ResponseWriter, r *http.Request) {
	writeJSON(rw, w.Domain.Status())
}

func (w *WebServer) handleReindex(rw http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(rw, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	resp, _ := w.Domain.StartReindex(strings.TrimSpace(r.URL.Query().Get("priority")))
	writeJSON(rw, resp)
}

func (w *WebServer) handleSearch(rw http.ResponseWriter, r *http.Request) {
	q := strings.TrimSpace(r.URL.Query().Get("q"))
	kind := strings.TrimSpace(r.URL.Query().Get("kind"))
	limit := atoiDefault(r.URL.Query().Get("limit"), 100)
	if limit <= 0 || limit > 500 {
		limit = 100
	}
	res, err := w.Domain.Search(q, kind, limit)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(rw, res)
}

func (w *WebServer) handleBrowse(rw http.ResponseWriter, r *http.Request) {
	path := strings.TrimSpace(r.URL.Query().Get("path"))
	res, err := w.Domain.Browse(path)
	if err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	writeJSON(rw, res)
}

func (w *WebServer) handleDuplicates(rw http.ResponseWriter, r *http.Request) {
	res, err := w.Domain.Duplicates()
	if err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(rw, res)
}

func (w *WebServer) handleSuggest(rw http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(rw, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req suggestRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	req.Path = filepath.Clean(strings.TrimSpace(req.Path))
	if err := w.Domain.AssertAllowed(req.Path); err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	suggested := domain.SuggestName(filepath.Base(req.Path))
	writeJSON(rw, map[string]string{
		"path":      req.Path,
		"current":   filepath.Base(req.Path),
		"suggested": suggested,
		"newPath":   filepath.Join(filepath.Dir(req.Path), suggested),
	})
}

func (w *WebServer) handleMove(rw http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(rw, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req moveRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	if err := w.Domain.RequirePassword(req.Password); err != nil {
		http.Error(rw, err.Error(), http.StatusForbidden)
		return
	}
	req.SrcPath = filepath.Clean(req.SrcPath)
	req.DstDir = filepath.Clean(req.DstDir)
	if err := w.Domain.AssertAllowed(req.SrcPath); err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	if err := w.Domain.AssertAllowed(req.DstDir); err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(req.Confirm) != "CONFIRM" {
		http.Error(rw, "confirm must be CONFIRM", http.StatusBadRequest)
		return
	}
	if err := os.MkdirAll(req.DstDir, 0o755); err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}
	dstPath := filepath.Join(req.DstDir, filepath.Base(req.SrcPath))
	if err := os.Rename(req.SrcPath, dstPath); err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(rw, model.ActionResponse{OK: true, Message: "moved to " + dstPath})
}

func (w *WebServer) handleRename(rw http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(rw, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req renameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	if err := w.Domain.RequirePassword(req.Password); err != nil {
		http.Error(rw, err.Error(), http.StatusForbidden)
		return
	}
	req.OldPath = filepath.Clean(req.OldPath)
	req.NewPath = filepath.Clean(req.NewPath)
	if err := w.Domain.AssertAllowed(req.OldPath); err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	if err := w.Domain.AssertAllowed(filepath.Dir(req.NewPath)); err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(req.Confirm) != "CONFIRM" {
		http.Error(rw, "confirm must be CONFIRM", http.StatusBadRequest)
		return
	}
	if err := os.Rename(req.OldPath, req.NewPath); err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(rw, model.ActionResponse{OK: true, Message: "renamed to " + req.NewPath})
}

func (w *WebServer) handleDelete(rw http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(rw, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req deleteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	if err := w.Domain.RequirePassword(req.Password); err != nil {
		http.Error(rw, err.Error(), http.StatusForbidden)
		return
	}
	req.Path = filepath.Clean(req.Path)
	if err := w.Domain.AssertAllowed(req.Path); err != nil {
		http.Error(rw, err.Error(), http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(req.Confirm) != "CONFIRM" {
		http.Error(rw, "confirm must be CONFIRM", http.StatusBadRequest)
		return
	}
	if err := os.RemoveAll(req.Path); err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(rw, model.ActionResponse{OK: true, Message: "deleted " + req.Path})
}

func writeJSON(rw http.ResponseWriter, v any) {
	rw.Header().Set("Content-Type", "application/json; charset=utf-8")
	enc := json.NewEncoder(rw)
	enc.SetIndent("", "  ")
	_ = enc.Encode(v)
}

func atoiDefault(s string, fallback int) int {
	v, err := strconv.Atoi(strings.TrimSpace(s))
	if err != nil {
		return fallback
	}
	return v
}

func logRequests(next http.Handler) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(rw, r)
	})
}
