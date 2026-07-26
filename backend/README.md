# 🏥 SamaPHARMACIE - Backend

Backend API complète pour la plateforme de mise en relation patients et pharmaciens.

## 🚀 Installation

### Prérequis
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 12

### Setup

1. **Cloner et installer les dépendances**
```bash
cd backend
npm install
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos paramètres
```

3. **Créer la base de données PostgreSQL**
```bash
createdb samapharmacie
```

4. **Exécuter les migrations**
```bash
npm run migrate
```

5. **Démarrer le serveur**
```bash
# Mode développement (avec rechargement auto)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 📋 Structure du projet

```
backend/
├── config/              # Configuration (DB, env)
├── controllers/         # Logique métier
├── middleware/          # Middlewares (auth, validation, logs)
├── routes/              # Définition des routes API
├── scripts/             # Scripts utilitaires (migration)
├── server.js            # Point d'entrée
├── package.json         # Dépendances
└── README.md           # Ce fichier
```

## 🔐 Authentification

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification.

### Obtenir un token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Réponse:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Utiliser le token

Ajouter le header Authorization à vos requêtes:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 📚 Documentation API

Voir `/API.md` à la racine du dépôt pour la documentation complète des endpoints.

### Endpoints principaux

#### Auth
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Récupérer l'utilisateur connecté

#### Pharmacies
- `GET /api/pharmacies` - Lister les pharmacies
- `GET /api/pharmacies/:id` - Détails d'une pharmacie
- `GET /api/pharmacies/:id/stock` - Stock d'une pharmacie

#### Réservations
- `POST /api/reservations` - Créer une réservation
- `GET /api/reservations` - Mes réservations
- `GET /api/reservations/:id` - Détails d'une réservation
- `PUT /api/reservations/:id` - Modifier une réservation
- `DELETE /api/reservations/:id` - Annuler une réservation

#### Espace Pharmacien
- `GET /api/pharmacien/dashboard` - Dashboard
- `GET /api/pharmacien/reservations` - Réservations de la pharmacie
- `PUT /api/pharmacien/reservations/:id/status` - Mettre à jour le statut
- `GET /api/pharmacien/stock` - Gestion du stock
- `GET /api/pharmacien/duty-schedule` - Calendrier de garde

#### Avis
- `POST /api/reviews` - Créer un avis
- `GET /api/reviews/:pharmacyId` - Avis d'une pharmacie

## 🧪 Tests

```bash
npm test
```

## 🔧 Troubleshooting

### Erreur de connexion à PostgreSQL
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
- Vérifier que PostgreSQL est lancé
- Vérifier les paramètres DB_HOST, DB_PORT, DB_USER, DB_PASSWORD dans `.env`

### JWT Secret non défini
```
Error: JWT_SECRET must be defined
```

**Solution:**
- Ajouter `JWT_SECRET` dans `.env`
- Générer une clé sécurisée: `openssl rand -base64 32`

### Table n'existe pas
```
Error: relation "users" does not exist
```

**Solution:**
- Exécuter les migrations: `npm run migrate`

## 📦 Déploiement

### Sur Heroku

```bash
heroku create samapharmacie-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
git push heroku main
heroku run npm run migrate
```

### Sur Railway / Render

1. Connecter le dépôt GitHub
2. Ajouter les variables d'environnement
3. Configurer la base de données PostgreSQL
4. Déployer

## 📞 Support

Pour les questions ou problèmes, ouvrir une issue sur GitHub.

## 📄 Licence

MIT
