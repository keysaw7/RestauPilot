import mongoose from 'mongoose';
import { IMenu } from './Menu';

export interface IOrderItem {
  _id: mongoose.Types.ObjectId;
  menuItem: mongoose.Types.ObjectId | IMenu;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
  specialInstructions?: string;
  priceAtTime: number; // Prix au moment de la commande
}

export interface IOrder extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  table: mongoose.Types.ObjectId;
  items: IOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtTime: {
    type: Number,
    required: true,
    min: 0
  },
  specialInstructions: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'paid', 'cancelled'],
    default: 'pending'
  }
});

const orderSchema = new mongoose.Schema({
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered', 'paid'],
    default: 'pending'
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Middleware pour calculer le montant total avant la sauvegarde
orderSchema.pre('save', function(this: IOrder, next) {
  this.totalAmount = this.items.reduce((total: number, item: IOrderItem) => {
    return total + (item.priceAtTime * item.quantity);
  }, 0);
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order; 