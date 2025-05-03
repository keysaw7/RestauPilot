import { Request, Response, NextFunction } from 'express';

interface AppErrorInterface extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
}

export class AppError extends Error implements AppErrorInterface {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  // Erreur non opérationnelle : ne pas divulguer les détails
  console.error('ERROR 💥', err);
  res.status(500).json({
    status: 'error',
    message: 'Une erreur inattendue s\'est produite',
  });
}; 