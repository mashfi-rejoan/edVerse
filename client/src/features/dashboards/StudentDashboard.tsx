import DashboardLayout from '../../components/DashboardLayout';
import authService from '../../services/authService';

const mockCourses = [
  { code: 'CS201', name: 'Data Structures', attendance: 92, grade: 'A', credits: 3 },
  { code: 'CS210', name: 'Database Systems', attendance: 88, grade: 'A-', credits: 3 },
  { code: 'CS230', name: 'Computer Networks', attendance: 84, grade: 'B+', credits: 3 }
];

const mockAssignments = [
  { title: 'DB Design Project', course: 'CS210', due: 'Jan 28', status: 'In Progress' },
  { title: 'Routing Lab', course: 'CS230', due: 'Jan 29', status: 'Not Started' },
  { title: 'AVL Trees', course: 'CS201', due: 'Feb 02', status: 'In Review' }
];

const mockSchedule = [
  { time: '09:00', course: 'CS201', room: 'A-204', type: 'Lecture' },
  { time: '11:00', course: 'CS210', room: 'Lab-3', type: 'Lab' },
  { time: '14:00', course: 'CS230', room: 'B-105', type: 'Lecture' }
];

const mockNotices = [
  { title: 'Library due in 3 days', detail: 'Return Applied ML book to avoid fines.' },
  { title: 'Assignment window open', detail: 'Upload DB Design Project by Jan 28, 11:59 PM.' },
  { title: 'Attendance alert', detail: 'CS230 at 84% — aim for 90%+' }
];

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
  const cgpa = 3.72; // placeholder until backend grades arrive
  const dueAssignments = mockAssignments.slice(0, 2);

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-6">
        <div className="bg-[#E4E1D7] border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[#2E4C3C]">
              {greeting}{user?.name ? `, ${user.name}` : ''}
            </p>
            <p className="text-gray-800 text-lg mt-1">Today: {formattedDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Enrolled Courses</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalCourses}</p>
            <p className="text-xs text-gray-500 mt-1">Current semester</p>
          </div>

          <div className="bg-primary text-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-white/80">Attendance</p>
            <p className="text-3xl font-bold mt-1">{averageAttendance}%</p>
            <p className="text-xs text-white/80 mt-1">Overall average</p>
          </div>

          <div className="bg-primary-dark text-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-white/80">CGPA</p>
            <p className="text-3xl font-bold mt-1">{cgpa.toFixed(2)}</p>
            <p className="text-xs text-white/80 mt-1">Updated last term</p>
          </div>

          <div className="bg-primary-darker text-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-white/80">Assignments</p>
            <p className="text-3xl font-bold mt-1">{mockAssignments.length}</p>
            <p className="text-xs text-white/80 mt-1">Active this week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Courses</h3>
              <span className="text-sm text-gray-500">{totalCourses} courses</span>
            </div>
            <div className="space-y-3">
              {mockCourses.map((course) => (
                <div
                  key={course.code}
                  className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{course.code}</p>
                    <p className="text-sm text-gray-600">{course.name}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-gray-700">
                      <span className="font-semibold">{course.attendance}%</span>
                      <span className="text-gray-500"> attendance</span>
                    </div>
                    <div className="text-gray-700">
                      <span className="font-semibold">{course.grade}</span>
                      <span className="text-gray-500"> grade</span>
                    </div>
                    <div className="text-gray-700">
                      <span className="font-semibold">{course.credits}</span>
                      <span className="text-gray-500"> cr</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Schedule</h3>
              <span className="text-sm text-gray-500">Local time</span>
            </div>
            <div className="space-y-3">
              {mockSchedule.map((item) => (
                <div key={`${item.course}-${item.time}`} className="border border-gray-100 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{item.course}</span>
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{item.type}</span>
                    <span>{item.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
              <span className="text-sm text-gray-500">Due soon</span>
            </div>
            <div className="space-y-3">
              {dueAssignments.map((assignment) => (
                <div key={assignment.title} className="border border-gray-100 rounded-lg px-3 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{assignment.title}</p>
                      <p className="text-xs text-gray-500">{assignment.course}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary-dark">{assignment.due}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Status: {assignment.status}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notices</h3>
              <span className="text-sm text-gray-500">Latest</span>
            </div>
            <div className="space-y-3">
              {mockNotices.map((notice) => (
                <div key={notice.title} className="border border-gray-100 rounded-lg px-3 py-3">
                  <p className="font-semibold text-gray-900">{notice.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notice.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
