import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import tableRoutes from './routes/tableRoutes';
import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tables', tableRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 