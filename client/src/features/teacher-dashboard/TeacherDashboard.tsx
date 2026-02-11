import { useState, useEffect } from 'react';
import TeacherDashboardLayout from '../../components/TeacherDashboardLayout';
import authService from '../../services/authService';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Clock, 
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Mock data
const mockTeacherData = {
  courses: [
    {
      courseCode: 'CS201',
      courseName: 'Data Structures',
      sections: ['1', '2'],
      totalStudents: 120,
      credits: 3,
      semester: 'Spring 2026'
    },
    {
      courseCode: 'CS210',
      courseName: 'Database Systems',
      sections: ['1'],
      totalStudents: 60,
      credits: 3,
      semester: 'Spring 2026'
    },
    {
      courseCode: 'CS301',
      courseName: 'Software Engineering',
      sections: ['1'],
      totalStudents: 45,
      credits: 3,
      semester: 'Spring 2026'
    }
  ],
  todayClasses: [
    { time: '09:00 AM', courseCode: 'CS201', courseName: 'Data Structures', section: '1', room: 'Room 204', type: 'Lecture' },
    { time: '11:00 AM', courseCode: 'CS210', courseName: 'Database Systems', section: '1', room: 'Lab-3', type: 'Lab' },
    { time: '02:00 PM', courseCode: 'CS301', courseName: 'Software Engineering', section: '1', room: 'Room 305', type: 'Lecture' }
  ],
  recentActivity: [
    { action: 'Marked attendance', detail: 'CS201 - Section 1 (45/48 present)', time: '2 hours ago' },
    { action: 'Posted assignment', detail: 'Database Normalization - CS210', time: '5 hours ago' },
    { action: 'Entered marks', detail: 'Quiz 2 - CS301 (45 students)', time: '1 day ago' }
  ],
  pendingTasks: [
    { task: 'Grade Assignment 3', course: 'CS201', count: 48, priority: 'high' },
    { task: 'Mark attendance', course: 'CS210', count: 1, priority: 'medium' },
    { task: 'Post midterm results', course: 'CS301', count: 45, priority: 'high' }
  ]
};

const TeacherDashboard = () => {
  const [teacherData] = useState(mockTeacherData);
  const user = authService.getCurrentUser();
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const greeting = today.getHours() < 12 ? 'Good Morning' : today.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  const totalCourses = teacherData.courses.length;
  const totalStudents = teacherData.courses.reduce((sum, c) => sum + c.totalStudents, 0);
  const totalClasses = teacherData.todayClasses.length;
  const pendingCount = teacherData.pendingTasks.length;

  return (
    <TeacherDashboardLayout title="Teacher Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0C2B4E] via-[#1A3D64] to-[#1D546C] rounded-2xl p-8 shadow-lg text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-3xl sm:text-4xl font-bold">
                {greeting}{user?.name ? `, ${user.name}` : ''}
              </p>
              <p className="text-white/80 text-lg mt-2 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {formattedDate}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">Semester: Spring 2026</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Users className="w-5 h-5" />
                <span className="font-semibold">Teacher ID: {user?.universityId || 'T2020001'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Total Courses */}
          <div className="bg-gradient-to-br from-[#0C2B4E] to-[#1A3D64] text-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-300" />
            </div>
            <p className="text-sm text-white/80 font-medium">Teaching Courses</p>
            <p className="text-3xl font-bold mt-1">{totalCourses}</p>
            <p className="text-xs text-white/70 mt-2">Current semester</p>
          </div>

          {/* Total Students */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                Total
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Students</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalStudents}</p>
            <p className="text-xs text-gray-500 mt-2">Across all courses</p>
          </div>

          {/* Today's Classes */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                Today
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Classes Today</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalClasses}</p>
            <p className="text-xs text-gray-500 mt-2">Scheduled for today</p>
          </div>

          {/* Pending Tasks */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-white/80 font-medium">Pending Tasks</p>
            <p className="text-3xl font-bold mt-1">{pendingCount}</p>
            <p className="text-xs text-white/70 mt-2">Requires attention</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Today's Classes */}
          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] p-5 text-white">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6" />
                <h3 className="text-xl font-bold">Today's Classes</h3>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {teacherData.todayClasses.map((cls, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-[#0C2B4E] bg-gradient-to-r from-blue-50 to-transparent rounded-r-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold text-[#0C2B4E]">{cls.time}</span>
                          <span className="text-xs bg-[#0C2B4E] text-white px-2 py-1 rounded-full">
                            {cls.type}
                          </span>
                        </div>
                        <p className="font-bold text-gray-900 text-lg">{cls.courseCode} - {cls.courseName}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                          <span>Section {cls.section}</span>
                          <span>•</span>
                          <span className="font-medium">{cls.room}</span>
                        </div>
                      </div>
                      <button className="text-sm bg-[#0C2B4E] text-white px-4 py-2 rounded-lg hover:bg-[#1A3D64] transition-colors">
                        Mark Attendance
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 text-white">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-lg font-bold">Pending Tasks</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {teacherData.pendingTasks.map((task, index) => (
                  <div
                    key={index}
                    className={`border-l-4 rounded-r-lg p-3 ${
                      task.priority === 'high' ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{task.task}</p>
                        <p className="text-xs text-gray-600 mt-1">{task.course}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{task.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Courses & Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Active Courses */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#1D546C] to-[#0C2B4E] p-4 text-white">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-bold">Active Courses</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {teacherData.courses.map((course) => (
                  <div key={course.courseCode} className="border border-gray-100 rounded-lg p-4 hover:border-[#0C2B4E] hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-[#0C2B4E] text-lg">{course.courseCode}</p>
                        <p className="text-gray-700 font-medium">{course.courseName}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                          <span>Sections: {course.sections.join(', ')}</span>
                          <span>•</span>
                          <span>{course.totalStudents} students</span>
                          <span>•</span>
                          <span>{course.credits} credits</span>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-lg font-bold">Recent Activity</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {teacherData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.detail}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherDashboardLayout>
  );
};

export default TeacherDashboard;
