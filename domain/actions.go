package domain

const (
	StatusAction            = "status"
	ReindexAction           = "reindex"
	BrowseAction            = "browse"
	OpenAction              = "open"
	DuplicatesAction        = "duplicates"
	SearchAction            = "search"
	SuggestAction           = "suggest"
	SuggestSubtitleAction   = "suggest-subtitle"
	ScanSubtitlesAction     = "scan-subtitles"
	CategorizePreviewAction = "categorize/preview"
	MoveAction              = "move"
	RenameAction            = "rename"
	DeleteAction            = "delete"
	ManageQueueAction       = "manage/queue"
	ManageCancelAction      = "manage/cancel"
	ManageRetryAction       = "manage/retry"
	ManageStatusAction      = "manage/status"
	ManageHistoryAction     = "manage/history"
	BackupConfigAction      = "backup/config"
	BackupEstimateAction    = "backup/estimate"
	BackupRunAction         = "backup/run"
)

var AllActions = []string{
	StatusAction,
	ReindexAction,
	BrowseAction,
	DuplicatesAction,
	SearchAction,
	SuggestAction,
	SuggestSubtitleAction,
	ScanSubtitlesAction,
	CategorizePreviewAction,
	MoveAction,
	RenameAction,
	DeleteAction,
	ManageQueueAction,
	ManageCancelAction,
	ManageRetryAction,
	ManageStatusAction,
	ManageHistoryAction,
	BackupConfigAction,
	BackupEstimateAction,
	BackupRunAction,
}
