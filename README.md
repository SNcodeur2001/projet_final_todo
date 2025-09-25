# Yallah Bakhna - Application de Gestion des Tâches

Une application complète de gestion des tâches construite avec React (frontend) et Node.js/TypeScript avec Prisma (backend). Gérez les tâches, les utilisateurs, les permissions, les pièces jointes et suivez les actions dans un environnement collaboratif.

## Fonctionnalités

- **Authentification Utilisateur**: Connexion/Inscription avec authentification basée sur JWT et accès basé sur les rôles (Admin/Utilisateur).
- **Gestion des Tâches**: Créez, mettez à jour, assignez et suivez les tâches avec des statuts (En Attente, En Cours, Terminé), dates et descriptions.
- **Permissions**: Permissions granulaires par tâche (Lecture Seule, Modification Seule, Accès Total).
- **Pièces Jointes**: Téléchargez des images et fichiers audio aux tâches.
- **Historique des Actions**: Enregistrement de toutes les actions (Lecture, Modification, Suppression) sur les tâches pour l'audit.
- **Notifications**: Notifications en temps réel pour les mises à jour des tâches.
- **Interface Réactive**: Interface React moderne avec Tailwind CSS.

## Stack Technique

- **Frontend**: React, Vite, Tailwind CSS, Axios pour les appels API.
- **Backend**: Node.js, TypeScript, Express, Prisma ORM, Base de données MySQL.
- **Authentification**: JWT, bcrypt pour le hachage des mots de passe.
- **Téléchargements**: Multer pour la gestion des pièces jointes.
- **Planification**: Node-cron pour la planification des tâches.

## Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Base de données MySQL (locale ou distante)

## Instructions d'Installation

### 1. Cloner le Dépôt

```bash
git clone <url-du-dépôt>
cd projet_final_taches
```

### 2. Configuration du Backend

Naviguez vers le répertoire backend :

```bash
cd projet_yallah_bakhna
```

#### Installer les Dépendances

```bash
npm install
```

#### Configuration de l'Environnement

Copiez le fichier d'environnement exemple :

```bash
cp .env.example .env
```

Modifiez `.env` avec vos identifiants de base de données :

```env
DATABASE_URL="mysql://utilisateur:motdepasse@localhost:3306/yallah_bakhna_db"
JWT_SECRET="votre-clé-secrète"
```

#### Configuration de la Base de Données

Exécutez les migrations pour configurer le schéma de la base de données :

```bash
npm run db:migrate
```

Alimentez la base de données avec des données d'exemple (utilisateurs, tâches, permissions) :

```bash
npm run db:seed
```

#### Démarrer le Serveur Backend

Pour le développement :

```bash
npm run dev
```

Le backend fonctionnera sur `http://localhost:3000`.

Pour la production :

```bash
npm run build
npm start
```

### 3. Configuration du Frontend

Naviguez vers le répertoire frontend :

```bash
cd ../yallah-bakhna-frontend
```

#### Installer les Dépendances

```bash
npm install
```

#### Configuration de l'Environnement

Copiez le fichier d'environnement exemple :

```bash
cp .env.example .env
```

Modifiez `.env` pour pointer vers l'API backend :

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

#### Démarrer le Serveur Frontend

```bash
npm run dev
```

Le frontend fonctionnera sur `http://localhost:5173`.

## Utilisation

1. Ouvrez votre navigateur et allez sur `http://localhost:5173`.
2. Connectez-vous avec l'un des comptes de test suivants :

   **Compte Administrateur:**
   - Email: `admin@example.com`
   - Mot de passe: `admin123`
   - Rôle: ADMIN
   - Nom complet: Admin User

   **Comptes Utilisateurs:**
   - Email: `user1@example.com`
   - Mot de passe: `user123`
   - Rôle: USER
   - Nom complet: John Doe

   - Email: `user2@example.com`
   - Mot de passe: `user123`
   - Rôle: USER
   - Nom complet: Jane Smith

3. Créez et gérez les tâches, assignez les permissions, téléchargez des pièces jointes.
4. Consultez l'historique des actions et les notifications.

**Note:** Le compte administrateur a accès à toutes les fonctionnalités du système, tandis que les comptes utilisateurs ont des accès limités selon leurs permissions.

## Points d'Accès API

- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `GET /api/tasks` - Obtenir toutes les tâches (avec permissions)
- `POST /api/tasks` - Créer une nouvelle tâche
- `PUT /api/tasks/:id` - Mettre à jour une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche
- `POST /api/tasks/:id/permissions` - Assigner des permissions à une tâche
- `POST /api/tasks/:id/attachments` - Télécharger une pièce jointe à une tâche
- `GET /api/users` - Obtenir tous les utilisateurs (admin uniquement)

## Schéma de la Base de Données

L'application utilise Prisma avec MySQL. Modèles principaux :

- **User**: Utilisateurs avec rôles (Admin/Utilisateur).
- **Tache**: Tâches avec statut, dates et relations.
- **TachePermission**: Permissions par paire tâche-utilisateur.
- **TacheAttachment**: Pièces jointes pour les tâches.
- **ActionHistory**: Journal d'audit pour les actions sur les tâches.

## Développement

- **Backend**: Utilise ts-node-dev pour le rechargement à chaud. Code dans `src/`.
- **Frontend**: Utilise Vite pour un développement rapide. Code dans `src/`.
- **Base de données**: Utilisez `npx prisma studio` pour visualiser/éditer les données dans le navigateur.

## Contribution

1. Forkez le dépôt.
2. Créez une branche de fonctionnalité.
3. Effectuez les modifications et testez.
4. Soumettez une pull request.

## Licence

ISC
# projet_final_todo
