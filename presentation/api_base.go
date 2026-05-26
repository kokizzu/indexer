package presentation

import (
	"context"
	"net/http"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"

	"indexer/domain"
)

func webApiParseInput(ctx *fiber.Ctx, reqCommon *domain.RequestCommon, in any, action string) error {
	body := ctx.Body()
	reqCommon.Action = action
	reqCommon.OutputFormat = "json"
	if err := ctx.QueryParser(in); err != nil {
		return err
	}
	if len(body) > 0 {
		retry := true
		if body[0] == '{' || ctx.Get("content-type") == fiber.MIMEApplicationJSON {
			if err := json.Unmarshal(body, in); err == nil {
				retry = false
			}
		}
		if retry {
			if err := ctx.BodyParser(in); err != nil {
				_ = ctx.JSON(fiber.Map{"error": err.Error()})
				return err
			}
		}
		if reqCommon.Debug && reqCommon.RawBody == "" {
			reqCommon.RawBody = string(body)
		}
	}
	reqCommon.FromFiberCtx(ctx, context.Background())
	return nil
}

func rcErr(rc domain.ResponseCommon) error {
	if rc.Error == "" {
		return nil
	}
	return domainErr(rc.Error)
}

func rcStatus(rc domain.ResponseCommon, fallback int) int {
	if rc.StatusCode != 0 {
		return rc.StatusCode
	}
	return fallback
}

type domainErr string

func (e domainErr) Error() string { return string(e) }

func respondRCError(ctx *fiber.Ctx, rc domain.ResponseCommon) error {
	if err := rcErr(rc); err != nil {
		return ctx.Status(rcStatus(rc, http.StatusBadRequest)).SendString(err.Error())
	}
	return nil
}

func execParsed[In any](ctx *fiber.Ctx, req *domain.RequestCommon, in *In, action string, exec func() (any, *domain.ResponseCommon), checkRC bool) error {
	if err := webApiParseInput(ctx, req, in, action); err != nil {
		return nil
	}
	out, rc := exec()
	if checkRC {
		if err := respondRCError(ctx, *rc); err != nil {
			return err
		}
	}
	return req.ToFiberCtx(ctx, out, rc, in)
}
