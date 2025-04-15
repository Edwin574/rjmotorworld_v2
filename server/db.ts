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
    log('MONGODB_URI environment variable is not set. Using in-memory storage.', 'mongodb');
    return false;
  }

  try {
    log('Connecting to MongoDB...', 'mongodb');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s of selection failure
      connectTimeoutMS: 10000,       // Timeout after 10s of initial connection failure
    });
    
    log('Connected to MongoDB database', 'mongodb');
    isMongoDBConnected = true;
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    log('Using in-memory storage fallback', 'mongodb');
    return false;
  }
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