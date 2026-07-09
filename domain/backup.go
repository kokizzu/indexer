package domain

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/user"
	"path/filepath"
	"sort"
	"strings"
	"syscall"
	"time"

	"indexer/model"
)

type BackupEntry struct {
	Path             string `json:"path"`
	TargetPath       string `json:"targetPath"`
	Kind             string `json:"kind"`
	Size             int64  `json:"size"`
	IncrementBytes   int64  `json:"incrementBytes"`
	ExistsInTarget   bool   `json:"existsInTarget"`
	TargetSize       int64  `json:"targetSize"`
	TargetModifiedAt string `json:"targetModifiedAt,omitempty"`
	ModifiedAt       string `json:"modifiedAt,omitempty"`
}

type BackupConfig struct {
	Sources  []string      `json:"sources"`
	Excludes []string      `json:"excludes,omitempty"`
	Warnings []string      `json:"warnings,omitempty"`
	Target   string        `json:"target"`
	Runtime  BackupRuntime `json:"runtime"`
	Status   BackupStatus  `json:"backupStatus"`
}

type BackupRuntime struct {
	EUID        int    `json:"euid"`
	User        string `json:"user"`
	IsRoot      bool   `json:"isRoot"`
	SudoHelper  bool   `json:"sudoHelper"`
	HelperChild bool   `json:"helperChild"`
	RootHint    string `json:"rootHint,omitempty"`
}

type BackupEstimate struct {
	Sources            []string      `json:"sources"`
	Warnings           []string      `json:"warnings,omitempty"`
	Target             string        `json:"target"`
	StartedAt          time.Time     `json:"startedAt"`
	CompletedAt        time.Time     `json:"completedAt"`
	Elapsed            string        `json:"elapsed"`
	ElapsedSeconds     float64       `json:"elapsedSeconds"`
	CurrentBackupSize  int64         `json:"currentBackupSize"`
	SourceSize         int64         `json:"sourceSize"`
	EstimatedIncrement int64         `json:"estimatedIncrement"`
	Files              int           `json:"files"`
	Directories        int           `json:"directories"`
	EntryCount         int           `json:"entryCount"`
	Truncated          bool          `json:"truncated"`
	Entries            []BackupEntry `json:"entries"`
	Status             BackupStatus  `json:"backupStatus"`
}

type BackupStatus struct {
	CurrentBackupSize      int64   `json:"currentBackupSize"`
	LastEstimateStartedAt  string  `json:"lastEstimateStartedAt,omitempty"`
	LastEstimateAt         string  `json:"lastEstimateAt,omitempty"`
	LastEstimateDuration   string  `json:"lastEstimateDuration,omitempty"`
	LastEstimateSeconds    float64 `json:"lastEstimateSeconds,omitempty"`
	LastBackupStartedAt    string  `json:"lastBackupStartedAt,omitempty"`
	LastBackupAt           string  `json:"lastBackupAt,omitempty"`
	LastBackupDuration     string  `json:"lastBackupDuration,omitempty"`
	LastBackupSeconds      float64 `json:"lastBackupSeconds,omitempty"`
	LastBackupMessage      string  `json:"lastBackupMessage,omitempty"`
	LastBackupError        string  `json:"lastBackupError,omitempty"`
	LastScheduledBackupAt  string  `json:"lastScheduledBackupAt,omitempty"`
	LastScheduledBackupErr string  `json:"lastScheduledBackupError,omitempty"`
}

func (d *Domain) BackupConfigResult() (BackupConfig, ResponseCommon) {
	sources, warnings, err := d.backupSources()
	rc := ResponseCommon{}
	status := d.loadBackupStatus()
	if err != nil {
		rc.SetError(http.StatusBadRequest, err.Error())
		return BackupConfig{Excludes: backupExcludes(d.Cfg.ExcludeSources), Warnings: warnings, Target: d.Cfg.BackupTarget, Runtime: d.backupRuntime(), Status: status}, rc
	}
	return BackupConfig{
		Sources:  sources,
		Excludes: backupExcludes(d.Cfg.ExcludeSources),
		Warnings: warnings,
		Target:   d.Cfg.BackupTarget,
		Runtime:  d.backupRuntime(),
		Status:   status,
	}, rc
}

