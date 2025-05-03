import { Request, Response, NextFunction } from 'express';
import Table from '../models/Table';
import { AppError } from '../middlewares/errorHandler';

const transformTable = (table: any) => {
  const { _id, ...rest } = table.toObject();
  return {
    _id: _id.toString(),
    ...rest
  };
};

export const createTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json(transformTable(table));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Erreur de création', 400));
  }
};

export const getAllTables = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tables = await Table.find();
    res.status(200).json(tables.map(transformTable));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Erreur de récupération', 500));
  }
};

export const getTableById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return next(new AppError('Table non trouvée', 404));
    }
    res.status(200).json(transformTable(table));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Erreur de récupération', 500));
  }
};

export const updateTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!table) {
      return next(new AppError('Table non trouvée', 404));
    }
    res.status(200).json(transformTable(table));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Erreur de mise à jour', 400));
  }
};

export const updateTableStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!table) {
      return next(new AppError('Table non trouvée', 404));
    }
    res.status(200).json(transformTable(table));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Erreur de mise à jour du statut', 400));
  }
};

export const updateTablePosition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { position } = req.body;
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { position },
      { new: true, runValidators: true }
    );
    if (!table) {
      return next(new AppError('Table non trouvée', 404));
    }
    res.status(200).json(transformTable(table));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Erreur de mise à jour de la position', 400));
  }
};

export const deleteTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(`Backend - Suppression de la table avec l'ID: ${id}`);
    
    if (!id || id === 'undefined') {
      return next(new AppError('ID de table invalide', 400));
    }

    const result = await Table.findByIdAndDelete(id);
    
    console.log("Résultat de la suppression:", result);
    
    if (!result) {
      return next(new AppError('Table non trouvée ou déjà supprimée', 404));
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Table supprimée avec succès',
      deletedTable: transformTable(result)
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    next(new AppError(error instanceof Error ? error.message : 'Erreur de suppression', 500));
  }
}; 