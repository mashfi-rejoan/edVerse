import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import axios from 'axios';
import { apiUrl } from '../../utils/apiBase';

interface Course {
  _id?: string;
  courseId?: string;
  enrollmentId?: string;
  code: string;
  title: string;
  credits: number;
  status: string;
  seats: string;
  canDrop: boolean;
  enrollmentStatus?: string;
}

interface AvailableCourse {
  _id: string;
  code: string;
  title: string;
  credits: number;
  instructor: string;
  seats: { filled: number; total: number };
  prerequisites: string;
  prerequisitesMet: boolean;
}

interface RetakeCourse {
  _id?: string;
  courseId?: string;
  enrollmentId?: string;
  code: string;
  title: string;
  credits: number;
  previousGrade: string;
  semester: string;
  canRetake: boolean;
}

interface EnrollmentHistory {
  _id: string;
  courseCode: string;
  courseName: string;
  semester: string;
  year: number;
  grade?: string;
  status: string;
}

const CourseManagement = () => {
  const [showDropModal, setShowDropModal] = useState(false);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedRetakeCourse, setSelectedRetakeCourse] = useState<RetakeCourse | null>(null);
  const [selectedAvailableCourse, setSelectedAvailableCourse] = useState<string>('');
  const [isAddDropOpen, setIsAddDropOpen] = useState(true);
  
  // Data states
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>([]);
  const [retakeCourses, setRetakeCourses] = useState<RetakeCourse[]>([]);
  const [enrollmentHistory, setEnrollmentHistory] = useState<EnrollmentHistory[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchEnrolledCourses(),
        fetchAvailableCourses(),
        fetchRetakeCourses(),
        fetchEnrollmentHistory()
      ]);
    } catch (err) {
      setError('Failed to load course data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(
        apiUrl(`/api/courses/student/${user.id}/courses?semester=Spring&year=2026`),
        { withCredentials: true }
      );
      const courses = response.data.courses || [];
      const formattedCourses = courses.map((c: any) => ({
        _id: c._id,
        courseId: c.courseId,
        enrollmentId: c.enrollmentId,
        code: c.courseCode,
        title: c.courseName,
        credits: c.credits || 0,
        status: c.enrollmentStatus || 'Enrolled',
        seats: `${c.enrolledCount || 0}/${c.maxStudents || 50}`,
        canDrop: c.enrollmentStatus !== 'Retake',
        enrollmentStatus: c.enrollmentStatus
      })).sort((a: any, b: any) => a.code.localeCompare(b.code));
      setEnrolledCourses(formattedCourses);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get(
        apiUrl('/api/courses/courses/available?semester=Spring&year=2026'),
        { withCredentials: true }
      );
      const courses = response.data.courses || [];
      const formattedCourses = courses.map((c: any) => ({
        _id: c._id,
        code: c.courseCode,
        title: c.courseName,
        credits: c.credits || 0,
        instructor: c.instructorName || 'TBA',
        seats: { filled: c.enrolledCount || 0, total: c.maxStudents || 50 },
        prerequisites: c.prerequisite || 'None',
        prerequisitesMet: true
      })).sort((a: any, b: any) => a.code.localeCompare(b.code));
      setAvailableCourses(formattedCourses);
    } catch (err) {
      console.error('Error fetching available courses:', err);
    }
  };

  const fetchRetakeCourses = async () => {
    try {
      const response = await axios.get(
        apiUrl(`/api/courses/student/${user.id}/courses?status=completed`),
        { withCredentials: true }
      );
      const courses = response.data.courses || [];
      const failedCourses = courses.filter((c: any) => 
        c.grade === 'F' || c.grade === 'D'
      ).map((c: any) => ({
        _id: c._id, // This is the course _id from the populated course object
        courseId: c._id, // Use the course _id
        enrollmentId: c.enrollmentId,
        code: c.courseCode,
        title: c.courseName,
        credits: c.credits || 0,
        previousGrade: c.grade,
        semester: `${c.semester} ${c.year}`,
        canRetake: true
      })).sort((a: any, b: any) => a.code.localeCompare(b.code));
      setRetakeCourses(failedCourses);
    } catch (err) {
      console.error('Error fetching retake courses:', err);
    }
  };

  const fetchEnrollmentHistory = async () => {
    try {
      const response = await axios.get(
        apiUrl(`/api/courses/student/${user.id}/courses`),
        { withCredentials: true }
      );
      const history = response.data.courses || [];
      setEnrollmentHistory(history.map((c: any) => ({
        _id: c._id,
        courseCode: c.courseCode,
        courseName: c.courseName,
        semester: c.semester,
        year: c.year,
        grade: c.grade,
        status: c.enrollmentStatus
      })));
    } catch (err) {
      console.error('Error fetching enrollment history:', err);
    }
  };

  const selectedCourseDetails = availableCourses.find(c => c.code === selectedAvailableCourse);

  const handleAddCourse = async () => {
    if (!selectedAvailableCourse || !selectedCourseDetails) return;
    
    setActionLoading(true);
    try {
      await axios.post(
        apiUrl('/api/courses/enroll'),
        {
          studentId: user.id,
          courseId: selectedCourseDetails._id,
          semester: 'Spring',
          year: 2026
        },
        { withCredentials: true }
      );
      
      alert('Course added successfully!');
      setSelectedAvailableCourse('');
      await fetchEnrolledCourses();
      await fetchAvailableCourses();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to add course';
      alert(errorMsg);
      console.error('Error adding course:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetakeClick = (course: RetakeCourse) => {
    if (!course.canRetake) return;
    setSelectedRetakeCourse(course);
    setShowRetakeModal(true);
  };

  const handleConfirmRetake = async () => {
    if (!selectedRetakeCourse) return;
    
    setActionLoading(true);
    try {
      await axios.post(
        apiUrl('/api/courses/retake'),
        {
          studentId: user.id,
          courseId: selectedRetakeCourse.courseId,
          semester: 'Spring',
          year: 2026
        },
        { withCredentials: true }
      );
      
      alert('Course retake registered successfully!');
      setShowRetakeModal(false);
      setSelectedRetakeCourse(null);
      await fetchEnrolledCourses();
      await fetchRetakeCourses();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to register for retake';
      alert(errorMsg);
      console.error('Error retaking course:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRetake = () => {
    setShowRetakeModal(false);
    setSelectedRetakeCourse(null);
  };

  const handleDropClick = (course: Course) => {
    if (!course.canDrop) return;
    setSelectedCourse(course);
    setShowDropModal(true);
  };

  const handleConfirmDrop = async () => {
    if (!selectedCourse || !selectedCourse.enrollmentId) return;
    
    setActionLoading(true);
    try {
      await axios.post(
        apiUrl('/api/courses/drop'),
        {
          studentId: user.id,
          enrollmentId: selectedCourse.enrollmentId
        },
        { withCredentials: true }
      );
      
      alert('Course dropped successfully!');
      setShowDropModal(false);
      setSelectedCourse(null);
      await fetchEnrolledCourses();
      await fetchAvailableCourses();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to drop course';
      alert(errorMsg);
      console.error('Error dropping course:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelDrop = () => {
    setShowDropModal(false);
    setSelectedCourse(null);
  };

  return (
    <DashboardLayout title="Registration">
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0C2B4E]">Registration</h1>
          <p className="text-gray-600 mt-2">Register for courses, manage enrollments, and plan your semester</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 mb-6">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2B4E]"></div>
              <p className="mt-4 text-gray-600">Loading course data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={fetchAllData}
              className="mt-3 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded hover:bg-red-50 transition"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Current Semester Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Semester Info */}
                <div className="md:col-span-1">
                  <p className="text-sm text-gray-600 font-medium mb-1">Current Semester</p>
                  <p className="text-2xl font-bold text-[#0C2B4E]">Spring 2026</p>
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      isAddDropOpen 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {isAddDropOpen ? 'Add/Drop Open' : 'Add/Drop Closed'}
                    </span>
                  </div>
                </div>

                {/* Enrolled Courses */}
                <div className="border-l border-gray-200 pl-6">
                  <p className="text-sm text-gray-600 font-medium mb-1">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-[#1A3D64]">{enrolledCourses.length}</p>
                  <p className="text-xs text-gray-500 mt-1">out of 6 max</p>
                </div>

                {/* Credits */}
                <div className="border-l border-gray-200 pl-6">
                  <p className="text-sm text-gray-600 font-medium mb-1">Total Credits</p>
                  <p className="text-2xl font-bold text-[#1D546C]">
                    {enrolledCourses.reduce((sum, course) => sum + course.credits, 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">out of 18 max</p>
                </div>

                {/* Credit Progress */}
                <div className="border-l border-gray-200 pl-6">
                  <p className="text-sm text-gray-600 font-medium mb-2">Credit Limit</p>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-[#1D546C]">
                          {Math.round((enrolledCourses.reduce((sum, course) => sum + course.credits, 0) / 18) * 100)}%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-gray-600">
                          {enrolledCourses.reduce((sum, course) => sum + course.credits, 0).toFixed(1)}/18
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                      <div 
                        style={{ width: `${Math.min((enrolledCourses.reduce((sum, course) => sum + course.credits, 0) / 18) * 100, 100)}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#1D546C]"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Courses Section */}

        {/* Enrolled Courses Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#0C2B4E]">Enrolled Courses</h2>
            <span className="text-sm text-gray-600">{enrolledCourses.length} courses enrolled</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course Code</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course Title</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Credits</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Seats</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrolledCourses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No courses enrolled
                    </td>
                  </tr>
                ) : (
                  enrolledCourses.map((course, index) => {
                    const [filled, total] = course.seats.split('/').map(Number);
                    const percentage = (filled / total) * 100;
                    const seatColor = percentage >= 95 ? 'red' : percentage >= 85 ? 'yellow' : 'green';
                    
                    return (
                      <tr key={course._id || index} className={`${index !== enrolledCourses.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition`}>
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm font-semibold text-[#0C2B4E]">{course.code}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-800">{course.title}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-sm font-medium text-gray-700">{course.credits}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            course.status === 'Retake'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {course.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs text-gray-600">{course.seats}</span>
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full bg-${seatColor}-500`} style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleDropClick(course)}
                            disabled={!course.canDrop || !isAddDropOpen || actionLoading}
                            className={`px-4 py-1.5 text-sm font-medium rounded transition ${
                              course.canDrop && isAddDropOpen && !actionLoading
                                ? 'text-red-600 hover:bg-red-50 border border-red-300'
                                : 'text-gray-400 bg-gray-100 border border-gray-300 cursor-not-allowed'
                            }`}
                          >
                            {actionLoading ? 'Processing...' : 'Drop'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Course Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#0C2B4E] mb-6">Add Course</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Course Selection */}
            <div>
              <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                id="course-select"
                value={selectedAvailableCourse}
                onChange={(e) => setSelectedAvailableCourse(e.target.value)}
                disabled={!isAddDropOpen}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent transition ${
                  isAddDropOpen 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                <option value="">-- Choose a course --</option>
                {availableCourses.map(course => (
                  <option key={course.code} value={course.code}>
                    {course.code} - {course.title}
                  </option>
                ))}
              </select>

              {!isAddDropOpen && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">Add/Drop Period Closed</p>
                    <p className="text-xs text-red-700 mt-1">Course registration is currently not available.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Course Details */}
            <div>
              {selectedCourseDetails ? (
                <div className="space-y-4">
                  <div className="bg-[#F4F4F4] rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-[#0C2B4E] mb-3">
                      {selectedCourseDetails.code} - {selectedCourseDetails.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Instructor:</span>
                        <span className="font-medium text-gray-800">{selectedCourseDetails.instructor}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credits:</span>
                        <span className="font-medium text-gray-800">{selectedCourseDetails.credits}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Available Seats:</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            selectedCourseDetails.seats.filled >= selectedCourseDetails.seats.total 
                              ? 'text-red-600' 
                              : selectedCourseDetails.seats.filled / selectedCourseDetails.seats.total > 0.85
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}>
                            {selectedCourseDetails.seats.total - selectedCourseDetails.seats.filled} / {selectedCourseDetails.seats.total}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-300">
                        <span className="text-gray-600 text-xs">Prerequisites:</span>
                        <p className="text-gray-800 font-medium text-xs mt-1">
                          {selectedCourseDetails.prerequisites || 'None'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warning Messages */}
                  {!selectedCourseDetails.prerequisitesMet && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Prerequisites Not Met</p>
                        <p className="text-xs text-yellow-700 mt-1">You have not completed the required prerequisite courses.</p>
                      </div>
                    </div>
                  )}

                  {selectedCourseDetails.seats.filled >= selectedCourseDetails.seats.total && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-red-800">Course Full</p>
                        <p className="text-xs text-red-700 mt-1">No seats available. Check back later for openings.</p>
                      </div>
                    </div>
                  )}

                  {/* Add Button */}
                  <button
                    onClick={handleAddCourse}
                    disabled={
                      actionLoading ||
                      !isAddDropOpen || 
                      !selectedCourseDetails.prerequisitesMet || 
                      selectedCourseDetails.seats.filled >= selectedCourseDetails.seats.total
                    }
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                      actionLoading ||
                      !isAddDropOpen || 
                      !selectedCourseDetails.prerequisitesMet || 
                      selectedCourseDetails.seats.filled >= selectedCourseDetails.seats.total
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0C2B4E] text-white hover:bg-[#1A3D64]'
                    }`}
                  >
                    {actionLoading ? 'Adding...' : 'Add Course'}
                  </button>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Select a course to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Retake Courses Section */}
        {retakeCourses.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg shadow-sm border-2 border-orange-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0C2B4E]">Courses Eligible for Retake</h2>
                <p className="text-sm text-gray-600">Review and retake courses to improve your grade</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-orange-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-100/50 border-b-2 border-orange-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course Code</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course Title</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Credits</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Previous Grade</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Semester</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {retakeCourses.map((course, index) => (
                    <tr key={course.code} className={`${index !== retakeCourses.length - 1 ? 'border-b border-orange-100' : ''} hover:bg-orange-50/30 transition`}>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-semibold text-[#0C2B4E]">{course.code}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-800">{course.title}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-medium text-gray-700">{course.credits}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-3 py-1 text-sm font-bold rounded ${
                          course.previousGrade === 'F' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {course.previousGrade}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-gray-600">{course.semester}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleRetakeClick(course)}
                          disabled={!course.canRetake || !isAddDropOpen}
                          className={`px-4 py-1.5 text-sm font-medium rounded transition ${
                            course.canRetake && isAddDropOpen
                              ? 'text-orange-700 bg-orange-100 hover:bg-orange-200 border border-orange-300'
                              : 'text-gray-400 bg-gray-100 border border-gray-300 cursor-not-allowed'
                          }`}
                        >
                          Retake
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-start gap-2 p-3 bg-white border border-orange-300 rounded-lg">
              <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-800">Important Information</p>
                <p className="text-xs text-gray-600 mt-1">
                  Retaking a course will replace your previous grade. The new grade will be reflected in your GPA calculation.
                </p>
              </div>
            </div>
          </div>
        )}

            </>
        )}

        {/* Drop Confirmation Modal */}
        {showDropModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-[#0C2B4E]">Drop Course</h3>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6">
                <div className="mb-4">
                  <p className="text-gray-800 font-medium mb-2">
                    {selectedCourse.code} - {selectedCourse.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    Credits: {selectedCourse.credits}
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Warning:</strong> Dropping this course will remove it from your enrollment. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Are you sure you want to drop this course?
                </p>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end rounded-b-lg">
                <button
                  onClick={handleCancelDrop}
                  disabled={actionLoading}
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDrop}
                  disabled={actionLoading}
                  className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                >
                  {actionLoading ? 'Dropping...' : 'Confirm Drop'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Retake Confirmation Modal */}
        {showRetakeModal && selectedRetakeCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
                <h3 className="text-lg font-semibold text-[#0C2B4E]">Retake Course</h3>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6">
                <div className="mb-4">
                  <p className="text-gray-800 font-medium mb-2">
                    {selectedRetakeCourse.code} - {selectedRetakeCourse.title}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Credits: {selectedRetakeCourse.credits}</span>
                    <span className="flex items-center gap-1">
                      Previous Grade: 
                      <span className={`ml-1 px-2 py-0.5 rounded font-bold ${
                        selectedRetakeCourse.previousGrade === 'F' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {selectedRetakeCourse.previousGrade}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-orange-700">
                        <strong>Grade Replacement:</strong> Your new grade will replace the previous grade in your transcript and GPA calculation.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Are you sure you want to retake this course?
                </p>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end rounded-b-lg">
                <button
                  onClick={handleCancelRetake}
                  disabled={actionLoading}
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRetake}
                  disabled={actionLoading}
                  className="px-5 py-2 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700 transition disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'Confirm Retake'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseManagement;
