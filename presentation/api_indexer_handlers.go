package presentation

import (
	"net/http"

	"github.com/gofiber/fiber/v2"

	"indexer/domain"
)

func statusHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := statusIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.StatusAction, func() (any, *domain.ResponseCommon) {
			out := execStatus(in, d)
			return out, &out.ResponseCommon
		}, false)
	}
}

func reindexHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := reindexIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.ReindexAction, func() (any, *domain.ResponseCommon) {
			out := execReindex(in, d)
			return out, &out.ResponseCommon
		}, false)
	}
}

func browseHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := browseIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.BrowseAction, func() (any, *domain.ResponseCommon) {
			out, rc := execBrowse(in, d)
			return out, &rc
		}, false)
	}
}

func openHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		path := c.Query("path")
		out, rc := d.OpenFileExternally(path)
		if err := rcErr(rc); err != nil {
			return c.Status(rcStatus(rc, http.StatusBadRequest)).JSON(out)
		}
		return c.JSON(out)
	}
}

func duplicatesHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := duplicatesIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.DuplicatesAction, func() (any, *domain.ResponseCommon) {
			out, rc := execDuplicates(in, d)
			return out, &rc
		}, false)
	}
}
