import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginDto, RegisterDto, JwtPayload, AuthResponse } from '../types/auth.types';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

export class AuthService {
  private static generateToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError('JWT_SECRET non défini', 500);
    }
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  static async register(data: RegisterDto): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Cet email est déjà utilisé', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || Role.WAITER,
      },
    });

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Ne pas renvoyer le mot de passe
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

  static async login(data: LoginDto): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Ne pas renvoyer le mot de passe
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }
} 