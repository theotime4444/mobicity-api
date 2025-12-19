# Mobicity API

API pour le projet Smart City - Localisation de points de transport en commun.

## 🚀 Démarrage avec Docker

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé sur votre machine

### Configuration

1. **Créer le fichier `.env`** à la racine du projet :
   ```bash
   cp .env.example .env
   ```
   
   Puis éditez `.env` et adaptez les valeurs si nécessaire (par défaut, les valeurs fonctionnent avec Docker).
   
   **Note** : Pour le développement local (sans Docker), utilisez `HOSTDB=localhost` dans `.env`

### Commandes de base

1. **Construire et démarrer les conteneurs** :
   ```bash
   docker compose up --build
   ```

2. **Attendre que la base de données soit prête** (vérifiez les logs) :
   ```bash
   docker compose logs -f db
   ```
   Attendez de voir "database system is ready to accept connections"

3. **Initialiser la base de données** (dans un nouveau terminal) :
   ```bash
   docker compose exec api npm run initDB
   ```
   
   Cette commande va automatiquement :
   - Créer la structure de la base de données depuis `schema.prisma` (Prisma db push)
   - Générer le client Prisma
   - Insérer les données de test (catégories, véhicules, utilisateurs)
   - Importer les données CSV (arrêts de bus et train)
   
   **Note** : Après avoir modifié le schéma Prisma, exécutez `npm run initDB` pour mettre à jour la base de données.

4. **Démarrer en arrière-plan** :
   ```bash
   docker compose up -d
   ```

5. **Voir les logs** :
   ```bash
   docker compose logs -f api
   ```

6. **Arrêter les conteneurs** :
   ```bash
   docker compose down
   ```

7. **Redémarrer les conteneurs** :
   ```bash
   docker compose restart
   ```

### Accès à l'API

Une fois démarré, l'API sera disponible sur :
- http://localhost:3001

### Accès à la base de données

La base de données PostgreSQL est accessible avec :
- **Hôte** : localhost (ou `db` depuis le conteneur API)
- **Port** : 5432
- **Utilisateur** : mobicity
- **Mot de passe** : mobicity_password
- **Base de données** : mobicity_db

Vous pouvez utiliser DBeaver, DataGrip, VSCode ou tout autre outil de gestion de base de données.

## 📝 Routes disponibles (API v1)

### Authentification (Publiques)
- `POST /v1/auth/login` - Se connecter et obtenir un token JWT (expiration 24h)
- `POST /v1/auth/register` - S'inscrire et créer un nouveau compte utilisateur

### Routes publiques (Lecture seule)
- `GET /v1/categories` - Récupérer toutes les catégories
- `GET /v1/categories/:id` - Récupérer une catégorie par son ID
- `GET /v1/vehicles` - Récupérer tous les véhicules
- `GET /v1/vehicles/:id` - Récupérer un véhicule par son ID
- `GET /v1/transport-locations` - Récupérer tous les points de transport (avec filtres optionnels : `?limit=10&offset=0&categoryId=1&search=bus`)
- `GET /v1/transport-locations/:id` - Récupérer un point de transport par son ID

### Routes utilisateur (Authentification requise)
- `GET /v1/users/me` - Récupérer les informations de l'utilisateur connecté
- `PATCH /v1/users/me` - Mettre à jour ses propres informations
- `GET /v1/favorites/me` - Récupérer tous ses favoris
- `POST /v1/favorites/me` - Ajouter un favori
- `DELETE /v1/favorites/me/:transportLocationId` - Supprimer un favori

### Routes admin (Authentification + Admin requis)
- `GET /v1/admin/users` - Récupérer tous les utilisateurs (avec pagination)
- `GET /v1/admin/users/:id` - Récupérer un utilisateur par son ID
- `POST /v1/admin/users` - Créer un utilisateur
- `PATCH /v1/admin/users` - Mettre à jour un utilisateur
- `DELETE /v1/admin/users/:id` - Supprimer un utilisateur

- `GET /v1/admin/categories` - Récupérer toutes les catégories
- `GET /v1/admin/categories/:id` - Récupérer une catégorie par son ID
- `POST /v1/admin/categories` - Créer une catégorie
- `PATCH /v1/admin/categories` - Mettre à jour une catégorie
- `DELETE /v1/admin/categories/:id` - Supprimer une catégorie

- `GET /v1/admin/vehicles` - Récupérer tous les véhicules
- `GET /v1/admin/vehicles/:id` - Récupérer un véhicule par son ID
- `POST /v1/admin/vehicles` - Créer un véhicule
- `PATCH /v1/admin/vehicles` - Mettre à jour un véhicule
- `DELETE /v1/admin/vehicles/:id` - Supprimer un véhicule

- `GET /v1/admin/transport-locations` - Récupérer tous les points de transport
- `GET /v1/admin/transport-locations/:id` - Récupérer un point de transport par son ID
- `POST /v1/admin/transport-locations` - Créer un point de transport
- `PATCH /v1/admin/transport-locations` - Mettre à jour un point de transport
- `DELETE /v1/admin/transport-locations/:id` - Supprimer un point de transport

- `GET /v1/admin/favorites` - Récupérer tous les favoris (avec filtres optionnels)
- `GET /v1/admin/favorites/users/:userId` - Récupérer tous les favoris d'un utilisateur

## 📝 Développement

Le code source est monté en volume dans le conteneur, donc vos modifications seront automatiquement prises en compte grâce à nodemon.

### Installation des dépendances dans Docker

Quand vous ajoutez une nouvelle dépendance, vous devez :

1. L'installer dans le conteneur :
   ```bash
   docker compose exec api npm i <nom-du-paquet>
   ```

