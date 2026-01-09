import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import { SellInquiry } from '../../models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  await connectToDatabase();

  try {
    const inquiryData = req.body;
    
    // Create new sell inquiry
    const newInquiry = new SellInquiry(inquiryData);
    const savedInquiry = await newInquiry.save();
    
    res.status(201).json(savedInquiry);
  } catch (error: any) {
    console.error('Error creating sell inquiry:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: 'Error creating sell inquiry' });
  }
}
