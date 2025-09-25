import cron from 'node-cron';
import { PrismaClient, StatusTache } from '@prisma/client';

const prisma = new PrismaClient();

// Cron qui tourne toutes les minutes
cron.schedule('* * * * *', async () => {
  const now = new Date();

  const tasksToClose = await prisma.tache.findMany({
    where: {
      dateFin: {
        lt: now,
      },
      status: {
        not: StatusTache.TERMINE,
      },
    },
  });

  for (const tache of tasksToClose) {
    await prisma.tache.update({
      where: { id: tache.id },
      data: { status: StatusTache.TERMINE },
    });

    console.log(`✅ Tâche ${tache.id} automatiquement marquée comme terminée`);
  }
});
