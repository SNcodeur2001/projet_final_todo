"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Cron qui tourne toutes les minutes
node_cron_1.default.schedule('* * * * *', async () => {
    const now = new Date();
    const tasksToClose = await prisma.tache.findMany({
        where: {
            dateFin: {
                lt: now,
            },
            status: {
                not: client_1.StatusTache.TERMINE,
            },
        },
    });
    for (const tache of tasksToClose) {
        await prisma.tache.update({
            where: { id: tache.id },
            data: { status: client_1.StatusTache.TERMINE },
        });
        console.log(`✅ Tâche ${tache.id} automatiquement marquée comme terminée`);
    }
});
