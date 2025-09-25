"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mnUpdateTacheSchema = exports.mnCreateTacheSchema = void 0;
const zod_1 = require("zod");
exports.mnCreateTacheSchema = zod_1.z.object({
    libelle: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().min(3).max(255).optional(),
    status: zod_1.z.enum(["EN_ATTENTE", "EN_COURS", "TERMINE"]).default("EN_ATTENTE"),
    audioUrl: zod_1.z.string().url().optional(), // <-- ajout pour l’audio
    dateDebut: zod_1.z.string().datetime().optional(),
    dateFin: zod_1.z.string().datetime().optional()
});
// Pour les mises à jour partielles
exports.mnUpdateTacheSchema = exports.mnCreateTacheSchema.partial();
