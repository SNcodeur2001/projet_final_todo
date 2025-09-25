"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TacheController = void 0;
const tache_service_1 = require("../services/tache.service");
const permission_validator_1 = require("../validators/permission.validator");
const mnTacheService = new tache_service_1.TacheService();
class TacheController {
    async handleRequest(res, callback, successStatus = 200) {
        try {
            const data = await callback();
            res.status(successStatus).json({ status: "success", data });
        }
        catch (mnError) {
            const statusCode = mnError.message?.includes("introuvable") ||
                mnError.message?.includes("ID") ||
                mnError.message?.includes("Accès interdit")
                ? 403
                : 400;
            res
                .status(statusCode)
                .json({ status: "error", message: mnError.message });
        }
    }
    getAll(req, res) {
        return this.handleRequest(res, () => mnTacheService.getAllTaches());
    }
    getById(req, res) {
        const mnId = Number(req.params.id);
        const userId = req.user.userId;
        return this.handleRequest(res, () => mnTacheService.getTacheById(mnId, userId));
    }
    create(req, res) {
        return this.handleRequest(res, async () => {
            const userId = req.user.userId;
            const data = { ...req.body, userId };
            if (req.file) {
                const host = req.protocol + "://" + req.get("host"); // ex: http://localhost:3000
                data.audioUrl = `${host}/uploads/audio/${req.file.filename}`;
            }
            return mnTacheService.createTache(data);
        }, 201);
    }
    update(req, res) {
        const mnId = Number(req.params.id);
        const userId = req.user.userId;
        return this.handleRequest(res, () => mnTacheService.updateTache(mnId, req.body, userId));
    }
    delete(req, res) {
        const mnId = Number(req.params.id);
        const userId = req.user.userId;
        return this.handleRequest(res, () => mnTacheService.deleteTache(mnId, userId));
    }
    marquerTermine(req, res) {
        const mnId = Number(req.params.id);
        const userId = req.user.userId;
        return this.handleRequest(res, () => mnTacheService.marquerTacheTermine(mnId, userId));
    }
    // Nouvelles méthodes pour les permissions
    assignPermission(req, res) {
        const tacheId = Number(req.params.id);
        const creatorUserId = req.user.userId;
        return this.handleRequest(res, () => {
            const validatedData = permission_validator_1.assignPermissionSchema.parse(req.body);
            return mnTacheService.assignPermission(tacheId, validatedData.userId, validatedData.permission, creatorUserId);
        });
    }
    getTachePermissions(req, res) {
        const tacheId = Number(req.params.id);
        const userId = req.user.userId;
        return this.handleRequest(res, () => mnTacheService.getTachePermissions(tacheId, userId));
    }
    removePermission(req, res) {
        const tacheId = Number(req.params.id);
        const targetUserId = Number(req.params.userId);
        const creatorUserId = req.user.userId;
        return this.handleRequest(res, () => mnTacheService.removePermission(tacheId, targetUserId, creatorUserId));
    }
    async uploadAttachment(req, res) {
        try {
            const tacheId = Number(req.params.id);
            const userId = req.user.userId;
            if (!req.file) {
                return res.status(400).json({
                    status: "error",
                    message: "Aucun fichier fourni",
                });
            }
            // === Ici ===
            const host = req.protocol + "://" + req.get("host");
            const fileUrl = `${host}/uploads/${req.file.mimetype.startsWith("image/") ? "image" : "audio"}/${req.file.filename}`;
            const fileData = {
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                fileUrl, // <-- ajoute cette URL ici
            };
            const attachment = await mnTacheService.addAttachment(tacheId, fileData, userId);
            res.status(201).json({ status: "success", data: attachment });
        }
        catch (mnError) {
            const statusCode = mnError.message?.includes("Accès interdit")
                ? 403
                : 400;
            res
                .status(statusCode)
                .json({ status: "error", message: mnError.message });
        }
    }
    getTacheAttachments(req, res) {
        const tacheId = Number(req.params.id);
        const userId = req.user.userId;
        return this.handleRequest(res, () => mnTacheService.getTacheAttachments(tacheId, userId));
    }
    deleteAttachment(req, res) {
        const attachmentId = Number(req.params.attachmentId);
        const userId = req.user.userId;
        return this.handleRequest(res, () => mnTacheService.deleteAttachment(attachmentId, userId));
    }
    getActionHistory(req, res) {
        const tacheId = Number(req.params.id);
        const userId = req.user.userId;
        return this.handleRequest(res, () => mnTacheService.getActionHistory(tacheId, userId));
    }
    getTachesTerminees(req, res) {
        const userId = req.user.userId;
        return this.handleRequest(res, () => mnTacheService.getTachesTerminees(userId));
    }
}
exports.TacheController = TacheController;
