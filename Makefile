APP=indexer

.PHONY: web air migrate cli-reindex cli-search svelte-watch test build

web:
	go run main.go web

air:
	air

migrate:
	go run main.go migrate

cli-reindex:
	go run main.go cli reindex

cli-search:
	go run main.go cli search "$(q)"

svelte-watch:
	cd svelte && npm run dev

test:
	go test ./...

build:
	go build ./...

