const { Course, Student, Enrollment, Semester, RetakeHistory } = require('./courseManagement');

/**
 * Request to retake a course for a student
 * @param {ObjectId} studentId - Student _id
 * @param {ObjectId} courseId - Course _id
 * @param {ObjectId} semesterId - Semester _id
 * @returns {Promise<{success: boolean, message: string, enrollment?: any, retakeHistory?: any}>}
 */
async function retakeCourse(studentId, courseId, semesterId) {
  // Fetch course, student, semester
  const [course, student, semester] = await Promise.all([
    Course.findById(courseId),
    Student.findById(studentId),
    Semester.findById(semesterId)
  ]);
  if (!course || !student || !semester) {
    return { success: false, message: 'Invalid course, student, or semester.' };
  }

  // 1. Validate completed course
  const prevEnrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    status: 'Completed',
    grade: { $ne: null }
  }).sort({ updatedAt: -1 });
  if (!prevEnrollment) {
    return { success: false, message: 'Course not completed previously.' };
  }

  // 2. Check previous grade eligibility
  // Use course.minGradeForRetake (default 'F')
  const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
  const minGrade = course.minGradeForRetake || 'F';
  const prevGradeIdx = gradeOrder.indexOf(prevEnrollment.grade);
  const minGradeIdx = gradeOrder.indexOf(minGrade);
  if (prevGradeIdx === -1 || minGradeIdx === -1 || prevGradeIdx > minGradeIdx) {
    return { success: false, message: 'Grade not eligible for retake.' };
  }

  // 3. Prevent duplicate retake in same semester
  const existingRetake = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    semester: semesterId,
    status: 'Retake',
    requestStatus: { $in: ['Pending', 'Approved'] }
  });
  if (existingRetake) {
    return { success: false, message: 'Retake request already exists for this semester.' };
  }

  // 4. Create new enrollment with status RETAKE
  const enrollment = new Enrollment({
    student: student._id,
    course: course._id,
    semester: semester._id,
    status: 'Retake',
    requestType: 'Retake',
    requestStatus: 'Pending',
    prerequisiteStatus: 'Met',
    retakeCount: (prevEnrollment.retakeCount || 0) + 1
  });
  await enrollment.save();

  // 5. Store previous grade in RetakeHistory
  const retakeHistory = new RetakeHistory({
    student: student._id,
    course: course._id,
    semester: semester._id,
    originalGrade: prevEnrollment.grade,
    status: 'Pending',
    requestedAt: new Date()
  });
  await retakeHistory.save();

  return { success: true, message: 'Retake course request submitted.', enrollment, retakeHistory };
}

module.exports = {
  retakeCourse
};
