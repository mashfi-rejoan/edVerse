import DashboardLayout from '../../components/DashboardLayout';
import authService from '../../services/authService';
import { 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  Calendar, 
  Award, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Target,
  BarChart3,
  Activity,
  FileText,
  Users,
  Bell
} from 'lucide-react';

const mockCourses = [
  { code: 'CS201', name: 'Data Structures', attendance: 92, grade: 'A', credits: 3, instructor: 'Dr. Ahmed', trend: 'up' },
  { code: 'CS210', name: 'Database Systems', attendance: 88, grade: 'A-', credits: 3, instructor: 'Prof. Khan', trend: 'up' },
  { code: 'CS230', name: 'Computer Networks', attendance: 84, grade: 'B+', credits: 3, instructor: 'Dr. Rahman', trend: 'down' }
];

const mockAssignments = [
  { title: 'DB Design Project', course: 'CS210', due: '2026-01-28', status: 'In Progress', priority: 'high', progress: 65 },
  { title: 'Routing Lab', course: 'CS230', due: '2026-01-29', status: 'Not Started', priority: 'high', progress: 0 },
  { title: 'AVL Trees', course: 'CS201', due: '2026-02-02', status: 'In Review', priority: 'medium', progress: 100 },
  { title: 'SQL Queries Practice', course: 'CS210', due: '2026-02-05', status: 'Not Started', priority: 'low', progress: 0 }
];

const mockSchedule = [
  { time: '09:00', course: 'CS201', room: 'A-204', type: 'Lecture', instructor: 'Dr. Ahmed' },
  { time: '11:00', course: 'CS210', room: 'Lab-3', type: 'Lab', instructor: 'Prof. Khan' },
  { time: '14:00', course: 'CS230', room: 'B-105', type: 'Lecture', instructor: 'Dr. Rahman' }
];

const mockNotices = [
  { title: 'Library due in 3 days', detail: 'Return Applied ML book to avoid fines.', type: 'warning', date: '2026-01-31' },
  { title: 'Assignment window open', detail: 'Upload DB Design Project by Jan 28, 11:59 PM.', type: 'info', date: '2026-01-30' },
  { title: 'Attendance alert', detail: 'CS230 at 84% — aim for 90%+', type: 'warning', date: '2026-01-29' },
  { title: 'Fee Payment Reminder', detail: 'Spring 2026 installment due on Feb 15', type: 'important', date: '2026-01-28' }
];

const mockActivities = [
  { action: 'Submitted assignment', detail: 'AVL Trees Implementation', time: '2 hours ago', icon: FileText },
  { action: 'Attended class', detail: 'CS210 - Database Lab', time: '4 hours ago', icon: CheckCircle },
  { action: 'Borrowed book', detail: 'Computer Networks - Tanenbaum', time: '1 day ago', icon: BookOpen },
  { action: 'Registered complaint', detail: 'Lab equipment issue', time: '2 days ago', icon: AlertCircle }
];

const mockPerformance = {
  attendance: { current: 88, previous: 85, trend: 'up' },
  cgpa: { current: 3.72, previous: 3.65, trend: 'up' },
  assignments: { completed: 12, total: 15, percentage: 80 },
  participation: { score: 92, rank: 15, total: 120 }
};

