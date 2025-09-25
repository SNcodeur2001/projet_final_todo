# Nouvelles Fonctionnalités - Système de Permissions et Pièces Jointes

## 📋 Fonctionnalités Ajoutées

### 1. Système de Permissions pour les Tâches
Le créateur d'une tâche peut maintenant attribuer des permissions à d'autres utilisateurs :

- **READ_ONLY** : Lecture seule
- **MODIFY_ONLY** : Modification uniquement (pas de suppression)
- **FULL_ACCESS** : Accès complet (modification + suppression + ajout de pièces jointes)

### 2. Gestion des Pièces Jointes
- Upload d'images pour les tâches
- Stockage sécurisé dans le dossier `uploads/images/`
- URLs générées automatiquement pour accéder aux fichiers

## 🚀 Nouveaux Endpoints

### Permissions

#### Attribuer une permission
```http
POST /api/taches/:id/permissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 2,
  "permission": "MODIFY_ONLY"
}
```

#### Voir les permissions d'une tâche
```http
GET /api/taches/:id/permissions
Authorization: Bearer <token>
```

#### Retirer une permission
```http
DELETE /api/taches/:id/permissions/:userId
Authorization: Bearer <token>
```

### Pièces Jointes

#### Ajouter une pièce jointe (image)
```http
POST /api/taches/:id/attachments
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image_file>
```

#### Voir les pièces jointes d'une tâche
```http
GET /api/taches/:id/attachments
Authorization: Bearer <token>
```

#### Supprimer une pièce jointe
```http
DELETE /api/taches/attachments/:attachmentId
Authorization: Bearer <token>
```

#### Accéder à une image uploadée
```http
GET /uploads/images/<filename>
```

## 🔐 Règles de Permissions

### Créateur de la tâche
- Peut faire toutes les opérations sur sa tâche
- Peut attribuer/retirer des permissions à d'autres utilisateurs
- Peut voir toutes les permissions de sa tâche

### Utilisateurs avec permissions
- **READ_ONLY** : Peut seulement voir la tâche et ses pièces jointes
- **MODIFY_ONLY** : Peut modifier la tâche et ajouter des pièces jointes
- **FULL_ACCESS** : Peut tout faire sauf gérer les permissions (réservé au créateur)

## 📁 Structure des Fichiers Ajoutés

```
src/
├── services/
│   ├── permission.service.ts    # Gestion des permissions
│   └── attachment.service.ts    # Gestion des pièces jointes
├── utils/
│   └── upload.ts               # Configuration multer pour upload
└── validators/
    └── permission.validator.ts  # Validation des permissions

uploads/
└── images/                     # Stockage des images uploadées
```

## 🗄️ Modifications de la Base de Données

### Nouvelles tables
- **TachePermission** : Stocke les permissions accordées
- **TacheAttachment** : Stocke les métadonnées des pièces jointes

### Nouveaux enums
- **PermissionType** : READ_ONLY, MODIFY_ONLY, FULL_ACCESS

## 📝 Exemples d'Utilisation

### 1. Créer une tâche et attribuer des permissions
```bash
# 1. Créer une tâche
curl -X POST http://localhost:3000/api/taches \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"libelle": "Ma tâche", "description": "Description"}'

# 2. Attribuer permission de modification à l'utilisateur ID 2
curl -X POST http://localhost:3000/api/taches/1/permissions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId": 2, "permission": "MODIFY_ONLY"}'
```

### 2. Ajouter une image à une tâche
```bash
curl -X POST http://localhost:3000/api/taches/1/attachments \
  -H "Authorization: Bearer <token>" \
  -F "file=@image.jpg"
```

### 3. Voir les pièces jointes
```bash
curl -X GET http://localhost:3000/api/taches/1/attachments \
  -H "Authorization: Bearer <token>"
```

## ⚠️ Notes Importantes

1. **Taille limite** : Les images sont limitées à 5MB
2. **Types autorisés** : Seuls les fichiers image sont acceptés
3. **Sécurité** : Toutes les opérations nécessitent une authentification JWT
4. **Permissions** : Seul le créateur peut gérer les permissions
5. **Stockage** : Les fichiers sont stockés localement dans `uploads/images/`

## 🔧 Configuration Requise

- **multer** : Pour la gestion des uploads
- **@types/multer** : Types TypeScript pour multer
- Dossier `uploads/images/` créé automatiquement