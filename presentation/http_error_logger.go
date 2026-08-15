package presentation

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
)

const maxLoggedHTTPErrorBytes = 4096

func httpErrorLogger(logger *log.Logger) fiber.Handler {
	if logger == nil {
		logger = log.Default()
	}

	return func(ctx *fiber.Ctx) error {
		err := ctx.Next()
		status := ctx.Response().StatusCode()
		if err != nil {
			var fiberErr *fiber.Error
			if errors.As(err, &fiberErr) {
				status = fiberErr.Code
			} else if status < http.StatusBadRequest {
				status = http.StatusInternalServerError
			}
		}
		if status < http.StatusBadRequest {
			return err
		}

		message := ""
		if err != nil {
			message = err.Error()
		} else {
			message = strings.TrimSpace(string(ctx.Response().Body()))
		}
		if message == "" {
			message = http.StatusText(status)
		}
		if len(message) > maxLoggedHTTPErrorBytes {
			message = message[:maxLoggedHTTPErrorBytes] + "... (truncated)"
		}

		logger.Printf(
			"http request failed: method=%s path=%s status=%d error=%q",
			ctx.Method(),
			ctx.Path(),
			status,
			message,
		)
		return err
	}
}
