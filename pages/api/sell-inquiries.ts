import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import { SellInquiry } from '../../models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        const inquiries = await SellInquiry.find({}).sort({ createdAt: -1 });
        res.status(200).json(inquiries);
      } catch (error) {
        console.error('Error fetching sell inquiries:', error);
        res.status(500).json({ message: 'Error fetching sell inquiries' });
      }
      break;

    case 'POST':
      try {
        const inquiryData = req.body;
        const newInquiry = new SellInquiry(inquiryData);
        const savedInquiry = await newInquiry.save();
        res.status(201).json(savedInquiry);
      } catch (error) {
        console.error('Error creating sell inquiry:', error);
        res.status(500).json({ message: 'Error creating sell inquiry' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}