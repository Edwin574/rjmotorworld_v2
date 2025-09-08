import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import { Car } from '../../../models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectToDatabase();
    const featuredCars = await Car.find({ featured: true }).sort({ createdAt: -1 }).limit(6);
    res.status(200).json(featuredCars);
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    res.status(500).json({ message: 'Error fetching featured cars' });
  }
}