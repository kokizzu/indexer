package domain

import (
	"strings"

	"indexer/model"
)

type StatusIn struct {
	RequestCommon
}

type ReindexIn struct {
	RequestCommon
	Priority string `json:"priority" form:"priority" query:"priority"`
}

type BrowseIn struct {
	RequestCommon
	Path string `json:"path" form:"path" query:"path"`
}

type DuplicatesIn struct {
	RequestCommon
}

type SearchIn struct {
	RequestCommon
	Q      string `json:"q" form:"q" query:"q"`
	Kind   string `json:"kind" form:"kind" query:"kind"`
	Limit  int    `json:"limit" form:"limit" query:"limit"`
	Offset int    `json:"offset" form:"offset" query:"offset"`
}

type SuggestIn struct {
	RequestCommon
	Path string `json:"path" form:"path" query:"path"`
}

type CategorizePreviewIn struct {
	RequestCommon
	Path         string `json:"path" form:"path" query:"path"`
	PreviewLimit int    `json:"previewLimit" form:"previewLimit" query:"previewLimit"`
	VideosOnly   bool   `json:"videosOnly" form:"videosOnly" query:"videosOnly"`
	WatchedCount int    `json:"watchedCount" form:"watchedCount" query:"watchedCount"`
}

type SubtitleScanIn struct {
	RequestCommon
	Path  string `json:"path" form:"path" query:"path"`
	Limit int    `json:"limit" form:"limit" query:"limit"`
}

type MoveIn struct {
	RequestCommon
	Password string `json:"password"`
	SrcPath  string `json:"srcPath"`
	DstDir   string `json:"dstDir"`
	Confirm  string `json:"confirm"`
}

type RenameIn struct {
	RequestCommon
	Password string `json:"password"`
	OldPath  string `json:"oldPath"`
	NewPath  string `json:"newPath"`
	Confirm  string `json:"confirm"`
}

type DeleteIn struct {
	RequestCommon
	Password string `json:"password"`
	Path     string `json:"path"`
	Confirm  string `json:"confirm"`
}

type ManageQueueIn struct {
	RequestCommon
	Action          string `json:"action"`
	ID              string `json:"id"`
	Password        string `json:"password"`
	SrcPath         string `json:"srcPath"`
	DstDir          string `json:"dstDir"`
	NewPath         string `json:"newPath"`
	VideosOnly      bool   `json:"videosOnly"`
	WatchedCount    int    `json:"watchedCount"`
	RemoveEmptyDirs bool   `json:"removeEmptyDirs"`
}

type ManageStatusIn struct {
	RequestCommon
}

type ManageHistoryIn struct {
	RequestCommon
	Limit int `json:"limit" form:"limit" query:"limit"`
}

type BackupEstimateIn struct {
	RequestCommon
	Limit int `json:"limit" form:"limit" query:"limit"`
}

type BackupConfigIn struct {
	RequestCommon
}

type BackupRunIn struct {
	RequestCommon
}

type StatusOut struct {
	ResponseCommon
	Status
}

type ReindexOut struct {
	ResponseCommon
	model.ActionResponse
}

type SearchOut struct {
	ResponseCommon
	model.SearchPage
}

type SuggestOut struct {
	ResponseCommon
	SuggestPathResult
}

type SubtitleSuggestOut struct {
	ResponseCommon
	SubtitleSuggestResult
}

type CategorizePreviewOut struct {
	ResponseCommon
	model.CategorizePreview
}

type ActionOut struct {
	ResponseCommon
	model.ActionResponse
}

type ManageStatusOut struct {
	ResponseCommon
	ManageQueueStatus
}

type BackupEstimateOut struct {
	ResponseCommon
	BackupEstimate
}

type BackupConfigOut struct {
	ResponseCommon
	BackupConfig
}

func (in ReindexIn) PriorityValue() string {
	return strings.TrimSpace(in.Priority)
}

func (in BrowseIn) PathValue() string {
	return strings.TrimSpace(in.Path)
}

func (in *SearchIn) Normalize() {
	in.Q = strings.TrimSpace(in.Q)
	in.Kind = strings.TrimSpace(in.Kind)
	if in.Limit <= 0 || in.Limit > 500 {
		in.Limit = 100
	}
	if in.Offset < 0 {
		in.Offset = 0
	}
}

func (in SuggestIn) PathValue() string {
	return strings.TrimSpace(in.Path)
}

func (in SubtitleScanIn) PathValue() string {
	return strings.TrimSpace(in.Path)
}

func (in SubtitleScanIn) LimitValue() int {
	return in.Limit
}

func (in CategorizePreviewIn) PathValue() string {
	return strings.TrimSpace(in.Path)
}

func (in CategorizePreviewIn) Options() CategorizeOptions {
	return CategorizeOptions{
		VideosOnly:   in.VideosOnly,
		WatchedCount: in.WatchedCount,
	}
}

func (in ManageQueueIn) ActionValue() string {
	return strings.TrimSpace(in.Action)
}

func (in ManageHistoryIn) LimitValue() int {
	if in.Limit <= 0 {
		return 100
	}
	return in.Limit
}

func (in BackupEstimateIn) LimitValue() int {
	if in.Limit <= 0 {
		return 500
	}
	if in.Limit > 5000 {
		return 5000
	}
	return in.Limit
}
