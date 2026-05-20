package presentation

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"indexer/domain"
)

type CLI struct {
	Domain *domain.Domain
	Stdout io.Writer
	Stderr io.Writer
}

func (c *CLI) Run(args []string) int {
	if c.Stdout == nil {
		c.Stdout = os.Stdout
	}
	if c.Stderr == nil {
		c.Stderr = os.Stderr
	}
	if len(args) == 0 {
		fmt.Fprintln(c.Stderr, "usage: cli reindex [priority-root ...] | cli search <query> | cli browse [path] | cli duplicates | cli suggest <path>")
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
	default:
		fmt.Fprintln(c.Stderr, "unknown cli command:", args[0])
		return 2
	}
}

func (c *CLI) printProgress(done <-chan struct{}) {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-done:
			return
		case <-ticker.C:
			st := c.Domain.Status()
			fmt.Fprintf(c.Stdout, "\rprogress %6.2f%% data=%s/%s indexed=%d files=%d dirs=%d current=%s", st.ProgressPct, humanBytes(st.ProcessedBytes), humanBytes(st.TotalBytes), st.Indexed, st.Files, st.Directories, st.CurrentPath)
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