func (d *Domain) BackupEstimateResult(limit int) (BackupEstimate, ResponseCommon) {
	if d.shouldUseBackupSudoHelper() {
		out, rc := d.backupEstimateViaSudoHelper(limit)
		if !rc.HasError() {
			d.recordBackupEstimate(out)
			out.Status = d.loadBackupStatus()
		}
		return out, rc
	}
	out, err := d.BackupEstimate(limit)
	rc := ResponseCommon{}
	if err != nil {
		rc.SetError(http.StatusBadRequest, err.Error())
		out = BackupEstimate{}
	} else {
		d.recordBackupEstimate(out)
		out.Status = d.loadBackupStatus()
	}
	return out, rc
}

func (d *Domain) BackupRunResult() (model.ActionResponse, ResponseCommon) {
	if !d.tryStartBackupRun() {
		return model.ActionResponse{}, responseError(http.StatusConflict, "backup is already running")
	}
	defer d.finishBackupRun()
	if d.shouldUseBackupSudoHelper() {
		out, rc := d.backupRunViaSudoHelper()
		if !rc.HasError() {
			d.recordBackupRun(out, "")
		} else {
			d.recordBackupRun(model.ActionResponse{}, rc.Error)
		}
		return out, rc
	}
	out, err := d.BackupRun()
	rc := ResponseCommon{}
	if err != nil {
		rc.SetError(http.StatusBadRequest, err.Error())
		out = model.ActionResponse{}
		d.recordBackupRun(out, rc.Error)
	} else {
		d.recordBackupRun(out, "")
	}
	return out, rc
}

func (d *Domain) StartBackupScheduler() {
	next := nextDailyBackupTime(time.Now())
	log.Printf("backup scheduler started: automatic incremental backup enabled at 05:00 local time; next run at %s", next.Format(time.RFC3339))
	go d.backupSchedulerLoop()
}

func (d *Domain) backupSchedulerLoop() {
	for {
		next := nextDailyBackupTime(time.Now())
		wait := time.Until(next)
		log.Printf("backup scheduler waiting: next automatic backup at %s (%s from now)", next.Format(time.RFC3339), wait.Round(time.Second))
		timer := time.NewTimer(wait)
		<-timer.C
		started := time.Now()
		log.Printf("scheduled backup starting: scheduled_at=%s started_at=%s", next.Format(time.RFC3339), started.Format(time.RFC3339))
		out, rc := d.BackupRunResult()
		errText := ""
		if rc.HasError() {
			errText = rc.Error
			log.Printf("scheduled backup failed: started_at=%s duration=%s error=%s", started.Format(time.RFC3339), time.Since(started).Round(time.Millisecond), errText)
		} else {
			log.Printf("scheduled backup completed: started_at=%s completed_at=%s duration=%s message=%s", started.Format(time.RFC3339), time.Now().Format(time.RFC3339), time.Since(started).Round(time.Millisecond), out.Message)
		}
		completed := time.Now().Format(time.RFC3339)
		d.updateBackupStatus(func(status *BackupStatus) {
			status.LastScheduledBackupAt = completed
			status.LastScheduledBackupErr = errText
		})
	}
}

func nextDailyBackupTime(now time.Time) time.Time {
	next := time.Date(now.Year(), now.Month(), now.Day(), 5, 0, 0, 0, now.Location())
	if !next.After(now) {
		next = next.Add(24 * time.Hour)
	}
	return next
}

func (d *Domain) tryStartBackupRun() bool {
	d.backupMu.Lock()
	defer d.backupMu.Unlock()
	if d.backupRunning {
		return false
	}
	d.backupRunning = true
	return true
}

func (d *Domain) finishBackupRun() {
	d.backupMu.Lock()
	d.backupRunning = false
	d.backupMu.Unlock()
}

