import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError } from '../middlewares/errorHandler';

const handleValidationErrors = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    throw new AppError(messages.join(', '), 400);
  }
  next();
};

export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('firstName')
    .notEmpty()
    .withMessage('Le prénom est requis')
    .trim(),
  body('lastName')
    .notEmpty()
    .withMessage('Le nom est requis')
    .trim(),
  body('role')
    .optional()
    .isIn(['ADMIN', 'MANAGER', 'WAITER', 'KITCHEN'])
    .withMessage('Rôle invalide'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
  handleValidationErrors,
]; 