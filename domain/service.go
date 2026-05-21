package domain

import (
	"bufio"
	"bytes"
	"context"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"indexer/conf"
	"indexer/model"
)

var (
	seasonRe       = regexp.MustCompile(`(?i)\bS(?:EASON)?\s*0?(\d{1,2})\b`)
	yearRe         = regexp.MustCompile(`\b(19|20)\d{2}\b`)
	episodeRe      = regexp.MustCompile(`(?i)\b(\d+(?:-\d+)?E(?:w(?:\d+|[EXD]))?)\b`)
	bracketRe      = regexp.MustCompile(`[\[\(][^\]\)]*[\]\)]`)
	splitterRe     = regexp.MustCompile(`[._]+`)
	episodicStemRe = regexp.MustCompile(`(?i)^(?P<title>.+?)[ .]S(?P<season>\d{2,4})(?P<episodes>E\d{2,4}(?:(?:E|-)\d{2,4})*)(?P<rest>[ .].+)?$`)
	prefixNoiseRe  = regexp.MustCompile(`^(?:www\.UIndex\.org|www\.Torrenting\.com|WWW\.SCENETIME\.COM)\s+-\s+`)
	sortedReadyRe  = regexp.MustCompile(`\[[^\]]*of_w\d+\](?:=missing[\d,\-]+)?$`)
)

const manageHistoryTimeLayout = "2006-01-02 15:04:05.999"

type Status struct {
	Running         bool            `json:"running"`
	StartedAt       time.Time       `json:"startedAt"`
	FinishedAt      time.Time       `json:"finishedAt"`
	Resumed         bool            `json:"resumed"`
	ResumedEntries  int             `json:"resumedEntries"`
	WorkerCount     int             `json:"workerCount"`
	ActiveWorkers   int             `json:"activeWorkers"`
	EstimatedRoots  int             `json:"estimatedRoots"`
	TotalRoots      int             `json:"totalRoots"`
	EstimatedFiles  int             `json:"estimatedFiles"`
	EstimatedDirs   int             `json:"estimatedDirs"`
	CurrentRoot     string          `json:"currentRoot"`
	CurrentPath     string          `json:"currentPath"`
	Indexed         int             `json:"indexed"`
	Directories     int             `json:"directories"`
	Files           int             `json:"files"`
	Added           int             `json:"added"`
	Removed         int             `json:"removed"`
	Renamed         int             `json:"renamed"`
	HashedFiles     int             `json:"hashedFiles"`
	ReusedFiles     int             `json:"reusedFiles"`
	ReusedDirs      int             `json:"reusedDirs"`
	SkippedSubtrees int             `json:"skippedSubtrees"`
	TotalBytes      int64           `json:"totalBytes"`
	ProcessedBytes  int64           `json:"processedBytes"`
	ProgressPct     float64         `json:"progressPct"`
	Mounts          []MountProgress `json:"mounts"`
	Error           string          `json:"error"`
	PriorityRoot    string          `json:"priorityRoot"`
}

type MountProgress struct {
	MountPoint     string         `json:"mountPoint"`
	TotalBytes     int64          `json:"totalBytes"`
	ProcessedBytes int64          `json:"processedBytes"`
	ProgressPct    float64        `json:"progressPct"`
	Roots          []RootProgress `json:"roots"`
}

type RootProgress struct {
	Path           string  `json:"path"`
	Kind           string  `json:"kind"`
	TotalBytes     int64   `json:"totalBytes"`
	ProcessedBytes int64   `json:"processedBytes"`
	ProgressPct    float64 `json:"progressPct"`
}

type RootInfo struct {
	Path string `json:"path"`
	Kind string `json:"kind"`
}

type Suggestion struct {
	Original   string `json:"original"`
	Normalized string `json:"normalized"`
	CleanTitle string `json:"cleanTitle"`
	Season     string `json:"season"`
	Year       string `json:"year"`
	Episode    string `json:"episode"`
	Extras     string `json:"extras"`
	Suggested  string `json:"suggested"`
	Changed    bool   `json:"changed"`
	RuleSource string `json:"ruleSource"`
}

type ManageTask struct {
	ID         string    `json:"id"`
	Action     string    `json:"action"`
	Status     string    `json:"status"`
	SrcPath    string    `json:"srcPath"`
	DstPath    string    `json:"dstPath"`
	DstDir     string    `json:"dstDir"`
	Message    string    `json:"message"`
	CreatedAt  time.Time `json:"createdAt"`
	StartedAt  time.Time `json:"startedAt"`
	FinishedAt time.Time `json:"finishedAt"`
}

type ManageQueueStatus struct {
	Running ManageTask   `json:"running"`
	Queued  []ManageTask `json:"queued"`
}

type Domain struct {
	Cfg    conf.Config
	Store  *model.Store
	client *http.Client

	mu     sync.RWMutex
	status Status

	manageMu      sync.RWMutex
	manageCond    *sync.Cond
	manageQueue   []*ManageTask
	manageRunning *ManageTask
}

type ReindexCheckpoint struct {
	PriorityRoot   string    `json:"priorityRoot"`
	StartedAt      time.Time `json:"startedAt"`
	Resumed        bool      `json:"resumed"`
	ResumedEntries int       `json:"resumedEntries"`
	EstimatedRoots int       `json:"estimatedRoots"`
	TotalRoots     int       `json:"totalRoots"`
	EstimatedFiles int       `json:"estimatedFiles"`
	EstimatedDirs  int       `json:"estimatedDirs"`
	TotalBytes     int64     `json:"totalBytes"`
	ProcessedBytes int64     `json:"processedBytes"`
	Indexed        int       `json:"indexed"`
	Directories    int       `json:"directories"`
	Files          int       `json:"files"`
	CurrentRoot    string    `json:"currentRoot"`
	CurrentPath    string    `json:"currentPath"`
}

type entryIndex struct {
	ByPath        map[string]model.FileEntry
	ChildrenByDir map[string][]model.FileEntry
}

func New(cfg conf.Config) *Domain {
	client := &http.Client{Timeout: 60 * time.Second}
	d := &Domain{
		Cfg:    cfg,
		client: client,
		Store:  model.NewStore(cfg, client),
	}
	d.manageCond = sync.NewCond(&d.manageMu)
	d.bootstrapResumeStatus()
	go d.manageLoop()
	return d
}

func (d *Domain) bootstrapResumeStatus() {
	roots := d.Roots("")
	if len(roots) == 0 {
		d.loadLastStatus()
		return
	}
	mountHints := loadMountHints()
	mounts := buildProgressTree(roots, mountHints, map[string]int64{})
	_, _, status, err := d.loadResumeState("", mounts)
	if err != nil {
		d.loadLastStatus()
		return
	}
	if !status.Resumed && status.TotalBytes == 0 && status.Indexed == 0 {
		d.loadLastStatus()
		return
	}
	status.Running = false
	status.ActiveWorkers = 0
	status.WorkerCount = len(groupRootsByMount(roots, mountHints))
	d.mu.Lock()
	d.status = status
	d.mu.Unlock()
}

func (d *Domain) loadLastStatus() {
	raw, err := os.ReadFile(d.lastStatusPath())
	if err != nil {
		return
	}
	var status Status
	if err := json.Unmarshal(raw, &status); err != nil {
		return
	}
	d.mu.Lock()
	d.status = status
	d.mu.Unlock()
}

func (d *Domain) EnsureProjectDirs() error {
	if err := os.MkdirAll("_tmpdb/var_lib_clickhouse", 0o755); err != nil {
		return err
	}
	return os.MkdirAll("_tmpdb", 0o755)
}

