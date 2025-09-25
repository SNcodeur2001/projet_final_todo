import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Démarrage de l\'alimentation de la base de données...');

  // Hash des mots de passe
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedUserPassword = await bcrypt.hash('user123', 10);
  const hashedManagerPassword = await bcrypt.hash('manager123', 10);

  console.log('Création des utilisateurs...');

  // Création des utilisateurs
  const admin = await prisma.user.upsert({
    where: { login: 'admin@yallahbakhna.com' },
    update: {},
    create: {
      nom: 'Système',
      prenom: 'Admin',
      login: 'admin@yallahbakhna.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.upsert({
    where: { login: 'manager@yallahbakhna.com' },
    update: {},
    create: {
      nom: 'Diop',
      prenom: 'Ousmane',
      login: 'manager@yallahbakhna.com',
      password: hashedManagerPassword,
      role: 'ADMIN',
    },
  });

  const users = await Promise.all([
    prisma.user.upsert({
      where: { login: 'aissata.ba@yallahbakhna.com' },
      update: {},
      create: {
        nom: 'Ba',
        prenom: 'Aissata',
        login: 'aissata.ba@yallahbakhna.com',
        password: hashedUserPassword,
        role: 'USER',
      },
    }),
    prisma.user.upsert({
      where: { login: 'moussa.fall@yallahbakhna.com' },
      update: {},
      create: {
        nom: 'Fall',
        prenom: 'Moussa',
        login: 'moussa.fall@yallahbakhna.com',
        password: hashedUserPassword,
        role: 'USER',
      },
    }),
    prisma.user.upsert({
      where: { login: 'fatou.ndiaye@yallahbakhna.com' },
      update: {},
      create: {
        nom: 'Ndiaye',
        prenom: 'Fatou',
        login: 'fatou.ndiaye@yallahbakhna.com',
        password: hashedUserPassword,
        role: 'USER',
      },
    }),
    prisma.user.upsert({
      where: { login: 'omar.seck@yallahbakhna.com' },
      update: {},
      create: {
        nom: 'Seck',
        prenom: 'Omar',
        login: 'omar.seck@yallahbakhna.com',
        password: hashedUserPassword,
        role: 'USER',
      },
    }),
    prisma.user.upsert({
      where: { login: 'aminata.diallo@yallahbakhna.com' },
      update: {},
      create: {
        nom: 'Diallo',
        prenom: 'Aminata',
        login: 'aminata.diallo@yallahbakhna.com',
        password: hashedUserPassword,
        role: 'USER',
      },
    }),
  ]);

  console.log('Création des tâches...');

  // Tâches du Projet E-commerce
  const ecommerceTasks = await Promise.all([
    prisma.tache.create({
      data: {
        libelle: 'Conception de la Base de Données E-commerce',
        description: 'Création du schéma de base de données pour le projet e-commerce incluant les tables produits, commandes, clients et inventaire.',
        status: 'TERMINE',
        userId: users[0].id,
        dateDebut: new Date('2024-09-01'),
        dateFin: new Date('2024-09-10'),
      },
    }),
    prisma.tache.create({
      data: {
        libelle: 'Développement Frontend du Catalogue',
        description: 'Création des composants React pour l\'affichage et le filtrage des produits avec Tailwind CSS.',
        status: 'EN_COURS',
        userId: users[1].id,
        dateDebut: new Date('2024-09-11'),
      },
    }),
    prisma.tache.create({
      data: {
        libelle: 'API de Paiement',
        description: 'Intégration de l\'API Wave et Orange Money pour les paiements.',
        status: 'EN_ATTENTE',
        userId: users[2].id,
        dateDebut: new Date('2024-09-20'),
      },
    }),
  ]);

  // Tâches du Projet Mobile
  const mobileTasks = await Promise.all([
    prisma.tache.create({
      data: {
        libelle: 'Conception UI/UX Application Mobile',
        description: 'Design de l\'interface utilisateur de l\'application mobile avec Figma.',
        status: 'EN_COURS',
        userId: users[3].id,
        dateDebut: new Date('2024-09-05'),
      },
    }),
    prisma.tache.create({
      data: {
        libelle: 'Développement React Native',
        description: 'Implémentation des écrans principaux de l\'application mobile.',
        status: 'EN_ATTENTE',
        userId: users[4].id,
        dateDebut: new Date('2024-09-15'),
      },
    }),
  ]);

  // Tâches Marketing Digital
  const marketingTasks = await Promise.all([
    prisma.tache.create({
      data: {
        libelle: 'Campagne Facebook Ads',
        description: 'Planification et exécution d\'une campagne publicitaire sur Facebook.',
        status: 'EN_COURS',
        userId: users[0].id,
        dateDebut: new Date('2024-09-08'),
      },
    }),
    prisma.tache.create({
      data: {
        libelle: 'Création Contenu Instagram',
        description: 'Production de contenu visuel pour Instagram : photos et stories.',
        status: 'EN_ATTENTE',
        userId: users[1].id,
        dateDebut: new Date('2024-09-18'),
      },
    }),
  ]);

  // Tâches Infrastructure
  const infraTasks = await Promise.all([
    prisma.tache.create({
      data: {
        libelle: 'Configuration Serveur AWS',
        description: 'Mise en place de l\'infrastructure cloud sur AWS avec monitoring.',
        status: 'TERMINE',
        userId: admin.id,
        dateDebut: new Date('2024-09-01'),
        dateFin: new Date('2024-09-07'),
      },
    }),
    prisma.tache.create({
      data: {
        libelle: 'Mise en Place CI/CD',
        description: 'Configuration du pipeline CI/CD avec GitHub Actions.',
        status: 'EN_COURS',
        userId: manager.id,
        dateDebut: new Date('2024-09-10'),
      },
    }),
  ]);

  const allTasks = [
    ...ecommerceTasks,
    ...mobileTasks,
    ...marketingTasks,
    ...infraTasks,
  ];

  console.log('Attribution des permissions...');

  // Création des permissions
  const permissions = [
    // Admin et Manager ont accès total à toutes les tâches
    ...allTasks.map(task => ({
      tacheId: task.id,
      userId: admin.id,
      permission: 'FULL_ACCESS' as const,
    })),
    ...allTasks.map(task => ({
      tacheId: task.id,
      userId: manager.id,
      permission: 'FULL_ACCESS' as const,
    })),
    // Les créateurs ont un accès total à leurs tâches
    ...allTasks.map(task => ({
      tacheId: task.id,
      userId: task.userId,
      permission: 'FULL_ACCESS' as const,
    })),
    // Les autres utilisateurs ont un accès en lecture seule
    ...allTasks.flatMap(task => 
      users
        .filter(user => user.id !== task.userId)
        .map(user => ({
          tacheId: task.id,
          userId: user.id,
          permission: 'READ_ONLY' as const,
        }))
    ),
  ];

  await prisma.tachePermission.createMany({
    data: permissions,
    skipDuplicates: true,
  });

  console.log('Enregistrement de l\'historique des actions...');

  // Création de l'historique des actions
  const actionHistory = [
    // Actions de création par les administrateurs
    ...allTasks.map(task => ({
      tacheId: task.id,
      userId: admin.id,
      action: 'MODIFY' as const,
    })),
    // Actions de modification sur les tâches terminées
    ...allTasks
      .filter(task => task.status === 'TERMINE')
      .map(task => ({
        tacheId: task.id,
        userId: task.userId,
        action: 'MODIFY' as const,
      })),
    // Actions de lecture par tous les utilisateurs
    ...allTasks.flatMap(task =>
      users.map(user => ({
        tacheId: task.id,
        userId: user.id,
        action: 'READ' as const,
      }))
    ),
  ];

  await prisma.actionHistory.createMany({
    data: actionHistory,
    skipDuplicates: true,
  });

  console.log('Base de données alimentée avec succès !');
  console.log('Résumé :');
  console.log(`- ${users.length + 2} utilisateurs créés`);
  console.log(`- ${allTasks.length} tâches créées`);
  console.log(`- ${permissions.length} permissions attribuées`);
  console.log(`- ${actionHistory.length} actions enregistrées`);
}

main()
  .catch((e) => {
    console.error('Erreur lors de l\'alimentation de la base de données:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
