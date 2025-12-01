# Collection Bruno API - Mobicity API v1

Cette collection contient toutes les routes de l'API Mobicity v1 pour les tests avec Bruno API.

## 📦 Installation

1. Ouvrir Bruno API
2. Cliquer sur "Open Collection"
3. Sélectionner le dossier `bruno` de ce projet
4. La collection sera importée automatiquement

## 🔑 Variables

Avant de tester les routes protégées, vous devez définir les variables suivantes :

1. **Token utilisateur** (`{{token}}`) :
   - Exécutez la requête "Login" dans le dossier "Authentification"
   - Copiez le token de la réponse
   - Allez dans "Collection Variables" → Ajoutez `token` avec la valeur du token

2. **Token admin** (`{{adminToken}}`) :
   - Exécutez la requête "Login" avec les identifiants admin :
     - Email: `marie.martin@mail.com`
     - Password: `password456`
   - Copiez le token de la réponse
   - Allez dans "Collection Variables" → Ajoutez `adminToken` avec la valeur du token

## 📋 Comptes de test

### Admin
- **Email:** `marie.martin@mail.com`
- **Password:** `password456`

### Utilisateur normal
- **Email:** `jean.dupont@mail.com`
- **Password:** `password123`

## 🗂️ Structure de la collection

### Authentification
- **Login** - Connexion et obtention d'un token JWT
- **Register** - Inscription d'un nouvel utilisateur

### Routes Publiques
- **Categories** - Liste et détails des catégories
- **Vehicles** - Liste et détails des véhicules
- **Transport Locations** - Liste et détails des points de transport (avec filtres)

### Routes Utilisateur (Authentification requise)
- **Users** - Gestion du profil utilisateur
- **Favorites** - Gestion des favoris

### Routes Admin (Authentification + Admin requis)
- **Users** - CRUD complet des utilisateurs
- **Categories** - CRUD complet des catégories
- **Vehicles** - CRUD complet des véhicules
- **Transport Locations** - CRUD complet des points de transport
- **Favorites** - Consultation des favoris

## 🚀 Utilisation

1. **Démarrer l'API** :
   ```bash
   docker-compose up
   ```

2. **Tester les routes publiques** directement

3. **Pour les routes protégées** :
   - Exécutez d'abord "Login" pour obtenir un token
   - Ajoutez le token dans les variables de collection
   - Les routes utilisateur utiliseront automatiquement `{{token}}`
   - Les routes admin utiliseront automatiquement `{{adminToken}}`

## 📝 Notes

- L'URL de base est `http://localhost:3001`
- Toutes les routes sont préfixées par `/v1`
- Les routes admin nécessitent un compte avec `isAdmin: true`
- Les routes utilisateur nécessitent un token JWT valide

