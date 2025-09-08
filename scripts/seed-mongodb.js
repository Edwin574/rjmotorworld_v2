import mongoose from 'mongoose';
import { Car, CarBrand, CarModel, User } from '../models/index.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-dealership';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Car.deleteMany({}),
      CarBrand.deleteMany({}),
      CarModel.deleteMany({}),
      User.deleteMany({})
    ]);

    // Create admin user
    const adminUser = new User({
      username: 'admin@example.com',
      password: 'admin123',
      isAdmin: true
    });
    await adminUser.save();

    // Create car brands
    const brands = await CarBrand.insertMany([
      { name: 'BMW', logoUrl: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
      { name: 'Mercedes-Benz', logoUrl: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
      { name: 'Toyota', logoUrl: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
      { name: 'Audi', logoUrl: 'https://www.carlogos.org/car-logos/audi-logo.png' }
    ]);

    // Create car models
    await CarModel.insertMany([
      { brandId: brands[0]._id, name: '3 Series' },
      { brandId: brands[0]._id, name: '5 Series' },
      { brandId: brands[0]._id, name: 'X5' },
      { brandId: brands[0]._id, name: 'M4' },
      { brandId: brands[1]._id, name: 'C-Class' },
      { brandId: brands[1]._id, name: 'E-Class' },
      { brandId: brands[1]._id, name: 'S-Class' },
      { brandId: brands[1]._id, name: 'EQS' },
      { brandId: brands[2]._id, name: 'Camry' },
      { brandId: brands[2]._id, name: 'Corolla' },
      { brandId: brands[2]._id, name: 'RAV4' },
      { brandId: brands[3]._id, name: 'A4' },
      { brandId: brands[3]._id, name: 'Q5' },
      { brandId: brands[3]._id, name: 'RS7' }
    ]);

    // Create sample cars
    await Car.insertMany([
      {
        title: 'BMW M4 Competition',
        make: 'BMW',
        model: 'M4',
        year: 2023,
        price: 82500,
        mileage: 12,
        color: 'Isle of Man Green',
        condition: 'new',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        description: 'Experience the thrill of driving with the all-new 2023 BMW M4 Competition.',
        bodyType: 'Coupe',
        engine: '3.0L Twin-Turbo',
        driveType: 'Rear-Wheel Drive',
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1617654112808-106c1d614972?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ],
        features: ['M Sport Differential', 'Adaptive M Suspension', '19"/20" M Double-spoke wheels']
      },
      {
        title: 'Audi RS7 Sportback',
        make: 'Audi',
        model: 'RS7',
        year: 2023,
        price: 123800,
        mileage: 5,
        color: 'Nardo Gray',
        condition: 'new',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        description: 'Introducing the 2023 Audi RS7 Sportback, a performance masterpiece.',
        bodyType: 'Sportback',
        engine: '4.0L Twin-Turbo V8',
        driveType: 'All-Wheel Drive',
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ],
        features: ['Quattro All-Wheel Drive', 'RS Sport Suspension', 'Bang & Olufsen Sound System']
      }
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();