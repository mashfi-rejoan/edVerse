const { Enrollment, Course, Semester } = require('./courseManagement');

/**
 * Fetch a student's enrollment history grouped by semester, sorted chronologically
 * @param {ObjectId} studentId - Student _id
 * @returns {Promise<{success: boolean, history: Array}>}
 */
async function getStudentEnrollmentHistory(studentId) {
  // Find all enrollments for the student, populate course and semester
  const enrollments = await Enrollment.find({ student: studentId })
    .populate('course')
    .populate('semester')
    .sort({ 'semester.startDate': 1, requestedAt: 1 });

  // Group by semester
  const historyMap = new Map();
  enrollments.forEach(enr => {
    const semId = enr.semester._id.toString();
    if (!historyMap.has(semId)) {
      historyMap.set(semId, {
        semester: {
          _id: enr.semester._id,
          name: enr.semester.name,
          startDate: enr.semester.startDate,
          endDate: enr.semester.endDate
        },
        courses: []
      });
    }
    historyMap.get(semId).courses.push({
      courseId: enr.course._id,
      code: enr.course.code,
      title: enr.course.title,
      credits: enr.course.credits,
      status: enr.status,
      grade: enr.grade || null,
      requestType: enr.requestType,
      requestStatus: enr.requestStatus,
      requestedAt: enr.requestedAt
    });
  });

  // Convert to sorted array by semester start date
  const history = Array.from(historyMap.values()).sort((a, b) => new Date(a.semester.startDate) - new Date(b.semester.startDate));

  return { success: true, history };
}

module.exports = {
  getStudentEnrollmentHistory
};
