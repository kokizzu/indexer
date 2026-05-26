package presentation

import (
	"strings"

	"github.com/gofiber/fiber/v2"

	"indexer/domain"
)

func searchHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := searchIn{}
		if err := webApiParseInput(c, &in.RequestCommon, &in, domain.SearchAction); err != nil {
			return nil
		}
		in.Kind = strings.TrimSpace(c.Query("kind", in.Kind))
		out := execSearch(&in, d)
		return in.RequestCommon.ToFiberCtx(c, out, &out.ResponseCommon, &in)
	}
}

func suggestHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := suggestIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.SuggestAction, func() (any, *domain.ResponseCommon) {
			out := execSuggest(&in, d)
			return out, &out.ResponseCommon
		}, false)
	}
}

func suggestSubtitleHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := suggestIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.SuggestSubtitleAction, func() (any, *domain.ResponseCommon) {
			out := execSuggestSubtitle(&in, d)
			return out, &out.ResponseCommon
		}, false)
	}
}

func scanSubtitlesHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := subtitleScanIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.ScanSubtitlesAction, func() (any, *domain.ResponseCommon) {
			out, rc := execScanSubtitles(&in, d)
			return out, &rc
		}, false)
	}
}

func categorizePreviewHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := categorizePreviewIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.CategorizePreviewAction, func() (any, *domain.ResponseCommon) {
			out := execCategorizePreview(in, d)
			return out, &out.ResponseCommon
		}, false)
	}
}
