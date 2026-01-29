import React, { useState, useEffect, FormEvent } from 'react';
import './TeacherDashboard.css';
import { apiUrl } from '../utils/apiBase';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [pendingModerations, setPendingModerations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch classes, assignments, announcements, and analytics
      // This will be updated with actual API calls
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (assignment) => {
    try {
      const response = await fetch(apiUrl('/api/assignments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment),
      });
      const data = await response.json();
      setAssignments([...assignments, data]);
      alert('Assignment created successfully!');
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleCreateAnnouncement = async (announcement) => {
    try {
      const response = await fetch(apiUrl('/api/announcements'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement),
      });
      const data = await response.json();
      setAnnouncements([...announcements, data]);
      alert('Announcement created successfully!');
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  return (
    <div className="teacher-dashboard">
      <h1>Teacher Dashboard</h1>
      
      <div className="dashboard-grid">
        {/* Classes Section */}
        <div className="card classes-card">
          <h2>Your Classes</h2>
          {classes.length > 0 ? (
            <ul>
              {classes.map((cls) => (
                <li key={cls.id}>
                  <h3>{cls.name}</h3>
                  <p>Students: {cls.studentCount}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No classes assigned yet.</p>
          )}
        </div>

        {/* Create Assignment Section */}
        <div className="card create-assignment-card">
          <h2>Create Assignment</h2>
          <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleCreateAssignment({
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              dueDate: formData.get('dueDate') as string,
            });
            (e.currentTarget as HTMLFormElement).reset();
          }}>
            <input type="text" name="title" placeholder="Assignment Title" required />
            <textarea name="description" placeholder="Assignment Description..."></textarea>
            <input type="date" name="dueDate" required />
            <button type="submit">Create</button>
          </form>
        </div>

        {/* Create Announcement Section */}
        <div className="card create-announcement-card">
          <h2>Create Announcement</h2>
          <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleCreateAnnouncement({
              title: formData.get('title') as string,
              content: formData.get('content') as string,
            });
            (e.currentTarget as HTMLFormElement).reset();
          }}>
            <input type="text" name="title" placeholder="Announcement Title" required />
            <textarea name="content" placeholder="Announcement Content..." required></textarea>
            <button type="submit">Announce</button>
          </form>
        </div>

        {/* Pending Moderations */}
        <div className="card moderation-card">
          <h2>Pending Moderations</h2>
          {pendingModerations.length > 0 ? (
            <ul>
              {pendingModerations.map((mod) => (
                <li key={mod.id}>
                  <h3>{mod.itemType}</h3>
                  <p>{mod.content}</p>
                  <button>Review</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending moderations.</p>
          )}
        </div>

        {/* Analytics Overview */}
        <div className="card analytics-card">
          <h2>Analytics Overview</h2>
          {analytics ? (
            <div>
              <p>Total Students: {analytics.totalStudents}</p>
              <p>Assignments Submitted: {analytics.assignmentsSubmitted}</p>
              <p>Average Score: {analytics.averageScore}%</p>
            </div>
          ) : (
            <p>No analytics data available.</p>
          )}
        </div>
      </div>

      {loading && <p className="loading">Loading dashboard...</p>}
    </div>
  );
};

export default TeacherDashboard;