func (d *Domain) BackupEstimate(limit int) (BackupEstimate, error) {
	started := time.Now()
	if err := d.validateBackupConfig(); err != nil {
		return BackupEstimate{}, err
	}
	target := d.Cfg.BackupTarget
	sources, warnings, err := d.backupSources()
	if err != nil {
		return BackupEstimate{}, err
	}
	excludes := backupExcludes(d.Cfg.ExcludeSources)
	out := BackupEstimate{
		Sources:   sources,
		Warnings:  warnings,
		Target:    target,
		StartedAt: started,
	}
	defer func() {
		completed := time.Now()
		out.CompletedAt = completed
		out.Elapsed = completed.Sub(started).Round(time.Millisecond).String()
		out.ElapsedSeconds = completed.Sub(started).Seconds()
	}()
	out.CurrentBackupSize = treeSize(target)
	sourceSeen := map[string]struct{}{}
	unreadable := backupUnreadableSummary{}
	for _, source := range sources {
		source = filepath.Clean(source)
		if _, ok := sourceSeen[source]; ok {
			continue
		}
		sourceSeen[source] = struct{}{}
		type pathInfo struct {
			path string
			info os.FileInfo
		}
		infos := []pathInfo{}
		dirSizes := map[string]int64{}
		dirIncrements := map[string]int64{}
		fileIncrements := map[string]int64{}
		if err := filepath.WalkDir(source, func(path string, de fs.DirEntry, walkErr error) error {
			if backupPathExcluded(path, excludes) {
				if de != nil && de.IsDir() {
					return filepath.SkipDir
				}
				return nil
			}
			if walkErr != nil {
				if isPermissionErr(walkErr) {
					unreadable.Add(path)
				} else {
					out.Warnings = append(out.Warnings, fmt.Sprintf("backup source %s: %v", path, walkErr))
				}
				if de != nil && de.IsDir() {
					return filepath.SkipDir
				}
				return nil
			}
			info, err := de.Info()
			if err != nil {
				if isPermissionErr(err) {
					unreadable.Add(path)
				} else {
					out.Warnings = append(out.Warnings, fmt.Sprintf("backup source %s: %v", path, err))
				}
				if de != nil && de.IsDir() {
					return filepath.SkipDir
				}
				return nil
			}
			infos = append(infos, pathInfo{path: path, info: info})
			if info.IsDir() {
				out.Directories++
				if _, ok := dirSizes[path]; !ok {
					dirSizes[path] = 0
				}
				if _, ok := dirIncrements[path]; !ok {
					dirIncrements[path] = 0
				}
				return nil
			}
			if !info.Mode().IsRegular() {
				return nil
			}
			out.Files++
			out.SourceSize += info.Size()
			targetInfo, statErr := os.Stat(backupTargetPath(target, path))
			increment := int64(0)
			if needsBackup(info, targetInfo, statErr) {
				increment = info.Size()
				out.EstimatedIncrement += increment
			}
			fileIncrements[path] = increment
			for dir := filepath.Dir(path); ; dir = filepath.Dir(dir) {
				if _, ok := dirSizes[dir]; ok {
					dirSizes[dir] += info.Size()
				}
				if _, ok := dirIncrements[dir]; ok {
					dirIncrements[dir] += increment
				}
				if dir == source || dir == filepath.Dir(dir) {
					break
				}
			}
			return nil
		}); err != nil {
			return BackupEstimate{}, err
		}
		for _, item := range infos {
			path := item.path
			info := item.info
			kind := "file"
			size := info.Size()
			increment := fileIncrements[path]
			if info.IsDir() {
				kind = "dir"
				size = dirSizes[path]
				increment = dirIncrements[path]
			} else if !info.Mode().IsRegular() {
				continue
			}
			targetPath := backupTargetPath(target, path)
			targetInfo, statErr := os.Stat(targetPath)
			targetSize := int64(0)
			targetMod := ""
			exists := false
			if statErr == nil {
				exists = true
				targetSize = targetInfo.Size()
				targetMod = targetInfo.ModTime().Format(time.RFC3339)
			}
			out.Entries = append(out.Entries, BackupEntry{
				Path:             path,
				TargetPath:       targetPath,
				Kind:             kind,
				Size:             size,
				IncrementBytes:   increment,
				ExistsInTarget:   exists,
				TargetSize:       targetSize,
				TargetModifiedAt: targetMod,
				ModifiedAt:       info.ModTime().Format(time.RFC3339),
			})
		}
	}
	if warning := unreadable.Warning(); warning != "" {
		out.Warnings = append(out.Warnings, warning)
	}
	sort.SliceStable(out.Entries, func(i, j int) bool {
		if out.Entries[i].Size == out.Entries[j].Size {
			return out.Entries[i].Path < out.Entries[j].Path
		}
		return out.Entries[i].Size > out.Entries[j].Size
	})
	out.EntryCount = len(out.Entries)
	if limit > 0 && len(out.Entries) > limit {
		out.Entries = out.Entries[:limit]
		out.Truncated = true
	}
	completed := time.Now()
	out.CompletedAt = completed
	out.Elapsed = completed.Sub(started).Round(time.Millisecond).String()
	out.ElapsedSeconds = completed.Sub(started).Seconds()
	return out, nil
}

