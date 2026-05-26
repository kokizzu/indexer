package presentation

import (
	"indexer/domain"

	"github.com/rs/zerolog"
)

type Cron struct {
	*domain.Domain
	Log *zerolog.Logger
}

func (c *Cron) Start(*zerolog.Logger) {
}