const StudentDashboard = () => {
  const user = authService.getCurrentUser();
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const greeting = today.getHours() < 12 ? 'Good Morning' : today.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  const totalCourses = mockCourses.length;
  const averageAttendance = Math.round(
    mockCourses.reduce((sum, c) => sum + c.attendance, 0) / Math.max(totalCourses, 1)
  );
  const cgpa = 3.72;
  const upcomingAssignments = mockAssignments.filter(a => a.status !== 'In Review').slice(0, 3);
  const urgentNotices = mockNotices.slice(0, 3);

  // Calculate days until due
  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Not Started': return 'bg-gray-100 text-gray-700';
      case 'In Review': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getNoticeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      case 'important': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-6">
        {/* Enhanced Header with Gradient */}
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
                <Award className="w-5 h-5" />
                <span className="font-semibold">Semester: Spring 2026</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Target className="w-5 h-5" />
                <span className="font-semibold">Student ID: 2024510183</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview Cards with Trends */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Attendance Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                mockPerformance.attendance.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {mockPerformance.attendance.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(mockPerformance.attendance.current - mockPerformance.attendance.previous)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Attendance Rate</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{averageAttendance}%</p>
            <p className="text-xs text-gray-500 mt-2">Previous: {mockPerformance.attendance.previous}%</p>
          </div>

          {/* CGPA Card */}
          <div className="bg-gradient-to-br from-[#0C2B4E] to-[#1A3D64] text-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                mockPerformance.cgpa.trend === 'up' ? 'text-green-300' : 'text-red-300'
              }`}>
                {mockPerformance.cgpa.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {(mockPerformance.cgpa.current - mockPerformance.cgpa.previous).toFixed(2)}
              </div>
            </div>
            <p className="text-sm text-white/80 font-medium">Cumulative GPA</p>
            <p className="text-3xl font-bold mt-1">{cgpa.toFixed(2)}</p>
            <p className="text-xs text-white/70 mt-2">Previous: {mockPerformance.cgpa.previous.toFixed(2)}</p>
          </div>

          {/* Courses Card */}
          <div className="bg-gradient-to-br from-[#1A3D64] to-[#1D546C] text-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                {mockCourses.reduce((sum, c) => sum + c.credits, 0)} Credits
              </span>
            </div>
            <p className="text-sm text-white/80 font-medium">Enrolled Courses</p>
            <p className="text-3xl font-bold mt-1">{totalCourses}</p>
            <p className="text-xs text-white/70 mt-2">Current semester</p>
          </div>

          {/* Assignments Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm font-semibold text-gray-700">
                {mockPerformance.assignments.percentage}%
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Assignments</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {mockPerformance.assignments.completed}/{mockPerformance.assignments.total}
            </p>
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all"
                style={{ width: `${mockPerformance.assignments.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Class Rank</p>
                <p className="text-2xl font-bold text-green-900">
                  {mockPerformance.participation.rank}/{mockPerformance.participation.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-3 rounded-full">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Classes Today</p>
                <p className="text-2xl font-bold text-orange-900">{mockSchedule.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-full">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Pending Notices</p>
                <p className="text-2xl font-bold text-blue-900">{mockNotices.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Active Courses & Performance */}
          <div className="xl:col-span-2 space-y-6">
            {/* Active Courses with Enhanced Details */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Active Courses</h3>
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    {totalCourses} courses
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {mockCourses.map((course) => (
                    <div
                      key={course.code}
                      className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#0C2B4E] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-[#0C2B4E]">{course.code}</p>
                            {course.trend === 'up' ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <p className="text-gray-700 font-medium">{course.name}</p>
                          <p className="text-sm text-gray-500 mt-1">Instructor: {course.instructor}</p>
                        </div>
                        <div className="bg-[#0C2B4E] text-white px-3 py-1 rounded-full text-sm font-bold">
                          {course.grade}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Attendance</span>
                            <span className="font-semibold">{course.attendance}%</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                course.attendance >= 90 ? 'bg-green-500' : 
                                course.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${course.attendance}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">Credits</p>
                          <p className="text-lg font-bold text-[#0C2B4E]">{course.credits}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assignments & Deadlines */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Assignments & Deadlines</h3>
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    {upcomingAssignments.length} upcoming
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {upcomingAssignments.map((assignment) => {
                    const daysLeft = getDaysUntilDue(assignment.due);
                    const isUrgent = daysLeft <= 2;
                    return (
                      <div
                        key={assignment.title}
                        className={`border-2 rounded-xl p-4 transition-all ${
                          isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-100 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900">{assignment.title}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-semibold ${getPriorityColor(assignment.priority)}`}>
                                {assignment.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{assignment.course}</p>
                          </div>
                          <div className={`text-right ${isUrgent ? 'text-red-700' : 'text-gray-700'}`}>
                            <p className="text-xs font-medium">Due in</p>
                            <p className="text-lg font-bold">{daysLeft} day{daysLeft !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                              {assignment.status}
                            </span>
                            <span className="font-semibold text-gray-700">{assignment.progress}% Complete</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-purple-600 h-full rounded-full transition-all"
                              style={{ width: `${assignment.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Schedule, Notices & Activities */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#1D546C] to-[#0C2B4E] p-4 text-white">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Today's Schedule</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {mockSchedule.map((item, index) => (
                    <div 
                      key={`${item.course}-${item.time}`} 
                      className="border-l-4 border-[#0C2B4E] bg-gradient-to-r from-blue-50 to-transparent rounded-r-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[#0C2B4E] text-lg">{item.time}</span>
                        <span className="text-xs bg-[#0C2B4E] text-white px-2 py-1 rounded-full">
                          {item.type}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900">{item.course}</p>
                      <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                        <span>{item.instructor}</span>
                        <span className="font-medium">{item.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Important Notices */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 text-white">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Important Notices</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {urgentNotices.map((notice) => (
                    <div
                      key={notice.title}
                      className={`border-l-4 rounded-r-lg p-3 ${getNoticeColor(notice.type)}`}
                    >
                      <p className="font-semibold text-gray-900 text-sm">{notice.title}</p>
                      <p className="text-xs text-gray-700 mt-1">{notice.detail}</p>
                      <p className="text-xs text-gray-500 mt-2">{notice.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Recent Activities</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {mockActivities.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="bg-green-100 p-2 rounded-full">
                          <IconComponent className="w-4 h-4 text-green-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.detail}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