2. Ou reconstruire l'image :
   ```bash
   docker compose up --build
   ```

## 🔧 Structure du projet

```
.
├── server.js              # Point d'entrée de l'API
├── database/              # Configuration de la base de données
│   └── databaseORM.js    # Client Prisma ORM
├── prisma/                # Configuration Prisma
│   └── schema.prisma     # Schéma de la base de données
├── controler/             # Contrôleurs (logique métier)
│   ├── auth.js            # Authentification
│   ├── user.js            # Contrôleur utilisateur (CRUD + /me + manager)
│   ├── category.js        # Contrôleur catégorie
│   ├── vehicle.js         # Contrôleur véhicule
│   ├── transportLocation.js # Contrôleur point de transport
│   ├── favorite.js        # Contrôleur favori
│   └── auth.js            # Contrôleur authentification
├── model/                 # Modèles
│   ├── user.js            # Modèle utilisateur (CRUD + authentification)
│   ├── category.js        # Modèle catégorie
│   ├── vehicle.js         # Modèle véhicule
│   ├── transportLocation.js # Modèle point de transport
│   └── favorite.js       # Modèle favori
├── middleware/
│   ├── authorization/
│   ├── identification/
│   ├── validation/        # Schémas Vine par entité
│   └── validation.js      # Regroupe tous les middlewares de validation
├── routes/                # Routes (définition des endpoints)
│   ├── index.js           # Router principal (orchestration)
│   └── v1/                 # Version 1 de l'API
│       ├── index.js        # Orchestrateur v1
│       ├── auth.js         # Authentification
│       ├── public/          # Routes publiques (lecture seule)
│       │   ├── category.js
│       │   ├── vehicle.js
│       │   └── transportLocation.js
│       ├── user/            # Routes utilisateur (checkJWT)
│       │   ├── user.js
│       │   └── favorite.js
│       └── admin/           # Routes admin (checkJWT + admin)
│           ├── index.js
│           ├── user.js
│           ├── category.js
│           ├── vehicle.js
│           ├── transportLocation.js
│           └── favorite.js
├── scripts/               # Scripts d'initialisation
│   ├── data/              # Données CSV à importer
│   │   ├── stops_bus.csv
│   │   └── stops_train.csv
│   └── JS/
│       ├── initDB.js      # Script pour initialiser la DB (Prisma + seed + CSV)
│       ├── seed.js        # Script de seed pour les données de test
│       ├── importCSV.js   # Script d'import des données CSV
│       └── hashPasswords.js # Script utilitaire pour générer des hashs
├── Dockerfile             # Configuration Docker pour l'API
├── compose.yml             # Orchestration des services
├── package.json           # Dépendances Node.js
└── README.md             # Ce fichier
```

## 📦 Architecture

Cette API suit l'architecture MVC (Model-View-Controller) adaptée pour une API REST :

- **Prisma ORM** : Client Prisma pour l'accès à la base de données (remplace les modèles SQL)
- **Controler** : Traite les requêtes HTTP et utilise Prisma pour accéder aux données
- **Route** : Définit les endpoints et associe les méthodes HTTP aux contrôleurs

**Note** : Les anciens modèles SQL (`model/*DB.js`) sont conservés pour référence mais ne sont plus utilisés. Toutes les routes utilisent maintenant les contrôleurs ORM.

## 🔒 Sécurité

⚠️ **Important** : Le fichier `.env` contient des informations sensibles et ne doit **JAMAIS** être commité sur Git. Il est déjà dans `.gitignore`.

## 🔧 Prisma ORM

Ce projet utilise Prisma ORM pour l'accès à la base de données. Voir `documentation/PRISMA_SETUP.md` pour plus d'informations.

### Génération du client Prisma

Le client Prisma est généré automatiquement lors de `npm run initDB`. 

Si vous devez le régénérer manuellement :

```bash
npm run prisma:generate
```

### Création/Mise à jour de la base de données

Pour créer ou mettre à jour la structure de la base de données depuis `schema.prisma` :

```bash
npm run prisma:dbpush    # Crée/met à jour la DB (recommandé pour le développement)
# ou
npm run prisma:migrate   # Crée une migration (recommandé pour la production)
```

## 🔐 Authentification JWT

L'API utilise JWT (JSON Web Tokens) pour l'authentification. 

### Connexion

Pour obtenir un token JWT, faites une requête POST à `/v1/auth/login` avec :
```json
{
  "email": "votre@email.com",
  "password": "votre_mot_de_passe"
}
```

La réponse contiendra un token JWT valide pendant 24 heures :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Utilisation du token

Pour les routes protégées, incluez le token dans le header `Authorization` :
```
Authorization: Bearer <votre_token>
```

### Sécurité des mots de passe

Les mots de passe sont hashés avec Argon2id et utilisent un "pepper" pour une sécurité renforcée. Les mots de passe ne sont jamais stockés en clair dans la base de données.

## 📖 Documentation Swagger

La documentation de l'API est générée automatiquement avec Swagger au démarrage du serveur.

### Visualiser la documentation

1. Démarrez le serveur : `npm run dev` ou `docker compose up`
2. Accédez à la documentation interactive : `http://localhost:3001/api-docs`
3. La documentation est automatiquement générée et mise à jour à chaque démarrage

### Générer manuellement la documentation

Si vous souhaitez générer manuellement le fichier `swagger/spec.json` :

```bash
npm run genDoc
```

Le fichier généré peut être visualisé dans [Swagger Editor](https://editor.swagger.io/).

## 📚 Notes

Cette structure respecte le style de code des laboratoires 1, 2, 3, 4, 5 et 6 du cours.
