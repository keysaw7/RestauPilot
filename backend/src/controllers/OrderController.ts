import { Request, Response } from 'express';
import Order, { IOrderItem } from '../models/Order';
import Menu from '../models/Menu';
import Table from '../models/Table';
import { AppError } from '../middlewares/errorHandler';
import mongoose from 'mongoose';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { tableId, items, notes } = req.body;

    // Vérifier si la table existe
    const table = await Table.findById(tableId);
    if (!table) {
      throw new AppError('Table non trouvée', 404);
    }

    // Vérifier si la table est disponible
    if (table.status !== 'available') {
      throw new AppError('La table n\'est pas disponible', 400);
    }

    // Vérifier et enrichir les items avec les prix actuels
    const enrichedItems = await Promise.all(items.map(async (item: any) => {
      const menuItem = await Menu.findById(item.menuItem);
      if (!menuItem) {
        throw new AppError(`Article ${item.menuItem} non trouvé`, 404);
      }
      if (!menuItem.isAvailable) {
        throw new AppError(`Article ${menuItem.name} n'est pas disponible`, 400);
      }

      return {
        menuItem: item.menuItem,
        quantity: item.quantity,
        status: 'pending',
        specialInstructions: item.specialInstructions,
        priceAtTime: menuItem.price
      } as IOrderItem;
    }));

    // Créer la commande
    const order = new Order({
      table: tableId,
      items: enrichedItems,
      notes,
      status: 'pending',
      totalAmount: enrichedItems.reduce((total, item) => total + (item.priceAtTime * item.quantity), 0)
    });

    await order.save();

    // Mettre à jour le statut de la table
    table.status = 'occupied';
    await table.save();

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table')
      .populate('items.menuItem');

    if (!order) {
      throw new AppError('Commande non trouvée', 404);
    }

    res.json(order);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError('Commande non trouvée', 404);
    }

    // Vérifier la transition de statut valide
    const validTransitions: Record<string, string[]> = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['served', 'cancelled'],
      'served': ['paid', 'cancelled'],
      'paid': [],
      'cancelled': []
    };

    if (!validTransitions[order.status].includes(status)) {
      throw new AppError('Transition de statut invalide', 400);
    }

    order.status = status;
    await order.save();

    // Si la commande est payée ou annulée, libérer la table
    if (status === 'paid' || status === 'cancelled') {
      const table = await Table.findById(order.table);
      if (table) {
        table.status = 'available';
        await table.save();
      }
    }

    res.json(order);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

export const updateOrderItemStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id, itemId } = req.params;
    
    const order = await Order.findById(id);
    if (!order) {
      throw new AppError('Commande non trouvée', 404);
    }

    // Rechercher l'item dans la commande en utilisant mongoose ObjectId pour la comparaison
    const itemIndex = order.items.findIndex(item => 
      item._id.equals(new mongoose.Types.ObjectId(itemId))
    );
    
    if (itemIndex === -1) {
      throw new AppError('Article non trouvé dans la commande', 404);
    }

    // Vérifier la transition de statut valide pour l'article
    const validTransitions: Record<string, string[]> = {
      'pending': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['served', 'cancelled'],
      'served': [],
      'cancelled': []
    };

    const currentStatus = order.items[itemIndex].status;
    if (!validTransitions[currentStatus].includes(status)) {
      throw new AppError('Transition de statut invalide pour l\'article', 400);
    }

    order.items[itemIndex].status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}; 