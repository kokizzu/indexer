package presentation

import (
	"path/filepath"
	"runtime"
)

func projectPath(parts ...string) string {
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		base := append([]string{"."}, parts...)
		return filepath.Join(base...)
	}
	base := filepath.Dir(filepath.Dir(file))
	all := append([]string{base}, parts...)
	return filepath.Join(all...)
}

func builtSveltePath(parts ...string) string {
	all := append([]string{"svelte"}, parts...)
	return projectPath(all...)
}
