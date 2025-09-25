"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tache_controller_1 = require("../controllers/tache.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_1 = require("../utils/upload");
const mnRouter = (0, express_1.Router)();
const mnController = new tache_controller_1.TacheController();
mnRouter.use(auth_middleware_1.authenticateJWT);
// Routes de base pour les tâches
mnRouter.post("/", upload_1.upload.single("audio"), // <-- multer intercepte un fichier "audio"
mnController.create.bind(mnController));
mnRouter.get("/", mnController.getAll.bind(mnController));
mnRouter.get("/terminees", mnController.getTachesTerminees.bind(mnController));
mnRouter.get("/:id", mnController.getById.bind(mnController));
mnRouter.put("/:id", mnController.update.bind(mnController));
mnRouter.delete("/:id", mnController.delete.bind(mnController));
mnRouter.patch("/:id/termine", mnController.marquerTermine.bind(mnController));
// Routes pour les permissions
mnRouter.post("/:id/permissions", mnController.assignPermission.bind(mnController));
mnRouter.get("/:id/permissions", mnController.getTachePermissions.bind(mnController));
mnRouter.delete("/:id/permissions/:userId", mnController.removePermission.bind(mnController));
// Routes pour les pièces jointes
mnRouter.post("/:id/attachments", upload_1.upload.single('file'), mnController.uploadAttachment.bind(mnController));
mnRouter.get("/:id/attachments", mnController.getTacheAttachments.bind(mnController));
mnRouter.delete("/attachments/:attachmentId", mnController.deleteAttachment.bind(mnController));
// Route pour l'historique des actions
mnRouter.get("/:id/history", mnController.getActionHistory.bind(mnController));
exports.default = mnRouter;
