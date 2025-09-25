"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionHistoryRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ActionHistoryRepository {
    async create(data) {
        return prisma.actionHistory.create({
            data,
        });
    }
    async findByTacheId(tacheId) {
        return prisma.actionHistory.findMany({
            where: { tacheId },
            include: {
                user: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        login: true,
                    },
                },
                tache: {
                    select: {
                        id: true,
                        libelle: true,
                    },
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
        });
    }
}
exports.ActionHistoryRepository = ActionHistoryRepository;
