import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { apiUrl } from '../utils/apiBase';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [platformStats, setPlatformStats] = useState(null);
  const [pendingModerations, setPendingModerations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch users, analytics, and platform stats
      // This will be updated with actual API calls
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleManageUsers = async (userId, action) => {
    try {
      const response = await fetch(apiUrl(`/api/users/${userId}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      alert(`User ${action} successfully!`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error managing user:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="dashboard-grid">
        {/* Platform Statistics */}
        <div className="card stats-card">
          <h2>Platform Statistics</h2>
          {platformStats ? (
            <div>
              <p>Total Users: {platformStats.totalUsers}</p>
              <p>Active Users: {platformStats.activeUsers}</p>
              <p>Total Complaints: {platformStats.totalComplaints}</p>
              <p>Total Resources: {platformStats.totalResources}</p>
            </div>
          ) : (
            <p>No statistics available.</p>
          )}
        </div>

        {/* User Management */}
        <div className="card users-card">
          <h2>Manage Users</h2>
          {users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  <h3>{user.name}</h3>
                  <p>Role: {user.role}</p>
                  <p>Email: {user.email}</p>
                  <button onClick={() => handleManageUsers(user.id, 'activate')}>Activate</button>
                  <button onClick={() => handleManageUsers(user.id, 'deactivate')}>Deactivate</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users to manage.</p>
          )}
        </div>

        {/* Platform Analytics */}
        <div className="card analytics-card">
          <h2>Platform Analytics</h2>
          {analytics ? (
            <div>
              <p>API Requests: {analytics.totalRequests}</p>
              <p>Success Rate: {analytics.successRate}%</p>
              <p>Avg Response Time: {analytics.avgResponseTime}ms</p>
            </div>
          ) : (
            <p>No analytics data available.</p>
          )}
        </div>

        {/* Pending Moderations */}
        <div className="card moderation-card">
          <h2>Pending Moderations</h2>
          {pendingModerations.length > 0 ? (
            <ul>
              {pendingModerations.map((mod) => (
                <li key={mod.id}>
                  <h3>{mod.itemType}</h3>
                  <p>Submitted by: {mod.submittedBy}</p>
                  <button>Review</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending moderations.</p>
          )}
        </div>

        {/* System Health */}
        <div className="card health-card">
          <h2>System Health</h2>
          <div>
            <p>Database Status: <span className="status-healthy">Healthy</span></p>
            <p>API Status: <span className="status-healthy">Healthy</span></p>
            <p>Server Uptime: 99.9%</p>
          </div>
        </div>
      </div>

      {loading && <p className="loading">Loading dashboard...</p>}
    </div>
  );
};

export default AdminDashboard;