func (d *Domain) BackupRun() (model.ActionResponse, error) {
	started := time.Now()
	if err := d.validateBackupConfig(); err != nil {
		return model.ActionResponse{}, err
	}
	if _, err := exec.LookPath("rsync"); err != nil {
		return model.ActionResponse{}, errors.New("rsync is required for backup")
	}
	sources, _, err := d.backupSources()
	if err != nil {
		return model.ActionResponse{}, err
	}
	if err := os.MkdirAll(d.Cfg.BackupTarget, 0o755); err != nil {
		return model.ActionResponse{}, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 24*time.Hour)
	defer cancel()
	args := []string{"-a", "--force", "--no-owner", "--no-group", "--relative"}
	for _, pattern := range backupRsyncExcludeArgs(d.Cfg.ExcludeSources) {
		args = append(args, "--exclude", pattern)
	}
	args = append(args, sources...)
	args = append(args, d.Cfg.BackupTarget)
	cmd := exec.CommandContext(ctx, "rsync", args...)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return model.ActionResponse{}, fmt.Errorf("rsync backup failed: %w (%s)", err, strings.TrimSpace(string(out)))
	}
	completed := time.Now()
	elapsed := completed.Sub(started).Round(time.Millisecond).String()
	msg := "backup completed in " + elapsed
	if trimmed := strings.TrimSpace(string(out)); trimmed != "" {
		msg += ": " + trimmed
	}
	return model.ActionResponse{
		OK:             true,
		Message:        msg,
		StartedAt:      started.Format(time.RFC3339),
		CompletedAt:    completed.Format(time.RFC3339),
		Elapsed:        elapsed,
		ElapsedSeconds: completed.Sub(started).Seconds(),
	}, nil
}

func (d *Domain) backupStatusPath() string {
	return filepath.Join("_tmpdb", "backup_status.json")
}

func (d *Domain) loadBackupStatus() BackupStatus {
	d.backupMu.Lock()
	defer d.backupMu.Unlock()
	path := d.backupStatusPath()
	raw, err := os.ReadFile(path)
	if err != nil {
		return BackupStatus{}
	}
	var status BackupStatus
	if err := json.Unmarshal(raw, &status); err != nil {
		return BackupStatus{}
	}
	if status.LastBackupAt == "" && (status.LastBackupDuration != "" || status.LastBackupMessage != "") {
		if info, err := os.Stat(path); err == nil {
			completed := info.ModTime()
			status.LastBackupAt = completed.Format(time.RFC3339)
			if status.LastBackupStartedAt == "" && status.LastBackupSeconds > 0 {
				status.LastBackupStartedAt = completed.Add(-time.Duration(status.LastBackupSeconds * float64(time.Second))).Format(time.RFC3339)
			}
		}
	}
	return status
}

func (d *Domain) saveBackupStatus(status BackupStatus) {
	_ = os.MkdirAll("_tmpdb", 0o755)
	raw, err := json.MarshalIndent(status, "", "  ")
	if err != nil {
		return
	}
	tmp := d.backupStatusPath() + ".tmp"
	if err := os.WriteFile(tmp, raw, 0o644); err != nil {
		return
	}
	_ = os.Rename(tmp, d.backupStatusPath())
}

