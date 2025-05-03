# RestauPilot

RestauPilot est une solution complète de gestion de restaurant pilotée par IA.

## Fonctionnalités principales

- 🍽️ Gestion des commandes et caisse
- 📅 Planning RH et pointage
- 📱 Réservations et fiches clients
- 📊 Tableaux de bord de ventes et rentabilité

## Stack technique

- **Backend**: Node.js + Express + TypeScript
- **Base de données**: PostgreSQL + Prisma
- **Frontend**: React + TypeScript
- **Authentification**: JWT
- **IA**: OpenAI API

## Installation

```bash
# Installation des dépendances
npm install

# Configuration de l'environnement
cp .env.example .env
# Remplir les variables d'environnement

# Lancer la base de données
docker-compose up -d

# Lancer le backend
cd backend && npm run dev

# Lancer le frontend
cd frontend && npm run dev
```

## Structure du projet

```
/restaupilot
├── backend/          # API et logique métier
├── frontend/         # Interface utilisateur
├── docs/            # Documentation
└── .prettierrc      # Configuration du formatage
```

## Contribution

Les contributions sont les bienvenues ! Consultez notre guide de contribution pour plus de détails.

## Licence

MIT 