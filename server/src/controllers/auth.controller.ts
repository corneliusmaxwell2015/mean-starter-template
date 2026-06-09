import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashed });

    res.json({
      message: 'User registered successfully',
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.json({
      accessToken,
      refreshToken
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: 'Refresh token required' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;

    const accessToken = generateAccessToken(decoded.userId);

    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
