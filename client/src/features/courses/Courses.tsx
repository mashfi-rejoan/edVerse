import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { BookOpen, FileText, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '../../utils/apiBase';

interface Teacher {
  _id: string;
  name: string;
  email: string;
  department?: string;
  officeHours?: string;
}

interface EnrolledCourse {
  _id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  instructor?: Teacher;
  instructorName?: string;
  instructorEmail?: string;
  description?: string;
  semester: string;
  year: number;
  outline?: string;
  materialsLink?: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        apiUrl(`/api/courses/student/${user.id}/courses?semester=Spring&year=2026`),
        { withCredentials: true }
      );
      
      const coursesData = response.data.courses || [];
      const sortedCourses = coursesData.sort((a: EnrolledCourse, b: EnrolledCourse) => 
        a.courseCode.localeCompare(b.courseCode)
      );
      setCourses(sortedCourses);
      
      if (sortedCourses.length > 0) {
        setSelectedCourse(sortedCourses[0]);
      }
    } catch (err) {
      setError('Failed to load enrolled courses');
    } finally {
      setLoading(false);
    }
  };


  return (
    <DashboardLayout title="My Courses">
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-[#0C2B4E] via-[#1A3D64] to-[#1D546C] rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">My Courses</h1>
                <p className="text-white/80 mt-1">View your enrolled courses and course materials</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2B4E]"></div>
              <p className="mt-4 text-gray-600">Loading your courses...</p>
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
              onClick={fetchEnrolledCourses}
              className="mt-3 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded hover:bg-red-50 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {courses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                <div className="text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No Enrolled Courses</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    You haven't enrolled in any courses yet. Visit the Registration page to enroll.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course List Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h2 className="text-lg font-semibold text-[#0C2B4E] mb-4">Enrolled Courses</h2>
                    <div className="space-y-2">
                      {courses.map((course) => (
                        <button
                          key={course._id}
                          onClick={() => setSelectedCourse(course)}
                          className={`w-full text-left p-4 rounded-lg border transition ${
                            selectedCourse?._id === course._id
                              ? 'bg-[#0C2B4E] text-white border-[#0C2B4E]'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-[#1A3D64] hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <BookOpen size={20} className={selectedCourse?._id === course._id ? 'text-white' : 'text-[#1D546C]'} />
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold text-sm ${selectedCourse?._id === course._id ? 'text-white' : 'text-[#0C2B4E]'}`}>
                                {course.courseCode}
                              </p>
                              <p className={`text-sm mt-1 line-clamp-2 ${selectedCourse?._id === course._id ? 'text-white/90' : 'text-gray-600'}`}>
                                {course.courseName}
                              </p>
                              <p className={`text-xs mt-1 ${selectedCourse?._id === course._id ? 'text-white/80' : 'text-gray-500'}`}>
                                {course.credits} Credits
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="lg:col-span-2">
                  {selectedCourse && (
                    <div className="space-y-6">
                      {/* Course Info Card */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-2xl font-bold text-[#0C2B4E]">{selectedCourse.courseCode}</h2>
                            <p className="text-lg text-gray-700 mt-1">{selectedCourse.courseName}</p>
                          </div>
                          <span className="px-3 py-1 text-sm font-semibold text-white bg-[#1D546C] rounded-full">
                            {selectedCourse.credits} Credits
                          </span>
                        </div>
                        
                        {selectedCourse.description && (
                          <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Course Description</h3>
                            <p className="text-sm text-gray-600">{selectedCourse.description}</p>
                          </div>
                        )}

                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {selectedCourse.semester} {selectedCourse.year}
                          </span>
                        </div>
                      </div>

                      {/* Course Materials */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="text-[#1D546C]" size={20} />
                          <h3 className="text-lg font-semibold text-[#0C2B4E]">Course Materials</h3>
                        </div>

                        {selectedCourse.materialsLink ? (
                          <a
                            href={selectedCourse.materialsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] transition font-medium"
                          >
                            <LinkIcon size={18} />
                            Course Materials
                          </a>
                        ) : (
                          <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-medium"
                          >
                            <FileText size={18} />
                            Course Materials (Coming Soon)
                          </button>
                        )}
                        
                        {!selectedCourse.materialsLink && (
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Your instructor will upload materials here
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Courses;
