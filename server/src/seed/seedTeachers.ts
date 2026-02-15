import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Teacher from '../models/Teacher';
import bcryptjs from 'bcryptjs';

dotenv.config();

const teachers = [
  {
    universityId: 'T-2024-001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@edverse.edu',
    password: 'teacher123',
    phone: '+1234567890',
    designation: 'Professor' as const,
    department: 'Computer Science',
    specialization: 'Artificial Intelligence',
    qualifications: ['PhD in Computer Science', 'MSc in AI'],
    experience: 15,
    officeRoom: 'CSE-301',
    officeHours: 'Mon-Wed 2:00 PM - 4:00 PM'
  },
  {
    universityId: 'T-2024-002',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@edverse.edu',
    password: 'teacher123',
    phone: '+1234567891',
    designation: 'Associate Professor' as const,
    department: 'Computer Science',
    specialization: 'Data Structures & Algorithms',
    qualifications: ['PhD in Computer Science', 'MSc in Software Engineering'],
    experience: 10,
    officeRoom: 'CSE-302',
    officeHours: 'Tue-Thu 3:00 PM - 5:00 PM'
  },
  {
    universityId: 'T-2024-003',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@edverse.edu',
    password: 'teacher123',
    phone: '+1234567892',
    designation: 'Assistant Professor' as const,
    department: 'Mathematics',
    specialization: 'Applied Mathematics',
    qualifications: ['PhD in Mathematics', 'MSc in Statistics'],
    experience: 7,
    officeRoom: 'MATH-201',
    officeHours: 'Mon-Fri 1:00 PM - 2:00 PM'
  },
  {
    universityId: 'T-2024-004',
    name: 'Dr. David Wilson',
    email: 'david.wilson@edverse.edu',
    password: 'teacher123',
    phone: '+1234567893',
    designation: 'Senior Lecturer' as const,
    department: 'Computer Science',
    specialization: 'Database Systems',
    qualifications: ['MSc in Computer Science', 'BSc in Software Engineering'],
    experience: 8,
    officeRoom: 'CSE-303',
    officeHours: 'Wed-Fri 10:00 AM - 12:00 PM'
  },
  {
    universityId: 'T-2024-005',
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@edverse.edu',
    password: 'teacher123',
    phone: '+1234567894',
    designation: 'Lecturer' as const,
    department: 'Computer Science',
    specialization: 'Web Development',
    qualifications: ['MSc in Computer Science', 'BSc in IT'],
    experience: 5,
    officeRoom: 'CSE-304',
    officeHours: 'Mon-Thu 2:00 PM - 3:00 PM'
  }
];

export const seedTeachers = async () => {
  try {
    // Delete existing teachers
    const teacherUsers = await User.find({ role: 'teacher' });
    const teacherUserIds = teacherUsers.map(u => u._id);
    await Teacher.deleteMany({ userId: { $in: teacherUserIds } });
    await User.deleteMany({ role: 'teacher' });

    // Create new teachers
    for (const teacherData of teachers) {
      const hashedPassword = await bcryptjs.hash(teacherData.password, 10);
      
      const user = await User.create({
        name: teacherData.name,
        email: teacherData.email,
        universityId: teacherData.universityId,
        password: hashedPassword,
        role: 'teacher',
        isActive: true
      });

      await Teacher.create({
        universityId: teacherData.universityId,
        userId: user._id,
        name: teacherData.name,
        email: teacherData.email,
        phone: teacherData.phone,
        designation: teacherData.designation,
        department: teacherData.department,
        specialization: teacherData.specialization,
        qualifications: teacherData.qualifications,
        experience: teacherData.experience,
        officeRoom: teacherData.officeRoom,
        officeHours: teacherData.officeHours
      });
    }

    console.log(`✓ ${teachers.length} teachers seeded successfully`);
  } catch (error) {
    console.error('✗ Error seeding teachers:', error);
    throw error;
  }
};

if (require.main === module) {
  mongoose
    .connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/edverse')
    .then(async () => {
      await seedTeachers();
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database connection error:', error);
      process.exit(1);
    });
}
