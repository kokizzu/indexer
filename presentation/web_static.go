package presentation

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

func (w *WebServer) WebStatic(app *fiber.App) {
	app.Get("/favicon.ico", func(c *fiber.Ctx) error {
		return c.Redirect("/favicon.svg", fiber.StatusTemporaryRedirect)
	})
	app.Get("/", func(c *fiber.Ctx) error {
		return views.RenderIndex(c)
	})
	app.Static("/", projectPath("svelte"), fiber.Static{
		Browse: false,
		Next: func(c *fiber.Ctx) bool {
			return strings.HasPrefix(c.Path(), "/api/")
		},
	})
}
