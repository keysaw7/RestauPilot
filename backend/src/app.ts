import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middlewares/errorHandler';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import tableRoutes from './routes/tableRoutes';
import orderRoutes from './routes/orderRoutes';
import menuRoutes from './routes/menuRoutes';
import { reservationRoutes } from './routes/reservation.routes';
import mongoose from 'mongoose';
import tablesRoutes from './routes/tables';
import ordersRoutes from './routes/orders';

// Création de l'application Express
const app = express();

// Création du client Prisma
export const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/orders', ordersRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Database connection (seulement en dehors des tests)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost:27017/restaupilot')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app; 