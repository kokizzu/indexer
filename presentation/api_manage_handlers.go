package presentation

import (
	"github.com/gofiber/fiber/v2"

	"indexer/domain"
)

func moveHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := moveIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.MoveAction, func() (any, *domain.ResponseCommon) {
			out := execMove(&in, d)
			return out, &out.ResponseCommon
		}, true)
	}
}

func renameHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := renameIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.RenameAction, func() (any, *domain.ResponseCommon) {
			out := execRename(&in, d)
			return out, &out.ResponseCommon
		}, true)
	}
}

func deleteHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := deleteIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.DeleteAction, func() (any, *domain.ResponseCommon) {
			out := execDelete(&in, d)
			return out, &out.ResponseCommon
		}, true)
	}
}

func manageQueueHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := manageQueueIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.ManageQueueAction, func() (any, *domain.ResponseCommon) {
			out := execManageQueue(in, d)
			return out, &out.ResponseCommon
		}, true)
	}
}

func manageCancelHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := manageQueueIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.ManageCancelAction, func() (any, *domain.ResponseCommon) {
			out := execManageCancel(in, d)
			return out, &out.ResponseCommon
		}, true)
	}
}

func manageRetryHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := manageQueueIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.ManageRetryAction, func() (any, *domain.ResponseCommon) {
			out := execManageRetry(in, d)
			return out, &out.ResponseCommon
		}, true)
	}
}

func manageStatusHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := manageStatusIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.ManageStatusAction, func() (any, *domain.ResponseCommon) {
			out := execManageStatus(in, d)
			return out, &out.ResponseCommon
		}, false)
	}
}

func manageHistoryHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := manageHistoryIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.ManageHistoryAction, func() (any, *domain.ResponseCommon) {
			out, rc := execManageHistory(&in, d)
			return out, &rc
		}, true)
	}
}

func backupConfigHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := backupConfigIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.BackupConfigAction, func() (any, *domain.ResponseCommon) {
			out := execBackupConfig(in, d)
			return out, &out.ResponseCommon
		}, true)
	}
}

func backupEstimateHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := backupEstimateIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.BackupEstimateAction, func() (any, *domain.ResponseCommon) {
			out := execBackupEstimate(in, d)
			return out, &out.ResponseCommon
		}, true)
	}
}

func backupRunHandler(d *domain.Domain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		in := backupRunIn{}
		return execParsed(c, &in.RequestCommon, &in, domain.BackupRunAction, func() (any, *domain.ResponseCommon) {
			out := execBackupRun(in, d)
			return out, &out.ResponseCommon
		}, true)
	}
}
