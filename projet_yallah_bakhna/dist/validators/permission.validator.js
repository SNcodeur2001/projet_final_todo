"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignPermissionSchema = void 0;
const zod_1 = require("zod");
exports.assignPermissionSchema = zod_1.z.object({
    userId: zod_1.z.number().int().positive("L'ID utilisateur doit être un nombre positif"),
    permission: zod_1.z.enum(["READ_ONLY", "MODIFY_ONLY", "FULL_ACCESS"], {
        message: "Permission invalide. Valeurs autorisées: READ_ONLY, MODIFY_ONLY, FULL_ACCESS"
    })
});
