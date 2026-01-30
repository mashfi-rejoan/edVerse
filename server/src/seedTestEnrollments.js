// Seed test enrollments for the test user
const mongoose = require('mongoose');
const { Course, Enrollment } = require('./database/courseSchema');
require('dotenv').config();

// Define User schema inline for this script
const userSchema = new mongoose.Schema({
  name: String,
  universityId: String,
  email: String
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedTestEnrollments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the test user by universityId
    const testUser = await User.findOne({ universityId: '20245103183' });
    if (!testUser) {
      console.log('Test user not found. Please login first to create the user.');
      process.exit(1);
    }

    console.log(`Found user: ${testUser.name} (${testUser._id})`);

    // Clear existing enrollments for this user
    await Enrollment.deleteMany({ student: testUser._id });
    console.log('Cleared existing enrollments');

    // Get some courses for Spring 2026
    const availableCourses = await Course.find({ 
      semester: 'Spring', 
      year: 2026,
      isActive: true 
    }).limit(5);

    if (availableCourses.length === 0) {
      console.log('No courses available for Spring 2026');
      process.exit(1);
    }

    // Enroll in 3 courses
    const enrollments = [];
    for (let i = 0; i < Math.min(3, availableCourses.length); i++) {
      const enrollment = new Enrollment({
        student: testUser._id,
        course: availableCourses[i]._id,
        semester: 'Spring',
        year: 2026,
        status: 'Enrolled',
        enrolledAt: new Date()
      });
      await enrollment.save();
      enrollments.push(enrollment);
      console.log(`✓ Enrolled in ${availableCourses[i].courseCode} - ${availableCourses[i].courseName}`);
    }

    // Get courses from previous semester (Fall 2025) for retake eligibility
    const pastCourses = await Course.find({ 
      semester: 'Fall', 
      year: 2025,
      isActive: true 
    }).limit(2);

    if (pastCourses.length > 0) {
      // Create a failed course for retake
      const failedEnrollment = new Enrollment({
        student: testUser._id,
        course: pastCourses[0]._id,
        semester: 'Fall',
        year: 2025,
        status: 'Completed',
        grade: 'D',
        enrolledAt: new Date('2025-09-01'),
        completedAt: new Date('2025-12-20')
      });
      await failedEnrollment.save();
      console.log(`✓ Added retake-eligible course: ${pastCourses[0].courseCode} with grade D`);
    }

    console.log('\n✨ Test enrollments created successfully!');
    console.log(`Total enrolled in Spring 2026: ${enrollments.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedTestEnrollments();
