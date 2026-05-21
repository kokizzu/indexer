package presentation

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"indexer/domain"
	"indexer/model"
)

type CLI struct {
	Domain *domain.Domain
	Stdout io.Writer
	Stderr io.Writer
	Stdin  io.Reader
}

func (c *CLI) Run(args []string) int {
	if c.Stdout == nil {
		c.Stdout = os.Stdout
	}
	if c.Stderr == nil {
		c.Stderr = os.Stderr
	}
	if c.Stdin == nil {
		c.Stdin = os.Stdin
	}
	if len(args) == 0 {
		fmt.Fprintln(c.Stderr, "usage: cli reindex [priority-root ...] | cli search <query> | cli browse [path] | cli duplicates | cli suggest <path> | cli manage <namefix|subtitle-rename|apply-rename|sorted-move|delete-target|queue|history> ...")
		return 2
	}

	switch args[0] {
	case "reindex":
		priority := strings.TrimSpace(strings.Join(args[1:], ","))
		done := make(chan struct{})
		go c.printProgress(done)
		resp := c.Domain.Reindex(priority)
		close(done)
		fmt.Fprintln(c.Stdout)
		return c.printJSON(resp)
	case "search":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli search <query>")
			return 2
		}
		res, err := c.Domain.Search(strings.Join(args[1:], " "), "", 100)
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(res)
	case "duplicates":
		res, err := c.Domain.Duplicates()
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(res)
	case "browse":
		path := ""
		if len(args) > 1 {
			path = args[1]
		}
		res, err := c.Domain.Browse(path)
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(res)
	case "suggest":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli suggest <path>")
			return 2
		}
		fmt.Fprintln(c.Stdout, domain.SuggestName(args[1]))
		return 0
	case "manage":
		return c.runManage(args[1:])
	default:
		fmt.Fprintln(c.Stderr, "unknown cli command:", args[0])
		return 2
	}
}

type manageCandidate struct {
	Path      string `json:"path"`
	Current   string `json:"current"`
	Suggested string `json:"suggested"`
	NewPath   string `json:"newPath"`
	Status    string `json:"status"`
	FileCount int    `json:"fileCount"`
	DirCount  int    `json:"dirCount"`
	IsDir     bool   `json:"isDir"`
}

func (c *CLI) runManage(args []string) int {
	if len(args) == 0 {
		fmt.Fprintln(c.Stderr, "usage: cli manage <namefix|subtitle-rename|apply-rename|sorted-move|delete-target|queue|history> ...")
		return 2
	}
	switch args[0] {
	case "queue":
		return c.printJSON(c.Domain.ManageStatus())
	case "history":
		limit := 100
		if len(args) > 1 {
			if v, err := strconv.Atoi(args[1]); err == nil && v > 0 {
				limit = v
			}
		}
		rows, err := c.Domain.ManageHistory(limit)
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(rows)
	case "namefix", "suggest":
		return c.runManageSuggest(args[1:])
	case "subtitle-rename", "subtitles":
		return c.runManageSubtitles(args[1:])
	case "apply-rename", "rename":
		return c.runManageRename(args[1:])
	case "sorted-move", "move":
		return c.runManageMove(args[1:])
	case "delete-target", "delete":
		return c.runManageDelete(args[1:])
	default:
		fmt.Fprintln(c.Stderr, "unknown manage mode:", args[0])
		return 2
	}
}

func (c *CLI) runManageSuggest(args []string) int {
	if len(args) < 1 {
		fmt.Fprintln(c.Stderr, "usage: cli manage namefix <scan|preview|categorize-preview> <path>")
		return 2
	}
	switch args[0] {
	case "scan":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli manage namefix scan <path>")
			return 2
		}
		rows, err := c.scanSuggestCandidates(args[1], false)
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(rows)
	case "preview":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli manage namefix preview <path>")
			return 2
		}
		s := c.Domain.SuggestPath(args[1])
		return c.printJSON(map[string]any{
			"path":       filepath.Clean(args[1]),
			"current":    filepath.Base(filepath.Clean(args[1])),
			"suggested":  s.Suggested,
			"suggestion": s,
			"newPath":    filepath.Join(filepath.Dir(filepath.Clean(args[1])), s.Suggested),
		})
	case "categorize-preview":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli manage namefix categorize-preview <path>")
			return 2
		}
		res, err := c.Domain.CategorizePreview(args[1], 120)
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(res)
	default:
		fmt.Fprintln(c.Stderr, "usage: cli manage namefix <scan|preview|categorize-preview> <path>")
		return 2
	}
}