func (d *Domain) StartClickHouse() error {
	if d.isClickHouseReachable() {
		return nil
	}
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	cmd := exec.CommandContext(ctx, "docker", "compose", "up", "-d", "clickhouse")
	cmd.Dir = "."
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("docker compose up -d clickhouse: %w (%s)", err, strings.TrimSpace(string(out)))
	}
	return nil
}

func (d *Domain) WaitClickHouse(timeout time.Duration) error {
	if d.isClickHouseReachable() {
		return nil
	}
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		if err := d.Store.ExecRaw("SELECT 1", ""); err == nil {
			return nil
		}
		time.Sleep(2 * time.Second)
	}
	return errors.New("clickhouse did not become ready in time")
}

func (d *Domain) isClickHouseReachable() bool {
	req, err := http.NewRequest(http.MethodGet, d.Cfg.ClickHouseURL+"/ping", nil)
	if err != nil {
		return false
	}
	req.SetBasicAuth(d.Cfg.ClickHouseUser, d.Cfg.ClickHousePass)
	resp, err := d.client.Do(req)
	if err != nil {
		return false
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	return resp.StatusCode < 300 && strings.Contains(strings.ToLower(string(body)), "ok")
}

func (d *Domain) ApplyMigrations() error {
	return d.Store.EnsureSchema()
}

func (d *Domain) Status() Status {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return d.status
}

func (d *Domain) ManageStatus() ManageQueueStatus {
	d.manageMu.RLock()
	defer d.manageMu.RUnlock()
	out := ManageQueueStatus{}
	if d.manageRunning != nil {
		out.Running = *d.manageRunning
	}
	out.Queued = make([]ManageTask, 0, len(d.manageQueue))
	for _, task := range d.manageQueue {
		if task == nil {
			continue
		}
		out.Queued = append(out.Queued, *task)
	}
	return out
}

func (d *Domain) ManageHistory(limit int) ([]model.ManageHistoryEntry, error) {
	return d.Store.ListManageHistory(limit)
}

func (d *Domain) QueueMove(password, srcPath, dstDir string) (model.ActionResponse, error) {
	if err := d.RequirePassword(password); err != nil {
		return model.ActionResponse{}, err
	}
	srcPath = filepath.Clean(srcPath)
	dstDir = filepath.Clean(dstDir)
	if err := d.AssertAllowed(srcPath); err != nil {
		return model.ActionResponse{}, err
	}
	if err := d.AssertAllowed(dstDir); err != nil {
		return model.ActionResponse{}, err
	}
	if err := d.ValidateSortedMove(srcPath, dstDir); err != nil {
		return model.ActionResponse{}, err
	}
	task := &ManageTask{
		ID:        d.newManageID(),
		Action:    "move",
		Status:    "queued",
		SrcPath:   srcPath,
		DstDir:    dstDir,
		DstPath:   filepath.Join(dstDir, filepath.Base(srcPath)),
		CreatedAt: time.Now().UTC(),
	}
	d.enqueueManageTask(task)
	return model.ActionResponse{OK: true, Message: "queued move " + task.ID}, nil
}

func (d *Domain) ValidateSortedMove(srcPath, dstDir string) error {
	srcPath = filepath.Clean(srcPath)
	dstDir = filepath.Clean(dstDir)
	if !d.isSortedRootPath(dstDir) {
		return nil
	}
	base := filepath.Base(srcPath)
	nameOnly := strings.TrimSuffix(base, filepath.Ext(base))
	if sortedReadyRe.MatchString(nameOnly) {
		return nil
	}
	return fmt.Errorf("source must already be renamed to final sorted form before moving into sorted roots: expected [...of_wN], got %s", base)
}

func (d *Domain) isSortedRootPath(path string) bool {
	for _, root := range d.Cfg.SortedRoots {
		root = filepath.Clean(root)
		if path == root || strings.HasPrefix(path, root+string(os.PathSeparator)) {
			return true
		}
	}
	return false
}

func (d *Domain) QueueRename(password, oldPath, newPath string) (model.ActionResponse, error) {
	if err := d.RequirePassword(password); err != nil {
		return model.ActionResponse{}, err
	}
	oldPath = filepath.Clean(oldPath)
	newPath = filepath.Clean(newPath)
	if err := d.AssertAllowed(oldPath); err != nil {
		return model.ActionResponse{}, err
	}
	if err := d.AssertAllowed(filepath.Dir(newPath)); err != nil {
		return model.ActionResponse{}, err
	}
	task := &ManageTask{
		ID:        d.newManageID(),
		Action:    "rename",
		Status:    "queued",
		SrcPath:   oldPath,
		DstPath:   newPath,
		CreatedAt: time.Now().UTC(),
	}
	d.enqueueManageTask(task)
	return model.ActionResponse{OK: true, Message: "queued rename " + task.ID}, nil
}

func (d *Domain) QueueDelete(password, path string) (model.ActionResponse, error) {
	if err := d.RequirePassword(password); err != nil {
		return model.ActionResponse{}, err
	}
	path = filepath.Clean(path)
	if err := d.AssertAllowed(path); err != nil {
		return model.ActionResponse{}, err
	}
	task := &ManageTask{
		ID:        d.newManageID(),
		Action:    "delete",
		Status:    "queued",
		SrcPath:   path,
		CreatedAt: time.Now().UTC(),
	}
	d.enqueueManageTask(task)
	return model.ActionResponse{OK: true, Message: "queued delete " + task.ID}, nil
}

func (d *Domain) QueueCategorize(password, path string) (model.ActionResponse, error) {
	if err := d.RequirePassword(password); err != nil {
		return model.ActionResponse{}, err
	}
	path = filepath.Clean(path)
	if err := d.AssertAllowed(path); err != nil {
		return model.ActionResponse{}, err
	}
	task := &ManageTask{
		ID:        d.newManageID(),
		Action:    "categorize",
		Status:    "queued",
		SrcPath:   path,
		CreatedAt: time.Now().UTC(),
	}
	d.enqueueManageTask(task)
	return model.ActionResponse{OK: true, Message: "queued categorize " + task.ID}, nil
}

func (d *Domain) enqueueManageTask(task *ManageTask) {
	d.manageMu.Lock()
	defer d.manageMu.Unlock()
	d.manageQueue = append(d.manageQueue, task)
	d.manageCond.Signal()
}

func (d *Domain) newManageID() string {
	return strconv.FormatInt(time.Now().UTC().UnixNano(), 36)
}

func (d *Domain) manageLoop() {
	for {
		d.manageMu.Lock()
		for len(d.manageQueue) == 0 {
			d.manageCond.Wait()
		}
		task := d.manageQueue[0]
		d.manageQueue = d.manageQueue[1:]
		task.Status = "running"
		task.StartedAt = time.Now().UTC()
		d.manageRunning = task
		d.manageMu.Unlock()

		err := d.executeManageTask(task)
		task.FinishedAt = time.Now().UTC()
		if err != nil {
			task.Status = "error"
			task.Message = err.Error()
		} else {
			task.Status = "done"
			if task.Message == "" {
				task.Message = task.Action + " completed"
			}
		}
		_ = d.Store.InsertManageHistory(model.ManageHistoryEntry{
			ID:         task.ID,
			Action:     task.Action,
			Status:     task.Status,
			SrcPath:    task.SrcPath,
			DstPath:    task.DstPath,
			Message:    task.Message,
			CreatedAt:  task.CreatedAt.UTC().Format(manageHistoryTimeLayout),
			StartedAt:  task.StartedAt.UTC().Format(manageHistoryTimeLayout),
			FinishedAt: task.FinishedAt.UTC().Format(manageHistoryTimeLayout),
		})

		d.manageMu.Lock()
		d.manageRunning = nil
		d.manageMu.Unlock()
	}
}

func (d *Domain) executeManageTask(task *ManageTask) error {
	switch task.Action {
	case "move":
		if err := os.MkdirAll(task.DstDir, 0o755); err != nil {
			return err
		}
		if err := os.Rename(task.SrcPath, task.DstPath); err != nil {
			return err
		}
		task.Message = "moved to " + task.DstPath
		return nil
	case "rename":
		if err := os.Rename(task.SrcPath, task.DstPath); err != nil {
			return err
		}
		task.Message = "renamed to " + task.DstPath
		return nil
	case "delete":
		if err := os.RemoveAll(task.SrcPath); err != nil {
			return err
		}
		task.Message = "deleted " + task.SrcPath
		return nil
	case "categorize":
		out, err := d.runCategorize(task.SrcPath, true)
		if err != nil {
			return err
		}
		task.Message = strings.TrimSpace(out)
		if task.Message == "" {
			task.Message = "categorize completed for " + task.SrcPath
		}
		return nil
	default:
		return fmt.Errorf("unknown manage action: %s", task.Action)
	}
}

func (d *Domain) StartReindex(priority string) (model.ActionResponse, bool) {
	d.mu.Lock()
	defer d.mu.Unlock()
	if d.status.Running {
		return model.ActionResponse{OK: false, Message: "reindex already running"}, false
	}
	roots := d.Roots(priority)
	if len(roots) == 0 {
		d.status = Status{Error: "no configured roots found or accessible"}
		return model.ActionResponse{OK: false, Message: "no configured roots found or accessible"}, false
	}
	d.status = Status{
		Running:      true,
		StartedAt:    time.Now(),
		PriorityRoot: priority,
	}
	go d.runReindex(priority)
	return model.ActionResponse{OK: true, Message: "reindex started"}, true
}

func (d *Domain) Reindex(priority string) model.ActionResponse {
	roots := d.Roots(priority)
	if len(roots) == 0 {
		d.mu.Lock()
		d.status = Status{Error: "no configured roots found or accessible"}
		d.mu.Unlock()
		return model.ActionResponse{OK: false, Message: "no configured roots found or accessible"}
	}
	d.mu.Lock()
	d.status = Status{
		Running:      true,
		StartedAt:    time.Now(),
		PriorityRoot: priority,
	}
	d.mu.Unlock()
	d.runReindex(priority)
	status := d.Status()
	if status.Error != "" {
		return model.ActionResponse{OK: false, Message: status.Error}
	}
	return model.ActionResponse{OK: true, Message: "reindex finished"}
}

func (d *Domain) runReindex(priority string) {
	status := Status{
		Running:      true,
		StartedAt:    time.Now(),
		PriorityRoot: priority,
	}
	defer func() {
		status.Running = false
		status.FinishedAt = time.Now()
		d.mu.Lock()
		d.status = status
		d.mu.Unlock()
		_ = d.saveLastStatus(status)
	}()

	existingEntries, err := d.Store.LoadEntries()
	if err != nil {
		status.Error = err.Error()
		return
	}
	index := indexEntries(existingEntries)
	existingByPath := make(map[string]string, len(existingEntries))
	for _, entry := range existingEntries {
		existingByPath[entry.Path] = entry.Fingerprint
	}

	roots := d.Roots(priority)
	mountHints := loadMountHints()
	status.Mounts = buildProgressTree(roots, mountHints, map[string]int64{})
	d.mu.Lock()
	d.status = status
	d.mu.Unlock()
	dirMTimeOK := d.canTrustDirectoryMTime(roots, mountHints)
	scanned, processedPaths, restoredStatus, err := d.loadResumeState(priority, status.Mounts)
	if err != nil {
		status.Error = err.Error()
		return
	}
	if restoredStatus.TotalBytes > 0 {
		status = restoredStatus
		d.mu.Lock()
		d.status = status
		d.mu.Unlock()
	}
	seedProgressTotals(&status)
	d.mu.Lock()
	d.status = status
	d.mu.Unlock()
	newPaths := make(map[string]string, len(scanned))
	for _, entry := range scanned {
		newPaths[entry.Path] = entry.Fingerprint
	}
	appendFile, err := os.OpenFile(d.entriesStatePath(), os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o644)
	if err != nil {
		status.Error = err.Error()
		return
	}
	defer appendFile.Close()
	writer := bufio.NewWriter(appendFile)
	defer writer.Flush()

	var scanMu sync.Mutex
	var firstErr error
	var errMu sync.Mutex
	var wg sync.WaitGroup
	groups := groupRootsByMount(roots, mountHints)
	status.WorkerCount = len(groups)
	status.TotalRoots = len(roots)
	d.mu.Lock()
	d.status = status
	d.mu.Unlock()
	for _, group := range groups {
		group := group
		wg.Add(1)
		go func() {
			defer wg.Done()
			scanMu.Lock()
			status.ActiveWorkers++
			d.mu.Lock()
			d.status = status
			d.mu.Unlock()
			scanMu.Unlock()
			defer func() {
				scanMu.Lock()
				status.ActiveWorkers--
				d.mu.Lock()
				d.status = status
				d.mu.Unlock()
				scanMu.Unlock()
			}()
			for _, rootInfo := range group {
				scanMu.Lock()
				status.CurrentRoot = rootInfo.Path
				scanMu.Unlock()
				walkErr := filepath.WalkDir(rootInfo.Path, func(path string, dirEntry fs.DirEntry, innerErr error) error {
					if innerErr != nil || path == "" {
						return nil
					}
					cleanPath := filepath.Clean(path)
					info, statErr := dirEntry.Info()
					if statErr != nil {
						return nil
					}
					if !info.IsDir() && !d.IsIndexableVideoExt(filepath.Ext(cleanPath)) {
						return nil
					}

					scanMu.Lock()
					if _, done := processedPaths[cleanPath]; done {
						scanMu.Unlock()
						return nil
					}
					status.CurrentPath = cleanPath
					discoverProgressEntry(&status, rootInfo.Path, info.IsDir(), info.Size())
					scanMu.Unlock()

					entry := model.FileEntry{
						Path:       cleanPath,
						Dir:        filepath.Dir(cleanPath),
						Base:       filepath.Base(cleanPath),
						Ext:        strings.ToLower(filepath.Ext(cleanPath)),
						Root:       rootInfo.Path,
						RootKind:   rootInfo.Kind,
						IsDir:      boolToUint8(info.IsDir()),
						Size:       info.Size(),
						ModifiedAt: info.ModTime().UTC(),
						Content:    strings.ToLower(IndexableText(rootInfo.Path, cleanPath, info.IsDir())),
					}
					reusedFile := false
					reusedDir := false
					if !info.IsDir() {
						if oldEntry, ok := index.ByPath[cleanPath]; ok && oldEntry.IsDir == 0 && oldEntry.Size == info.Size() && sameModTime(oldEntry.ModifiedAt, info.ModTime()) {
							entry.Fingerprint = oldEntry.Fingerprint
							entry.Content = oldEntry.Content
							reusedFile = true
						} else {
							entry.Fingerprint = QuickFingerprint(cleanPath, info.Size())
						}
					} else if dirMTimeOK {
						if oldEntry, ok := index.ByPath[cleanPath]; ok && oldEntry.IsDir == 1 && sameModTime(oldEntry.ModifiedAt, info.ModTime()) {
							reusedDir = true
						}
					}

					scanMu.Lock()
					if _, done := processedPaths[cleanPath]; done {
						scanMu.Unlock()
						return nil
					}
					scanned = append(scanned, entry)
					newPaths[entry.Path] = entry.Fingerprint
					processedPaths[entry.Path] = struct{}{}
					applyProgressEntry(&status, entry)
					if !info.IsDir() {
						if reusedFile {
							status.ReusedFiles++
						} else {
							status.HashedFiles++
						}
					} else if reusedDir {
						status.ReusedDirs++
					}
					if err := appendEntry(writer, entry); err != nil {
						scanMu.Unlock()
						return err
					}
					if err := d.saveCheckpoint(status); err != nil {
						scanMu.Unlock()
						return err
					}
					d.mu.Lock()
					d.status = status
					d.mu.Unlock()
					scanMu.Unlock()
					return nil
				})
				if walkErr != nil {
					errMu.Lock()
					if firstErr == nil {
						firstErr = walkErr
					}
					errMu.Unlock()
					return
				}
				scanMu.Lock()
				status.EstimatedRoots++
				_ = d.saveCheckpoint(status)
				d.mu.Lock()
				d.status = status
				d.mu.Unlock()
				scanMu.Unlock()
			}
		}()
	}
	wg.Wait()
	if firstErr != nil {
		status.Error = firstErr.Error()
		return
	}

	status.Added, status.Removed, status.Renamed = DiffCounts(existingByPath, newPaths)
	computeSubtreeStats(scanned)
	if err := d.Store.ReplaceEntries(scanned); err != nil {
		status.Error = err.Error()
		return
	}
	finalizeProgress(&status)
	d.mu.Lock()
	d.status = status
	d.mu.Unlock()
	_ = d.saveLastStatus(status)
	_ = os.Remove(d.checkpointPath())
	_ = os.Remove(d.entriesStatePath())
}

func (d *Domain) Search(q, kind string, limit int) ([]model.SearchResult, error) {
	return d.Store.Search(q, kind, limit)
}

func (d *Domain) SearchPage(q, kind string, limit, offset int) (model.SearchPage, error) {
	return d.Store.SearchPage(q, kind, limit, offset)
}

func (d *Domain) Duplicates() ([]model.DuplicateGroup, error) {
	return d.Store.Duplicates()
}

func (d *Domain) CategorizePreview(path string, previewLimit int) (model.CategorizePreview, error) {
	path = filepath.Clean(strings.TrimSpace(path))
	if err := d.AssertAllowed(path); err != nil {
		return model.CategorizePreview{}, err
	}
	if previewLimit <= 0 {
		previewLimit = 200
	}
	out, err := d.runCategorizePreview(path, previewLimit)
	if err != nil {
		return model.CategorizePreview{}, err
	}
	return parseCategorizePreview(path, out), nil
}

func (d *Domain) runCategorizePreview(path string, previewLimit int) (string, error) {
	scriptPath, err := findProjectFile("categorize_episode_files.py")
	if err != nil {
		return "", err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()
	cmd := exec.CommandContext(ctx, "python3", scriptPath, "--root", path, "--preview-limit", strconv.Itoa(previewLimit))
	out, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("categorize preview failed: %w (%s)", err, strings.TrimSpace(string(out)))
	}
	return string(out), nil
}

func parseCategorizePreview(path, out string) model.CategorizePreview {
	res := model.CategorizePreview{
		Path:   path,
		Output: out,
	}
	lines := strings.Split(out, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		switch {
		case strings.HasPrefix(line, "Detected episodic video files:"):
			res.DetectedVideoFiles = atoiLoose(strings.TrimSpace(strings.TrimPrefix(line, "Detected episodic video files:")))
		case strings.HasPrefix(line, "Detected groups:"):
			res.DetectedGroups = atoiLoose(strings.TrimSpace(strings.TrimPrefix(line, "Detected groups:")))
		case strings.HasPrefix(line, "Planned moves/renames:"):
			res.PlannedMoves = atoiLoose(strings.TrimSpace(strings.TrimPrefix(line, "Planned moves/renames:")))
		case strings.Contains(line, " -> "):
			parts := strings.SplitN(line, " -> ", 2)
			if len(parts) == 2 {
				res.Operations = append(res.Operations, model.CategorizePreviewOperation{
					Source: strings.TrimSpace(parts[0]),
					Target: strings.TrimSpace(parts[1]),
				})
			}
		case strings.Contains(strings.ToLower(line), "preview truncated"):
			res.Truncated = true
		}
	}
	return res
}

func atoiLoose(s string) int {
	v, _ := strconv.Atoi(strings.TrimSpace(s))
	return v
}

func (d *Domain) runCategorize(path string, apply bool) (string, error) {
	scriptPath, err := findProjectFile("categorize_episode_files.py")
	if err != nil {
		return "", err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer cancel()
	args := []string{scriptPath, "--root", path, "--preview-limit", "120"}
	if apply {
		args = append(args, "--apply", "--remove-empty-dirs")
	}
	cmd := exec.CommandContext(ctx, "python3", args...)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("categorize apply failed: %w (%s)", err, strings.TrimSpace(string(out)))
	}
	return string(out), nil
}

func findProjectFile(name string) (string, error) {
	wd, err := os.Getwd()
	if err != nil {
		return "", err
	}
	cur := wd
	for {
		candidate := filepath.Join(cur, name)
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
			return candidate, nil
		}
		parent := filepath.Dir(cur)
		if parent == cur {
			break
		}
		cur = parent
	}
	return "", fmt.Errorf("project file not found: %s", name)
}

