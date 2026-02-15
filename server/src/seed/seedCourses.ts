import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';
import User from '../models/User';

dotenv.config();

const courses = [
  {
    courseCode: 'CSE101',
    courseName: 'Introduction to Programming',
    credits: 3,
    semester: 1,
    department: 'Computer Science',
    courseType: 'Theory' as const,
    academicYear: '2024',
    description: 'Fundamentals of programming using C',
    isOffering: true
  },
  {
    courseCode: 'CSE102',
    courseName: 'Data Structures',
    credits: 3,
    semester: 2,
    department: 'Computer Science',
    courseType: 'Theory' as const,
    prerequisites: ['CSE101'],
    academicYear: '2024',
    description: 'Study of data structures and algorithms',
    isOffering: true
  },
  {
    courseCode: 'CSE103',
    courseName: 'Database Systems',
    credits: 3,
    semester: 3,
    department: 'Computer Science',
    courseType: 'Theory + Lab' as const,
    prerequisites: ['CSE102'],
    academicYear: '2024',
    description: 'Relational database design and SQL',
    isOffering: true
  },
  {
    courseCode: 'CSE104',
    courseName: 'Algorithms',
    credits: 3,
    semester: 4,
    department: 'Computer Science',
    courseType: 'Theory' as const,
    prerequisites: ['CSE102'],
    academicYear: '2024',
    description: 'Advanced algorithm design and analysis',
    isOffering: true
  },
  {
    courseCode: 'CSE201',
    courseName: 'Object Oriented Programming',
    credits: 3,
    semester: 2,
    department: 'Computer Science',
    courseType: 'Theory + Lab' as const,
    prerequisites: ['CSE101'],
    academicYear: '2024',
    description: 'OOP concepts using Java',
    isOffering: true
  },
  {
    courseCode: 'CSE202',
    courseName: 'Web Development',
    credits: 3,
    semester: 3,
    department: 'Computer Science',
    courseType: 'Lab' as const,
    prerequisites: ['CSE101'],
    academicYear: '2024',
    description: 'HTML, CSS, JavaScript, and modern web frameworks',
    isOffering: true
  },
  {
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    credits: 3,
    semester: 1,
    department: 'Mathematics',
    courseType: 'Theory' as const,
    academicYear: '2024',
    description: 'Differential and integral calculus',
    isOffering: true
  },
  {
    courseCode: 'MATH102',
    courseName: 'Linear Algebra',
    credits: 3,
    semester: 2,
    department: 'Mathematics',
    courseType: 'Theory' as const,
    academicYear: '2024',
    description: 'Vectors, matrices, and linear transformations',
    isOffering: true
  }
];

export const seedCourses = async () => {
  try {
    await Course.deleteMany({});

    // Get an admin user as creator
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      throw new Error('No admin user found. Please seed admins first.');
    }

    const coursesWithCreator = courses.map(course => ({
      ...course,
      createdBy: admin._id
    }));

    await Course.insertMany(coursesWithCreator);
    console.log(`✓ ${courses.length} courses seeded successfully`);
  } catch (error) {
    console.error('✗ Error seeding courses:', error);
    throw error;
  }
};

if (require.main === module) {
  mongoose
    .connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/edverse')
    .then(async () => {
      await seedCourses();
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database connection error:', error);
      process.exit(1);
    });
}
