import { Request, Response } from 'express';
import Menu from '../models/Menu';
import { AppError } from '../middlewares/errorHandler';

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const menuItem = new Menu(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const { category, available } = req.query;
    const query: any = {};

    if (category) {
      query.category = category;
    }
    if (available === 'true') {
      query.isAvailable = true;
    }

    const menuItems = await Menu.find(query).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getMenuItem = async (req: Request, res: Response) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      throw new AppError('Article non trouvé', 404);
    }
    res.json(menuItem);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      throw new AppError('Article non trouvé', 404);
    }

    res.json(menuItem);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

export const toggleMenuItemAvailability = async (req: Request, res: Response) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      throw new AppError('Article non trouvé', 404);
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.json(menuItem);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      throw new AppError('Article non trouvé', 404);
    }
    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}; 