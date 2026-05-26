package domain

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

type RequestCommon struct {
	TracerContext context.Context `json:"-" form:"tracerContext" query:"tracerContext"`
	RequestId     string          `json:"requestId,omitempty" form:"requestId" query:"requestId"`
	UserAgent     string          `json:"userAgent,omitempty" form:"userAgent" query:"userAgent"`
	IpAddress     string          `json:"ipAddress,omitempty" form:"ipAddress" query:"ipAddress"`
	OutputFormat  string          `json:"outputFormat,omitempty" form:"outputFormat" query:"outputFormat"`
	Debug         bool            `json:"debug,omitempty" form:"debug" query:"debug"`
	Host          string          `json:"host,omitempty" form:"host" query:"host"`
	Action        string          `json:"-" form:"-" query:"-"`
	RawBody       string          `json:"rawBody,omitempty" form:"rawBody" query:"rawBody"`
	start         time.Time       `json:"-"`
}

func (r *RequestCommon) FromFiberCtx(ctx *fiber.Ctx, tracerCtx context.Context) {
	r.RequestId = ctx.GetRespHeader("X-Request-Id")
	if r.RequestId == "" {
		r.RequestId = strconv.FormatInt(time.Now().UnixNano(), 36)
	}
	r.UserAgent = string(ctx.Request().Header.UserAgent())
	r.IpAddress = ctx.IP()
	r.Host = ctx.Protocol() + "://" + ctx.Hostname()
	r.TracerContext = tracerCtx
	r.start = time.Now()
}

func (r *RequestCommon) ToFiberCtx(ctx *fiber.Ctx, out any, rc *ResponseCommon, in any) error {
	if rc.StatusCode != 0 && rc.StatusCode != http.StatusOK {
		ctx.Status(rc.StatusCode)
	}
	if rc.Redirect != "" {
		return ctx.Redirect(rc.Redirect, rc.StatusCode)
	}
	ctx.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)
	if r.Debug {
		rc.Debug = in
	}
	byt, err := json.Marshal(out)
	if err != nil {
		return err
	}
	_, err = ctx.Write(byt)
	return err
}

func (r *RequestCommon) ToCli(outW io.Writer, errW io.Writer, out any, rc ResponseCommon) {
	byt, err := json.MarshalIndent(out, "", "  ")
	if err != nil {
		return
	}
	_, _ = outW.Write(byt)
	meta, err := json.MarshalIndent(map[string]any{
		"statusCode": rc.StatusCode,
		"redirect":   rc.Redirect,
		"error":      rc.Error,
		"debug":      rc.Debug,
		"requestId":  r.RequestId,
	}, "", "  ")
	if err != nil {
		return
	}
	_, _ = errW.Write(meta)
}

func (r *RequestCommon) FromCli(action string, payload []byte, in any) bool {
	if len(payload) > 0 {
		if err := json.Unmarshal(payload, in); err != nil {
			return false
		}
	}
	r.RequestId = strconv.FormatInt(time.Now().UnixNano(), 36)
	r.UserAgent = "CLI"
	r.IpAddress = "127.0.0.1"
	r.TracerContext = context.Background()
	r.start = time.Now()
	r.Action = action
	r.OutputFormat = "json"
	if len(payload) > 0 {
		r.RawBody = string(payload)
	}
	return true
}

type ResponseCommon struct {
	Error      string `json:"error,omitempty"`
	StatusCode int    `json:"status,omitempty"`
	Debug      any    `json:"debug,omitempty"`
	Redirect   string `json:"redirect,omitempty"`
}

func (r *ResponseCommon) SetError(code int, err string) {
	r.StatusCode = code
	r.Error = err
}

func (r *ResponseCommon) HasError() bool {
	return r.StatusCode >= 400 || r.Error != ""
}
