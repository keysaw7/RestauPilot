# Spécifications UI RestauPilot

## Design System

### Couleurs
- Primaire: `#2196F3` (Bleu)
- Secondaire: `#FF9800` (Orange)
- Succès: `#4CAF50` (Vert)
- Erreur: `#F44336` (Rouge)
- Warning: `#FFC107` (Jaune)
- Info: `#2196F3` (Bleu)
- Fond: `#FFFFFF` (Blanc)
- Texte: `#212121` (Noir)
- Texte secondaire: `#757575` (Gris)

### Typographie
- Police principale: Roboto
- Taille de base: 16px
- Échelles:
  - H1: 2.5rem
  - H2: 2rem
  - H3: 1.75rem
  - H4: 1.5rem
  - H5: 1.25rem
  - H6: 1rem
  - Body: 1rem
  - Small: 0.875rem

### Espacement
- Base: 8px
- Multiples: 16px, 24px, 32px, 48px, 64px

## Composants

### Navigation
- Barre latérale fixe avec menu déroulant
- Barre supérieure avec recherche et notifications
- Breadcrumbs pour la navigation hiérarchique

### Tableaux
- En-têtes fixes
- Pagination
- Tri et filtrage
- Actions en ligne
- Sélection multiple

### Formulaires
- Validation en temps réel
- Messages d'erreur contextuels
- Autocomplétion
- Sélection de dates
- Téléchargement de fichiers

### Modales
- Confirmation d'actions
- Formulaires complexes
- Visualisation de détails

### Notifications
- Toast pour les actions rapides
- Alertes pour les messages importants
- Badges pour les compteurs

## Pages

### Dashboard
- Vue d'ensemble des ventes
- Graphiques de performance
- Alertes et notifications
- Actions rapides

### Commandes
- Liste des commandes en cours
- Détails d'une commande
- Création de commande
- Paiement

### Plan de salle
- Vue interactive des tables
- Statut en temps réel
- Gestion des réservations
- Assignation des commandes

### RH
- Planning du personnel
- Pointage
- Gestion des congés
- Profils employés

### Réservations
- Calendrier des réservations
- Formulaire de réservation
- Gestion des clients
- Historique

### Finance
- Tableaux de bord
- Rapports personnalisés
- Export de données
- Analyse de rentabilité

## Responsive Design

### Breakpoints
- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

### Adaptations
- Menu hamburger sur mobile
- Tableaux scrollables horizontalement
- Formulaires en colonnes simples
- Modales pleine page

## Accessibilité

### Contraste
- Ratio minimum de 4.5:1 pour le texte normal
- Ratio minimum de 3:1 pour le texte grand

### Navigation
- Support du clavier
- Focus visible
- Ordre logique de tabulation

### ARIA
- Rôles appropriés
- Labels descriptifs
- États et propriétés

## Animations

### Transitions
- Durée: 200ms
- Timing: ease-in-out
- Échelle: 0.95 -> 1

### Micro-interactions
- Feedback sur les actions
- Chargement progressif
- Confirmation visuelle 