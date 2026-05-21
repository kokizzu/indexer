package model

import "time"

type FileEntry struct {
	Path         string    `json:"path"`
	Dir          string    `json:"dir"`
	Base         string    `json:"base"`
	Ext          string    `json:"ext"`
	Root         string    `json:"root"`
	RootKind     string    `json:"rootKind"`
	IsDir        uint8     `json:"is_dir"`
	Size         int64     `json:"size"`
	SubtreeSize  int64     `json:"subtree_size"`
	SubtreeFiles int       `json:"subtree_files"`
	SubtreeDirs  int       `json:"subtree_dirs"`
	ModifiedAt   time.Time `json:"modified_at"`
	Fingerprint  string    `json:"fingerprint"`
	Content      string    `json:"content"`
}

type SearchResult struct {
	Path        string `json:"path"`
	DisplayPath string `json:"displayPath"`
	Base        string `json:"base"`
	Root        string `json:"root"`
	RootKind    string `json:"rootKind"`
	IsDir       uint8  `json:"isDir"`
	Size        int64  `json:"size"`
	FileCount   int    `json:"fileCount"`
	DirCount    int    `json:"dirCount"`
	ModifiedAt  string `json:"modifiedAt"`
	Fingerprint string `json:"fingerprint"`
}

type SearchPage struct {
	Rows  []SearchResult `json:"rows"`
	Total int            `json:"total"`
}

type DuplicateGroup struct {
	Fingerprint string   `json:"fingerprint"`
	Size        int64    `json:"size"`
	Paths       []string `json:"paths"`
}

type BrowseEntry struct {
	Path       string `json:"path"`
	Base       string `json:"base"`
	IsDir      bool   `json:"isDir"`
	Size       int64  `json:"size"`
	FileCount  int    `json:"fileCount"`
	DirCount   int    `json:"dirCount"`
	ModifiedAt string `json:"modifiedAt"`
}

type ActionResponse struct {
	OK      bool   `json:"ok"`
	Message string `json:"message"`
}

type ManageHistoryEntry struct {
	ID         string `json:"id"`
	Action     string `json:"action"`
	Status     string `json:"status"`
	SrcPath    string `json:"srcPath"`
	DstPath    string `json:"dstPath"`
	Message    string `json:"message"`
	CreatedAt  string `json:"createdAt"`
	StartedAt  string `json:"startedAt"`
	FinishedAt string `json:"finishedAt"`
}

type CategorizePreviewOperation struct {
	Source string `json:"source"`
	Target string `json:"target"`
}

type CategorizePreview struct {
	Path               string                       `json:"path"`
	Output             string                       `json:"output"`
	DetectedVideoFiles int                          `json:"detectedVideoFiles"`
	DetectedGroups     int                          `json:"detectedGroups"`
	PlannedMoves       int                          `json:"plannedMoves"`
	Operations         []CategorizePreviewOperation `json:"operations"`
	Truncated          bool                         `json:"truncated"`
}

type SubtitleRenameCandidate struct {
	Path      string `json:"path"`
	Current   string `json:"current"`
	Suggested string `json:"suggested"`
	NewPath   string `json:"newPath"`
}
