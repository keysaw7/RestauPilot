export interface Table {
  _id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  position: {
    x: number;
    y: number;
  };
  shape: 'square' | 'round' | 'rectangular';
  currentOrderId?: string;
} 