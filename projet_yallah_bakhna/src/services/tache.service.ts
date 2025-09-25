import { TacheRepository } from "../repositories/tache.repositorie";
import { ActionHistoryRepository } from "../repositories/actionHistory.repository";
import { PermissionService } from "./permission.service";
import { AttachmentService } from "./attachment.service";
import { ActionType } from "@prisma/client";
import {
  mnCreateTacheSchema,
  mnUpdateTacheSchema,
} from "../validators/tache.validator";

export class TacheService {
  private mnTacheRepository: TacheRepository;
  private actionHistoryRepository: ActionHistoryRepository;
  private permissionService: PermissionService;
  private attachmentService: AttachmentService;

  constructor() {
    this.mnTacheRepository = new TacheRepository();
    this.actionHistoryRepository = new ActionHistoryRepository();
    this.permissionService = new PermissionService();
    this.attachmentService = new AttachmentService();
  }

  async getAllTaches() {
    return this.mnTacheRepository.findAll();
  }

  private async findTacheById(mnId: number) {
    const mnTache = await this.mnTacheRepository.findById(mnId);
    if (!mnTache) {
      throw new Error(`Tâche avec id ${mnId} introuvable`);
    }
    return mnTache;
  }

  async getTacheById(mnId: number, userId: number) {
    const mnTache = await this.findTacheById(mnId);
    // Log the read action
    await this.actionHistoryRepository.create({
      tacheId: mnId,
      userId,
      action: ActionType.READ,
    });
    return mnTache;
  }

  async createTache(mnData: unknown & { userId: number }) {
    const { userId, ...dataToParse } = mnData;
    const mnParsed = mnCreateTacheSchema.parse(dataToParse);
    const dataToCreate = {
      ...mnParsed,
      userId,
      dateDebut: mnParsed.dateDebut ? new Date(mnParsed.dateDebut) : null,
      dateFin: mnParsed.dateFin ? new Date(mnParsed.dateFin) : null,
    };
    return this.mnTacheRepository.create(dataToCreate);
  }

  async updateTache(mnId: number, mnData: unknown, userId: number) {
    const canModify = await this.permissionService.checkUserCanModifyTache(mnId, userId);
    if (!canModify) {
      throw new Error("Accès interdit : vous n'avez pas les permissions pour modifier cette tâche");
    }

    const mnParsed = mnUpdateTacheSchema.parse(mnData);
    const dataToUpdate = {
      ...mnParsed,
      dateDebut: mnParsed.dateDebut ? new Date(mnParsed.dateDebut) : undefined,
      dateFin: mnParsed.dateFin ? new Date(mnParsed.dateFin) : undefined,
    };
    const result = await this.mnTacheRepository.update(mnId, dataToUpdate);

    // Log the modify action
    await this.actionHistoryRepository.create({
      tacheId: mnId,
      userId,
      action: ActionType.MODIFY,
    });

    return result;
  }

  async deleteTache(mnId: number, userId: number) {
    const canDelete = await this.permissionService.checkUserCanDeleteTache(mnId, userId);
    if (!canDelete) {
      throw new Error("Accès interdit : vous n'avez pas les permissions pour supprimer cette tâche");
    }

    // Log the delete action before deleting
    await this.actionHistoryRepository.create({
      tacheId: mnId,
      userId,
      action: ActionType.DELETE,
    });

    return this.mnTacheRepository.delete(mnId);
  }

  async marquerTacheTermine(mnId: number, userId: number) {
    const canModify = await this.permissionService.checkUserCanModifyTache(mnId, userId);
    if (!canModify) {
      throw new Error("Accès interdit : vous n'avez pas les permissions pour modifier cette tâche");
    }

    const result = await this.mnTacheRepository.marquerTacheTermine(mnId);

    // Log the modify action
    await this.actionHistoryRepository.create({
      tacheId: mnId,
      userId,
      action: ActionType.MODIFY,
    });

    return result;
  }

  // Nouvelles méthodes pour les permissions
  async assignPermission(tacheId: number, targetUserId: number, permission: string, creatorUserId: number) {
    // Vérifier que l'utilisateur est le créateur de la tâche
    const tache = await this.findTacheById(tacheId);
    if (tache.userId !== creatorUserId) {
      throw new Error("Seul le créateur de la tâche peut attribuer des permissions");
    }

    // Log the modify action
    await this.actionHistoryRepository.create({
      tacheId,
      userId: creatorUserId,
      action: ActionType.MODIFY,
    });

    return this.permissionService.assignPermission({
      tacheId,
      userId: targetUserId,
      permission: permission as any
    });
  }

  async getTachePermissions(tacheId: number, userId: number) {
    // Vérifier que l'utilisateur est le créateur de la tâche
    const tache = await this.findTacheById(tacheId);
    if (tache.userId !== userId) {
      throw new Error("Seul le créateur de la tâche peut voir les permissions");
    }

    return this.permissionService.getTachePermissions(tacheId);
  }

  async removePermission(tacheId: number, targetUserId: number, creatorUserId: number) {
    // Vérifier que l'utilisateur est le créateur de la tâche
    const tache = await this.findTacheById(tacheId);
    if (tache.userId !== creatorUserId) {
      throw new Error("Seul le créateur de la tâche peut retirer des permissions");
    }

    // Log the modify action
    await this.actionHistoryRepository.create({
      tacheId,
      userId: creatorUserId,
      action: ActionType.MODIFY,
    });

    return this.permissionService.removePermission(tacheId, targetUserId);
  }

  // Nouvelles méthodes pour les pièces jointes
  async addAttachment(tacheId: number, fileData: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
  }, userId: number) {
    const canModify = await this.permissionService.checkUserCanModifyTache(tacheId, userId);
    if (!canModify) {
      throw new Error("Accès interdit : vous n'avez pas les permissions pour ajouter des pièces jointes");
    }

    const result = await this.attachmentService.createAttachment({
      tacheId,
      ...fileData
    });

    // Log the modify action
    await this.actionHistoryRepository.create({
      tacheId,
      userId,
      action: ActionType.MODIFY,
    });

    return result;
  }

  async getTacheAttachments(tacheId: number, userId: number) {
    // const canRead = await this.permissionService.checkUserCanReadTache(tacheId, userId);
    // if (!canRead) {
    //   throw new Error("Accès interdit : vous n'avez pas les permissions pour voir cette tâche");
    // }

    return this.attachmentService.getAttachmentsByTacheId(tacheId);
  }

  async deleteAttachment(attachmentId: number, userId: number) {
    const attachment = await this.attachmentService.getAttachmentById(attachmentId);
    if (!attachment) {
      throw new Error("Pièce jointe introuvable");
    }

    const canModify = await this.permissionService.checkUserCanModifyTache(attachment.tacheId, userId);
    if (!canModify) {
      throw new Error("Accès interdit : vous n'avez pas les permissions pour supprimer cette pièce jointe");
    }

    const result = await this.attachmentService.deleteAttachment(attachmentId);

    // Log the modify action
    await this.actionHistoryRepository.create({
      tacheId: attachment.tacheId,
      userId,
      action: ActionType.MODIFY,
    });

    return result;
  }

  async getActionHistory(tacheId: number, userId: number) {
    // Check if user can read the task
    const canRead = await this.permissionService.checkUserCanReadTache(tacheId, userId);
    if (!canRead) {
      throw new Error("Accès interdit : vous n'avez pas les permissions pour voir cette tâche");
    }

    return this.actionHistoryRepository.findByTacheId(tacheId);
  }

  async getTachesTerminees(userId: number) {
  return this.mnTacheRepository.findTerminees(userId);
}

}
