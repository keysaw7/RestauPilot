# Contexte projet
Tu es un assistant de développement IA (Cursor) chargé de créer la base d’un **MVP “RestauPilot”**, un outil global de gestion de restaurant piloté par IA. L’objectif est de livrer une structure de code, une arborescence de repo et les premières tâches prêtes à coder.

# Objectifs MVP
1. Mettre en place une API backend et une application frontend minimalistes.  
2. Implémenter en priorité :
   - **Commandes & Caisse** avec plan de salle dynamique
   - **Planning RH** + pointage
   - **Réservations** + fiches clients
   - **Tableaux de bord** de ventes et de rentabilité

# Modules fonctionnels (v1)
- **orders/** : création, modification, paiement d’une commande  
- **tables/** : plan de salle interactif  
- **staff/** : planning intelligent, pointage  
- **reservations/** : réservations web/app, fiches clients  
- **finance/** : collecte de données de vente pour dashboards  

# Stack technique
- Langage : **TypeScript**  
- Backend : **Node.js + Express** (ou NestJS)  
- Base de données : **PostgreSQL** + **Prisma**  
- Frontend : **React** (CRA ou Next.js pour PWA)  
- Authentification : JWT (Auth.js ou Clerk)  
- IA : OpenAI API (GPT pour assistant, Whisper pour voix)

# Structure du dépôt

/restaupilot
├── README.md
├── .gitignore
├── package.json
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentification & gestion des rôles
│   │   ├── orders/            # Gestion des commandes & paiements
│   │   ├── tables/            # Plan de salle et tables
│   │   ├── staff/             # RH : planning & pointage
│   │   ├── reservations/      # Réservations clients
│   │   ├── finance/           # Tableaux de bord & rentabilité
│   │   └── ai/                # Fonctions IA : recommandations, planifications
│   ├── prisma/
│   │   ├── schema.prisma      # Modèle de données
│   │   └── seed.ts            # Données de test initiales
│   ├── .env                   # Variables d’environnement
│   └── tsconfig.json          # Configuration TypeScript backend
├── frontend/
│   ├── src/
│   │   ├── components/        # Composants UI React
│   │   ├── pages/             # Pages principales (Next.js ou routing manuel)
│   │   ├── services/          # Appels API (axios ou fetch)
│   │   └── utils/             # Helpers généraux : date, IA, etc.
│   ├── public/                # Assets statiques
│   ├── .env                   # Variables d’environnement front
│   └── tsconfig.json          # Configuration TypeScript frontend
├── docs/
│   ├── specs/                 # Spécifications fonctionnelles
│   ├── wireframes/            # Schémas ou mockups
│   └── roadmap.md             # Feuille de route projet
└── .prettierrc                # Configuration formatage

# Tâches initiales (issues)
1. **Init Repo & CI**  
   - Créer README.md, .gitignore, configurations ESLint/Prettier.
2. **Modèle de données**  
   - Définir schéma Prisma pour User, Restaurant, Order, Table, Reservation, Shift, Sale.
3. **Endpoints Auth**  
   - Signup, login, rôles (admin, serveur).
4. **Module Orders**  
   - CRUD commandes, intégration Stripe sandbox.
5. **UI Plan de salle**  
   - Composant React affichant tables et états (librairie ex. react-grid-layout).

# Contraintes & recommandations
- **Code typé** (TypeScript partout)  
- **Tests unitaires** pour chaque route backend  
- **Architecture modulaire** (chaque module sous son dossier)  
- **Documentation** au fur et à mesure (OpenAPI spec + commentaires JSDoc)  

# Format de livrables attendus
- Arborescence de fichiers générée  
- Fichiers `package.json` prêts à installer  
- Schéma Prisma complet  
- Templates de routes Express et de pages React  
- Premier ticket (issue) créé dans la board GitHub

---  
Merci de générer d’abord la structure de repo et lister les premières issues.  
