const { Course, Student, Enrollment, Semester } = require('./courseManagement');
const mongoose = require('mongoose');

/**
 * Add a course for a student (request-based, pending approval)
 * @param {ObjectId} studentId - Student _id
 * @param {ObjectId} courseId - Course _id
 * @param {ObjectId} semesterId - Semester _id
 * @returns {Promise<{success: boolean, message: string, enrollment?: any}>}
 */
async function addCourse(studentId, courseId, semesterId) {

  // Fetch course, student, semester
  const [course, student, semester] = await Promise.all([
    Course.findById(courseId),
    Student.findById(studentId),
    Semester.findById(semesterId)
  ]);
  if (!course || !student || !semester) {
    return { success: false, message: 'Invalid course, student, or semester.' };
  }

  // Prevent duplicate add requests (pending or approved)
  const existingAdd = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    semester: semesterId,
    requestType: 'Add',
    requestStatus: { $in: ['Pending', 'Approved'] }
  });
  if (existingAdd) {
    return { success: false, message: 'Add request already exists or course already added.' };
  }

  // Prevent adding if already enrolled (approved, not dropped)
  const alreadyEnrolled = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    semester: semesterId,
    status: { $in: ['Enrolled', 'Retake', 'Improve'] },
    requestStatus: 'Approved'
  });
  if (alreadyEnrolled) {
    return { success: false, message: 'Already enrolled in this course.' };
  }

  // 1. Capacity check
  const enrolledCount = await Enrollment.countDocuments({
    course: courseId,
    semester: semesterId,
    status: { $in: ['Enrolled', 'Retake', 'Improve'] },
    requestStatus: 'Approved'
  });
  if (enrolledCount >= course.capacity) {
    return { success: false, message: 'Course capacity full.' };
  }

  // 2. Prerequisite check
  if (course.prerequisites && course.prerequisites.length > 0) {
    // Find all completed courses for student
    const completedCourses = await Enrollment.find({
      student: studentId,
      status: 'Completed',
      grade: { $ne: null }
    }).select('course');
    const completedCourseIds = completedCourses.map(e => String(e.course));
    // Get codes of completed courses
    const completedCourseDocs = await Course.find({ _id: { $in: completedCourseIds } });
    const completedCodes = completedCourseDocs.map(c => c.code);
    let prereqMet = false;
    if (course.prerequisiteType === 'Any') {
      prereqMet = course.prerequisites.some(code => completedCodes.includes(code));
    } else {
      prereqMet = course.prerequisites.every(code => completedCodes.includes(code));
    }
    if (!prereqMet) {
      return { success: false, message: 'Prerequisites not completed.' };
    }
  }

  // 3. Credit limit check
  const currentCredits = await Enrollment.aggregate([
    { $match: { student: student._id, semester: semester._id, requestStatus: 'Approved', status: { $in: ['Enrolled', 'Retake', 'Improve'] } } },
    { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'courseObj' } },
    { $unwind: '$courseObj' },
    { $group: { _id: null, total: { $sum: '$courseObj.credits' } } }
  ]);
  const totalCredits = (currentCredits[0]?.total || 0) + course.credits;
  const maxCredits = student.maxCreditsPerSemester || 24;
  if (totalCredits > maxCredits) {
    return { success: false, message: 'Credit limit exceeded.' };
  }

  // 4. Create Enrollment (pending approval)
  const enrollment = new Enrollment({
    student: student._id,
    course: course._id,
    semester: semester._id,
    status: 'Enrolled',
    requestType: 'Add',
    requestStatus: 'Pending',
    prerequisiteStatus: 'Met',
  });
  await enrollment.save();
  return { success: true, message: 'Add course request submitted.', enrollment };
}

/**
 * Drop a course for a student (request-based, pending approval)
 * @param {ObjectId} studentId - Student _id
 * @param {ObjectId} courseId - Course _id
 * @param {ObjectId} semesterId - Semester _id
 * @returns {Promise<{success: boolean, message: string, enrollment?: any}>}
 */
async function dropCourse(studentId, courseId, semesterId) {
  // Fetch semester for deadline
  const semester = await Semester.findById(semesterId);
  if (!semester) return { success: false, message: 'Invalid semester.' };
  const now = new Date();
  if (now > semester.addDropDeadline) {
    return { success: false, message: 'Add/Drop deadline has passed.' };
  }

  // Prevent duplicate drop requests (pending or approved)
  const existingDrop = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    semester: semesterId,
    requestType: 'Drop',
    requestStatus: { $in: ['Pending', 'Approved'] }
  });
  if (existingDrop) {
    return { success: false, message: 'Drop request already exists for this course.' };
  }

  // Find active enrollment (must be enrolled to drop)
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    semester: semesterId,
    status: { $in: ['Enrolled', 'Retake', 'Improve'] },
    requestStatus: 'Approved'
  });
  if (!enrollment) {
    return { success: false, message: 'Enrollment not found or already dropped.' };
  }

  // Create drop request (pending approval)
  const dropRequest = new Enrollment({
    student: studentId,
    course: courseId,
    semester: semesterId,
    status: 'Dropped',
    requestType: 'Drop',
    requestStatus: 'Pending',
    prerequisiteStatus: enrollment.prerequisiteStatus || 'Met',
  });
  await dropRequest.save();
  return { success: true, message: 'Drop course request submitted.', enrollment: dropRequest };
}

module.exports = {
  addCourse,
  dropCourse
};
