import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedAdmins } from './seedAdmins';
import { seedTeachers } from './seedTeachers';
import { seedStudents } from './seedStudents';
import { seedCourses } from './seedCourses';

dotenv.config();

const seedAll = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/edverse');
    console.log('✓ Connected to database\n');

    await seedAdmins();
    await seedTeachers();
    await seedStudents();
    await seedCourses();

    console.log('\n🎉 All seed data inserted successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@edverse.edu / admin123');
    console.log('   Teacher: sarah.johnson@edverse.edu / teacher123');
    console.log('   Student: s.2024.a.001@student.edverse.edu / student123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAll();
