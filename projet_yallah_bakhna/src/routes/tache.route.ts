import { Router } from "express";
import { TacheController } from "../controllers/tache.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { upload } from "../utils/upload";

const mnRouter = Router();
const mnController = new TacheController();

mnRouter.use(authenticateJWT);

// Routes de base pour les tâches
mnRouter.post(
  "/", 
  upload.single("audio"), // <-- multer intercepte un fichier "audio"
  mnController.create.bind(mnController)
);
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
mnRouter.post("/:id/attachments", upload.single('file'), mnController.uploadAttachment.bind(mnController));
mnRouter.get("/:id/attachments", mnController.getTacheAttachments.bind(mnController));
mnRouter.delete("/attachments/:attachmentId", mnController.deleteAttachment.bind(mnController));

// Route pour l'historique des actions
mnRouter.get("/:id/history", mnController.getActionHistory.bind(mnController));

export default mnRouter;