func (d *Domain) RequirePassword(password string) error {
	if password != d.Cfg.Password {
		return errors.New("invalid password")
	}
	return nil
}

func (d *Domain) AssertAllowed(path string) error {
	for _, root := range d.Cfg.AllRoots() {
		root = filepath.Clean(root)
		if path == root || strings.HasPrefix(path, root+string(os.PathSeparator)) {
			return nil
		}
	}
	return fmt.Errorf("path outside configured roots: %s", path)
}

func (d *Domain) Roots(priority string) []RootInfo {
	priorityRoots := parsePriorityRoots(priority)
	roots := make([]RootInfo, 0, len(d.Cfg.SortedRoots)+len(d.Cfg.UnsortedRoots))
	addRoot := func(paths []string, kind string) {
		for _, root := range paths {
			if root == "" {
				continue
			}
			if info, err := os.Stat(root); err == nil && info.IsDir() {
				roots = append(roots, RootInfo{Path: root, Kind: kind})
			}
		}
	}
	addRoot(d.Cfg.UnsortedRoots, "unsorted")
	addRoot(d.Cfg.SortedRoots, "sorted")
	sort.SliceStable(roots, func(i, j int) bool {
		if len(priorityRoots) == 0 {
			return roots[i].Path < roots[j].Path
		}
		_, iPriority := priorityRoots[roots[i].Path]
		_, jPriority := priorityRoots[roots[j].Path]
		if iPriority && !jPriority {
			return true
		}
		if !iPriority && jPriority {
			return false
		}
		return roots[i].Path < roots[j].Path
	})
	return roots
}

