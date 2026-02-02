import { useState, useEffect } from 'react';
import TeacherDashboardLayout from '../../components/TeacherDashboardLayout';
import authService from '../../services/authService';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import {
  BookOpen,
  Plus,
  Filter,
  Clock,
  Pin
} from 'lucide-react';

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

const mockCourses = [
  { courseCode: 'CS201', courseName: 'Data Structures', sections: ['A', 'B'] },
  { courseCode: 'CS210', courseName: 'Database Systems', sections: ['A'] },
  { courseCode: 'CS301', courseName: 'Software Engineering', sections: ['A'] }
];

const Classroom = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS201');
  const [selectedSection, setSelectedSection] = useState('All');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'announcement' | 'material' | 'assignment'>('all');
  const user = authService.getCurrentUser();

  const selectedCourseData = mockCourses.find(c => c.courseCode === selectedCourse);

  // Fetch posts for selected course
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedSection && selectedSection !== 'All') {
          query.append('section', selectedSection);
        }

        const response = await fetch(
          `http://localhost:4000/api/classroom/course/${selectedCourse}?${query}`
        );
        const result = await response.json();

        if (result.success && result.data) {
          // Filter by type if needed
          let filteredPosts = result.data;
          if (filterType !== 'all') {
            filteredPosts = filteredPosts.filter((p: Post) => p.type === filterType);
          }
          setPosts(filteredPosts);
        } else {
          // Try to get from localStorage as fallback
          const storageKey = `classroom_posts_${selectedCourse}`;
          const savedPosts = localStorage.getItem(storageKey);
          if (savedPosts) {
            setPosts(JSON.parse(savedPosts));
          } else {
            setPosts([]);
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Fallback to localStorage
        const storageKey = `classroom_posts_${selectedCourse}`;
        const savedPosts = localStorage.getItem(storageKey);
        if (savedPosts) {
          setPosts(JSON.parse(savedPosts));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCourse, selectedSection, filterType]);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
    
    // Also save to localStorage for backup
    const storageKey = `classroom_posts_${selectedCourse}`;
    localStorage.setItem(storageKey, JSON.stringify([newPost, ...posts]));
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  const handlePostPinned = (postId: string, isPinned: boolean) => {
    setPosts(prev => 
      prev.map(p => p._id === postId ? { ...p, isPinned } : p)
        .sort((a, b) => {
          if (a.isPinned === b.isPinned) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return b.isPinned ? 1 : -1;
        })
    );
  };

  return (
    <TeacherDashboardLayout title="Classroom">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0C2B4E] via-[#1A3D64] to-[#1D546C] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Classroom</h1>
                <p className="text-white/80 mt-1">Share announcements, materials, and assignments</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-white text-[#0C2B4E] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>

          {/* Course and Section Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/80 block mb-2">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedSection('All');
                }}
                className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {mockCourses.map(course => (
                  <option key={course.courseCode} value={course.courseCode} className="text-gray-900">
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-white/80 block mb-2">Select Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="All" className="text-gray-900">All Sections</option>
                {selectedCourseData?.sections.map(section => (
                  <option key={section} value={section} className="text-gray-900">
                    Section {section}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
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

        {/* Posts Feed */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No posts yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first post to get started</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                onDeleted={handlePostDeleted}
                onPinned={handlePostPinned}
                isTeacher={user?.role === 'teacher'}
              />
            ))
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost
          courseCode={selectedCourse}
          courseName={selectedCourseData?.courseName || ''}
          sections={selectedCourseData?.sections || []}
          onPostCreated={handlePostCreated}
          onClose={() => setShowCreatePost(false)}
        />
      )}
    </TeacherDashboardLayout>
  );
};

export default Classroom;
