import express, { Request, Response } from 'express';
import Order from '../models/Order';

const router = express.Router();

// Récupérer toutes les commandes
router.get('/', async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('table').populate('items.menuItem');
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error });
  }
});

// Récupérer une commande par son ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('table').populate('items.menuItem');
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error });
  }
});

// Créer une nouvelle commande
router.post('/', async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
    await order.save();
    const populatedOrder = await Order.findById(order._id).populate('table').populate('items.menuItem');
    return res.status(201).json(populatedOrder);
  } catch (error) {
    return res.status(400).json({ message: 'Erreur lors de la création de la commande', error });
  }
});

// Mettre à jour une commande
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('table').populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    return res.json(order);
  } catch (error) {
    return res.status(400).json({ message: 'Erreur lors de la mise à jour de la commande', error });
  }
});

// Supprimer une commande
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    return res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression de la commande', error });
  }
});

// Mettre à jour le statut d'une commande
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('table').populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    return res.json(order);
  } catch (error) {
    return res.status(400).json({ message: 'Erreur lors de la mise à jour du statut', error });
  }
});

export default router; 