func (d *Domain) updateBackupStatus(fn func(*BackupStatus)) {
	d.backupMu.Lock()
	defer d.backupMu.Unlock()
	var status BackupStatus
	if raw, err := os.ReadFile(d.backupStatusPath()); err == nil {
		_ = json.Unmarshal(raw, &status)
	}
	fn(&status)
	d.saveBackupStatusUnlocked(status)
}

func (d *Domain) saveBackupStatusUnlocked(status BackupStatus) {
	_ = os.MkdirAll("_tmpdb", 0o755)
	raw, err := json.MarshalIndent(status, "", "  ")
	if err != nil {
		return
	}
	tmp := d.backupStatusPath() + ".tmp"
	if err := os.WriteFile(tmp, raw, 0o644); err != nil {
		return
	}
	_ = os.Rename(tmp, d.backupStatusPath())
}

func (d *Domain) recordBackupEstimate(out BackupEstimate) {
	d.updateBackupStatus(func(status *BackupStatus) {
		status.CurrentBackupSize = out.CurrentBackupSize
		status.LastEstimateStartedAt = out.StartedAt.Format(time.RFC3339)
		status.LastEstimateAt = out.CompletedAt.Format(time.RFC3339)
		status.LastEstimateDuration = out.Elapsed
		status.LastEstimateSeconds = out.ElapsedSeconds
	})
}

func (d *Domain) recordBackupRun(out model.ActionResponse, errText string) {
	d.updateBackupStatus(func(status *BackupStatus) {
		status.LastBackupError = strings.TrimSpace(errText)
		if out.OK {
			completedAt := strings.TrimSpace(out.CompletedAt)
			if completedAt == "" {
				completedAt = time.Now().Format(time.RFC3339)
			}
			startedAt := strings.TrimSpace(out.StartedAt)
			if startedAt == "" && out.ElapsedSeconds > 0 {
				if completed, err := time.Parse(time.RFC3339, completedAt); err == nil {
					startedAt = completed.Add(-time.Duration(out.ElapsedSeconds * float64(time.Second))).Format(time.RFC3339)
				}
			}
			status.CurrentBackupSize = treeSize(d.Cfg.BackupTarget)
			status.LastBackupStartedAt = startedAt
			status.LastBackupAt = completedAt
			status.LastBackupDuration = out.Elapsed
			status.LastBackupSeconds = out.ElapsedSeconds
			status.LastBackupMessage = out.Message
		}
	})
}

func (d *Domain) validateBackupConfig() error {
	if len(d.Cfg.BackupSources) == 0 {
		return errors.New("BACKUP_SOURCES is empty")
	}
	if strings.TrimSpace(d.Cfg.BackupTarget) == "" {
		return errors.New("BACKUP_TARGET is empty")
	}
	sources, _, err := d.backupSources()
	if err != nil {
		return err
	}
	_ = sources
	return nil
}

