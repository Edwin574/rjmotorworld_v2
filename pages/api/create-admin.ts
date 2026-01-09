import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import { User } from '../../models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectToDatabase();
    
    // Check if admin user exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      return res.status(200).json({ 
        message: 'Admin user already exists',
        username: existingAdmin.username,
        isAdmin: existingAdmin.isAdmin
      });
    }
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      password: 'admin123', // In production, use bcrypt
      isAdmin: true
    });
    
    await adminUser.save();
    
    res.status(201).json({
      message: 'Admin user created successfully!',
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    });
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
