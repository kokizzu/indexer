#!/usr/bin/env bash

set -eu

cd presentation
go test -run '^$' -bench=BenchmarkGenerateViews
gofmt -w actions.GEN.go api_routes.GEN.go cmd_run.GEN.go web_view.GEN.go