func (d *Domain) backupSources() ([]string, []string, error) {
	if len(d.Cfg.BackupSources) == 0 {
		return nil, nil, errors.New("BACKUP_SOURCES is empty")
	}
	candidates := make([]string, 0, len(d.Cfg.BackupSources))
	warnings := []string{}
	for _, source := range d.Cfg.BackupSources {
		source = filepath.Clean(strings.TrimSpace(source))
		if source == "" {
			continue
		}
		if strings.ContainsAny(source, "*?[") {
			matches, err := filepath.Glob(source)
			if err != nil {
				return nil, nil, fmt.Errorf("backup source glob %s: %w", source, err)
			}
			if len(matches) == 0 {
				warnings = append(warnings, fmt.Sprintf("backup source glob %s matched no files", source))
				continue
			}
			sort.Strings(matches)
			candidates = append(candidates, matches...)
			continue
		}
		candidates = append(candidates, source)
	}
	out := make([]string, 0, len(candidates))
	excludes := backupExcludes(d.Cfg.ExcludeSources)
	for _, source := range candidates {
		info, err := os.Stat(source)
		if err != nil {
			warnings = append(warnings, fmt.Sprintf("backup source %s: %v", source, err))
			continue
		}
		if !info.IsDir() && !info.Mode().IsRegular() {
			warnings = append(warnings, fmt.Sprintf("backup source %s is not a regular file or directory", source))
			continue
		}
		if backupPathExcluded(source, excludes) {
			warnings = append(warnings, fmt.Sprintf("backup source %s skipped because it matches EXCLUDE_SOURCES", source))
			continue
		}
		out = append(out, source)
	}
	sort.Strings(out)
	out, overlapWarnings := removeOverlappedBackupSources(out)
	warnings = append(warnings, overlapWarnings...)
	if len(out) == 0 {
		if len(warnings) > 0 {
			return nil, warnings, errors.New(strings.Join(warnings, "; "))
		}
		return nil, nil, errors.New("BACKUP_SOURCES is empty")
	}
	return out, warnings, nil
}

func removeOverlappedBackupSources(sources []string) ([]string, []string) {
	out := make([]string, 0, len(sources))
	warnings := []string{}
	seen := map[string]struct{}{}
	for _, source := range sources {
		source = filepath.Clean(source)
		if _, ok := seen[source]; ok {
			warnings = append(warnings, fmt.Sprintf("backup source %s skipped because it is duplicated", source))
			continue
		}
		seen[source] = struct{}{}
		overlappedBy := ""
		for _, existing := range out {
			if isPathWithin(source, existing) {
				overlappedBy = existing
				break
			}
		}
		if overlappedBy != "" {
			warnings = append(warnings, fmt.Sprintf("backup source %s skipped because it is inside %s", source, overlappedBy))
			continue
		}
		out = append(out, source)
	}
	return out, warnings
}

func backupExcludes(raw []string) []string {
	out := make([]string, 0, len(raw))
	seen := map[string]struct{}{}
	for _, item := range raw {
		item = filepath.Clean(strings.TrimSpace(item))
		if item == "." || item == "" {
			continue
		}
		if _, ok := seen[item]; ok {
			continue
		}
		seen[item] = struct{}{}
		out = append(out, item)
	}
	sort.Strings(out)
	return out
}

func (d *Domain) backupRuntime() BackupRuntime {
	euid := os.Geteuid()
	name := ""
	if current, err := user.Current(); err == nil && current != nil {
		name = current.Username
	}
	out := BackupRuntime{
		EUID:        euid,
		User:        name,
		IsRoot:      euid == 0,
		SudoHelper:  euid != 0,
		HelperChild: backupHelperChild(),
	}
	if !out.IsRoot {
		out.RootHint = "Backup estimate/run use sudo helper by default. Run make install-backup-sudoers once to configure sudoers."
	}
	return out
}

func backupHelperChild() bool {
	return strings.TrimSpace(os.Getenv("INDEXER_BACKUP_HELPER_CHILD")) == "1"
}

func (d *Domain) shouldUseBackupSudoHelper() bool {
	return os.Geteuid() != 0 && !backupHelperChild()
}

func (d *Domain) backupEstimateViaSudoHelper(limit int) (BackupEstimate, ResponseCommon) {
	payload, _ := json.Marshal(BackupEstimateIn{Limit: limit})
	var out BackupEstimateOut
	rc := d.runBackupSudoHelper(BackupEstimateAction, payload, &out)
	if rc.HasError() {
		return BackupEstimate{}, rc
	}
	return out.BackupEstimate, out.ResponseCommon
}

func (d *Domain) backupRunViaSudoHelper() (model.ActionResponse, ResponseCommon) {
	var out ActionOut
	rc := d.runBackupSudoHelper(BackupRunAction, []byte(`{}`), &out)
	if rc.HasError() {
		return model.ActionResponse{}, rc
	}
	return out.ActionResponse, out.ResponseCommon
}

