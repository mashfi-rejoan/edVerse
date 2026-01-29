import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { BookOpen, Users, GraduationCap } from 'lucide-react';
import { apiUrl } from '../../utils/apiBase';

interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  instructorName: string;
  credits: number;
  department?: string;
  description?: string;
  semester: string;
  year: number;
  enrollmentId?: string;
  enrollmentStatus?: string;
  grade?: string;
}

interface Semester {
  semester: string;
  year: number;
}

interface CourseMaterial {
  _id: string;
  title: string;
  description?: string;
  type: string;
  fileUrl?: string;
  dueDate?: string;
  createdAt: string;
}

const Courses = () => {
  const [currentSemester, setCurrentSemester] = useState<Semester>({ semester: 'Spring', year: 2026 });
  const [selectedSemester, setSelectedSemester] = useState<Semester>({ semester: 'Spring', year: 2026 });
  const [availableSemesters, setAvailableSemesters] = useState<Semester[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseMaterials, setCourseMaterials] = useState<CourseMaterial[]>([]);
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available' | 'materials'>('enrolled');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (selectedSemester.semester && selectedSemester.year && user?.id) {
      fetchEnrolledCourses();
      if (activeTab === 'available') {
        fetchAvailableCourses();
      }
    }
  }, [selectedSemester, activeTab]);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseMaterials(selectedCourse._id);
    }
  }, [selectedCourse]);

  const fetchSemesters = async () => {
    try {
      const response = await fetch(apiUrl('/api/courses/semesters'), { credentials: 'include' });
      const data = await response.json();
      setCurrentSemester(data.current);
      setSelectedSemester(data.current);
      setAvailableSemesters(data.available || []);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        apiUrl(`/api/courses/student/${user.id}/courses?semester=${selectedSemester.semester}&year=${selectedSemester.year}`),
        { credentials: 'include' }
      );
      const data = await response.json();
      setEnrolledCourses(data.courses || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        apiUrl(`/api/courses/courses/available?semester=${selectedSemester.semester}&year=${selectedSemester.year}`),
        { credentials: 'include' }
      );
      const data = await response.json();

      const enrolledIds = enrolledCourses.map((c) => c._id);
      const available = (data.courses || []).filter((c: Course) => !enrolledIds.includes(c._id));

      setAvailableCourses(available);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching available courses:', error);
      setLoading(false);
    }
  };

  const fetchCourseMaterials = async (courseId: string) => {
    try {
      const response = await fetch(apiUrl(`/api/courses/course/${courseId}/materials`), {
        credentials: 'include'
      });
      const data = await response.json();
      setCourseMaterials(data.materials || []);
    } catch (error) {
      console.error('Error fetching course materials:', error);
    }
  };

  const handleEnrollCourse = async (courseId: string) => {
    try {
      const response = await fetch(apiUrl('/api/courses/enroll'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          studentId: user.id,
          courseId,
          semester: selectedSemester.semester,
          year: selectedSemester.year
        })
      });

      if (response.ok) {
        alert('Successfully enrolled in course!');
        fetchEnrolledCourses();
        fetchAvailableCourses();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
    }
  };

  const handleDropCourse = async (enrollmentId: string) => {
    if (!confirm('Are you sure you want to drop this course?')) return;

    try {
      const response = await fetch(apiUrl('/api/courses/drop'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enrollmentId })
      });

      if (response.ok) {
        alert('Course dropped successfully');
        fetchEnrolledCourses();
      } else {
        alert('Failed to drop course');
      }
    } catch (error) {
      console.error('Error dropping course:', error);
      alert('Failed to drop course');
    }
  };

  const isCurrentSemester =
    selectedSemester.semester === currentSemester.semester &&
    selectedSemester.year === currentSemester.year;

  const totalCredits = enrolledCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

  return (
    <DashboardLayout title="Courses">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <GraduationCap size={18} />
            <span>{enrolledCourses.length} courses enrolled</span>
          </div>
        </div>

        {/* Semester Selector */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Semester</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={`${selectedSemester.semester}-${selectedSemester.year}`}
              onChange={(e) => {
                const [semester, year] = e.target.value.split('-');
                setSelectedSemester({ semester, year: parseInt(year) });
                setSelectedCourse(null);
                setActiveTab('enrolled');
              }}
            >
              {availableSemesters.map((sem, idx) => (
                <option key={idx} value={`${sem.semester}-${sem.year}`}>
                  {sem.semester} {sem.year}
                  {sem.semester === currentSemester.semester && sem.year === currentSemester.year && ' (Current)'}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {isCurrentSemester ? '📅 Current Semester' : '📚 Past Semester'}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'enrolled' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveTab('enrolled')}
          >
            📖 My Courses
          </button>
          {isCurrentSemester && (
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'available' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveTab('available')}
            >
              ➕ Available Courses
            </button>
          )}
          {selectedCourse && (
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'materials' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveTab('materials')}
            >
              📚 Materials
            </button>
          )}
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <GraduationCap className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">{totalCredits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Selected Semester</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedSemester.semester} {selectedSemester.year}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {loading ? (
          <div className="text-center text-gray-600 py-10">Loading courses...</div>
        ) : (
          <>
            {activeTab === 'enrolled' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{course.courseCode}</h3>
                          <p className="text-base text-gray-700 font-medium">{course.courseName}</p>
                        </div>
                        <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                          {course.credits} Credits
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} />
                          <span>{course.instructorName || 'TBA'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen size={16} />
                          <span>{course.department || 'N/A'}</span>
                        </div>

                        {course.grade && (
                          <div className="text-sm text-green-700 font-medium">Grade: {course.grade}</div>
                        )}

                        <div className="text-sm text-gray-600">
                          Status: <span className="font-medium">{course.enrollmentStatus || 'Enrolled'}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                          onClick={() => {
                            setSelectedCourse(course);
                            setActiveTab('materials');
                          }}
                        >
                          View Details
                        </button>
                        <button
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                          onClick={() => {
                            setSelectedCourse(course);
                            setActiveTab('materials');
                          }}
                        >
                          Resources
                        </button>
                        {isCurrentSemester && course.enrollmentStatus === 'Enrolled' && course.enrollmentId && (
                          <button
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                            onClick={() => handleDropCourse(course.enrollmentId!)}
                          >
                            Drop
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-600 py-10 col-span-full">
                    No enrolled courses for this semester.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'available' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {availableCourses.length > 0 ? (
                  availableCourses.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{course.courseCode}</h3>
                          <p className="text-base text-gray-700 font-medium">{course.courseName}</p>
                        </div>
                        <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                          {course.credits} Credits
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} />
                          <span>{course.instructorName || 'TBA'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen size={16} />
                          <span>{course.department || 'N/A'}</span>
                        </div>

                        {course.description && (
                          <p className="text-sm text-gray-600">{course.description}</p>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                          onClick={() => handleEnrollCourse(course._id)}
                        >
                          Enroll
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-600 py-10 col-span-full">
                    No available courses for enrollment.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'materials' && selectedCourse && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedCourse.courseName}</h2>
                    <p className="text-sm text-gray-600">{selectedCourse.courseCode}</p>
                  </div>
                  <button
                    className="px-3 py-2 text-sm bg-gray-100 rounded-lg"
                    onClick={() => setActiveTab('enrolled')}
                  >
                    Back to Courses
                  </button>
                </div>

                {courseMaterials.length > 0 ? (
                  <div className="space-y-4">
                    {courseMaterials.map((material) => (
                      <div key={material._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{material.title}</h3>
                            {material.description && (
                              <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                            )}
                          </div>
                          <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                            {material.type}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(material.createdAt).toLocaleDateString()}
                          {material.dueDate && (
                            <span className="ml-3 text-red-600">
                              Due: {new Date(material.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {material.fileUrl && (
                          <a
                            href={material.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-600 py-10">
                    No materials available for this course.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Courses;
