package presentation

import (
	"indexer/domain"
	"indexer/model"
)

func execSearch(in *domain.SearchIn, d *domain.Domain) domain.SearchOut {
	in.Normalize()
	res, rc := d.SearchPageResult(in.Q, in.Kind, in.Limit, in.Offset)
	return domain.SearchOut{ResponseCommon: rc, SearchPage: res}
}

func execSuggest(in *domain.SuggestIn, d *domain.Domain) domain.SuggestOut {
	res, rc := d.SuggestPathResult(in.PathValue())
	return domain.SuggestOut{ResponseCommon: rc, SuggestPathResult: res}
}

func execSuggestSubtitle(in *domain.SuggestIn, d *domain.Domain) domain.SubtitleSuggestOut {
	res, rc := d.SuggestSubtitleRenameResult(in.PathValue())
	return domain.SubtitleSuggestOut{ResponseCommon: rc, SubtitleSuggestResult: res}
}

func execScanSubtitles(in *domain.SubtitleScanIn, d *domain.Domain) ([]model.SubtitleRenameCandidate, domain.ResponseCommon) {
	return d.ScanSubtitleRenameCandidatesResult(in.PathValue(), in.LimitValue())
}

func execCategorizePreview(in domain.CategorizePreviewIn, d *domain.Domain) domain.CategorizePreviewOut {
	res, rc := d.CategorizePreviewResult(in.PathValue(), in.PreviewLimit, in.Options())
	return domain.CategorizePreviewOut{ResponseCommon: rc, CategorizePreview: res}
}
