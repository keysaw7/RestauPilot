import express from 'express';
import {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  toggleMenuItemAvailability,
  deleteMenuItem
} from '../controllers/MenuController';

const router = express.Router();

// Créer un nouvel article
router.post('/', createMenuItem);

// Récupérer tous les articles (avec filtres optionnels)
router.get('/', getMenuItems);

// Récupérer un article par son ID
router.get('/:id', getMenuItem);

// Mettre à jour un article
router.put('/:id', updateMenuItem);

// Basculer la disponibilité d'un article
router.patch('/:id/toggle-availability', toggleMenuItemAvailability);

// Supprimer un article
router.delete('/:id', deleteMenuItem);

export default router; 