func (c *CLI) runManageSubtitles(args []string) int {
	if len(args) < 1 {
		fmt.Fprintln(c.Stderr, "usage: cli manage subtitle-rename <scan|queue> <path> [--password PASS]")
		return 2
	}
	switch args[0] {
	case "scan":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli manage subtitle-rename scan <path>")
			return 2
		}
		rows, err := c.Domain.ScanSubtitleRenameCandidates(args[1], 500)
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(rows)
	case "queue":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli manage subtitle-rename queue <subtitle-path> [--password PASS]")
			return 2
		}
		newPath, err := c.Domain.SuggestSubtitleRename(args[1])
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		password, _, err := c.resolvePassword(args[2:])
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		res, err := c.Domain.QueueRename(password, args[1], newPath)
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(res)
	default:
		fmt.Fprintln(c.Stderr, "usage: cli manage subtitle-rename <scan|queue> <path> [--password PASS]")
		return 2
	}
}

func (c *CLI) runManageRename(args []string) int {
	if len(args) < 1 {
		fmt.Fprintln(c.Stderr, "usage: cli manage apply-rename <scan|preview|queue> ...")
		return 2
	}
	switch args[0] {
	case "scan":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli manage apply-rename scan <path>")
			return 2
		}
		rows, err := c.scanSuggestCandidates(args[1], false)
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(rows)
	case "preview":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli manage apply-rename preview <path>")
			return 2
		}
		return c.printRenamePreview(args[1])
	case "queue":
		if len(args) < 3 {
			fmt.Fprintln(c.Stderr, "usage: cli manage apply-rename queue <old-path> <new-path> [--password PASS]")
			return 2
		}
		password, _, err := c.resolvePassword(args[3:])
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		res, err := c.Domain.QueueRename(password, args[1], args[2])
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(res)
	default:
		fmt.Fprintln(c.Stderr, "usage: cli manage apply-rename <scan|preview|queue> ...")
		return 2
	}
}

func (c *CLI) runManageMove(args []string) int {
	if len(args) < 1 {
		fmt.Fprintln(c.Stderr, "usage: cli manage sorted-move <scan|preview|queue> ...")
		return 2
	}
	switch args[0] {
	case "scan":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli manage sorted-move scan <path>")
			return 2
		}
		rows, err := c.scanSuggestCandidates(args[1], true)
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(rows)
	case "preview":
		if len(args) < 3 {
			fmt.Fprintln(c.Stderr, "usage: cli manage sorted-move preview <src-path> <dst-dir>")
			return 2
		}
		if err := c.Domain.ValidateSortedMove(args[1], args[2]); err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(map[string]any{
			"action":   "move",
			"srcPath":  filepath.Clean(args[1]),
			"dstDir":   filepath.Clean(args[2]),
			"dstPath":  filepath.Join(filepath.Clean(args[2]), filepath.Base(filepath.Clean(args[1]))),
			"preview":  true,
			"queueOnly": true,
		})
	case "queue":
		if len(args) < 3 {
			fmt.Fprintln(c.Stderr, "usage: cli manage sorted-move queue <src-path> <dst-dir> [--password PASS]")
			return 2
		}
		password, _, err := c.resolvePassword(args[3:])
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		res, err := c.Domain.QueueMove(password, args[1], args[2])
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(res)
	default:
		fmt.Fprintln(c.Stderr, "usage: cli manage sorted-move <scan|preview|queue> ...")
		return 2
	}
}

