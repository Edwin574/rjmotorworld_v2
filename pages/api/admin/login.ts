import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import { User } from '../../../models';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rj-motorworld-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'rj-motorworld-refresh-secret-key';

const generateTokens = (user: any) => {
  const payload = { id: user._id, username: user.username, role: 'admin' };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectToDatabase();
    
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For simplicity, we're doing plain text comparison
    // In production, you should use bcrypt or similar
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}