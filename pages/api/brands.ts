import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import { CarBrand } from '../../models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        const brands = await CarBrand.find({}).sort({ name: 1 });
        res.status(200).json(brands);
      } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ message: 'Error fetching brands' });
      }
      break;

    case 'POST':
      try {
        const brandData = req.body;
        const newBrand = new CarBrand(brandData);
        const savedBrand = await newBrand.save();
        res.status(201).json(savedBrand);
      } catch (error) {
        console.error('Error creating brand:', error);
        res.status(500).json({ message: 'Error creating brand' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}