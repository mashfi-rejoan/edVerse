// Script to seed sample courses for testing
const mongoose = require('mongoose');
const { Course } = require('./database/courseSchema');
require('dotenv').config();

const sampleCourses = [
  {
    courseCode: 'CSE101',
    courseName: 'Introduction to Computer Science',
    instructorName: 'Dr. John Smith',
    credits: 3,
    department: 'Computer Science',
    description: 'An introduction to fundamental concepts in computer science including programming, algorithms, and data structures.',
    semester: 'Spring',
    year: 2026,
    isActive: true,
  },
  {
    courseCode: 'CSE201',
    courseName: 'Data Structures and Algorithms',
    instructorName: 'Dr. Sarah Johnson',
    credits: 4,
    department: 'Computer Science',
    description: 'Study of advanced data structures, algorithm design, and complexity analysis.',
    semester: 'Spring',
    year: 2026,
    isActive: true,
  },
  {
    courseCode: 'MAT101',
    courseName: 'Calculus I',
    instructorName: 'Prof. Michael Brown',
    credits: 3,
    department: 'Mathematics',
    description: 'Introduction to differential and integral calculus.',
    semester: 'Spring',
    year: 2026,
    isActive: true,
  },
  {
    courseCode: 'PHY101',
    courseName: 'Physics I',
    instructorName: 'Dr. Emily Davis',
    credits: 4,
    department: 'Physics',
    description: 'Classical mechanics, energy, and motion.',
    semester: 'Spring',
    year: 2026,
    isActive: true,
  },
  {
    courseCode: 'ENG101',
    courseName: 'English Composition',
    instructorName: 'Prof. David Wilson',
    credits: 3,
    department: 'English',
    description: 'Academic writing and critical thinking skills.',
    semester: 'Spring',
    year: 2026,
    isActive: true,
  },
  // Summer 2025 courses (past semester)
  {
    courseCode: 'CSE150',
    courseName: 'Web Development',
    instructorName: 'Dr. Lisa Anderson',
    credits: 3,
    department: 'Computer Science',
    description: 'HTML, CSS, JavaScript, and modern web frameworks.',
    semester: 'Summer',
    year: 2025,
    isActive: false,
  },
  {
    courseCode: 'BUS101',
    courseName: 'Business Fundamentals',
    instructorName: 'Prof. Robert Taylor',
    credits: 3,
    department: 'Business',
    description: 'Introduction to business concepts and practices.',
    semester: 'Summer',
    year: 2025,
    isActive: false,
  },
  // Fall 2025 courses (past semester)
  {
    courseCode: 'CSE180',
    courseName: 'Database Systems',
    instructorName: 'Dr. Maria Garcia',
    credits: 3,
    department: 'Computer Science',
    description: 'Database design, SQL, and NoSQL databases.',
    semester: 'Fall',
    year: 2025,
    isActive: false,
  },
];

async function seedCourses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing courses (optional)
    // await Course.deleteMany({});
    // console.log('Cleared existing courses');

    // Check which courses already exist
    const existingCodes = await Course.find({}).distinct('courseCode');
    const newCourses = sampleCourses.filter(c => !existingCodes.includes(c.courseCode));

    if (newCourses.length === 0) {
      console.log('All sample courses already exist!');
    } else {
      // Insert sample courses
      const result = await Course.insertMany(newCourses);
      console.log(`✅ Successfully added ${result.length} sample courses!`);
      
      console.log('\nAdded courses:');
      result.forEach(course => {
        console.log(`- ${course.courseCode}: ${course.courseName} (${course.semester} ${course.year})`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✨ Done!');
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
}

seedCourses();
