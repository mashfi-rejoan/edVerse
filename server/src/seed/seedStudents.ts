import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Student from '../models/Student';

dotenv.config();

const generateStudents = (batch: string, section: string, count: number) => {
  const students = [];
  for (let i = 1; i <= count; i++) {
    const id = `S-${batch}-${section}-${String(i).padStart(3, '0')}`;
    students.push({
      universityId: id,
      name: `Student ${id}`,
      email: `${id.toLowerCase().replace(/-/g, '.')}@student.edverse.edu`,
      password: 'student123',
      phone: `+123456${String(i).padStart(4, '0')}`,
      batch,
      section,
      semester: 1,
      bloodGroup: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)] as any
    });
  }
  return students;
};

const students = [
  ...generateStudents('2024', 'A', 15),
  ...generateStudents('2024', 'B', 15),
  ...generateStudents('2023', 'A', 10),
  ...generateStudents('2023', 'B', 10)
];

export const seedStudents = async () => {
  try {
    // Delete existing students
    const studentUsers = await User.find({ role: 'student' });
    const studentUserIds = studentUsers.map(u => u._id);
    await Student.deleteMany({ userId: { $in: studentUserIds } });
    await User.deleteMany({ role: 'student' });

    // Create new students
    let count = 0;
    for (const studentData of students) {
      const user = await User.create({
        name: studentData.name,
        email: studentData.email,
        universityId: studentData.universityId,
        password: studentData.password,
        role: 'student',
        isActive: true
      });

      // Ensure password is hashed correctly
      user.password = studentData.password;
      await user.save();

      await Student.create({
        universityId: studentData.universityId,
        userId: user._id,
        name: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        batch: studentData.batch,
        section: studentData.section,
        semester: studentData.semester,
        bloodGroup: studentData.bloodGroup
      });

      count++;
      if (count % 10 === 0) {
        console.log(`  Created ${count}/${students.length} students...`);
      }
    }

    console.log(`✓ ${students.length} students seeded successfully`);
  } catch (error) {
    console.error('✗ Error seeding students:', error);
    throw error;
  }
};

if (require.main === module) {
  mongoose
    .connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/edverse')
    .then(async () => {
      await seedStudents();
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database connection error:', error);
      process.exit(1);
    });
}
