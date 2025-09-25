import { PrismaClient, Tache, StatusTache } from "@prisma/client";

// Type for creating a tache without the user relation
type TacheCreateData = {
  libelle: string;
  description?: string | null;
  status: StatusTache;
  userId: number;
  audioUrl?: string | null; // <- ajout pour l'audio
  dateDebut?: Date | null;
  dateFin?: Date | null;
};

const mnPrisma = new PrismaClient();

/**
 * Repository for task data access using Prisma
 * 👉 Rôle : accès DB uniquement (pas de validation Zod ici)
 */
export class TacheRepository {
  async findAll(): Promise<Tache[]> {
    return mnPrisma.tache.findMany();
  }

  async findById(mnId: number): Promise<Tache | null> {
    return mnPrisma.tache.findUnique({
      where: { id: mnId },
    });
  }

  async create(data: TacheCreateData): Promise<Tache> {
    return mnPrisma.tache.create({
      data,
    });
  }

  async update(mnId: number, data: Partial<TacheCreateData>): Promise<Tache> {
    return mnPrisma.tache.update({
      where: { id: mnId },
      data,
    });
  }

  async delete(mnId: number): Promise<Tache> {
    return mnPrisma.tache.delete({
      where: { id: mnId },
    });
  }

  async marquerTacheTermine(mnId: number): Promise<Tache> {
    return mnPrisma.tache.update({
      where: { id: mnId },
      data: { status: StatusTache.TERMINE },
    });
  }
  async findTerminees(userId: number) {
  return mnPrisma.tache.findMany({
    where: {
      userId,
      status: StatusTache.TERMINE,
      dateFin: {
        lte: new Date()
      }
    },
  });
}

}
