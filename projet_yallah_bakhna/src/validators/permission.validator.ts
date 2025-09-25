import { z } from "zod";

export const assignPermissionSchema = z.object({
  userId: z.number().int().positive("L'ID utilisateur doit être un nombre positif"),
  permission: z.enum(["READ_ONLY", "MODIFY_ONLY", "FULL_ACCESS"], {
    message: "Permission invalide. Valeurs autorisées: READ_ONLY, MODIFY_ONLY, FULL_ACCESS"
  })
});

export type AssignPermissionData = z.infer<typeof assignPermissionSchema>;