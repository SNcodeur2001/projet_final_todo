import { Request, Response } from "express";
import { TacheService } from "../services/tache.service";
import { upload } from "../utils/upload";
import { assignPermissionSchema } from "../validators/permission.validator";

const mnTacheService = new TacheService();

export class TacheController {
  private async handleRequest(
    res: Response,
    callback: () => Promise<any>,
    successStatus = 200
  ) {
    try {
      const data = await callback();
      res.status(successStatus).json({ status: "success", data });
    } catch (mnError: any) {
      const statusCode =
        mnError.message?.includes("introuvable") ||
        mnError.message?.includes("ID") ||
        mnError.message?.includes("Accès interdit")
          ? 403
          : 400;

      res
        .status(statusCode)
        .json({ status: "error", message: mnError.message });
    }
  }

  getAll(req: Request, res: Response) {
    return this.handleRequest(res, () => mnTacheService.getAllTaches());
  }

  getById(req: Request, res: Response) {
    const mnId = Number(req.params.id);
    const userId = req.user.userId;
    return this.handleRequest(res, () =>
      mnTacheService.getTacheById(mnId, userId)
    );
  }

  create(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const userId = req.user.userId;
        const data: any = { ...req.body, userId };

        if (req.file) {
          const host = req.protocol + "://" + req.get("host"); // ex: http://localhost:3000
          data.audioUrl = `${host}/uploads/audio/${req.file.filename}`;
        }

        return mnTacheService.createTache(data);
      },
      201
    );
  }

  update(req: Request, res: Response) {
    const mnId = Number(req.params.id);
    const userId = req.user.userId;
    return this.handleRequest(res, () =>
      mnTacheService.updateTache(mnId, req.body, userId)
    );
  }

  delete(req: Request, res: Response) {
    const mnId = Number(req.params.id);
    const userId = req.user.userId;
    return this.handleRequest(res, () =>
      mnTacheService.deleteTache(mnId, userId)
    );
  }

  marquerTermine(req: Request, res: Response) {
    const mnId = Number(req.params.id);
    const userId = req.user.userId;
    return this.handleRequest(res, () =>
      mnTacheService.marquerTacheTermine(mnId, userId)
    );
  }

  // Nouvelles méthodes pour les permissions
  assignPermission(req: Request, res: Response) {
    const tacheId = Number(req.params.id);
    const creatorUserId = req.user.userId;

    return this.handleRequest(res, () => {
      const validatedData = assignPermissionSchema.parse(req.body);
      return mnTacheService.assignPermission(
        tacheId,
        validatedData.userId,
        validatedData.permission,
        creatorUserId
      );
    });
  }

  getTachePermissions(req: Request, res: Response) {
    const tacheId = Number(req.params.id);
    const userId = req.user.userId;

    return this.handleRequest(res, () =>
      mnTacheService.getTachePermissions(tacheId, userId)
    );
  }

  removePermission(req: Request, res: Response) {
    const tacheId = Number(req.params.id);
    const targetUserId = Number(req.params.userId);
    const creatorUserId = req.user.userId;

    return this.handleRequest(res, () =>
      mnTacheService.removePermission(tacheId, targetUserId, creatorUserId)
    );
  }

  async uploadAttachment(req: Request, res: Response) {
    try {
      const tacheId = Number(req.params.id);
      const userId = req.user.userId;

      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "Aucun fichier fourni",
        });
      }

      const fileData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };

      const attachment = await mnTacheService.addAttachment(
        tacheId,
        fileData,
        userId
      );

      res.status(201).json({ status: "success", data: attachment });
    } catch (mnError: any) {
      const statusCode = mnError.message?.includes("Accès interdit")
        ? 403
        : 400;
      res
        .status(statusCode)
        .json({ status: "error", message: mnError.message });
    }
  }

  getTacheAttachments(req: Request, res: Response) {
    const tacheId = Number(req.params.id);
    const userId = req.user.userId;

    return this.handleRequest(res, () =>
      mnTacheService.getTacheAttachments(tacheId, userId)
    );
  }

  deleteAttachment(req: Request, res: Response) {
    const attachmentId = Number(req.params.attachmentId);
    const userId = req.user.userId;

    return this.handleRequest(res, () =>
      mnTacheService.deleteAttachment(attachmentId, userId)
    );
  }

  getActionHistory(req: Request, res: Response) {
    const tacheId = Number(req.params.id);
    const userId = req.user.userId;

    return this.handleRequest(res, () =>
      mnTacheService.getActionHistory(tacheId, userId)
    );
  }

  getTachesTerminees(req: Request, res: Response) {
  const userId = req.user.userId;
  return this.handleRequest(res, () =>
    mnTacheService.getTachesTerminees(userId)
  );
}

}
