import { PrismaClient, ActionHistory, ActionType } from "@prisma/client";

type ActionHistoryCreateData = {
  tacheId: number;
  userId: number;
  action: ActionType;
};

const prisma = new PrismaClient();

export class ActionHistoryRepository {
  async create(data: ActionHistoryCreateData): Promise<ActionHistory> {
    return prisma.actionHistory.create({
      data,
    });
  }

  async findByTacheId(tacheId: number): Promise<ActionHistory[]> {
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