func parsePriorityRoots(priority string) map[string]struct{} {
	priority = strings.NewReplacer("\n", ",", ";", ",").Replace(priority)
	out := map[string]struct{}{}
	for _, part := range strings.Split(priority, ",") {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		out[filepath.Clean(part)] = struct{}{}
	}
	return out
}

func (d *Domain) Browse(path string) ([]model.BrowseEntry, error) {
	if strings.TrimSpace(path) != "" {
		path = filepath.Clean(path)
		if err := d.AssertAllowed(path); err != nil {
			return nil, err
		}
	}
	return d.Store.Browse(path, d.Cfg.AllRoots())
}

func SuggestName(base string) string {
	return SuggestDetails(base).Suggested
}

func (d *Domain) SuggestPath(path string) Suggestion {
	path = filepath.Clean(strings.TrimSpace(path))
	info, err := os.Stat(path)
	if err != nil || !info.IsDir() {
		return SuggestDetails(filepath.Base(path))
	}
	entries, err := os.ReadDir(path)
	if err != nil {
		return SuggestDetails(filepath.Base(path))
	}
	type episodeCandidate struct {
		title   string
		season  int
		episode []int
	}
	groups := map[string]*episodeCandidate{}
	counts := map[string]int{}
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		ext := strings.ToLower(strings.TrimPrefix(filepath.Ext(entry.Name()), "."))
		if !d.IsIndexableVideoExt(ext) {
			continue
		}
		title, season, episodes, ok := parseEpisodicVideoStem(strings.TrimSuffix(entry.Name(), filepath.Ext(entry.Name())))
		if !ok {
			continue
		}
		key := fmt.Sprintf("%s|%d", title, season)
		cand := groups[key]
		if cand == nil {
			cand = &episodeCandidate{title: title, season: season}
			groups[key] = cand
		}
		cand.episode = append(cand.episode, episodes...)
		counts[key]++
	}
	if len(groups) == 1 {
		for key, cand := range groups {
			summary, suffix := summarizeEpisodes(cand.episode)
			suggested := buildEpisodeFolderName(cand.title, cand.season, summary, 0, suffix)
			return Suggestion{
				Original:   filepath.Base(path),
				Normalized: normalizeEpisodeTitle(cand.title),
				CleanTitle: displayEpisodeTitle(cand.title, cand.season),
				Season:     fmt.Sprintf("S%02d", cand.season),
				Episode:    summary,
				Extras:     suffix,
				Suggested:  suggested,
				Changed:    suggested != filepath.Base(path),
				RuleSource: "categorize_episode_files.py directory grouping (" + strconv.Itoa(counts[key]) + " files)",
			}
		}
	}
	return SuggestDetails(filepath.Base(path))
}

