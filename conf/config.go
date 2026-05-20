package conf

import (
	"bufio"
	"bytes"
	"errors"
	"os"
	"path/filepath"
	"strings"
)

const (
	DefaultAddr           = ":18080"
	DefaultClickHouseURL  = "http://127.0.0.1:8127"
	DefaultClickHouseDB   = "indexer"
	DefaultClickHouseUser = "userC"
	DefaultClickHousePass = "passC"
	DefaultMoviesExts     = "mkv avi mpg mpeg mp4 m4v mov webm wmv"
	DefaultSubtitleExts   = "sub idx srt"
)

type Config struct {
	Addr           string
	Password       string
	SortedRoots    []string
	UnsortedRoots  []string
	ClickHouseURL  string
	ClickHouseDB   string
	ClickHouseUser string
	ClickHousePass string
	MoviesExts     []string
	SubtitleExts   []string
}

func LoadConfig(envPath string) (Config, error) {
	values, err := ParseEnvFiles(envPath, ".env.override")
	if err != nil {
		return Config{}, err
	}

	get := func(key, fallback string) string {
		if v := strings.TrimSpace(os.Getenv(key)); v != "" {
			return v
		}
		if v := strings.TrimSpace(values[key]); v != "" {
			return v
		}
		return fallback
	}

	cfg := Config{
		Addr:           get("WEB_ADDR", DefaultAddr),
		Password:       get("PASSWORD", ""),
		SortedRoots:    ParseMultilineList(get("SORTED_MOVIES", "")),
		UnsortedRoots:  ParseMultilineList(get("UNSORTED_MOVIES", "")),
		ClickHouseURL:  get("CLICKHOUSE_URL", DefaultClickHouseURL),
		ClickHouseDB:   get("CLICKHOUSE_DB", DefaultClickHouseDB),
		ClickHouseUser: get("CLICKHOUSE_USER", DefaultClickHouseUser),
		ClickHousePass: get("CLICKHOUSE_PASSWORD", DefaultClickHousePass),
		MoviesExts:     ParseSpaceList(get("MOVIES_EXTS", DefaultMoviesExts)),
		SubtitleExts:   ParseSpaceList(get("SUBTITLE_EXT", DefaultSubtitleExts)),
	}
	if cfg.Password == "" {
		return Config{}, errors.New("PASSWORD must not be empty")
	}
	return cfg, nil
}

func ParseSpaceList(raw string) []string {
	fields := strings.Fields(strings.TrimSpace(raw))
	out := make([]string, 0, len(fields))
	for _, field := range fields {
		field = strings.ToLower(strings.TrimSpace(field))
		if field == "" {
			continue
		}
		field = strings.TrimPrefix(field, ".")
		out = append(out, field)
	}
	return out
}

func ParseEnvFiles(paths ...string) (map[string]string, error) {
	merged := map[string]string{}
	for _, path := range paths {
		values, err := ParseEnvFile(path)
		if err != nil {
			if errors.Is(err, os.ErrNotExist) {
				continue
			}
			return nil, err
		}
		for k, v := range values {
			merged[k] = v
		}
	}
	return merged, nil
}

func ParseEnvFile(path string) (map[string]string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	res := map[string]string{}
	sc := bufio.NewScanner(bytes.NewReader(data))
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		idx := strings.IndexByte(line, '=')
		if idx <= 0 {
			continue
		}
		key := strings.TrimSpace(line[:idx])
		val := strings.TrimSpace(line[idx+1:])
		if val == `"` || (strings.HasPrefix(val, `"`) && !strings.HasSuffix(val, `"`)) {
			var b strings.Builder
			firstLine := strings.TrimPrefix(val, `"`)
			if firstLine != "" {
				b.WriteString(firstLine)
			}
			for sc.Scan() {
				next := sc.Text()
				trimmedNext := strings.TrimSpace(next)
				if trimmedNext == `"` {
					break
				}
				if strings.HasSuffix(trimmedNext, `"`) {
					if b.Len() > 0 {
						b.WriteByte('\n')
					}
					b.WriteString(strings.TrimSpace(strings.TrimSuffix(trimmedNext, `"`)))
					break
				}
				if b.Len() > 0 {
					b.WriteByte('\n')
				}
				b.WriteString(strings.TrimSpace(next))
			}
			res[key] = b.String()
			continue
		}
		res[key] = strings.Trim(val, `"`)
	}
	return res, sc.Err()
}

func ParseMultilineList(raw string) []string {
	lines := strings.Split(raw, "\n")
	out := make([]string, 0, len(lines))
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		out = append(out, filepath.Clean(line))
	}
	return out
}

func (c Config) AllRoots() []string {
	out := append([]string{}, c.SortedRoots...)
	out = append(out, c.UnsortedRoots...)
	return out
}
