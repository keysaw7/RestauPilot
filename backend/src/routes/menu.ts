import express from 'express';
import { MenuItem } from '../models/menuItem';

const router = express.Router();

// Récupérer tous les plats
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du menu', error });
  }
});

// Récupérer un plat par son ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du plat', error });
  }
});

// Créer un nouveau plat
router.post('/', async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du plat', error });
  }
});

// Mettre à jour un plat
router.put('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du plat', error });
  }
});

// Supprimer un plat
router.delete('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    res.json({ message: 'Plat supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du plat', error });
  }
});

export default router; 