func (d *Domain) runBackupSudoHelper(action string, payload []byte, out any) ResponseCommon {
	helper, err := backupSudoHelperBinaryPath()
	if err != nil {
		return responseError(http.StatusInternalServerError, err.Error())
	}
	if err := backupSudoPreflight(); err != nil {
		return responseError(http.StatusForbidden, err.Error())
	}
	ctx, cancel := context.WithTimeout(context.Background(), 24*time.Hour)
	defer cancel()
	cmd := exec.CommandContext(ctx, "sudo", "-n", helper, "backup-helper", action, string(payload))
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	err = cmd.Run()
	raw := stdout.Bytes()
	if err != nil {
		msg := backupSudoHelperError(err, raw, stderr.Bytes())
		if msg == err.Error() {
			msg = backupSudoDiagnostic(ctx, helper, msg)
		}
		return responseError(http.StatusForbidden, "backup sudo helper failed: "+msg)
	}
	if err := json.Unmarshal(raw, out); err != nil {
		return responseError(http.StatusInternalServerError, fmt.Sprintf("backup sudo helper returned invalid JSON: %v", err))
	}
	return ResponseCommon{}
}

func backupSudoDiagnostic(ctx context.Context, helper string, fallback string) string {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	cmd := exec.CommandContext(ctx, "sudo", "-n", "-l", helper)
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	err := cmd.Run()
	msg := backupSudoHelperError(err, stdout.Bytes(), stderr.Bytes())
	if msg == "" {
		return fallback
	}
	return fallback + ": sudo diagnostic: " + msg
}

func backupSudoPreflight() error {
	if raw, err := os.ReadFile("/proc/self/status"); err == nil {
		for _, line := range strings.Split(string(raw), "\n") {
			if strings.TrimSpace(line) == "NoNewPrivs:\t1" || strings.TrimSpace(line) == "NoNewPrivs: 1" {
				return errors.New("sudo cannot run because this web process has NoNewPrivs enabled")
			}
		}
	}
	for _, path := range []string{"/etc/sudo.conf", "/etc/sudoers", "/etc/sudoers.d/indexer-backup-helper"} {
		if err := backupRequireRootOwned(path); err != nil {
			return err
		}
	}
	return nil
}

func backupRequireRootOwned(path string) error {
	info, err := os.Stat(path)
	if err != nil {
		return fmt.Errorf("sudo preflight failed: %s: %v", path, err)
	}
	stat, ok := info.Sys().(*syscall.Stat_t)
	if !ok {
		return nil
	}
	if stat.Uid != 0 {
		return fmt.Errorf("sudo preflight failed: %s is owned by uid %d, should be 0", path, stat.Uid)
	}
	return nil
}

func backupSudoHelperError(err error, stdout []byte, stderr []byte) string {
	parts := []string{}
	if err != nil {
		parts = append(parts, err.Error())
	}
	if msg := backupJSONError(stderr); msg != "" {
		parts = append(parts, msg)
	} else if msg := strings.TrimSpace(string(stderr)); msg != "" {
		parts = append(parts, msg)
	}
	if msg := backupJSONError(stdout); msg != "" {
		parts = append(parts, msg)
	} else if msg := strings.TrimSpace(string(stdout)); msg != "" {
		parts = append(parts, msg)
	}
	return strings.Join(parts, ": ")
}

func backupJSONError(raw []byte) string {
	if len(strings.TrimSpace(string(raw))) == 0 {
		return ""
	}
	var meta struct {
		Error string `json:"error"`
	}
	if err := json.Unmarshal(raw, &meta); err != nil {
		return ""
	}
	return strings.TrimSpace(meta.Error)
}

func backupSudoHelperBinaryPath() (string, error) {
	const binary = "/usr/local/lib/indexer/indexer-backup-helper"
	if info, err := os.Stat(binary); err == nil && !info.IsDir() {
		return binary, nil
	}
	const installed = "/usr/local/sbin/indexer-backup-sudo-helper"
	if info, err := os.Stat(installed); err == nil && !info.IsDir() {
		body, readErr := os.ReadFile(installed)
		if readErr == nil && strings.Contains(string(body), "go run") {
			return "", errors.New("backup sudo helper is stale; run make install-backup-sudoers to install the compiled helper")
		}
		return "", errors.New("backup helper binary is not installed; run make install-backup-sudoers")
	}
	return "", errors.New("backup sudo helper is not installed; run make install-backup-sudoers")
}

