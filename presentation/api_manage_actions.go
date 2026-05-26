package presentation

import (
	"indexer/domain"
	"indexer/model"
)

func execMove(in *domain.MoveIn, d *domain.Domain) domain.ActionOut {
	res, rc := d.MoveNowResult(in.RequestCommon, in.Password, in.SrcPath, in.DstDir, in.Confirm)
	return domain.ActionOut{ResponseCommon: rc, ActionResponse: res}
}

func execRename(in *domain.RenameIn, d *domain.Domain) domain.ActionOut {
	res, rc := d.RenameNowResult(in.RequestCommon, in.Password, in.OldPath, in.NewPath, in.Confirm)
	return domain.ActionOut{ResponseCommon: rc, ActionResponse: res}
}

func execDelete(in *domain.DeleteIn, d *domain.Domain) domain.ActionOut {
	res, rc := d.DeleteNowResult(in.RequestCommon, in.Password, in.Path, in.Confirm)
	return domain.ActionOut{ResponseCommon: rc, ActionResponse: res}
}

func execManageQueue(in domain.ManageQueueIn, d *domain.Domain) domain.ActionOut {
	res, rc := d.QueueManageResult(in.RequestCommon, in.ActionValue(), in.Password, in.SrcPath, in.DstDir, in.NewPath, domain.CategorizeOptions{
		VideosOnly:      in.VideosOnly,
		WatchedCount:    in.WatchedCount,
		RemoveEmptyDirs: in.RemoveEmptyDirs,
	})
	return domain.ActionOut{ResponseCommon: rc, ActionResponse: res}
}

func execManageCancel(in domain.ManageQueueIn, d *domain.Domain) domain.ActionOut {
	res, rc := d.CancelManageTaskResult(in.ID)
	return domain.ActionOut{ResponseCommon: rc, ActionResponse: res}
}

func execManageRetry(in domain.ManageQueueIn, d *domain.Domain) domain.ActionOut {
	res, rc := d.RetryManageTaskResult(in.Password, in.ID)
	return domain.ActionOut{ResponseCommon: rc, ActionResponse: res}
}

func execManageStatus(_ domain.ManageStatusIn, d *domain.Domain) domain.ManageStatusOut {
	res, rc := d.ManageStatusResult()
	return domain.ManageStatusOut{ResponseCommon: rc, ManageQueueStatus: res}
}

func execManageHistory(in *domain.ManageHistoryIn, d *domain.Domain) ([]model.ManageHistoryEntry, domain.ResponseCommon) {
	return d.ManageHistoryResult(in.LimitValue())
}
