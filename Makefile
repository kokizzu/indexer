APP=indexer

.PHONY: web air migrate cli-reindex cli-search svelte-watch svelte-build test build clickhouse gen-views

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

svelte-build:
	cd svelte && npm run build

test:
	go test ./...

build:
	go build ./...

clickhouse:
	clickhouse client --port 9006 --user userC --password passC --database indexer

gen-views:
	./gen-views.sh
