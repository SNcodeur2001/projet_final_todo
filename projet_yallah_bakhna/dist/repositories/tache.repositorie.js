"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TacheRepository = void 0;
const client_1 = require("@prisma/client");
const mnPrisma = new client_1.PrismaClient();
/**
 * Repository for task data access using Prisma
 * 👉 Rôle : accès DB uniquement (pas de validation Zod ici)
 */
class TacheRepository {
    async findAll() {
        return mnPrisma.tache.findMany();
    }
    async findById(mnId) {
        return mnPrisma.tache.findUnique({
            where: { id: mnId },
        });
    }
    async create(data) {
        return mnPrisma.tache.create({
            data,
        });
    }
    async update(mnId, data) {
        return mnPrisma.tache.update({
            where: { id: mnId },
            data,
        });
    }
    async delete(mnId) {
        return mnPrisma.tache.delete({
            where: { id: mnId },
        });
    }
    async marquerTacheTermine(mnId) {
        return mnPrisma.tache.update({
            where: { id: mnId },
            data: { status: client_1.StatusTache.TERMINE },
        });
    }
    async findTerminees(userId) {
        return mnPrisma.tache.findMany({
            where: {
                userId,
                status: client_1.StatusTache.TERMINE,
                dateFin: {
                    lte: new Date()
                }
            },
        });
    }
}
exports.TacheRepository = TacheRepository;
