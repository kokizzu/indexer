package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"indexer/conf"
	"indexer/domain"
	"indexer/presentation"
)

func main() {
	cfg, err := conf.LoadConfig(".env")
	if err != nil {
		log.Fatalf("load config: %v", err)
	}

	dom := domain.New(cfg)
	if err := dom.EnsureProjectDirs(); err != nil {
		log.Fatalf("prepare project dirs: %v", err)
	}

	mode := "web"
	if len(os.Args) > 1 {
		mode = os.Args[1]
	}

	switch mode {
	case "config":
		raw, _ := json.MarshalIndent(cfg, "", "  ")
		log.Print(string(raw))
	case "migrate":
		if err := dom.StartClickHouse(); err != nil {
			log.Printf("clickhouse bootstrap warning: %v", err)
		}
		if err := dom.WaitClickHouse(45 * time.Second); err != nil {
			log.Fatalf("wait clickhouse: %v", err)
		}
		if err := dom.ApplyMigrations(); err != nil {
			log.Fatalf("apply migrations: %v", err)
		}
		log.Print("migrations applied")
	case "backup":
		if err := dom.StartClickHouse(); err != nil {
			log.Printf("clickhouse bootstrap warning: %v", err)
		}
		if err := dom.WaitClickHouse(45 * time.Second); err != nil {
			log.Fatalf("wait clickhouse: %v", err)
		}
		if err := dom.ApplyMigrations(); err != nil {
			log.Fatalf("apply migrations: %v", err)
		}
		path := filepath.Join("backup", "entries_"+time.Now().Format("20060102_150405")+".jsonl")
		if err := dom.Store.BackupEntries(path); err != nil {
			log.Fatalf("backup entries: %v", err)
		}
		log.Print("backup written to ", path)
	case "restore":
		if len(os.Args) < 3 {
			log.Fatal("usage: go run main.go restore <backup-file>")
		}
		if err := dom.StartClickHouse(); err != nil {
			log.Printf("clickhouse bootstrap warning: %v", err)
		}
		if err := dom.WaitClickHouse(45 * time.Second); err != nil {
			log.Fatalf("wait clickhouse: %v", err)
		}
		if err := dom.ApplyMigrations(); err != nil {
			log.Fatalf("apply migrations: %v", err)
		}
		if err := dom.Store.RestoreEntries(os.Args[2]); err != nil {
			log.Fatalf("restore entries: %v", err)
		}
		log.Print("restore completed from ", os.Args[2])
	case "web":
		if err := dom.StartClickHouse(); err != nil {
			log.Printf("clickhouse bootstrap warning: %v", err)
		}
		if err := dom.WaitClickHouse(45 * time.Second); err != nil {
			log.Printf("clickhouse availability warning: %v", err)
		}
		if err := dom.ApplyMigrations(); err != nil {
			log.Printf("schema warning: %v", err)
		}

		ws := &presentation.WebServer{Domain: dom}
		srv := &http.Server{
			Addr:              cfg.Addr,
			Handler:           ws.Handler(),
			ReadHeaderTimeout: 10 * time.Second,
		}
		log.Printf("indexer listening on %s", cfg.Addr)
		log.Fatal(srv.ListenAndServe())
	case "cli":
		if err := dom.StartClickHouse(); err != nil {
			log.Printf("clickhouse bootstrap warning: %v", err)
		}
		if err := dom.WaitClickHouse(45 * time.Second); err != nil {
			log.Fatalf("wait clickhouse: %v", err)
		}
		if err := dom.ApplyMigrations(); err != nil {
			log.Fatalf("apply migrations: %v", err)
		}
		cli := &presentation.CLI{Domain: dom}
		os.Exit(cli.Run(os.Args[2:]))
	default:
		log.Fatalf("unsupported mode %q, use web|migrate|config|backup|restore|cli", mode)
	}
}
