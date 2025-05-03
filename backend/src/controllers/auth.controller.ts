import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto, AuthResponse } from '../types/auth.types';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data: RegisterDto = req.body;
      const result: AuthResponse = await AuthService.register(data);
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data: LoginDto = req.body;
      const result: AuthResponse = await AuthService.login(data);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
} 