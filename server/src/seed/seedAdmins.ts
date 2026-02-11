import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import bcryptjs from 'bcryptjs';

dotenv.config();

const admins = [
  {
    name: 'System Administrator',
    email: 'admin@edverse.edu',
    password: 'admin123',
    role: 'admin',
    isActive: true
  },
  {
    name: 'Academic Admin',
    email: 'academic.admin@edverse.edu',
    password: 'admin123',
    role: 'admin',
    isActive: true
  }
];

export const seedAdmins = async () => {
  try {
    await User.deleteMany({ role: 'admin' });
    
    const hashedAdmins = await Promise.all(
      admins.map(async (admin) => ({
        ...admin,
        password: await bcryptjs.hash(admin.password, 10)
      }))
    );

    await User.insertMany(hashedAdmins);
    console.log('✓ Admin users seeded successfully');
  } catch (error) {
    console.error('✗ Error seeding admins:', error);
    throw error;
  }
};

if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edverse')
    .then(async () => {
      await seedAdmins();
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database connection error:', error);
      process.exit(1);
    });
}
