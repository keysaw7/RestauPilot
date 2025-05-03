import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Routes protégées - Accès ADMIN uniquement
router.use(authenticate);
router.use(authorize([Role.ADMIN]));

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUser);
router.patch('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export const userRoutes = router; 