import { PrismaClient, PermissionType } from "@prisma/client";

const prisma = new PrismaClient();

export class PermissionService {
  async assignPermission(data: {
    tacheId: number;
    userId: number;
    permission: PermissionType;
  }) {
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

  async getUserPermissionForTache(tacheId: number, userId: number) {
    return prisma.tachePermission.findUnique({
      where: {
        tacheId_userId: {
          tacheId,
          userId
        }
      }
    });
  }

  async getTachePermissions(tacheId: number) {
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

  async removePermission(tacheId: number, userId: number) {
    return prisma.tachePermission.delete({
      where: {
        tacheId_userId: {
          tacheId,
          userId
        }
      }
    });
  }

  async checkUserCanModifyTache(tacheId: number, userId: number): Promise<boolean> {
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
    return !!(permission && (permission.permission === PermissionType.MODIFY_ONLY || permission.permission === PermissionType.FULL_ACCESS));
  }

  async checkUserCanDeleteTache(tacheId: number, userId: number): Promise<boolean> {
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
    return !!(permission && permission.permission === PermissionType.FULL_ACCESS);
  }

  async checkUserCanReadTache(tacheId: number, userId: number): Promise<boolean> {
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