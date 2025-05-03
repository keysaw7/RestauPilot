import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMenu extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: 'starter' | 'main' | 'dessert' | 'drink' | 'other';
  isAvailable: boolean;
  preparationTime?: number; // en minutes
  ingredients?: string[];
  allergens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['starter', 'main', 'dessert', 'drink', 'other'],
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    min: 0
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

const Menu: Model<IMenu> = mongoose.model<IMenu>('Menu', MenuSchema);

export default Menu; 