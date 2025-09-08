import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { log } from './vite';
import { storage } from './storage';
import { MemStorage } from './storage';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

let isMongoDBConnected = false;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. MongoDB is required.');
  }

  log('Connecting to MongoDB...', 'mongodb');
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });
  log('Connected to MongoDB database', 'mongodb');
  isMongoDBConnected = true;
}

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isMongoDBConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
  isMongoDBConnected = false;
});

process.on('SIGINT', async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
  }
  process.exit(0);
});

export function isConnectedToMongoDB() {
  return isMongoDBConnected;
}

export default mongoose;