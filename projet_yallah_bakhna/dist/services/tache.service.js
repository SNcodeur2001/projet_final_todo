"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TacheService = void 0;
const tache_repositorie_1 = require("../repositories/tache.repositorie");
const actionHistory_repository_1 = require("../repositories/actionHistory.repository");
const permission_service_1 = require("./permission.service");
const attachment_service_1 = require("./attachment.service");
const client_1 = require("@prisma/client");
const tache_validator_1 = require("../validators/tache.validator");
class TacheService {
    constructor() {
        this.mnTacheRepository = new tache_repositorie_1.TacheRepository();
        this.actionHistoryRepository = new actionHistory_repository_1.ActionHistoryRepository();
        this.permissionService = new permission_service_1.PermissionService();
        this.attachmentService = new attachment_service_1.AttachmentService();
    }
    async getAllTaches() {
        return this.mnTacheRepository.findAll();
    }
    async findTacheById(mnId) {
        const mnTache = await this.mnTacheRepository.findById(mnId);
        if (!mnTache) {
            throw new Error(`Tâche avec id ${mnId} introuvable`);
        }
        return mnTache;
    }
    async getTacheById(mnId, userId) {
        const mnTache = await this.findTacheById(mnId);
        // Log the read action
        await this.actionHistoryRepository.create({
            tacheId: mnId,
            userId,
            action: client_1.ActionType.READ,
        });
        return mnTache;
    }
    async createTache(mnData) {
        const { userId, ...dataToParse } = mnData;
        const mnParsed = tache_validator_1.mnCreateTacheSchema.parse(dataToParse);
        const dataToCreate = {
            ...mnParsed,
            userId,
            dateDebut: mnParsed.dateDebut ? new Date(mnParsed.dateDebut) : null,
            dateFin: mnParsed.dateFin ? new Date(mnParsed.dateFin) : null,
        };
        return this.mnTacheRepository.create(dataToCreate);
    }
    async updateTache(mnId, mnData, userId) {
        const canModify = await this.permissionService.checkUserCanModifyTache(mnId, userId);
        if (!canModify) {
            throw new Error("Accès interdit : vous n'avez pas les permissions pour modifier cette tâche");
        }
        const mnParsed = tache_validator_1.mnUpdateTacheSchema.parse(mnData);
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
            action: client_1.ActionType.MODIFY,
        });
        return result;
    }
    async deleteTache(mnId, userId) {
        const canDelete = await this.permissionService.checkUserCanDeleteTache(mnId, userId);
        if (!canDelete) {
            throw new Error("Accès interdit : vous n'avez pas les permissions pour supprimer cette tâche");
        }
        // Log the delete action before deleting
        await this.actionHistoryRepository.create({
            tacheId: mnId,
            userId,
            action: client_1.ActionType.DELETE,
        });
        return this.mnTacheRepository.delete(mnId);
    }
    async marquerTacheTermine(mnId, userId) {
        const canModify = await this.permissionService.checkUserCanModifyTache(mnId, userId);
        if (!canModify) {
            throw new Error("Accès interdit : vous n'avez pas les permissions pour modifier cette tâche");
        }
        const result = await this.mnTacheRepository.marquerTacheTermine(mnId);
        // Log the modify action
        await this.actionHistoryRepository.create({
            tacheId: mnId,
            userId,
            action: client_1.ActionType.MODIFY,
        });
        return result;
    }
    // Nouvelles méthodes pour les permissions
    async assignPermission(tacheId, targetUserId, permission, creatorUserId) {
        // Vérifier que l'utilisateur est le créateur de la tâche
        const tache = await this.findTacheById(tacheId);
        if (tache.userId !== creatorUserId) {
            throw new Error("Seul le créateur de la tâche peut attribuer des permissions");
        }
        // Log the modify action
        await this.actionHistoryRepository.create({
            tacheId,
            userId: creatorUserId,
            action: client_1.ActionType.MODIFY,
        });
        return this.permissionService.assignPermission({
            tacheId,
            userId: targetUserId,
            permission: permission
        });
    }
    async getTachePermissions(tacheId, userId) {
        // Vérifier que l'utilisateur est le créateur de la tâche
        const tache = await this.findTacheById(tacheId);
        if (tache.userId !== userId) {
            throw new Error("Seul le créateur de la tâche peut voir les permissions");
        }
        return this.permissionService.getTachePermissions(tacheId);
    }
    async removePermission(tacheId, targetUserId, creatorUserId) {
        // Vérifier que l'utilisateur est le créateur de la tâche
        const tache = await this.findTacheById(tacheId);
        if (tache.userId !== creatorUserId) {
            throw new Error("Seul le créateur de la tâche peut retirer des permissions");
        }
        // Log the modify action
        await this.actionHistoryRepository.create({
            tacheId,
            userId: creatorUserId,
            action: client_1.ActionType.MODIFY,
        });
        return this.permissionService.removePermission(tacheId, targetUserId);
    }
    // Nouvelles méthodes pour les pièces jointes
    async addAttachment(tacheId, fileData, userId) {
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
            action: client_1.ActionType.MODIFY,
        });
        return result;
    }
    async getTacheAttachments(tacheId, userId) {
        // const canRead = await this.permissionService.checkUserCanReadTache(tacheId, userId);
        // if (!canRead) {
        //   throw new Error("Accès interdit : vous n'avez pas les permissions pour voir cette tâche");
        // }
        return this.attachmentService.getAttachmentsByTacheId(tacheId);
    }
    async deleteAttachment(attachmentId, userId) {
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
            action: client_1.ActionType.MODIFY,
        });
        return result;
    }
    async getActionHistory(tacheId, userId) {
        // Check if user can read the task
        const canRead = await this.permissionService.checkUserCanReadTache(tacheId, userId);
        if (!canRead) {
            throw new Error("Accès interdit : vous n'avez pas les permissions pour voir cette tâche");
        }
        return this.actionHistoryRepository.findByTacheId(tacheId);
    }
    async getTachesTerminees(userId) {
        return this.mnTacheRepository.findTerminees(userId);
    }
}
exports.TacheService = TacheService;
