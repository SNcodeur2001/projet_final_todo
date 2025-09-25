"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mnCreateUserSchema = exports.mnLoginSchema = void 0;
const zod_1 = require("zod");
exports.mnLoginSchema = zod_1.z.object({
    login: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6),
});
exports.mnCreateUserSchema = zod_1.z.object({
    nom: zod_1.z.string().min(2),
    prenom: zod_1.z.string().min(2),
    login: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['ADMIN', 'USER']).optional(),
});
