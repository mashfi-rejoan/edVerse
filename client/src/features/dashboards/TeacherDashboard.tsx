import DashboardLayout from '../../components/DashboardLayout';

const TeacherDashboard = () => {
  return (
    <DashboardLayout title="Teacher Dashboard">
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome, Teacher!</h2>
          <p className="text-gray-600">
            Your teacher dashboard is under construction. Soon you&apos;ll be able to:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>✓ Manage your courses</li>
            <li>✓ Mark student attendance</li>
            <li>✓ Grade assignments and exams</li>
            <li>✓ View teaching schedule</li>
            <li>✓ Upload course materials</li>
            <li>✓ Send announcements to students</li>
            <li>✓ View student analytics</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Courses</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm opacity-90 mt-1">Teaching this semester</p>
          </div>
          
          <div className="bg-primary-dark text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Students</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm opacity-90 mt-1">Total enrolled</p>
          </div>
          
          <div className="bg-primary-darker text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Pending</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm opacity-90 mt-1">Assignments to grade</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
