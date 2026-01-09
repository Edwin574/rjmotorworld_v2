// MongoDB initialization script
// This script runs when MongoDB container starts for the first time

db = db.getSiblingDB('rjmotorworld');

// Create a user for the application database
db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'rjmotorworld'
    }
  ]
});

// Create initial collections if needed
db.createCollection('cars');
db.createCollection('users');
db.createCollection('sessions');

// Insert some sample data (optional)
db.cars.insertMany([
  {
    brand: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    mileage: 15000,
    color: 'Silver',
    description: 'Well-maintained Toyota Camry in excellent condition',
    images: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 22000,
    mileage: 20000,
    color: 'Blue',
    description: 'Reliable Honda Civic with low mileage',
    images: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database initialized successfully!');