func (c *CLI) runManageDelete(args []string) int {
	if len(args) < 1 {
		fmt.Fprintln(c.Stderr, "usage: cli manage delete-target <scan|preview|queue> ...")
		return 2
	}
	switch args[0] {
	case "scan":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli manage delete-target scan <path>")
			return 2
		}
		rows, err := c.scanDeleteCandidates(args[1])
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(rows)
	case "preview":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli manage delete-target preview <path>")
			return 2
		}
		return c.printJSON(map[string]any{
			"action":  "delete",
			"path":    filepath.Clean(args[1]),
			"preview": true,
		})
	case "queue":
		if len(args) < 2 {
			fmt.Fprintln(c.Stderr, "usage: cli manage delete-target queue <path> [--password PASS]")
			return 2
		}
		password, _, err := c.resolvePassword(args[2:])
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		res, err := c.Domain.QueueDelete(password, args[1])
		if err != nil {
			fmt.Fprintln(c.Stderr, err.Error())
			return 1
		}
		return c.printJSON(res)
	default:
		fmt.Fprintln(c.Stderr, "usage: cli manage delete-target <scan|preview|queue> ...")
		return 2
	}
}

func (c *CLI) printRenamePreview(path string) int {
	s := c.Domain.SuggestPath(path)
	return c.printJSON(map[string]any{
		"action":     "rename",
		"path":       filepath.Clean(path),
		"current":    filepath.Base(filepath.Clean(path)),
		"suggested":  s.Suggested,
		"suggestion": s,
		"newPath":    filepath.Join(filepath.Dir(filepath.Clean(path)), s.Suggested),
		"preview":    true,
	})
}

func (c *CLI) scanSuggestCandidates(path string, moveOnly bool) ([]manageCandidate, error) {
	dirs, err := c.collectDirectories(path, 300)
	if err != nil {
		return nil, err
	}
	rows := make([]manageCandidate, 0, len(dirs))
	for _, item := range dirs {
		s := c.Domain.SuggestPath(item.Path)
		current := strings.TrimSpace(item.Base)
		suggested := strings.TrimSpace(s.Suggested)
		currentReady := isSortedReadyCLI(current)
		suggestedReady := isSortedReadyCLI(suggested)
		status := ""
		switch {
		case currentReady:
			status = "MOVE READY"
		case suggested != "" && suggested != current && suggestedReady:
			status = "RENAME → MOVE"
		case suggested != "" && suggested != current:
			status = "RENAME"
		}
		if moveOnly {
			if !currentReady {
				continue
			}
		} else {
			if status == "" || currentReady {
				continue
			}
		}
		rows = append(rows, manageCandidate{
			Path:      item.Path,
			Current:   current,
			Suggested: suggested,
			NewPath:   filepath.Join(filepath.Dir(item.Path), suggested),
			Status:    status,
			FileCount: item.FileCount,
			DirCount:  item.DirCount,
			IsDir:     true,
		})
	}
	return rows, nil
}

func (c *CLI) scanDeleteCandidates(path string) ([]manageCandidate, error) {
	rows, err := c.collectEntries(path, 300)
	if err != nil {
		return nil, err
	}
	out := make([]manageCandidate, 0, len(rows))
	for _, item := range rows {
		fileCount := 1
		dirCount := 0
		if item.IsDir {
			fileCount = item.FileCount
			dirCount = item.DirCount
		}
		out = append(out, manageCandidate{
			Path:      item.Path,
			Current:   item.Base,
			Suggested: item.Path,
			Status:    map[bool]string{true: "DIR", false: "FILE"}[item.IsDir],
			FileCount: fileCount,
			DirCount:  dirCount,
			IsDir:     item.IsDir,
		})
	}
	return out, nil
}

func (c *CLI) collectDirectories(rootPath string, limit int) ([]model.BrowseEntry, error) {
	queue := []string{filepath.Clean(rootPath)}
	seen := map[string]struct{}{}
	out := make([]model.BrowseEntry, 0, minInt(limit, 64))
	for len(queue) > 0 && len(out) < limit {
		current := queue[0]
		queue = queue[1:]
		if _, ok := seen[current]; ok {
			continue
		}
		seen[current] = struct{}{}
		rows, err := c.Domain.Browse(current)
		if err != nil {
			return nil, err
		}
		for _, item := range rows {
			if !item.IsDir {
				continue
			}
			out = append(out, item)
			if len(out) >= limit {
				break
			}
			queue = append(queue, item.Path)
		}
	}
	return out, nil
}

