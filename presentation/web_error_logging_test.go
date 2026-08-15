package presentation

import (
	"bytes"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gofiber/fiber/v2"
)

func TestHTTPErrorLoggerLogsSerializedFailure(t *testing.T) {
	t.Parallel()

	var logs bytes.Buffer
	app := fiber.New()
	app.Use(httpErrorLogger(log.New(&logs, "", 0)))
	app.Get("/api/serialized", func(c *fiber.Ctx) error {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "clickhouse unavailable"})
	})

	res, err := app.Test(httptest.NewRequest(http.MethodGet, "/api/serialized", nil))
	if err != nil {
		t.Fatalf("request: %v", err)
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusInternalServerError {
		t.Fatalf("status=%d, want %d", res.StatusCode, http.StatusInternalServerError)
	}

	got := logs.String()
	for _, want := range []string{
		"http request failed",
		"method=GET",
		"path=/api/serialized",
		"status=500",
		`error="{\"error\":\"clickhouse unavailable\"}"`,
	} {
		if !strings.Contains(got, want) {
			t.Fatalf("log %q does not contain %q", got, want)
		}
	}
}

func TestHTTPErrorLoggerLogsReturnedClientError(t *testing.T) {
	t.Parallel()

	var logs bytes.Buffer
	app := fiber.New()
	app.Use(httpErrorLogger(log.New(&logs, "", 0)))
	app.Get("/api/returned", func(*fiber.Ctx) error {
		return fiber.NewError(http.StatusBadRequest, "bad query")
	})

	res, err := app.Test(httptest.NewRequest(http.MethodGet, "/api/returned", nil))
	if err != nil {
		t.Fatalf("request: %v", err)
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusBadRequest {
		t.Fatalf("status=%d, want %d", res.StatusCode, http.StatusBadRequest)
	}

	got := logs.String()
	for _, want := range []string{"method=GET", "path=/api/returned", "status=400", `error="bad query"`} {
		if !strings.Contains(got, want) {
			t.Fatalf("log %q does not contain %q", got, want)
		}
	}
}

func TestHTTPErrorLoggerDoesNotLogSuccess(t *testing.T) {
	t.Parallel()

	var logs bytes.Buffer
	app := fiber.New()
	app.Use(httpErrorLogger(log.New(&logs, "", 0)))
	app.Get("/api/ok", func(c *fiber.Ctx) error {
		return c.SendStatus(http.StatusOK)
	})

	res, err := app.Test(httptest.NewRequest(http.MethodGet, "/api/ok", nil))
	if err != nil {
		t.Fatalf("request: %v", err)
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("status=%d, want %d", res.StatusCode, http.StatusOK)
	}
	if got := logs.String(); got != "" {
		t.Fatalf("unexpected log for successful request: %q", got)
	}
}
