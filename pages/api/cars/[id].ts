import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import { Car } from '../../../models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        const car = await Car.findById(id);
        if (!car) {
          return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(car);
      } catch (error) {
        console.error('Error fetching car:', error);
        res.status(500).json({ message: 'Error fetching car' });
      }
      break;

    case 'PUT':
      try {
        const carData = req.body;
        const updatedCar = await Car.findByIdAndUpdate(id, carData, { new: true });
        if (!updatedCar) {
          return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(updatedCar);
      } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ message: 'Error updating car' });
      }
      break;

    case 'DELETE':
      try {
        const deletedCar = await Car.findByIdAndDelete(id);
        if (!deletedCar) {
          return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
      } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ message: 'Error deleting car' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}