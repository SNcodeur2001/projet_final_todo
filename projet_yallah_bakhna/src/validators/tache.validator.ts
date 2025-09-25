import { z } from "zod";

export const mnCreateTacheSchema = z.object({
  libelle: z.string().min(3).max(100),
  description: z.string().min(3).max(255).optional(),
  status: z.enum(["EN_ATTENTE", "EN_COURS", "TERMINE"]).default("EN_ATTENTE"),
  audioUrl: z.string().url().optional(), // <-- ajout pour l’audio
   dateDebut: z.string().datetime().optional(),
  dateFin: z.string().datetime().optional()
});

// Pour les mises à jour partielles
export const mnUpdateTacheSchema = mnCreateTacheSchema.partial();
