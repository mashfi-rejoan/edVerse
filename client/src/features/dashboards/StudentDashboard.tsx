import DashboardLayout from '../../components/DashboardLayout';

const StudentDashboard = () => {
  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome, Student!</h2>
          <p className="text-gray-600">
            Your student dashboard is under construction. Soon you&apos;ll be able to:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>✓ View your courses and enrollment</li>
            <li>✓ Check attendance records</li>
            <li>✓ View grades and CGPA</li>
            <li>✓ Access timetable and schedule</li>
            <li>✓ Submit assignments</li>
            <li>✓ Access library services</li>
            <li>✓ Manage blood donation availability</li>
            <li>✓ Submit complaints and feedback</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Courses</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm opacity-90 mt-1">Enrolled this semester</p>
          </div>
          
          <div className="bg-primary-dark text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Attendance</h3>
            <p className="text-3xl font-bold">0%</p>
            <p className="text-sm opacity-90 mt-1">Overall attendance</p>
          </div>
          
          <div className="bg-primary-darker text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">CGPA</h3>
            <p className="text-3xl font-bold">0.00</p>
            <p className="text-sm opacity-90 mt-1">Current CGPA</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
