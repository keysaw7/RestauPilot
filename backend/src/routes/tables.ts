import express, { Request, Response } from 'express';
import Table from '../models/Table';

const router = express.Router();

// Récupérer toutes les tables
router.get('/', async (_req: Request, res: Response) => {
  try {
    const tables = await Table.find();
    return res.json(tables);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des tables', error });
  }
});

// Récupérer une table par son ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table non trouvée' });
    }
    return res.json(table);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération de la table', error });
  }
});

// Créer une nouvelle table
router.post('/', async (req: Request, res: Response) => {
  try {
    const table = new Table(req.body);
    await table.save();
    return res.status(201).json(table);
  } catch (error) {
    return res.status(400).json({ message: 'Erreur lors de la création de la table', error });
  }
});

// Mettre à jour une table
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!table) {
      return res.status(404).json({ message: 'Table non trouvée' });
    }
    return res.json(table);
  } catch (error) {
    return res.status(400).json({ message: 'Erreur lors de la mise à jour de la table', error });
  }
});

// Supprimer une table
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table non trouvée' });
    }
    return res.json({ message: 'Table supprimée avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression de la table', error });
  }
});

// Mettre à jour le statut d'une table
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!table) {
      return res.status(404).json({ message: 'Table non trouvée' });
    }
    return res.json(table);
  } catch (error) {
    return res.status(400).json({ message: 'Erreur lors de la mise à jour du statut', error });
  }
});

export default router; 