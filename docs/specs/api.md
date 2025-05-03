# Spécifications API RestauPilot

## Authentification

### POST /auth/login
Authentifie un utilisateur et retourne un token JWT.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "string"
  }
}
```

### POST /auth/register
Crée un nouvel utilisateur.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "string"
}
```

## Commandes

### GET /orders
Récupère toutes les commandes.

**Query Parameters:**
- `status`: Filtre par statut
- `date`: Filtre par date
- `tableId`: Filtre par table

**Response:**
```json
{
  "orders": [
    {
      "id": "string",
      "status": "string",
      "total": "number",
      "tableId": "string",
      "userId": "string",
      "items": [
        {
          "id": "string",
          "quantity": "number",
          "price": "number",
          "menuItem": {
            "id": "string",
            "name": "string",
            "price": "number"
          }
        }
      ]
    }
  ]
}
```

### POST /orders
Crée une nouvelle commande.

**Request Body:**
```json
{
  "tableId": "string",
  "items": [
    {
      "menuItemId": "string",
      "quantity": "number"
    }
  ]
}
```

## Tables

### GET /tables
Récupère toutes les tables.

**Response:**
```json
{
  "tables": [
    {
      "id": "string",
      "number": "number",
      "capacity": "number",
      "status": "string",
      "restaurantId": "string"
    }
  ]
}
```

### PUT /tables/:id/status
Met à jour le statut d'une table.

**Request Body:**
```json
{
  "status": "string"
}
```

## Réservations

### GET /reservations
Récupère toutes les réservations.

**Query Parameters:**
- `date`: Filtre par date
- `status`: Filtre par statut

**Response:**
```json
{
  "reservations": [
    {
      "id": "string",
      "date": "string",
      "partySize": "number",
      "status": "string",
      "tableId": "string",
      "userId": "string"
    }
  ]
}
```

### POST /reservations
Crée une nouvelle réservation.

**Request Body:**
```json
{
  "date": "string",
  "partySize": "number",
  "tableId": "string",
  "userId": "string"
}
```

## Personnel

### GET /staff/shifts
Récupère tous les shifts.

**Query Parameters:**
- `startDate`: Date de début
- `endDate`: Date de fin
- `userId`: Filtre par utilisateur

**Response:**
```json
{
  "shifts": [
    {
      "id": "string",
      "startTime": "string",
      "endTime": "string",
      "status": "string",
      "userId": "string"
    }
  ]
}
```

### POST /staff/shifts
Crée un nouveau shift.

**Request Body:**
```json
{
  "startTime": "string",
  "endTime": "string",
  "userId": "string"
}
```

## Finance

### GET /finance/sales
Récupère les données de ventes.

**Query Parameters:**
- `startDate`: Date de début
- `endDate`: Date de fin
- `groupBy`: Regroupement (day, week, month)

**Response:**
```json
{
  "sales": [
    {
      "date": "string",
      "total": "number",
      "count": "number",
      "average": "number"
    }
  ]
}
```

### GET /finance/profitability
Récupère les données de rentabilité.

**Query Parameters:**
- `startDate`: Date de début
- `endDate`: Date de fin

**Response:**
```json
{
  "profitability": {
    "totalRevenue": "number",
    "totalCost": "number",
    "profit": "number",
    "margin": "number"
  }
}
``` 