import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateLogin, validateRegister } from '../validators/auth.validator';

const router = Router();

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);

export const authRoutes = router; 