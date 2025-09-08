import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import { Car } from '../../../models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        const {
          condition,
          make,
          model,
          minYear,
          maxYear,
          minPrice,
          maxPrice,
          minMileage,
          maxMileage,
          featured,
          search,
        } = req.query;

        let query: any = {};

        // Apply filters
        if (condition) query.condition = condition;
        if (make) query.make = make;
        if (model) query.model = model;
        if (minYear) query.year = { $gte: parseInt(minYear as string) };
        if (maxYear) query.year = { ...query.year, $lte: parseInt(maxYear as string) };
        if (minPrice) query.price = { $gte: parseInt(minPrice as string) };
        if (maxPrice) query.price = { ...query.price, $lte: parseInt(maxPrice as string) };
        if (minMileage) query.mileage = { $gte: parseInt(minMileage as string) };
        if (maxMileage) query.mileage = { ...query.mileage, $lte: parseInt(maxMileage as string) };
        if (featured !== undefined) query.featured = featured === 'true';

        // Search filter
        if (search) {
          const searchRegex = new RegExp(search as string, 'i');
          query.$or = [
            { title: searchRegex },
            { make: searchRegex },
            { model: searchRegex },
            { description: searchRegex }
          ];
        }

        const cars = await Car.find(query).sort({ createdAt: -1 });
        res.status(200).json(cars);
      } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Error fetching cars' });
      }
      break;

    case 'POST':
      try {
        const carData = req.body;
        const newCar = new Car(carData);
        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
      } catch (error) {
        console.error('Error creating car:', error);
        res.status(500).json({ message: 'Error creating car' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}