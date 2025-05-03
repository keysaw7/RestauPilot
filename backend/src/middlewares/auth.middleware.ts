import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from './errorHandler';

interface UserPayload extends JwtPayload {
  role: string;
}

// Étend l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError('Token manquant', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Token invalide', 401));
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Non authentifié', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Accès non autorisé', 403);
    }

    next();
  };
}; 