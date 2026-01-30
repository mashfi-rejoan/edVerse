const { Course, Enrollment } = require('./courseManagement');

/**
 * Get course capacity analytics for a specific semester
 * @param {ObjectId} courseId
 * @param {ObjectId} semesterId
 * @returns {Promise<{success: boolean, fillRatio: number, availableSeats: number, status: string, capacity: number, enrolled: number}>}
 */
async function getCourseCapacityAnalytics(courseId, semesterId) {
  const course = await Course.findById(courseId);
  if (!course) {
    return { success: false, message: 'Course not found.' };
  }
  // Count approved enrollments for this course and semester
  const enrolled = await Enrollment.countDocuments({
    course: courseId,
    semester: semesterId,
    status: { $in: ['Enrolled', 'Retake', 'Improve'] },
    requestStatus: 'Approved'
  });
  const capacity = course.capacity;
  const fillRatio = capacity > 0 ? enrolled / capacity : 0;
  const availableSeats = Math.max(0, capacity - enrolled);
  let status = 'Available';
  if (availableSeats === 0) status = 'Full';
  else if (fillRatio >= 0.8) status = 'Almost Full';
  return {
    success: true,
    fillRatio,
    availableSeats,
    status,
    capacity,
    enrolled
  };
}

module.exports = {
  getCourseCapacityAnalytics
};