func responseError(code int, message string) ResponseCommon {
	rc := ResponseCommon{}
	rc.SetError(code, message)
	return rc
}

type backupUnreadableSummary struct {
	Count   int
	Example string
}

func (s *backupUnreadableSummary) Add(path string) {
	s.Count++
	if s.Example == "" {
		s.Example = path
	}
}

func (s backupUnreadableSummary) Warning() string {
	if s.Count == 0 {
		return ""
	}
	msg := fmt.Sprintf("skipped %d unreadable backup paths", s.Count)
	if s.Example != "" {
		msg += " (example: " + s.Example + ")"
	}
	if os.Geteuid() != 0 {
		msg += "; run make install-backup-sudoers to scan root-owned sources"
	}
	return msg
}

func isPermissionErr(err error) bool {
	return errors.Is(err, os.ErrPermission) || strings.Contains(strings.ToLower(err.Error()), "permission denied")
}

func backupPathExcluded(path string, excludes []string) bool {
	path = filepath.Clean(path)
	base := filepath.Base(path)
	for _, pattern := range excludes {
		if pattern == "" {
			continue
		}
		if strings.ContainsAny(pattern, "*?[") {
			if matched, _ := filepath.Match(pattern, path); matched {
				return true
			}
			if !strings.ContainsAny(pattern, string(os.PathSeparator)) {
				if matched, _ := filepath.Match(pattern, base); matched {
					return true
				}
			}
			continue
		}
		if isPathWithin(path, pattern) {
			return true
		}
	}
	return false
}

func backupRsyncExcludeArgs(raw []string) []string {
	excludes := backupExcludes(raw)
	out := make([]string, 0, len(excludes)*2)
	seen := map[string]struct{}{}
	add := func(pattern string) {
		pattern = filepath.ToSlash(filepath.Clean(strings.TrimSpace(pattern)))
		if pattern == "." || pattern == "" {
			return
		}
		pattern = strings.TrimLeft(pattern, "/")
		if _, ok := seen[pattern]; ok {
			return
		}
		seen[pattern] = struct{}{}
		out = append(out, pattern)
	}
	for _, exclude := range excludes {
		add(exclude)
		if !strings.ContainsAny(exclude, "*?[") {
			add(filepath.Join(exclude, "***"))
		}
	}
	return out
}

func isPathWithin(path string, root string) bool {
	path = filepath.Clean(path)
	root = filepath.Clean(root)
	if path == root {
		return true
	}
	rel, err := filepath.Rel(root, path)
	if err != nil {
		return false
	}
	return rel != "." && rel != ".." && !strings.HasPrefix(rel, ".."+string(os.PathSeparator))
}

func needsBackup(source os.FileInfo, target os.FileInfo, targetErr error) bool {
	if targetErr != nil {
		return true
	}
	if !target.Mode().IsRegular() {
		return true
	}
	if source.Size() != target.Size() {
		return true
	}
	return source.ModTime().After(target.ModTime().Add(time.Second))
}

func backupTargetPath(target string, sourcePath string) string {
	cleaned := filepath.Clean(sourcePath)
	volume := filepath.VolumeName(cleaned)
	cleaned = strings.TrimPrefix(cleaned, volume)
	cleaned = strings.TrimLeft(cleaned, string(os.PathSeparator))
	if cleaned == "" {
		cleaned = strings.Trim(volume, string(os.PathSeparator))
	}
	return filepath.Join(target, cleaned)
}

func treeSize(path string) int64 {
	var total int64
	_ = filepath.WalkDir(path, func(_ string, de fs.DirEntry, err error) error {
		if err != nil || de == nil {
			return nil
		}
		info, err := de.Info()
		if err != nil || !info.Mode().IsRegular() {
			return nil
		}
		total += info.Size()
		return nil
	})
	return total
}
