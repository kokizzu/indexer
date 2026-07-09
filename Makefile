APP=indexer
BACKUP_HELPER_BUILD=build/bin/indexer-backup-helper
GO_FILES=$(shell rg --files -g '*.go')

.PHONY: web web-dev install-backup-sudoers check-backup-endpoint air migrate cli-reindex cli-search svelte-watch svelte-build test build clickhouse gen-views verify-dependency-security

web:
	go run main.go web

web-dev:
	./scripts/run-web-dev.sh

$(BACKUP_HELPER_BUILD): $(GO_FILES) go.mod go.sum
	mkdir -p $(dir $@)
	go build -o $@ .

install-backup-sudoers: $(BACKUP_HELPER_BUILD)
	sudo ./scripts/install-backup-sudoers.sh "$(abspath $(BACKUP_HELPER_BUILD))"

check-backup-endpoint:
	./scripts/check-backup-endpoint.sh

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

verify-dependency-security:
	bash ./scripts/verify-dependency-security.sh
