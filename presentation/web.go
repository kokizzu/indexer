package presentation

import (
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"indexer/domain"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/rs/zerolog"
)

type WebServer struct {
	Domain *domain.Domain
}

var views *Views

func (w *WebServer) App() *fiber.App {
	app := fiber.New(fiber.Config{
		ProxyHeader: "X-Real-IP",
	})
	app.Use(logger.New(logger.Config{
		Next: func(c *fiber.Ctx) bool {
			return !strings.HasPrefix(c.Path(), "/api/")
		},
	}))
	app.Use(recover.New())

	views = &Views{}
	views.LoadAll()

	w.WebStatic(app)
	ApiRoutes(app, w.Domain)
	return app
}

func (w *WebServer) Start(_ *zerolog.Logger) {
	log.Fatal(w.App().Listen(w.Domain.Cfg.Addr))
}

func (w *WebServer) Handler() http.Handler {
	return adaptor.FiberApp(w.App())
}

func (w *WebServer) handleIndex(rw http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(rw, r)
		return
	}
	data, err := os.ReadFile(builtSveltePath("index.html"))
	if err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}
	rw.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = io.Copy(rw, strings.NewReader(string(data)))
}
