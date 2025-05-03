import mongoose from 'mongoose';
import { Table } from '../models/table';

const tables = [
  {
    number: 1,
    capacity: 4,
    status: 'available'
  },
  {
    number: 2,
    capacity: 2,
    status: 'available'
  },
  {
    number: 3,
    capacity: 6,
    status: 'available'
  },
  {
    number: 4,
    capacity: 4,
    status: 'available'
  },
  {
    number: 5,
    capacity: 8,
    status: 'available'
  }
];

const seedTables = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/restaupilot');
    console.log('Connecté à MongoDB');

    // Supprimer toutes les tables existantes
    await Table.deleteMany({});
    console.log('Anciennes tables supprimées');

    // Ajouter les nouvelles tables
    await Table.insertMany(tables);
    console.log('Nouvelles tables ajoutées');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    process.exit(1);
  }
};

seedTables(); 