# 🚀 Projet Yallah Bakhna - API de Gestion des Tâches

Une API REST moderne pour la gestion des tâches avec système de permissions et pièces jointes, développée avec Node.js, Express, TypeScript et Prisma.

## 📋 Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies Utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Authentification](#authentification)
- [Système de Permissions](#système-de-permissions)
- [Gestion des Pièces Jointes](#gestion-des-pièces-jointes)
- [Structure du Projet](#structure-du-projet)
- [Base de Données](#base-de-données)
- [Conventions de Code](#conventions-de-code)
- [Développement](#développement)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Contribuer](#contribuer)
- [Licence](#licence)

## ✨ Fonctionnalités

- ✅ **CRUD complet** pour les tâches
- ✅ **Système d'authentification** JWT
- ✅ **Gestion des utilisateurs** avec rôles (ADMIN/USER)
- ✅ **Système de permissions** granulaire pour les tâches
- ✅ **Upload d'images** et gestion des pièces jointes
- ✅ **Validation des données** avec Zod
- ✅ **Gestion des statuts** (EN_ATTENTE, EN_COURS, TERMINE)
- ✅ **Architecture MVC** propre et maintenable
- ✅ **TypeScript** pour la sécurité des types
- ✅ **Base de données MySQL** avec Prisma ORM
- ✅ **Gestion d'erreurs** robuste
- ✅ **Documentation API** complète

## 🛠 Technologies Utilisées

- **Backend**: Node.js, Express.js
- **Langage**: TypeScript
- **Base de données**: MySQL avec Prisma ORM
- **Authentification**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Upload de fichiers**: Multer
- **Sécurité**: bcrypt pour le hachage des mots de passe
- **Développement**: ts-node-dev, nodemon

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- MySQL (version 8.0 ou supérieure)
- npm ou yarn

## 🚀 Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/projet_yallah_bakhna.git
   cd projet_yallah_bakhna
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de la base de données**
   ```bash
   # Créer un fichier .env à la racine du projet
   cp .env.example .env

   # Modifier le fichier .env avec vos informations
   DATABASE_URL="mysql://username:password@localhost:3306/yallah_bakhna_db"
   JWT_SECRET="votre_secret_jwt_tres_securise"
   ```

4. **Initialiser la base de données**
   ```bash
   # Appliquer les migrations Prisma
   npm run db:migrate

   # Générer le client Prisma
   npx prisma generate
   ```

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
# Base de données
DATABASE_URL="mysql://username:password@localhost:3306/yallah_bakhna_db"

# JWT
JWT_SECRET="votre_secret_jwt_tres_securise"

# Port du serveur (optionnel, défaut: 3000)
PORT=3000

# Environnement (development/production)
NODE_ENV=development
```

## 🎯 Utilisation

### Démarrage en mode développement
```bash
npm run dev
```

Le serveur démarrera sur `http://localhost:3000`

### Construction pour la production
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

## 🔐 Authentification

### Inscription d'un utilisateur
```http
POST /api/auth/register
Content-Type: application/json

{
  "nom": "Ndiaye",
  "prenom": "Mapathe",
  "login": "mapathe.ndiaye",
  "password": "motdepasse123"
}
```

**Réponse de succès (201):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "nom": "Ndiaye",
      "prenom": "Mapathe",
      "login": "mapathe.ndiaye",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Connexion d'un utilisateur
```http
POST /api/auth/login
Content-Type: application/json

{
  "login": "mapathe.ndiaye",
  "password": "motdepasse123"
}
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "nom": "Ndiaye",
      "prenom": "Mapathe",
      "login": "mapathe.ndiaye",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 📝 Gestion des Tâches

> **Note**: Tous les endpoints de tâches nécessitent une authentification JWT via le header `Authorization: Bearer <token>`

### Créer une tâche
```http
POST /api/taches
Authorization: Bearer <token>
Content-Type: application/json

{
  "libelle": "Développer l'API",
  "description": "Créer une API REST pour la gestion des tâches",
  "status": "EN_ATTENTE"
}
```

**Réponse de succès (201):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "libelle": "Développer l'API",
    "description": "Créer une API REST pour la gestion des tâches",
    "status": "EN_ATTENTE",
    "userId": 1
  }
}
```

### Récupérer toutes les tâches
```http
GET /api/taches
Authorization: Bearer <token>
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "libelle": "Développer l'API",
      "description": "Créer une API REST pour la gestion des tâches",
      "status": "EN_ATTENTE",
      "userId": 1
    }
  ]
}
```

### Récupérer une tâche par ID
```http
GET /api/taches/1
Authorization: Bearer <token>
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "libelle": "Développer l'API",
    "description": "Créer une API REST pour la gestion des tâches",
    "status": "EN_ATTENTE",
    "userId": 1
  }
}
```

### Mettre à jour une tâche
```http
PUT /api/taches/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "libelle": "API REST complétée",
  "status": "EN_COURS"
}
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "libelle": "API REST complétée",
    "description": "Créer une API REST pour la gestion des tâches",
    "status": "EN_COURS",
    "userId": 1
  }
}
```

### Supprimer une tâche
```http
DELETE /api/taches/1
Authorization: Bearer <token>
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "libelle": "API REST complétée",
    "description": "Créer une API REST pour la gestion des tâches",
    "status": "EN_COURS",
    "userId": 1
  }
}
```

### Marquer une tâche comme terminée
```http
PATCH /api/taches/1/termine
Authorization: Bearer <token>
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "libelle": "API REST complétée",
    "description": "Créer une API REST pour la gestion des tâches",
    "status": "TERMINE",
    "userId": 1
  }
}
```

## 🔑 Système de Permissions

### Types de permissions disponibles
- **READ_ONLY**: Lecture seule de la tâche
- **MODIFY_ONLY**: Modification de la tâche (pas de suppression)
- **FULL_ACCESS**: Accès complet (modification + suppression + pièces jointes)

### Attribuer une permission à un utilisateur
```http
POST /api/taches/1/permissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 2,
  "permission": "MODIFY_ONLY"
}
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "tacheId": 1,
    "userId": 2,
    "permission": "MODIFY_ONLY"
  }
}
```

### Voir les permissions d'une tâche
```http
GET /api/taches/1/permissions
Authorization: Bearer <token>
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "tacheId": 1,
      "userId": 2,
      "permission": "MODIFY_ONLY",
      "user": {
        "id": 2,
        "nom": "Diop",
        "prenom": "Fatou",
        "login": "fatou.diop"
      }
    }
  ]
}
```

### Retirer une permission
```http
DELETE /api/taches/1/permissions/2
Authorization: Bearer <token>
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "tacheId": 1,
    "userId": 2,
    "permission": "MODIFY_ONLY"
  }
}
```

## 📎 Gestion des Pièces Jointes

### Ajouter une pièce jointe (image)
```http
POST /api/taches/1/attachments
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image_file>
```

**Exemple avec curl:**
```bash
curl -X POST http://localhost:3000/api/taches/1/attachments \
  -H "Authorization: Bearer <token>" \
  -F "file=@image.jpg"
```

**Réponse de succès (201):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "tacheId": 1,
    "filename": "file-1641234567890-123456789.jpg",
    "originalName": "image.jpg",
    "mimetype": "image/jpeg",
    "size": 245760,
    "url": "/uploads/images/file-1641234567890-123456789.jpg",
    "createdAt": "2024-01-03T10:30:00.000Z"
  }
}
```

### Voir les pièces jointes d'une tâche
```http
GET /api/taches/1/attachments
Authorization: Bearer <token>
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "tacheId": 1,
      "filename": "file-1641234567890-123456789.jpg",
      "originalName": "image.jpg",
      "mimetype": "image/jpeg",
      "size": 245760,
      "url": "/uploads/images/file-1641234567890-123456789.jpg",
      "createdAt": "2024-01-03T10:30:00.000Z"
    }
  ]
}
```

### Supprimer une pièce jointe
```http
DELETE /api/taches/attachments/1
Authorization: Bearer <token>
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "tacheId": 1,
    "filename": "file-1641234567890-123456789.jpg",
    "originalName": "image.jpg",
    "mimetype": "image/jpeg",
    "size": 245760,
    "url": "/uploads/images/file-1641234567890-123456789.jpg",
    "createdAt": "2024-01-03T10:30:00.000Z"
  }
}
```

### Accéder à une image uploadée
```http
GET /uploads/images/file-1641234567890-123456789.jpg
```

Cette URL retourne directement le fichier image.

## 📊 Récapitulatif des Endpoints

| Méthode | Endpoint | Description | Auth Required |
|---------|----------|-------------|---------------|
| **Authentification** |
| `POST` | `/api/auth/register` | Inscription d'un utilisateur | ❌ |
| `POST` | `/api/auth/login` | Connexion d'un utilisateur | ❌ |
| **Gestion des Tâches** |
| `GET` | `/api/taches` | Récupérer toutes les tâches | ✅ |
| `GET` | `/api/taches/:id` | Récupérer une tâche par ID | ✅ |
| `POST` | `/api/taches` | Créer une nouvelle tâche | ✅ |
| `PUT` | `/api/taches/:id` | Mettre à jour une tâche | ✅ |
| `DELETE` | `/api/taches/:id` | Supprimer une tâche | ✅ |
| `PATCH` | `/api/taches/:id/termine` | Marquer une tâche comme terminée | ✅ |
| **Permissions** |
| `POST` | `/api/taches/:id/permissions` | Attribuer une permission | ✅ |
| `GET` | `/api/taches/:id/permissions` | Voir les permissions d'une tâche | ✅ |
| `DELETE` | `/api/taches/:id/permissions/:userId` | Retirer une permission | ✅ |
| **Pièces Jointes** |
| `POST` | `/api/taches/:id/attachments` | Ajouter une pièce jointe | ✅ |
| `GET` | `/api/taches/:id/attachments` | Voir les pièces jointes | ✅ |
| `DELETE` | `/api/taches/attachments/:attachmentId` | Supprimer une pièce jointe | ✅ |
| `GET` | `/uploads/images/:filename` | Accéder à une image | ❌ |

## ⚠️ Codes de Statut HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Erreur de validation ou données invalides
- `401` - Non authentifié (token manquant ou invalide)
- `403` - Accès interdit (permissions insuffisantes)
- `404` - Ressource non trouvée
- `500` - Erreur serveur interne

## 🔒 Règles de Sécurité et Permissions

### Authentification
- Tous les endpoints (sauf `/auth/register` et `/auth/login`) nécessitent un token JWT
- Le token doit être inclus dans le header: `Authorization: Bearer <token>`

### Permissions sur les Tâches
- **Créateur de la tâche**: Peut faire toutes les opérations
- **READ_ONLY**: Peut seulement voir la tâche et ses pièces jointes
- **MODIFY_ONLY**: Peut modifier la tâche et ajouter des pièces jointes
- **FULL_ACCESS**: Peut tout faire sauf gérer les permissions

### Upload de Fichiers
- Taille limite: 5MB par fichier
- Types autorisés: Images uniquement (image/*)
- Stockage: Dossier `uploads/images/`

## 🏗 Structure du Projet

```
projet_yallah_bakhna/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts          # Authentification
│   │   └── tache.controller.ts         # Gestion des tâches
│   ├── services/
│   │   ├── user.service.ts             # Logique utilisateurs
│   │   ├── tache.service.ts            # Logique tâches
│   │   ├── permission.service.ts       # Logique permissions
│   │   └── attachment.service.ts       # Logique pièces jointes
│   ├── repositories/
│   │   ├── user.repositorie.ts         # Accès données utilisateurs
│   │   └── tache.repositorie.ts        # Accès données tâches
│   ├── routes/
│   │   ├── auth.route.ts               # Routes authentification
│   │   └── tache.route.ts              # Routes tâches
│   ├── validators/
│   │   ├── auth.validator.ts           # Validation auth
│   │   ├── tache.validator.ts          # Validation tâches
│   │   └── permission.validator.ts     # Validation permissions
│   ├── middlewares/
│   │   └── auth.middleware.ts          # Middleware JWT
│   ├── utils/
│   │   └── upload.ts                   # Configuration upload
│   ├── config/
│   │   └── rbac.ts                     # Configuration RBAC
│   └── index.ts                        # Point d'entrée
├── prisma/
│   ├── schema.prisma                   # Schéma de base de données
│   └── migrations/                     # Migrations
├── uploads/
│   └── images/                         # Images uploadées
├── package.json
├── tsconfig.json
├── .env                                # Variables d'environnement
└── README.md
```

## 🗄️ Base de Données

### Schéma Prisma Complet

```prisma
enum Role {
  ADMIN
  USER
}

