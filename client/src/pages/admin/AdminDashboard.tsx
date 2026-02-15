import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, GraduationCap, TrendingUp, TrendingDown,
  Activity, CheckCircle, Clock, AlertCircle, FileText, UserCheck,
  BarChart3, Award, Bell, ArrowRight, Target, Settings, Database,
  Zap, MessageSquare, ClipboardCheck
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock chart data
  const enrollmentData = [
    { section: 'Section 1', students: 45 },
    { section: 'Section 2', students: 42 },
    { section: 'Section 3', students: 48 },
    { section: 'Section 4', students: 40 },
    { section: 'Section 5', students: 38 }
  ];

  const attendanceData = [
    { day: 'Mon', rate: 92 },
    { day: 'Tue', rate: 89 },
    { day: 'Wed', rate: 94 },
    { day: 'Thu', rate: 91 },
    { day: 'Fri', rate: 88 },
    { day: 'Sat', rate: 85 }
  ];

  const complaintData = [
    { name: 'Resolved', value: 78, color: '#10b981' },
    { name: 'Pending', value: 12, color: '#f59e0b' },
    { name: 'In Progress', value: 10, color: '#3b82f6' }
  ];

  const courseRegistrationData = [
    { course: 'CSE-301', enrolled: 156 },
    { course: 'CSE-302', enrolled: 148 },
    { course: 'CSE-303', enrolled: 142 },
    { course: 'CSE-304', enrolled: 151 },
    { course: 'CSE-305', enrolled: 139 }
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error(err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome back, {user.name || 'System Administrator'}! 👋
          </h1>
          <p className="text-gray-600 text-sm">Here's what's happening with your university today.</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          {/* Students Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <TrendingUp size={14} />
                <span>+12%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalStudents?.toLocaleString() || '1,245'}
            </h3>
            <p className="text-sm text-gray-600 font-medium">Total Students</p>
          </div>

          {/* Faculty Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <TrendingUp size={14} />
                <span>+5%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalTeachers || '87'}
            </h3>
            <p className="text-sm text-gray-600 font-medium">Faculty Members</p>
          </div>

          {/* Courses Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <TrendingUp size={14} />
                <span>+8%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalCourses || '156'}
            </h3>
            <p className="text-sm text-gray-600 font-medium">Active Courses</p>
          </div>

          {/* Pending Approvals Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <ClipboardCheck size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-red-600">
                <AlertCircle size={14} />
                <span>Pending</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.pendingApprovals || '23'}
            </h3>
            <p className="text-sm text-gray-600 font-medium">Pending Approvals</p>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <Calendar size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                <Clock size={14} />
                <span>7 days</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.upcomingExams || '8'}
            </h3>
            <p className="text-sm text-gray-600 font-medium">Upcoming Events</p>
          </div>
        </div>

        {/* Pending Actions Alert Box */}
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                Pending Actions Required
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">{stats?.pendingApprovals || 23}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Room Bookings</span>
                    <span className="text-2xl font-bold text-orange-600">8</span>
                  </div>
                  <p className="text-xs text-gray-500">Awaiting approval</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Unassigned Complaints</span>
                    <span className="text-2xl font-bold text-red-600">12</span>
                  </div>
                  <p className="text-xs text-gray-500">Need assignment</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Grade Submissions</span>
                    <span className="text-2xl font-bold text-yellow-600">3</span>
                  </div>
                  <p className="text-xs text-gray-500">Not submitted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-gray-700" />
                Quick Stats
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Pending Complaints */}
              <div className="flex items-center justify-between py-3 px-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <AlertCircle size={20} className="text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Pending Complaints</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{stats?.pendingComplaints || '12'}</span>
              </div>

              {/* Today's Attendance */}
              <div className="flex items-center justify-between py-3 px-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Activity size={20} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Today's Attendance</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{stats?.todayAttendance || '94.5'}%</span>
              </div>

              {/* Upcoming Exams */}
              <div className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Upcoming Exams</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{stats?.upcomingExams || '8'}</span>
              </div>

              {/* Announcements */}
              <div className="flex items-center justify-between py-3 px-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Bell size={20} className="text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Announcements</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{stats?.announcements || '5'}</span>
              </div>
            </div>
          </div>

          {/* Recent Activities Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity size={20} className="text-gray-700" />
                Recent Activities
              </h2>
              <button className="text-[#0C2B4E] text-sm font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Activity 1 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">New student enrollment</p>
                  <p className="text-xs text-gray-600 mt-0.5">Sarah Ahmed enrolled in CSE</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> 5 min ago
                  </p>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen size={18} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Course updated</p>
                  <p className="text-xs text-gray-600 mt-0.5">Advanced Database syllabus updated</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> 1 hour ago
                  </p>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Exam scheduled</p>
                  <p className="text-xs text-gray-600 mt-0.5">Midterm for Mathematics-II</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> 2 hours ago
                  </p>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Complaint resolved</p>
                  <p className="text-xs text-gray-600 mt-0.5">Library access issue fixed</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> 3 hours ago
                  </p>
                </div>
              </div>

              {/* Activity 5 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award size={18} className="text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Achievement</p>
                  <p className="text-xs text-gray-600 mt-0.5">10 students on Dean's List</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> 5 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Enrollment by Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users size={20} className="text-gray-700" />
                Enrollment by Section
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="section" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity size={20} className="text-gray-700" />
                Weekly Attendance Rate
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Complaint Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare size={20} className="text-gray-700" />
                Complaint Status
              </h2>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={complaintData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {complaintData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Course Registration */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen size={20} className="text-gray-700" />
                Course Enrollment Stats
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={courseRegistrationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis dataKey="course" type="category" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="enrolled" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;