func (c *CLI) collectEntries(rootPath string, limit int) ([]model.BrowseEntry, error) {
	queue := []string{filepath.Clean(rootPath)}
	seen := map[string]struct{}{}
	out := make([]model.BrowseEntry, 0, minInt(limit, 64))
	for len(queue) > 0 && len(out) < limit {
		current := queue[0]
		queue = queue[1:]
		if _, ok := seen[current]; ok {
			continue
		}
		seen[current] = struct{}{}
		rows, err := c.Domain.Browse(current)
		if err != nil {
			return nil, err
		}
		for _, item := range rows {
			out = append(out, item)
			if len(out) >= limit {
				break
			}
			if item.IsDir {
				queue = append(queue, item.Path)
			}
		}
	}
	return out, nil
}

func (c *CLI) resolvePassword(args []string) (string, []string, error) {
	rest := make([]string, 0, len(args))
	password := strings.TrimSpace(os.Getenv("INDEXER_PASSWORD"))
	for i := 0; i < len(args); i++ {
		if args[i] == "--password" {
			if i+1 >= len(args) {
				return "", nil, fmt.Errorf("missing value for --password")
			}
			password = args[i+1]
			i++
			continue
		}
		rest = append(rest, args[i])
	}
	if password != "" {
		return password, rest, nil
	}
	fmt.Fprint(c.Stderr, "Manage password: ")
	reader := bufio.NewReader(c.Stdin)
	line, err := reader.ReadString('\n')
	if err != nil && err != io.EOF {
		return "", nil, err
	}
	password = strings.TrimSpace(line)
	if password == "" {
		return "", nil, fmt.Errorf("password is required")
	}
	return password, rest, nil
}

func isSortedReadyCLI(name string) bool {
	name = strings.TrimSpace(name)
	return strings.Contains(name, "of_w") && strings.Contains(name, "[") && strings.Contains(name, "]")
}

func minInt(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func (c *CLI) printProgress(done <-chan struct{}) {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()
	resumeShown := false
	for {
		select {
		case <-done:
			return
		case <-ticker.C:
			st := c.Domain.Status()
			if st.Resumed && !resumeShown {
				fmt.Fprintf(c.Stdout, "resuming restoredEntries=%d restoredFiles=%d restoredDirs=%d restoredData=%s from=%s\n", st.ResumedEntries, st.Files, st.Directories, humanBytes(st.ProcessedBytes), st.CurrentPath)
				resumeShown = true
			}
			if st.Indexed == 0 && st.ProcessedBytes == 0 {
				fmt.Fprintf(c.Stdout, "\restimating resumed=%t workers=%d active=%d roots=%d/%d estData=%s estFiles=%d estDirs=%d current=%s", st.Resumed, st.WorkerCount, st.ActiveWorkers, st.EstimatedRoots, st.TotalRoots, humanBytes(st.TotalBytes), st.EstimatedFiles, st.EstimatedDirs, st.CurrentPath)
				continue
			}
			fmt.Fprintf(c.Stdout, "\rprogress %6.2f%% resumed=%t workers=%d active=%d roots=%d/%d estData=%s data=%s/%s indexed=%d files=%d dirs=%d current=%s", st.ProgressPct, st.Resumed, st.WorkerCount, st.ActiveWorkers, st.EstimatedRoots, st.TotalRoots, humanBytes(st.TotalBytes), humanBytes(st.ProcessedBytes), humanBytes(st.TotalBytes), st.Indexed, st.Files, st.Directories, st.CurrentPath)
		}
	}
}

func (c *CLI) printJSON(v any) int {
	raw, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		fmt.Fprintln(c.Stderr, err.Error())
		return 1
	}
	fmt.Fprintln(c.Stdout, string(raw))
	return 0
}

func humanBytes(v int64) string {
	if v <= 0 {
		return "0 B"
	}
	const unit = 1024
	value := float64(v)
	suffixes := []string{"B", "KB", "MB", "GB", "TB"}
	idx := 0
	for value >= unit && idx < len(suffixes)-1 {
		value /= unit
		idx++
	}
	if idx == 0 {
		return fmt.Sprintf("%d %s", v, suffixes[idx])
	}
	return fmt.Sprintf("%.2f %s", value, suffixes[idx])
}