func SuggestDetails(base string) Suggestion {
	name := strings.TrimSpace(base)
	name = strings.ReplaceAll(name, "_", " ")
	name = splitterRe.ReplaceAllString(name, " ")
	name = strings.Join(strings.Fields(name), " ")

	season := seasonRe.FindString(name)
	year := yearRe.FindString(name)
	episode := episodeRe.FindString(name)
	extras := strings.TrimSpace(strings.Join(bracketRe.FindAllString(base, -1), " "))

	title := seasonRe.ReplaceAllString(name, "")
	title = yearRe.ReplaceAllString(title, "")
	title = episodeRe.ReplaceAllString(title, "")
	title = bracketRe.ReplaceAllString(title, "")
	title = strings.Join(strings.Fields(title), " ")
	title = strings.Trim(title, "-= ")
	title = titleCase(title)

	parts := []string{title}
	if season != "" {
		parts = append(parts, strings.ToUpper(strings.ReplaceAll(season, " ", "")))
	}
	if year != "" {
		parts = append(parts, year)
	}
	if episode != "" {
		parts = append(parts, strings.ToUpper(strings.ReplaceAll(episode, " ", "")))
	}
	if extras != "" {
		parts = append(parts, extras)
	}
	suggested := strings.Join(parts, " ")
	suggested = strings.Join(strings.Fields(suggested), " ")
	if suggested == "" {
		suggested = base
	}
	return Suggestion{
		Original:   base,
		Normalized: name,
		CleanTitle: title,
		Season:     strings.ToUpper(strings.ReplaceAll(season, " ", "")),
		Year:       year,
		Episode:    strings.ToUpper(strings.ReplaceAll(episode, " ", "")),
		Extras:     extras,
		Suggested:  suggested,
		Changed:    suggested != base,
		RuleSource: "basename heuristic",
	}
}

func cleanEpisodeComponent(name string) string {
	name = prefixNoiseRe.ReplaceAllString(strings.TrimSpace(name), "")
	name = strings.Join(strings.Fields(name), " ")
	return strings.Trim(name, " .")
}

func normalizeEpisodeTitle(raw string) string {
	return cleanEpisodeComponent(strings.ReplaceAll(raw, ".", " "))
}

func displayEpisodeTitle(raw string, season int) string {
	return fmt.Sprintf("%s S%02d", normalizeEpisodeTitle(raw), season)
}

func parseEpisodicVideoStem(stem string) (string, int, []int, bool) {
	stem = cleanEpisodeComponent(stem)
	match := episodicStemRe.FindStringSubmatch(stem)
	if match == nil {
		return "", 0, nil, false
	}
	episodesToken := match[episodicStemRe.SubexpIndex("episodes")]
	title := match[episodicStemRe.SubexpIndex("title")]
	season, err := strconv.Atoi(match[episodicStemRe.SubexpIndex("season")])
	if err != nil {
		return "", 0, nil, false
	}
	numsRaw := regexp.MustCompile(`\d{2,4}`).FindAllString(episodesToken, -1)
	if len(numsRaw) == 0 {
		return "", 0, nil, false
	}
	nums := make([]int, 0, len(numsRaw))
	for _, raw := range numsRaw {
		n, err := strconv.Atoi(raw)
		if err == nil {
			nums = append(nums, n)
		}
	}
	if len(nums) == 0 {
		return "", 0, nil, false
	}
	episodes := []int{nums[0]}
	if strings.Contains(episodesToken, "-") && len(nums) >= 2 && nums[1] >= nums[0] {
		episodes = episodes[:0]
		for n := nums[0]; n <= nums[1]; n++ {
			episodes = append(episodes, n)
		}
	} else {
		episodes = nums
	}
	return title, season, episodes, true
}

func summarizeEpisodes(episodes []int) (string, string) {
	if len(episodes) == 0 {
		return "", ""
	}
	ordered := make([]int, 0, len(episodes))
	seen := map[int]struct{}{}
	for _, ep := range episodes {
		if _, ok := seen[ep]; ok {
			continue
		}
		seen[ep] = struct{}{}
		ordered = append(ordered, ep)
	}
	sort.Ints(ordered)
	maxEpisode := ordered[len(ordered)-1]
	missing := make([]int, 0)
	for ep := 1; ep <= maxEpisode; ep++ {
		if _, ok := seen[ep]; !ok {
			missing = append(missing, ep)
		}
	}
	if len(missing) > 0 && len(missing) <= 3 {
		return strconv.Itoa(maxEpisode), "=missing" + joinEpisodeRanges(missing)
	}
	if len(ordered) == 1 {
		only := ordered[0]
		if only == 1 {
			return "1", ""
		}
		return fmt.Sprintf("%d-%d", only, only), ""
	}
	ranges := collapseEpisodeRanges(ordered)
	if len(ranges) == 1 && ranges[0][0] == 1 {
		if ranges[0][0] == ranges[0][1] {
			return "1", ""
		}
		return strconv.Itoa(ranges[0][1]), ""
	}
	parts := make([]string, 0, len(ranges))
	for _, rg := range ranges {
		start, end := rg[0], rg[1]
		switch {
		case start == end:
			parts = append(parts, strconv.Itoa(start))
		case start == 1:
			parts = append(parts, fmt.Sprintf("-%d", end))
		default:
			parts = append(parts, fmt.Sprintf("%d-%d", start, end))
		}
	}
	return strings.Join(parts, ","), ""
}

func collapseEpisodeRanges(ordered []int) [][2]int {
	if len(ordered) == 0 {
		return nil
	}
	out := make([][2]int, 0)
	start, prev := ordered[0], ordered[0]
	for _, ep := range ordered[1:] {
		if ep == prev+1 {
			prev = ep
			continue
		}
		out = append(out, [2]int{start, prev})
		start, prev = ep, ep
	}
	out = append(out, [2]int{start, prev})
	return out
}