enum StatusTache {
  EN_ATTENTE
  EN_COURS
  TERMINE
}

enum PermissionType {
  READ_ONLY
  MODIFY_ONLY
  FULL_ACCESS
}

model User {
  id                Int                @id @default(autoincrement())
  nom               String
  prenom            String
  login             String             @unique
  password          String
  role              Role               @default(USER)
  taches            Tache[]
  tachePermissions  TachePermission[]
}

model Tache {
  id           Int                @id @default(autoincrement())
  libelle      String
  description  String?
  status       StatusTache        @default(EN_ATTENTE)
  userId       Int
  user         User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  permissions  TachePermission[]
  attachments  TacheAttachment[]
}

model TachePermission {
  id         Int            @id @default(autoincrement())
  tacheId    Int
  userId     Int
  permission PermissionType
  tache      Tache          @relation(fields: [tacheId], references: [id], onDelete: Cascade)
  user       User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([tacheId, userId])
}

model TacheAttachment {
  id           Int      @id @default(autoincrement())
  tacheId      Int
  filename     String
  originalName String
  mimetype     String
  size         Int
  url          String
  tache        Tache    @relation(fields: [tacheId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
}
```

## 📝 Conventions de Code

### Préfixe des Variables et Constantes

Toutes les variables et constantes doivent être préfixées par `mn` :

```typescript
// ✅ Correct
const mnTacheService = new TacheService();
const mnRouter = Router();
const mnPort = 3000;

// ❌ Incorrect
const tacheService = new TacheService();
const router = Router();
const port = 3000;
```

## 💻 Développement

### Scripts Disponibles

```bash
# Développement avec rechargement automatique
npm run dev

# Construction pour la production
npm run build

# Démarrage en production
npm start

# Migration de base de données
npm run db:migrate
```

## 🧪 Tests

*(À implémenter)*

```bash
# Exécuter les tests
npm test

# Tests avec couverture
npm run test:coverage
```

## 🚀 Déploiement

### Préparation pour la production

1. **Construction de l'application**
   ```bash
   npm run build
   ```

2. **Configuration des variables d'environnement**
   ```env
   NODE_ENV=production
   DATABASE_URL="mysql://prod-user:prod-password@prod-host:3306/prod-db"
   JWT_SECRET="votre_secret_jwt_production_tres_securise"
   ```

3. **Démarrage du serveur**
   ```bash
   npm start
   ```

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub ou contacter l'équipe de développement.

---

**Développé avec ❤️ par [Mapathe Ndiaye]**# projet_todo_express
# backend_yallah_bakhna
# backend_yallah_bakhna
