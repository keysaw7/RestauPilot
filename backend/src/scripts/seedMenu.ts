import mongoose from 'mongoose';
import { MenuItem } from '../models/menuItem';

const menuItems = [
  {
    name: 'Salade César',
    description: 'Laitue romaine, croûtons, parmesan, sauce césar',
    price: 8.90,
    category: 'Entrées',
    isAvailable: true
  },
  {
    name: 'Steak Frites',
    description: 'Steak de bœuf, frites maison, sauce au choix',
    price: 16.90,
    category: 'Plats',
    isAvailable: true
  },
  {
    name: 'Pizza Margherita',
    description: 'Tomate, mozzarella, basilic',
    price: 12.90,
    category: 'Pizzas',
    isAvailable: true
  },
  {
    name: 'Tiramisu',
    description: 'Dessert italien au café et mascarpone',
    price: 6.90,
    category: 'Desserts',
    isAvailable: true
  },
  {
    name: 'Coca-Cola',
    description: 'Boisson gazeuse',
    price: 3.50,
    category: 'Boissons',
    isAvailable: true
  }
];

const seedMenu = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/restaupilot');
    console.log('Connecté à MongoDB');

    // Supprimer tous les plats existants
    await MenuItem.deleteMany({});
    console.log('Anciens plats supprimés');

    // Ajouter les nouveaux plats
    await MenuItem.insertMany(menuItems);
    console.log('Nouveaux plats ajoutés');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    process.exit(1);
  }
};

seedMenu(); 