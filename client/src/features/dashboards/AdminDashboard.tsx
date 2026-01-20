import DashboardLayout from '../../components/DashboardLayout';

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome, Admin!</h2>
          <p className="text-gray-600">
            Your admin dashboard is under construction. Soon you&apos;ll be able to:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>✓ Manage users and roles</li>
            <li>✓ Oversee all courses</li>
            <li>✓ Create and manage timetables</li>
            <li>✓ Publish university announcements</li>
            <li>✓ View system-wide reports</li>
            <li>✓ Manage complaints and moderation</li>
            <li>✓ Configure system settings</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-primary text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm opacity-90 mt-1">Total users</p>
          </div>
          
          <div className="bg-primary-dark text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Courses</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm opacity-90 mt-1">Active courses</p>
          </div>
          
          <div className="bg-primary-darker text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Complaints</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm opacity-90 mt-1">Pending review</p>
          </div>

          <div className="bg-gray-700 text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Events</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm opacity-90 mt-1">Upcoming events</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
