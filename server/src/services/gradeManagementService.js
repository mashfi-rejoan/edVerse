const { Enrollment, RetakeHistory } = require('./courseManagement');

/**
 * Assign or update a grade for an enrollment (if not published)
 * @param {ObjectId} enrollmentId
 * @param {String} grade
 * @returns {Promise<{success: boolean, message: string, enrollment?: any}>}
 */
async function assignGrade(enrollmentId, grade) {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    return { success: false, message: 'Enrollment not found.' };
  }
  if (enrollment.grade && enrollment.requestStatus === 'Approved') {
    return { success: false, message: 'Grade already published. Cannot edit.' };
  }
  enrollment.grade = grade;
  await enrollment.save();
  return { success: true, message: 'Grade assigned.', enrollment };
}

/**
 * Publish a grade (finalize, cannot edit after)
 * @param {ObjectId} enrollmentId
 * @returns {Promise<{success: boolean, message: string, enrollment?: any}>}
 */
async function publishGrade(enrollmentId) {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    return { success: false, message: 'Enrollment not found.' };
  }
  if (!enrollment.grade) {
    return { success: false, message: 'No grade to publish.' };
  }
  if (enrollment.requestStatus === 'Approved') {
    return { success: false, message: 'Grade already published.' };
  }
  enrollment.requestStatus = 'Approved';
  await enrollment.save();
  return { success: true, message: 'Grade published.', enrollment };
}

/**
 * Handle retake grade update: replace grade, keep history
 * @param {ObjectId} enrollmentId - Retake enrollment
 * @param {String} grade
 * @returns {Promise<{success: boolean, message: string, enrollment?: any, retakeHistory?: any}>}
 */
async function assignRetakeGrade(enrollmentId, grade) {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment || enrollment.status !== 'Retake') {
    return { success: false, message: 'Retake enrollment not found.' };
  }
  if (enrollment.grade && enrollment.requestStatus === 'Approved') {
    return { success: false, message: 'Grade already published. Cannot edit.' };
  }
  // Update grade
  enrollment.grade = grade;
  await enrollment.save();
  // Update retake history
  const retakeHistory = await RetakeHistory.findOne({
    student: enrollment.student,
    course: enrollment.course,
    semester: enrollment.semester,
    status: { $in: ['Pending', 'Approved'] }
  });
  if (retakeHistory) {
    retakeHistory.retakeGrade = grade;
    retakeHistory.status = 'Completed';
    await retakeHistory.save();
  }
  return { success: true, message: 'Retake grade assigned.', enrollment, retakeHistory };
}

module.exports = {
  assignGrade,
  publishGrade,
  assignRetakeGrade
};