func joinEpisodeRanges(ordered []int) string {
	ranges := collapseEpisodeRanges(ordered)
	parts := make([]string, 0, len(ranges))
	for _, rg := range ranges {
		if rg[0] == rg[1] {
			parts = append(parts, strconv.Itoa(rg[0]))
		} else {
			parts = append(parts, fmt.Sprintf("%d-%d", rg[0], rg[1]))
		}
	}
	return strings.Join(parts, ",")
}

func buildEpisodeFolderName(rawTitle string, season int, summary string, watchedCount int, suffix string) string {
	return fmt.Sprintf("%s [%sof_w%d]%s", displayEpisodeTitle(rawTitle, season), summary, watchedCount, suffix)
}

func (d *Domain) IsIndexableVideoExt(ext string) bool {
	ext = strings.ToLower(strings.TrimPrefix(strings.TrimSpace(ext), "."))
	for _, candidate := range d.Cfg.MoviesExts {
		if ext == candidate {
			return true
		}
	}
	return false
}

func (d *Domain) IsSubtitleExt(ext string) bool {
	ext = strings.ToLower(strings.TrimPrefix(strings.TrimSpace(ext), "."))
	for _, candidate := range d.Cfg.SubtitleExts {
		if ext == candidate {
			return true
		}
	}
	return false
}

func (d *Domain) SuggestSubtitleRename(path string) (string, error) {
	path = filepath.Clean(strings.TrimSpace(path))
	if err := d.AssertAllowed(path); err != nil {
		return "", err
	}
	ext := strings.ToLower(filepath.Ext(path))
	if !d.IsSubtitleExt(ext) {
		return "", fmt.Errorf("not a configured subtitle file: %s", path)
	}
	parent := filepath.Dir(path)
	stemBase := filepath.Base(parent)
	if stemBase == "" || stemBase == "." || stemBase == string(os.PathSeparator) {
		return "", fmt.Errorf("cannot infer subtitle stem from parent directory: %s", path)
	}
	lang := subtitleLanguageSuffix(filepath.Base(path))
	targetName := stemBase
	if lang != "" {
		targetName += "." + lang
	}
	targetName += ext
	return filepath.Join(parent, targetName), nil
}

func (d *Domain) ScanSubtitleRenameCandidates(path string, limit int) ([]model.SubtitleRenameCandidate, error) {
	path = filepath.Clean(strings.TrimSpace(path))
	if err := d.AssertAllowed(path); err != nil {
		return nil, err
	}
	info, err := os.Stat(path)
	if err != nil {
		return nil, err
	}
	if !info.IsDir() {
		return nil, fmt.Errorf("scan path must be a directory: %s", path)
	}
	if limit <= 0 || limit > 2000 {
		limit = 500
	}
	out := make([]model.SubtitleRenameCandidate, 0, minInt(limit, 64))
	seen := map[string]struct{}{}
	_ = filepath.WalkDir(path, func(current string, dirEntry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return nil
		}
		if dirEntry.IsDir() {
			name := dirEntry.Name()
			if name == ".git" || name == ".agents" || name == ".codex" {
				return filepath.SkipDir
			}
			return nil
		}
		if !d.IsSubtitleExt(filepath.Ext(current)) {
			return nil
		}
		newPath, err := d.SuggestSubtitleRename(current)
		if err != nil {
			return nil
		}
		if filepath.Clean(newPath) == filepath.Clean(current) {
			return nil
		}
		if _, ok := seen[current]; ok {
			return nil
		}
		seen[current] = struct{}{}
		out = append(out, model.SubtitleRenameCandidate{
			Path:      current,
			Current:   filepath.Base(current),
			Suggested: filepath.Base(newPath),
			NewPath:   newPath,
		})
		if len(out) >= limit {
			return io.EOF
		}
		return nil
	})
	sort.Slice(out, func(i, j int) bool { return strings.ToLower(out[i].Path) < strings.ToLower(out[j].Path) })
	return out, nil
}

