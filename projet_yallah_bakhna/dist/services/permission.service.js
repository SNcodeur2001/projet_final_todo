"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PermissionService {
    async assignPermission(data) {
        return prisma.tachePermission.upsert({
            where: {
                tacheId_userId: {
                    tacheId: data.tacheId,
                    userId: data.userId
                }
            },
            update: {
                permission: data.permission
            },
            create: data
        });
    }
    async getUserPermissionForTache(tacheId, userId) {
        return prisma.tachePermission.findUnique({
            where: {
                tacheId_userId: {
                    tacheId,
                    userId
                }
            }
        });
    }
    async getTachePermissions(tacheId) {
        return prisma.tachePermission.findMany({
            where: { tacheId },
            include: {
                user: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        login: true
                    }
                }
            }
        });
    }
    async removePermission(tacheId, userId) {
        return prisma.tachePermission.delete({
            where: {
                tacheId_userId: {
                    tacheId,
                    userId
                }
            }
        });
    }
    async checkUserCanModifyTache(tacheId, userId) {
        // Vérifier si l'utilisateur est le créateur de la tâche
        const tache = await prisma.tache.findUnique({
            where: { id: tacheId }
        });
        if (!tache) {
            return false;
        }
        // Si c'est le créateur, il peut toujours modifier
        if (tache.userId === userId) {
            return true;
        }
        // Vérifier les permissions accordées
        const permission = await this.getUserPermissionForTache(tacheId, userId);
        return !!(permission && (permission.permission === client_1.PermissionType.MODIFY_ONLY || permission.permission === client_1.PermissionType.FULL_ACCESS));
    }
    async checkUserCanDeleteTache(tacheId, userId) {
        // Vérifier si l'utilisateur est le créateur de la tâche
        const tache = await prisma.tache.findUnique({
            where: { id: tacheId }
        });
        if (!tache) {
            return false;
        }
        // Si c'est le créateur, il peut toujours supprimer
        if (tache.userId === userId) {
            return true;
        }
        // Vérifier les permissions accordées (seul FULL_ACCESS permet la suppression)
        const permission = await this.getUserPermissionForTache(tacheId, userId);
        return !!(permission && permission.permission === client_1.PermissionType.FULL_ACCESS);
    }
    async checkUserCanReadTache(tacheId, userId) {
        // Vérifier si l'utilisateur est le créateur de la tâche
        const tache = await prisma.tache.findUnique({
            where: { id: tacheId }
        });
        if (!tache) {
            return false;
        }
        // Si c'est le créateur, il peut toujours lire
        if (tache.userId === userId) {
            return true;
        }
        // Vérifier les permissions accordées (toutes les permissions permettent la lecture)
        const permission = await this.getUserPermissionForTache(tacheId, userId);
        return !!permission;
    }
}
exports.PermissionService = PermissionService;
