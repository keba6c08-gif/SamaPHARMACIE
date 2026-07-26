# 📋 API SamaPHARMACIE - Spécification complète

## 🎯 Vue d'ensemble
- **Base URL** : `http://localhost:5000/api` (développement)
- **Format réponse** : JSON
- **Authentification** : JWT Bearer Token dans le header `Authorization: Bearer <token>`
- **CORS** : Activé pour `http://localhost:3000` (ou domaine frontend)

---

## 🔐 Authentification

### 1. POST `/auth/register`
**Description** : Créer un nouveau compte (Patient ou Pharmacien)

**Body** :
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "patient",
  "phone": "+33612345678"
}
```

**Paramètres** :
| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| `email` | string | ✅ | Email unique |
| `password` | string | ✅ | Min 8 caractères |
| `firstName` | string | ✅ | |
| `lastName` | string | ✅ | |
| `role` | enum | ✅ | `"patient"` ou `"pharmacien"` |
| `phone` | string | ✅ | Format international |

**Réponse 201** :
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "user": {
    "id": "uuid-xxx",
    "email": "user@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "patient",
    "phone": "+33612345678",
    "createdAt": "2026-07-26T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Erreurs** :
- `400` : Email déjà utilisé
- `400` : Données invalides

---

### 2. POST `/auth/login`
**Description** : Authentifier un utilisateur

**Body** :
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Réponse 200** :
```json
{
  "success": true,
  "message": "Connexion réussie",
  "user": {
    "id": "uuid-xxx",
    "email": "user@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "patient"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Erreurs** :
- `401` : Email ou mot de passe incorrect
- `404` : Utilisateur non trouvé

---

### 3. POST `/auth/logout`
**Description** : Déconnecter l'utilisateur (optionnel, plus utile côté client)

**Headers** : `Authorization: Bearer <token>`

**Réponse 200** :
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

### 4. GET `/auth/me`
**Description** : Récupérer les infos de l'utilisateur connecté

**Headers** : `Authorization: Bearer <token>`

**Réponse 200** :
```json
{
  "success": true,
  "user": {
    "id": "uuid-xxx",
    "email": "user@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "patient",
    "phone": "+33612345678",
    "createdAt": "2026-07-26T10:30:00Z"
  }
}
```

---

## 🏥 Pharmacies

### 5. GET `/pharmacies`
**Description** : Lister toutes les pharmacies (avec filtres optionnels)

**Query Parameters** :
| Param | Type | Défaut | Notes |
|-------|------|--------|-------|
| `search` | string | — | Recherche par nom |
| `city` | string | — | Filtre par ville |
| `latitude` | number | — | Latitude pour tri par distance |
| `longitude` | number | — | Longitude pour tri par distance |
| `radius` | number | 5 | Rayon en km (utilisé avec lat/lon) |
| `page` | number | 1 | Pagination |
| `limit` | number | 20 | Résultats par page |

**Exemple** : `GET /pharmacies?search=Pharmacie&city=Paris&latitude=48.8566&longitude=2.3522&radius=10`

**Réponse 200** :
```json
{
  "success": true,
  "data": [
    {
      "id": "pharm-001",
      "name": "Pharmacie Centrale",
      "address": "123 Rue de la Paix, 75000 Paris",
      "city": "Paris",
      "postalCode": "75000",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "phone": "+33123456789",
      "email": "contact@pharmacie-centrale.fr",
      "hours": {
        "monday": { "open": "09:00", "close": "19:00" },
        "tuesday": { "open": "09:00", "close": "19:00" },
        "wednesday": { "open": "09:00", "close": "19:00" },
        "thursday": { "open": "09:00", "close": "19:00" },
        "friday": { "open": "09:00", "close": "19:00" },
        "saturday": { "open": "09:00", "close": "13:00" },
        "sunday": null
      },
      "onDuty": true,
      "distance": 0.5,
      "averageRating": 4.5,
      "reviewCount": 23
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 157,
    "totalPages": 8
  }
}
```

---

### 6. GET `/pharmacies/:id`
**Description** : Récupérer les détails complets d'une pharmacie

**Réponse 200** :
```json
{
  "success": true,
  "data": {
    "id": "pharm-001",
    "name": "Pharmacie Centrale",
    "address": "123 Rue de la Paix, 75000 Paris",
    "city": "Paris",
    "postalCode": "75000",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "phone": "+33123456789",
    "email": "contact@pharmacie-centrale.fr",
    "pharmacistName": "Dr. Marie Soulier",
    "hours": { /* ... */ },
    "onDuty": true,
    "averageRating": 4.5,
    "reviewCount": 23,
    "stock": [
      {
        "medicineId": "med-001",
        "name": "Doliprane 500mg",
        "quantity": 15,
        "available": true
      }
    ]
  }
}
```

---

### 7. GET `/pharmacies/:id/stock`
**Description** : Récupérer le stock d'une pharmacie

**Query Parameters** :
| Param | Type | Notes |
|-------|------|-------|
| `medicineId` | string | (Optionnel) Rechercher un médicament spécifique |

**Réponse 200** :
```json
{
  "success": true,
  "data": [
    {
      "id": "med-001",
      "name": "Doliprane 500mg",
      "manufacturer": "Sanofi",
      "quantity": 15,
      "available": true,
      "price": 3.50,
      "lastRestocked": "2026-07-26T08:00:00Z"
    },
    {
      "id": "med-002",
      "name": "Ibuprofen 200mg",
      "manufacturer": "Hexagon",
      "quantity": 0,
      "available": false,
      "price": 2.80,
      "lastRestocked": "2026-07-20T10:00:00Z"
    }
  ]
}
```

---

## 💊 Médicaments

### 8. GET `/medicines`
**Description** : Lister les médicaments disponibles

**Query Parameters** :
| Param | Type | Notes |
|-------|------|-------|
| `search` | string | Recherche par nom |
| `page` | number | Pagination |
| `limit` | number | Résultats par page |

**Réponse 200** :
```json
{
  "success": true,
  "data": [
    {
      "id": "med-001",
      "name": "Doliprane 500mg",
      "manufacturer": "Sanofi",
      "description": "Paracétamol pour douleur et fièvre",
      "price": 3.50,
      "pharmaciesWithStock": 42
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### 9. GET `/medicines/:id`
**Description** : Détails d'un médicament + pharmacies qui l'ont en stock

**Réponse 200** :
```json
{
  "success": true,
  "data": {
    "id": "med-001",
    "name": "Doliprane 500mg",
    "manufacturer": "Sanofi",
    "description": "Paracétamol pour douleur et fièvre",
    "price": 3.50,
    "pharmacies": [
      {
        "pharmacyId": "pharm-001",
        "pharmacyName": "Pharmacie Centrale",
        "quantity": 15,
        "distance": 0.5
      }
    ]
  }
}
```

---

## 📋 Réservations

### 10. POST `/reservations`
**Description** : Créer une nouvelle réservation

**Headers** : `Authorization: Bearer <token>` (Patient)

**Body** :
```json
{
  "pharmacyId": "pharm-001",
  "medicines": [
    {
      "medicineId": "med-001",
      "quantity": 1
    }
  ],
  "pickupDate": "2026-07-27",
  "pickupTime": "14:30",
  "notes": "Allergie à la pénicilline"
}
```

**Réponse 201** :
```json
{
  "success": true,
  "message": "Réservation créée avec succès",
  "data": {
    "id": "res-001",
    "patientId": "user-123",
    "pharmacyId": "pharm-001",
    "status": "pending",
    "medicines": [
      {
        "medicineId": "med-001",
        "name": "Doliprane 500mg",
        "quantity": 1,
        "price": 3.50
      }
    ],
    "totalPrice": 3.50,
    "pickupDate": "2026-07-27",
    "pickupTime": "14:30",
    "notes": "Allergie à la pénicilline",
    "createdAt": "2026-07-26T10:30:00Z",
    "expiresAt": "2026-07-28T14:30:00Z"
  }
}
```

---

### 11. GET `/reservations`
**Description** : Lister les réservations de l'utilisateur connecté

**Headers** : `Authorization: Bearer <token>`

**Query Parameters** :
| Param | Type | Notes |
|-------|------|-------|
| `status` | enum | `pending`, `confirmed`, `ready`, `picked_up`, `cancelled` |
| `page` | number | Pagination |

**Réponse 200** :
```json
{
  "success": true,
  "data": [
    {
      "id": "res-001",
      "pharmacyName": "Pharmacie Centrale",
      "status": "ready",
      "totalPrice": 3.50,
      "pickupDate": "2026-07-27",
      "pickupTime": "14:30",
      "createdAt": "2026-07-26T10:30:00Z"
    }
  ]
}
```

---

### 12. GET `/reservations/:id`
**Description** : Détails complets d'une réservation (+ timeline de suivi)

**Headers** : `Authorization: Bearer <token>`

**Réponse 200** :
```json
{
  "success": true,
  "data": {
    "id": "res-001",
    "patientId": "user-123",
    "patientName": "Jean Dupont",
    "pharmacyId": "pharm-001",
    "pharmacyName": "Pharmacie Centrale",
    "status": "ready",
    "medicines": [
      {
        "medicineId": "med-001",
        "name": "Doliprane 500mg",
        "quantity": 1,
        "price": 3.50
      }
    ],
    "totalPrice": 3.50,
    "pickupDate": "2026-07-27",
    "pickupTime": "14:30",
    "notes": "Allergie à la pénicilline",
    "createdAt": "2026-07-26T10:30:00Z",
    "expiresAt": "2026-07-28T14:30:00Z",
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2026-07-26T10:30:00Z",
        "description": "Réservation créée"
      },
      {
        "status": "confirmed",
        "timestamp": "2026-07-26T10:35:00Z",
        "description": "Confirmée par la pharmacie"
      },
      {
        "status": "ready",
        "timestamp": "2026-07-26T11:00:00Z",
        "description": "Prête à récupérer"
      }
    ]
  }
}
```

---

### 13. PUT `/reservations/:id`
**Description** : Modifier une réservation (avant confirmation)

**Headers** : `Authorization: Bearer <token>`

**Body** :
```json
{
  "pickupDate": "2026-07-28",
  "pickupTime": "15:00",
  "notes": "Appeler avant d'arriver"
}
```

**Réponse 200** : Réservation mise à jour

---

### 14. DELETE `/reservations/:id`
**Description** : Annuler une réservation

**Headers** : `Authorization: Bearer <token>`

**Réponse 200** :
```json
{
  "success": true,
  "message": "Réservation annulée"
}
```

**Erreurs** :
- `400` : Réservation déjà récupérée
- `403` : Pas autorisé à annuler cette réservation

---

## 👨‍⚕️ Espace Pharmacien

### 15. GET `/pharmacien/dashboard`
**Description** : Dashboard du pharmacien avec stats et réservations

**Headers** : `Authorization: Bearer <token>` (Pharmacien)

**Réponse 200** :
```json
{
  "success": true,
  "data": {
    "pharmacyId": "pharm-001",
    "pharmacyName": "Pharmacie Centrale",
    "stats": {
      "totalReservations": 156,
      "pendingReservations": 12,
      "readyReservations": 5,
      "pickedUpToday": 23,
      "revenue": 2847.50
    },
    "pendingReservations": [
      {
        "id": "res-001",
        "patientName": "Jean Dupont",
        "medicines": [
          { "name": "Doliprane 500mg", "quantity": 1 }
        ],
        "pickupTime": "14:30",
        "createdAt": "2026-07-26T10:30:00Z"
      }
    ],
    "onDutySchedule": {
      "date": "2026-07-26",
      "startTime": "09:00",
      "endTime": "19:00",
      "active": true
    }
  }
}
```

---

### 16. GET `/pharmacien/reservations`
**Description** : Lister toutes les réservations de la pharmacie

**Headers** : `Authorization: Bearer <token>` (Pharmacien)

**Query Parameters** :
| Param | Type | Notes |
|-------|------|-------|
| `status` | enum | Filtrer par statut |
| `date` | string | Filtrer par date (YYYY-MM-DD) |
| `page` | number | Pagination |

**Réponse 200** :
```json
{
  "success": true,
  "data": [
    {
      "id": "res-001",
      "patientName": "Jean Dupont",
      "patientPhone": "+33612345678",
      "medicines": [
        { "name": "Doliprane 500mg", "quantity": 1, "price": 3.50 }
      ],
      "totalPrice": 3.50,
      "status": "pending",
      "pickupTime": "14:30",
      "createdAt": "2026-07-26T10:30:00Z"
    }
  ]
}
```

---

### 17. PUT `/pharmacien/reservations/:id/status`
**Description** : Mettre à jour le statut d'une réservation

**Headers** : `Authorization: Bearer <token>` (Pharmacien)

**Body** :
```json
{
  "status": "ready",
  "notes": "Prête à récupérer - appeler le patient"
}
```

**Statuts valides** :
- `pending` → `confirmed`
- `confirmed` → `ready`
- `ready` → `picked_up`
- Tout statut → `cancelled`

**Réponse 200** :
```json
{
  "success": true,
  "message": "Statut mis à jour",
  "data": { /* réservation mise à jour */ }
}
```

---

### 18. GET `/pharmacien/stock`
**Description** : Récupérer le stock complet de la pharmacie

**Headers** : `Authorization: Bearer <token>` (Pharmacien)

**Réponse 200** :
```json
{
  "success": true,
  "data": [
    {
      "id": "med-001",
      "name": "Doliprane 500mg",
      "manufacturer": "Sanofi",
      "quantity": 15,
      "minStock": 5,
      "price": 3.50,
      "expiryDate": "2027-12-31",
      "lastRestocked": "2026-07-26T08:00:00Z"
    }
  ]
}
```

---

### 19. PUT `/pharmacien/stock/:medicineId`
**Description** : Mettre à jour la quantité en stock

**Headers** : `Authorization: Bearer <token>` (Pharmacien)

**Body** :
```json
{
  "quantity": 25,
  "minStock": 5,
  "action": "restock"
}
```

**Actions** :
- `restock` : Ajouter du stock
- `remove` : Retirer du stock (ex: articles périmés)
- `adjust` : Rectifier la quantité

**Réponse 200** :
```json
{
  "success": true,
  "message": "Stock mis à jour",
  "data": { /* médicament mis à jour */ }
}
```

---

### 20. POST `/pharmacien/stock/add`
**Description** : Ajouter un nouveau médicament au stock

**Headers** : `Authorization: Bearer <token>` (Pharmacien)

**Body** :
```json
{
  "medicineId": "med-003",
  "quantity": 50,
  "minStock": 5,
  "expiryDate": "2027-06-30"
}
```

**Réponse 201** : Médicament ajouté au stock

---

### 21. GET `/pharmacien/duty-schedule`
**Description** : Récupérer le calendrier de garde

**Headers** : `Authorization: Bearer <token>` (Pharmacien)

**Query Parameters** :
| Param | Type | Notes |
|-------|------|-------|
| `startDate` | string | (YYYY-MM-DD) |
| `endDate` | string | (YYYY-MM-DD) |

**Réponse 200** :
```json
{
  "success": true,
  "data": [
    {
      "id": "duty-001",
      "date": "2026-07-26",
      "startTime": "09:00",
      "endTime": "19:00",
      "dutyType": "normal",
      "pharmacistName": "Dr. Marie Soulier"
    },
    {
      "id": "duty-002",
      "date": "2026-07-27",
      "startTime": "09:00",
      "endTime": "13:00",
      "dutyType": "morning",
      "pharmacistName": "Dr. Marie Soulier"
    }
  ]
}
```

---

### 22. POST `/pharmacien/duty-schedule`
**Description** : Ajouter une plage horaire de garde

**Headers** : `Authorization: Bearer <token>` (Pharmacien)

**Body** :
```json
{
  "date": "2026-07-28",
  "startTime": "09:00",
  "endTime": "19:00",
  "dutyType": "normal"
}
```

**Réponse 201** : Plage créée

---

### 23. DELETE `/pharmacien/duty-schedule/:id`
**Description** : Supprimer une plage de garde

**Headers** : `Authorization: Bearer <token>` (Pharmacien)

**Réponse 200** : Plage supprimée

---

## ⭐ Avis & Évaluations

### 24. POST `/reviews`
**Description** : Laisser un avis sur une pharmacie

**Headers** : `Authorization: Bearer <token>` (Patient)

**Body** :
```json
{
  "pharmacyId": "pharm-001",
  "rating": 5,
  "comment": "Très bon service, accueil chaleureux",
  "reservationId": "res-001"
}
```

**Réponse 201** :
```json
{
  "success": true,
  "message": "Avis créé",
  "data": {
    "id": "review-001",
    "pharmacyId": "pharm-001",
    "patientId": "user-123",
    "rating": 5,
    "comment": "Très bon service, accueil chaleureux",
    "createdAt": "2026-07-26T10:30:00Z"
  }
}
```

---

### 25. GET `/pharmacies/:id/reviews`
**Description** : Récupérer les avis d'une pharmacie

**Query Parameters** :
| Param | Type | Notes |
|-------|------|-------|
| `rating` | number | Filtrer par note (ex: 5) |
| `page` | number | Pagination |

**Réponse 200** :
```json
{
  "success": true,
  "data": [
    {
      "id": "review-001",
      "patientName": "Jean Dupont",
      "rating": 5,
      "comment": "Très bon service",
      "createdAt": "2026-07-26T10:30:00Z"
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 23
}
```

---

## 🔔 Notifications (Optionnel - v2)

### 26. GET `/notifications`
**Description** : Récupérer les notifications de l'utilisateur

**Headers** : `Authorization: Bearer <token>`

**Réponse 200** :
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-001",
      "type": "reservation_ready",
      "title": "Votre réservation est prête",
      "message": "Pharmacie Centrale - Doliprane 500mg",
      "reservationId": "res-001",
      "read": false,
      "createdAt": "2026-07-26T11:00:00Z"
    }
  ]
}
```

---

## 📊 Modèles de données (BDD)

### Users
```
id (UUID, PK)
email (VARCHAR, UNIQUE)
password (VARCHAR, hashed)
firstName (VARCHAR)
lastName (VARCHAR)
role (ENUM: patient, pharmacien)
phone (VARCHAR)
profilePicture (VARCHAR, NULL)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

### Pharmacies
```
id (UUID, PK)
name (VARCHAR)
address (VARCHAR)
city (VARCHAR)
postalCode (VARCHAR)
latitude (FLOAT)
longitude (FLOAT)
phone (VARCHAR)
email (VARCHAR)
pharmacistName (VARCHAR)
averageRating (FLOAT)
reviewCount (INT)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

### Medicines
```
id (UUID, PK)
name (VARCHAR)
manufacturer (VARCHAR)
description (TEXT)
price (DECIMAL)
createdAt (TIMESTAMP)
```

### PharmacyStock
```
id (UUID, PK)
pharmacyId (UUID, FK → Pharmacies)
medicineId (UUID, FK → Medicines)
quantity (INT)
minStock (INT)
expiryDate (DATE)
lastRestocked (TIMESTAMP)
```

### Reservations
```
id (UUID, PK)
patientId (UUID, FK → Users)
pharmacyId (UUID, FK → Pharmacies)
status (ENUM: pending, confirmed, ready, picked_up, cancelled)
totalPrice (DECIMAL)
pickupDate (DATE)
pickupTime (TIME)
notes (TEXT)
createdAt (TIMESTAMP)
expiresAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

### ReservationItems
```
id (UUID, PK)
reservationId (UUID, FK → Reservations)
medicineId (UUID, FK → Medicines)
quantity (INT)
price (DECIMAL)
```

### DutySchedule
```
id (UUID, PK)
pharmacyId (UUID, FK → Pharmacies)
date (DATE)
startTime (TIME)
endTime (TIME)
dutyType (ENUM: normal, morning, evening, night)
pharmacistName (VARCHAR)
createdAt (TIMESTAMP)
```

### Reviews
```
id (UUID, PK)
pharmacyId (UUID, FK → Pharmacies)
patientId (UUID, FK → Users)
rating (INT, 1-5)
comment (TEXT)
reservationId (UUID, FK → Reservations, NULL)
createdAt (TIMESTAMP)
```

### Notifications
```
id (UUID, PK)
userId (UUID, FK → Users)
type (VARCHAR)
title (VARCHAR)
message (TEXT)
reservationId (UUID, FK → Reservations, NULL)
read (BOOLEAN)
createdAt (TIMESTAMP)
```

---

## 🔄 Flux utilisateur

### Patient
1. **Register** → POST `/auth/register` (role: patient)
2. **Login** → POST `/auth/login`
3. **Browse pharmacies** → GET `/pharmacies` (avec géolocalisation)
4. **Search medicine** → GET `/medicines`
5. **View pharmacy details** → GET `/pharmacies/:id`
6. **Create reservation** → POST `/reservations`
7. **Track order** → GET `/reservations/:id`
8. **Modify/Cancel** → PUT/DELETE `/reservations/:id`
9. **Leave review** → POST `/reviews`

### Pharmacien
1. **Register** → POST `/auth/register` (role: pharmacien)
2. **Login** → POST `/auth/login`
3. **View dashboard** → GET `/pharmacien/dashboard`
4. **Manage reservations** → GET/PUT `/pharmacien/reservations/:id/status`
5. **Manage stock** → GET/PUT `/pharmacien/stock/:medicineId`
6. **Set duty schedule** → GET/POST `/pharmacien/duty-schedule`

---

## 🚨 Gestion des erreurs

Toutes les réponses d'erreur suivent ce format :

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Description lisible de l'erreur"
  }
}
```

**Codes courants** :
| Code | Statut HTTP | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Données invalides |
| `UNAUTHORIZED` | 401 | Token invalide/expiré |
| `FORBIDDEN` | 403 | Pas de permissions |
| `NOT_FOUND` | 404 | Ressource inexistante |
| `CONFLICT` | 409 | Conflit (ex: email déjà utilisé) |
| `SERVER_ERROR` | 500 | Erreur serveur |

---

## 📝 Résumé : 26 endpoints API

✅ **Auth** : 4 endpoints  
✅ **Pharmacies** : 3 endpoints  
✅ **Médicaments** : 2 endpoints  
✅ **Réservations** : 5 endpoints  
✅ **Espace Pharmacien** : 9 endpoints  
✅ **Avis** : 2 endpoints  
✅ **Notifications** : 1 endpoint  

---

**Prochaines étapes** :
- ✅ Valider cette spec (des changements?)
- ⬜ Setup du backend Node.js + Express
- ⬜ Initialiser PostgreSQL
- ⬜ Implémenter les endpoints un par un
- ⬜ Connecter le frontend
