package presentation

import (
	"indexer/domain"
	"indexer/model"
)

func execStatus(in domain.StatusIn, d *domain.Domain) domain.StatusOut {
	res, rc := d.StatusResult()
	return domain.StatusOut{ResponseCommon: rc, Status: res}
}

func execReindex(in domain.ReindexIn, d *domain.Domain) domain.ReindexOut {
	res, rc := d.StartReindexResult(in.PriorityValue())
	return domain.ReindexOut{ResponseCommon: rc, ActionResponse: res}
}

func execBrowse(in domain.BrowseIn, d *domain.Domain) ([]model.BrowseEntry, domain.ResponseCommon) {
	return d.BrowseResult(in.PathValue())
}

func execDuplicates(_ domain.DuplicatesIn, d *domain.Domain) ([]model.DuplicateGroup, domain.ResponseCommon) {
	return d.DuplicatesResult()
}
