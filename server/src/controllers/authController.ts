import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { AuthRequest } from '../middleware/auth';

const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const signToken = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return jwt.sign({ role: 'admin' }, secret, { expiresIn: '7d' });
};

const setTokenCookie = (res: Response, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      res.status(400).json({ message: 'Password is required' });
      return;
    }

    const admin = await Admin.findOne();
    if (!admin) {
      res.status(500).json({ message: 'Admin account not configured' });
      return;
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    const token = signToken();
    setTokenCookie(res, token);

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully' });
};

export const verify = (req: AuthRequest, res: Response): void => {
  res.json({ authenticated: true, user: req.user });
};
