#!/usr/bin/env sh
set -eu

WEB_ADDR="${WEB_ADDR:-:18081}" go run main.go web
