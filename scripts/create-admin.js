import connectToDatabase from '../lib/mongodb';
import { User } from '../models';

async function createAdminUser() {
  try {
    await connectToDatabase();
    
    // Check if admin user exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username);
      return;
    }
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      password: 'admin123', // In production, use bcrypt
      isAdmin: true
    });
    
    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
