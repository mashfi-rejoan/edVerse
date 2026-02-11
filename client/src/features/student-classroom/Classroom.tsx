import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import authService from '../../services/authService';
import StudentPostCard from './StudentPostCard';
import { apiUrl } from '../../utils/apiBase';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface Post {
  _id: string;
  teacherId: string;
  teacherName: string;
  courseCode: string;
  courseName: string;
  sections: string[];
  type: 'announcement' | 'material' | 'assignment';
  title: string;
  content: string;
  attachments: any[];
  submissions: any[];
  dueDate: string | null;
  isPinned: boolean;
  viewedBy: string[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

interface EnrolledCourse {
  _id?: string;
  courseCode: string;
  courseName: string;
  credits?: number;
  instructorName?: string;
  instructor?: {
    name?: string;
    email?: string;
  };
  semester?: string;
  year?: number;
}

const mockCourses = [
  { courseCode: 'CS201', courseName: 'Data Structures', sections: ['1', '2'] },
  { courseCode: 'CS210', courseName: 'Database Systems', sections: ['1'] },
  { courseCode: 'CS301', courseName: 'Software Engineering', sections: ['1'] }
];

const Classroom = () => {
  const [viewMode, setViewMode] = useState<'courses' | 'course'>('courses');
  const [courses, setCourses] = useState<EnrolledCourse[]>(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCourseLoading, setIsCourseLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'announcement' | 'material' | 'assignment'>('all');
  const user = authService.getCurrentUser();
  const studentId = user?.universityId || user?.id || `S${Date.now()}`;
  const studentName = user?.name || 'Student';
  const studentProfile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('studentProfile') || '{}');
    } catch {
      return {};
    }
  }, []);
  const studentSection = studentProfile.section || '1';

  const selectedCourseData = useMemo(
    () => (selectedCourse ? selectedCourse : null),
    [selectedCourse]
  );

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return;
      setIsCourseLoading(true);
      try {
        const response = await fetch(
          apiUrl(`/api/courses/student/${user.id}/courses?semester=Spring&year=2026`)
        );
        const result = await response.json();
        const courseList = result.courses || result.data || [];
        if (Array.isArray(courseList) && courseList.length > 0) {
          const normalized = courseList.map((course: any) => ({
            _id: course._id,
            courseCode: course.courseCode,
            courseName: course.courseName,
            credits: course.credits,
            instructorName: course.instructorName || course.instructor?.name,
            instructor: course.instructor,
            semester: course.semester,
            year: course.year
          }));
          setCourses(normalized);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsCourseLoading(false);
      }
    };

    fetchCourses();
  }, [user?.id]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!selectedCourseData?.courseCode || viewMode !== 'course') return;
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (studentSection) {
          query.append('section', studentSection);
        }

        const response = await fetch(
          apiUrl(`/api/classroom/course/${selectedCourseData.courseCode}?${query}`)
        );
        const result = await response.json();

        if (result.success && result.data) {
          let filteredPosts = result.data as Post[];
          if (filterType !== 'all') {
            filteredPosts = filteredPosts.filter((p) => p.type === filterType);
          }
          setPosts(filteredPosts);
        } else {
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        loadFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      if (!selectedCourseData?.courseCode) return;
      const storageKey = `classroom_posts_${selectedCourseData.courseCode}`;
      const savedPosts = localStorage.getItem(storageKey);
      if (savedPosts) {
        const parsed = JSON.parse(savedPosts) as Post[];
        let filtered = parsed;
        if (studentSection) {
          filtered = filtered.filter((p) =>
            p.sections?.includes('All') || p.sections?.includes(studentSection)
          );
        }
        if (filterType !== 'all') {
          filtered = filtered.filter((p) => p.type === filterType);
        }
        filtered.sort((a, b) => {
          if (a.isPinned === b.isPinned) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return b.isPinned ? 1 : -1;
        });
        setPosts(filtered);
      } else {
        setPosts([]);
      }
    };

    fetchPosts();
  }, [selectedCourseData?.courseCode, filterType, studentSection, viewMode]);

  useEffect(() => {
    if (!studentId || posts.length === 0) return;

    const unviewed = posts.filter((p) => !p.viewedBy?.includes(studentId));
    if (unviewed.length === 0) return;

    unviewed.forEach(async (post) => {
      try {
        await fetch(apiUrl(`/api/classroom/${post._id}/view`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId })
        });
      } catch (error) {
        console.error('Error marking as viewed:', error);
      }
    });

    setPosts((prev) =>
      prev.map((p) =>
        p.viewedBy?.includes(studentId)
          ? p
          : { ...p, viewedBy: [...(p.viewedBy || []), studentId] }
      )
    );
  }, [posts, studentId]);

  const handleSubmissionUpdated = (updatedPost: Post) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  return (
    <DashboardLayout title="Classroom">
      <div className="space-y-6">
        {viewMode === 'courses' ? (
          <>
            <div className="bg-gradient-to-br from-[#0C2B4E] via-[#1A3D64] to-[#1D546C] rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8" />
                <div>
                  <h1 className="text-3xl font-bold">Classroom</h1>
                  <p className="text-white/80 mt-1">Select a course to view teacher posts</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-white/80">
                Your Section: <span className="font-semibold text-white">{studentSection}</span>
              </div>
            </div>

            {isCourseLoading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No enrolled courses</p>
                <p className="text-gray-400 text-sm mt-1">Register for courses to access classroom updates</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <button
                    key={course._id || course.courseCode}
                    onClick={() => {
                      setSelectedCourse(course);
                      setViewMode('course');
                      setFilterType('all');
                    }}
                    className="text-left bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#1D546C]">{course.courseCode}</p>
                        <h3 className="text-lg font-bold text-gray-900 mt-1">{course.courseName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium text-gray-800">
                            {course.instructorName || course.instructor?.name || 'TBA'}
                          </span>
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#0C2B4E]/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-[#0C2B4E]" />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                      {course.credits !== undefined && (
                        <p>Credits: <span className="font-medium text-gray-800">{course.credits}</span></p>
                      )}
                      {course.semester && course.year && (
                        <p>{course.semester} {course.year}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-[#0C2B4E] via-[#1A3D64] to-[#1D546C] rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8" />
                  <div>
                    <h1 className="text-3xl font-bold">{selectedCourseData?.courseCode} Classroom</h1>
                    <p className="text-white/80 mt-1">{selectedCourseData?.courseName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-white/80">
                    Section <span className="font-semibold text-white">{studentSection}</span>
                  </div>
                  <button
                    onClick={() => {
                      setViewMode('courses');
                      setSelectedCourse(null);
                      setPosts([]);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/20"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-[#0C2B4E] text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-[#0C2B4E]'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setFilterType('announcement')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'announcement'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-600'
                }`}
              >
                Announcements
              </button>
              <button
                onClick={() => setFilterType('material')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'material'
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-green-600'
                }`}
              >
                Materials
              </button>
              <button
                onClick={() => setFilterType('assignment')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'assignment'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-600'
                }`}
              >
                Assignments
              </button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No posts yet</p>
                  <p className="text-gray-400 text-sm mt-1">Your teachers will post updates here</p>
                </div>
              ) : (
                posts.map(post => (
                  <StudentPostCard
                    key={post._id}
                    post={post}
                    studentId={studentId}
                    studentName={studentName}
                    onSubmissionUpdated={handleSubmissionUpdated}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Classroom;
