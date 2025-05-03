import express from 'express';
import {
  createOrder,
  getOrder,
  updateOrderStatus,
  updateOrderItemStatus
} from '../controllers/OrderController';

const router = express.Router();

// Créer une nouvelle commande
router.post('/', createOrder);

// Récupérer une commande par son ID
router.get('/:id', getOrder);

// Mettre à jour le statut d'une commande
router.patch('/:id/status', updateOrderStatus);

// Mettre à jour le statut d'un article dans une commande
router.patch('/:id/items/:itemId/status', updateOrderItemStatus);

export default router; 