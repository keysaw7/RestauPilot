import { MenuItem } from './menu';

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  specialInstructions?: string;
  priceAtTime: number;
}

export interface Order {
  id: string;
  table: {
    id: string;
    number: number;
  };
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
} 