func minInt(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func subtitleLanguageSuffix(base string) string {
	name := strings.ToLower(strings.TrimSuffix(base, filepath.Ext(base)))
	replacer := strings.NewReplacer(
		".", " ",
		"_", " ",
		"-", " ",
		"[", " ",
		"]", " ",
		"(", " ",
		")", " ",
	)
	tokens := strings.Fields(replacer.Replace(name))
	tokenSet := make(map[string]struct{}, len(tokens))
	for _, token := range tokens {
		tokenSet[token] = struct{}{}
	}
	for _, pair := range [][2]string{
		{"english", "en"},
		{"eng", "en"},
		{"indonesian", "id"},
		{"indonesia", "id"},
		{"indo", "id"},
		{"japanese", "ja"},
		{"jpn", "ja"},
		{"korean", "ko"},
		{"kor", "ko"},
		{"chinese", "zh"},
		{"mandarin", "zh"},
		{"spanish", "es"},
		{"esp", "es"},
		{"french", "fr"},
		{"german", "de"},
		{"arabic", "ar"},
		{"portuguese", "pt"},
		{"vietnamese", "vi"},
		{"thai", "th"},
	} {
		if _, ok := tokenSet[pair[0]]; ok {
			return pair[1]
		}
	}
	return ""
}

func computeSubtreeStats(entries []model.FileEntry) {
	byPath := make(map[string]*model.FileEntry, len(entries))
	order := make([]string, 0, len(entries))
	for i := range entries {
		entry := &entries[i]
		if entry.IsDir == 0 {
			entry.SubtreeSize = entry.Size
			entry.SubtreeFiles = 1
			entry.SubtreeDirs = 0
		} else {
			entry.SubtreeSize = 0
			entry.SubtreeFiles = 0
			entry.SubtreeDirs = 0
		}
		byPath[entry.Path] = entry
		order = append(order, entry.Path)
	}
	sort.Slice(order, func(i, j int) bool {
		di := strings.Count(order[i], string(os.PathSeparator))
		dj := strings.Count(order[j], string(os.PathSeparator))
		if di == dj {
			return order[i] > order[j]
		}
		return di > dj
	})
	for _, path := range order {
		entry := byPath[path]
		if entry == nil || entry.Dir == path {
			continue
		}
		parent := byPath[entry.Dir]
		if parent == nil || parent.IsDir == 0 {
			continue
		}
		parent.SubtreeSize += entry.SubtreeSize
		parent.SubtreeFiles += entry.SubtreeFiles
		if entry.IsDir == 1 {
			parent.SubtreeDirs += entry.SubtreeDirs + 1
		}
	}
}

func titleCase(s string) string {
	words := strings.Fields(strings.ToLower(s))
	for i, word := range words {
		runes := []rune(word)
		if len(runes) == 0 {
			continue
		}
		runes[0] = []rune(strings.ToUpper(string(runes[0])))[0]
		words[i] = string(runes)
	}
	return strings.Join(words, " ")
}

func IndexableText(root, path string, isDir bool) string {
	base := filepath.Base(path)
	if isDir {
		return normalizeSearchText(base)
	}
	root = filepath.Clean(root)
	path = filepath.Clean(path)
	rel, err := filepath.Rel(root, path)
	if err != nil || rel == "." || rel == "" || strings.HasPrefix(rel, "..") {
		return normalizeSearchText(base)
	}
	return normalizeSearchText(filepath.ToSlash(rel))
}

func normalizeSearchText(s string) string {
	return strings.NewReplacer(
		"_", " ",
		".", " ",
		"/", " ",
		"[", " ",
		"]", " ",
		"(", " ",
		")", " ",
		"-", " ",
		"=", " ",
	).Replace(s)
}

func QuickFingerprint(path string, size int64) string {
	f, err := os.Open(path)
	if err != nil {
		return ""
	}
	defer f.Close()

	h := sha1.New()
	_, _ = io.WriteString(h, strconv.FormatInt(size, 10))
	const chunk = 1 << 20
	buf := make([]byte, chunk)
	if _, err := io.ReadFull(f, buf); err == nil || err == io.ErrUnexpectedEOF {
		_, _ = h.Write(buf)
	}
	if size > chunk {
		if _, err := f.Seek(-chunk, io.SeekEnd); err == nil {
			last := make([]byte, chunk)
			if _, err := io.ReadFull(f, last); err == nil || err == io.ErrUnexpectedEOF {
				_, _ = h.Write(last)
			}
		}
	}
	return hex.EncodeToString(h.Sum(nil))
}

func DiffCounts(existingByPath, newByPath map[string]string) (added, removed, renamed int) {
	oldFP := map[string][]string{}
	newFP := map[string][]string{}
	for path, fp := range existingByPath {
		if fp != "" {
			oldFP[fp] = append(oldFP[fp], path)
		}
		if _, ok := newByPath[path]; !ok {
			removed++
		}
	}
	for path, fp := range newByPath {
		if fp != "" {
			newFP[fp] = append(newFP[fp], path)
		}
		if _, ok := existingByPath[path]; !ok {
			added++
		}
	}
	for fp, oldPaths := range oldFP {
		newPaths := newFP[fp]
		if len(oldPaths) == 0 || len(newPaths) == 0 {
			continue
		}
		oldSet := make(map[string]struct{}, len(oldPaths))
		for _, p := range oldPaths {
			oldSet[p] = struct{}{}
		}
		for _, p := range newPaths {
			if _, ok := oldSet[p]; !ok {
				renamed++
				break
			}
		}
	}
	return added, removed, renamed
}

func boolToUint8(v bool) uint8 {
	if v {
		return 1
	}
	return 0
}

func (d *Domain) estimateRootBytes(roots []RootInfo) (map[string]int64, int64) {
	rootTotals := make(map[string]int64, len(roots))
	var total int64
	for _, root := range roots {
		_ = filepath.WalkDir(root.Path, func(path string, dirEntry fs.DirEntry, err error) error {
			if err != nil {
				return nil
			}
			info, statErr := dirEntry.Info()
			if statErr == nil && !info.IsDir() {
				rootTotals[root.Path] += info.Size()
				total += info.Size()
			}
			return nil
		})
	}
	return rootTotals, total
}

func (d *Domain) checkpointPath() string {
	return filepath.Join("_tmpdb", "reindex_state.json")
}

func (d *Domain) entriesStatePath() string {
	return filepath.Join("_tmpdb", "reindex_entries.jsonl")
}

func (d *Domain) lastStatusPath() string {
	return filepath.Join("_tmpdb", "last_reindex_status.json")
}

func (d *Domain) saveCheckpoint(status Status) error {
	raw, err := json.MarshalIndent(ReindexCheckpoint{
		PriorityRoot:   status.PriorityRoot,
		StartedAt:      status.StartedAt,
		Resumed:        status.Resumed,
		ResumedEntries: status.ResumedEntries,
		EstimatedRoots: status.EstimatedRoots,
		TotalRoots:     status.TotalRoots,
		EstimatedFiles: status.EstimatedFiles,
		EstimatedDirs:  status.EstimatedDirs,
		TotalBytes:     status.TotalBytes,
		ProcessedBytes: status.ProcessedBytes,
		Indexed:        status.Indexed,
		Directories:    status.Directories,
		Files:          status.Files,
		CurrentRoot:    status.CurrentRoot,
		CurrentPath:    status.CurrentPath,
	}, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(d.checkpointPath(), raw, 0o644)
}

func (d *Domain) saveLastStatus(status Status) error {
	raw, err := json.MarshalIndent(status, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(d.lastStatusPath(), raw, 0o644)
}

func (d *Domain) loadResumeState(priority string, mounts []MountProgress) ([]model.FileEntry, map[string]struct{}, Status, error) {
	processed := map[string]struct{}{}
	status := Status{
		Running:      true,
		StartedAt:    time.Now(),
		PriorityRoot: priority,
		Mounts:       mounts,
	}
	raw, err := os.ReadFile(d.checkpointPath())
	if err == nil {
		if len(bytes.TrimSpace(raw)) == 0 {
			raw = nil
		}
	}
	if len(raw) > 0 {
		var ck ReindexCheckpoint
		if err := json.Unmarshal(raw, &ck); err != nil {
			if strings.Contains(strings.ToLower(err.Error()), "unexpected end of json input") {
				raw = nil
			} else {
				return nil, nil, Status{}, err
			}
		}
		if raw != nil && ck.PriorityRoot == priority {
			status.StartedAt = ck.StartedAt
			status.Resumed = ck.Resumed
			status.ResumedEntries = ck.ResumedEntries
			status.EstimatedRoots = ck.EstimatedRoots
			status.TotalRoots = ck.TotalRoots
			status.EstimatedFiles = ck.EstimatedFiles
			status.EstimatedDirs = ck.EstimatedDirs
			status.TotalBytes = ck.TotalBytes
			status.CurrentRoot = ck.CurrentRoot
			status.CurrentPath = ck.CurrentPath
		}
	}
	entryByPath := make(map[string]model.FileEntry, 1024)
	file, err := os.Open(d.entriesStatePath())
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return []model.FileEntry{}, processed, status, nil
		}
		return nil, nil, Status{}, err
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := bytes.TrimSpace(scanner.Bytes())
		if len(line) == 0 {
			continue
		}
		var entry model.FileEntry
		if err := json.Unmarshal(line, &entry); err != nil {
			if strings.Contains(strings.ToLower(err.Error()), "unexpected end of json input") {
				continue
			}
			return nil, nil, Status{}, err
		}
		entry.Path = filepath.Clean(entry.Path)
		entryByPath[entry.Path] = entry
	}
	if err := scanner.Err(); err != nil {
		return nil, nil, Status{}, err
	}
	entries := make([]model.FileEntry, 0, len(entryByPath))
	paths := make([]string, 0, len(entryByPath))
	for path := range entryByPath {
		paths = append(paths, path)
	}
	sort.Strings(paths)
	for _, path := range paths {
		entry := entryByPath[path]
		entries = append(entries, entry)
		processed[entry.Path] = struct{}{}
		applyProgressEntry(&status, entry)
	}
	if len(entries) > 0 {
		status.Resumed = true
		status.ResumedEntries = len(entries)
	}
	return entries, processed, status, nil
}

func appendEntry(writer *bufio.Writer, entry model.FileEntry) error {
	raw, err := json.Marshal(entry)
	if err != nil {
		return err
	}
	if _, err := writer.Write(raw); err != nil {
		return err
	}
	if err := writer.WriteByte('\n'); err != nil {
		return err
	}
	return writer.Flush()
}

func progressPct(processed, total int64) float64 {
	if total <= 0 {
		return 0
	}
	return float64(processed) * 100 / float64(total)
}

func buildProgressTree(roots []RootInfo, mounts map[string][]string, rootTotals map[string]int64) []MountProgress {
	grouped := map[string]*MountProgress{}
	keys := make([]string, 0, len(roots))
	for _, root := range roots {
		mountPoint := mountPointFor(root.Path, mounts)
		mp := grouped[mountPoint]
		if mp == nil {
			mp = &MountProgress{MountPoint: mountPoint}
			grouped[mountPoint] = mp
			keys = append(keys, mountPoint)
		}
		total := rootTotals[root.Path]
		mp.TotalBytes += total
		mp.Roots = append(mp.Roots, RootProgress{
			Path:       root.Path,
			Kind:       root.Kind,
			TotalBytes: total,
		})
	}
	sort.Strings(keys)
	out := make([]MountProgress, 0, len(keys))
	for _, key := range keys {
		mp := grouped[key]
		sort.Slice(mp.Roots, func(i, j int) bool { return mp.Roots[i].Path < mp.Roots[j].Path })
		out = append(out, *mp)
	}
	return out
}

func applyProgressEntry(status *Status, entry model.FileEntry) {
	status.Indexed++
	if entry.IsDir == 1 {
		status.Directories++
	} else {
		status.Files++
		status.ProcessedBytes += entry.Size
	}
	status.ProgressPct = progressPct(status.ProcessedBytes, status.TotalBytes)
	for mi := range status.Mounts {
		mount := &status.Mounts[mi]
		for ri := range mount.Roots {
			root := &mount.Roots[ri]
			if root.Path != entry.Root {
				continue
			}
			if entry.IsDir == 0 {
				root.ProcessedBytes += entry.Size
			}
			root.ProgressPct = progressPct(root.ProcessedBytes, root.TotalBytes)
			mount.ProcessedBytes = 0
			for _, r := range mount.Roots {
				mount.ProcessedBytes += r.ProcessedBytes
			}
			mount.ProgressPct = progressPct(mount.ProcessedBytes, mount.TotalBytes)
			return
		}
	}
}

func seedProgressTotals(status *Status) {
	if status.TotalBytes < status.ProcessedBytes {
		status.TotalBytes = status.ProcessedBytes
	}
	for mi := range status.Mounts {
		mount := &status.Mounts[mi]
		var mountProcessed int64
		var mountTotal int64
		for ri := range mount.Roots {
			root := &mount.Roots[ri]
			if root.TotalBytes < root.ProcessedBytes {
				root.TotalBytes = root.ProcessedBytes
			}
			root.ProgressPct = progressPct(root.ProcessedBytes, root.TotalBytes)
			mountProcessed += root.ProcessedBytes
			mountTotal += root.TotalBytes
		}
		if mount.TotalBytes < mountTotal {
			mount.TotalBytes = mountTotal
		}
		mount.ProcessedBytes = mountProcessed
		mount.ProgressPct = progressPct(mount.ProcessedBytes, mount.TotalBytes)
	}
	status.ProgressPct = progressPct(status.ProcessedBytes, status.TotalBytes)
}

func finalizeProgress(status *Status) {
	status.EstimatedRoots = status.TotalRoots
	status.EstimatedFiles = status.Files
	status.EstimatedDirs = status.Directories
	for mi := range status.Mounts {
		mount := &status.Mounts[mi]
		var mountTotal int64
		for ri := range mount.Roots {
			root := &mount.Roots[ri]
			if root.TotalBytes < root.ProcessedBytes {
				root.TotalBytes = root.ProcessedBytes
			}
			root.ProcessedBytes = root.TotalBytes
			root.ProgressPct = progressPct(root.ProcessedBytes, root.TotalBytes)
			mountTotal += root.TotalBytes
		}
		mount.TotalBytes = mountTotal
		mount.ProcessedBytes = mountTotal
		mount.ProgressPct = progressPct(mount.ProcessedBytes, mount.TotalBytes)
	}
	if status.TotalBytes < status.ProcessedBytes {
		status.TotalBytes = status.ProcessedBytes
	}
	status.ProcessedBytes = status.TotalBytes
	status.ProgressPct = progressPct(status.ProcessedBytes, status.TotalBytes)
}

func discoverProgressEntry(status *Status, rootPath string, isDir bool, size int64) {
	if isDir {
		status.EstimatedDirs++
	} else {
		status.EstimatedFiles++
		if size > 0 {
			status.TotalBytes += size
		}
	}
	status.ProgressPct = progressPct(status.ProcessedBytes, status.TotalBytes)
	for mi := range status.Mounts {
		mount := &status.Mounts[mi]
		for ri := range mount.Roots {
			root := &mount.Roots[ri]
			if root.Path != rootPath {
				continue
			}
			if !isDir && size > 0 {
				root.TotalBytes += size
			}
			root.ProgressPct = progressPct(root.ProcessedBytes, root.TotalBytes)
			mount.TotalBytes = 0
			for _, r := range mount.Roots {
				mount.TotalBytes += r.TotalBytes
			}
			mount.ProgressPct = progressPct(mount.ProcessedBytes, mount.TotalBytes)
			return
		}
	}
}

func indexEntries(entries []model.FileEntry) entryIndex {
	idx := entryIndex{
		ByPath:        make(map[string]model.FileEntry, len(entries)),
		ChildrenByDir: make(map[string][]model.FileEntry),
	}
	for _, entry := range entries {
		idx.ByPath[entry.Path] = entry
		idx.ChildrenByDir[entry.Dir] = append(idx.ChildrenByDir[entry.Dir], entry)
	}
	return idx
}

func collectSubtree(idx entryIndex, dirPath string) []model.FileEntry {
	var out []model.FileEntry
	entry, ok := idx.ByPath[dirPath]
	if !ok {
		return out
	}
	queue := []model.FileEntry{entry}
	for len(queue) > 0 {
		cur := queue[0]
		queue = queue[1:]
		out = append(out, cur)
		if cur.IsDir != 1 {
			continue
		}
		children := idx.ChildrenByDir[cur.Path]
		sort.Slice(children, func(i, j int) bool { return children[i].Path < children[j].Path })
		queue = append(queue, children...)
	}
	return out
}

func sameModTime(a, b time.Time) bool {
	return a.UTC().Truncate(time.Millisecond).UnixNano() == b.UTC().Truncate(time.Millisecond).UnixNano()
}

func (d *Domain) canTrustDirectoryMTime(roots []RootInfo, mounts map[string][]string) bool {
	for _, root := range roots {
		opts := mountOptionsFor(root.Path, mounts)
		for _, opt := range opts {
			switch opt {
			case "nomtime", "no_mtime", "ignore_mtime":
				return false
			}
		}
	}
	return true
}

func loadMountHints() map[string][]string {
	paths := []string{"/proc/mounts", "/etc/fstab"}
	out := map[string][]string{}
	for _, path := range paths {
		raw, err := os.ReadFile(path)
		if err != nil {
			continue
		}
		for _, line := range strings.Split(string(raw), "\n") {
			line = strings.TrimSpace(line)
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			fields := strings.Fields(line)
			if len(fields) < 4 {
				continue
			}
			mountPoint := fields[1]
			if path == "/etc/fstab" && strings.HasPrefix(mountPoint, "UUID=") {
				continue
			}
			out[mountPoint] = strings.Split(fields[3], ",")
		}
	}
	return out
}

func mountOptionsFor(path string, mounts map[string][]string) []string {
	best := mountPointFor(path, mounts)
	return mounts[best]
}

func mountPointFor(path string, mounts map[string][]string) string {
	best := ""
	for mountPoint := range mounts {
		if path == mountPoint || strings.HasPrefix(path, mountPoint+string(os.PathSeparator)) {
			if len(mountPoint) > len(best) {
				best = mountPoint
			}
		}
	}
	return best
}

func groupRootsByMount(roots []RootInfo, mounts map[string][]string) [][]RootInfo {
	grouped := map[string][]RootInfo{}
	keys := make([]string, 0, len(roots))
	for _, root := range roots {
		mountPoint := mountPointFor(root.Path, mounts)
		if _, ok := grouped[mountPoint]; !ok {
			keys = append(keys, mountPoint)
		}
		grouped[mountPoint] = append(grouped[mountPoint], root)
	}
	sort.Strings(keys)
	out := make([][]RootInfo, 0, len(keys))
	for _, key := range keys {
		out = append(out, grouped[key])
	}
	return out
}
