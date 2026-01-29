import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import { apiUrl } from '../utils/apiBase';

const StudentDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [resources, setResources] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch announcements, assignments, resources, and complaints
      // This will be updated with actual API calls
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (complaint) => {
    try {
      const response = await fetch(apiUrl('/api/shared/complaints'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaint),
      });
      const data = await response.json();
      setComplaints([...complaints, data]);
      alert('Complaint submitted successfully!');
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      
      <div className="dashboard-grid">
        {/* Announcements Section */}
        <div className="card announcements-card">
          <h2>Latest Announcements</h2>
          {announcements.length > 0 ? (
            <ul>
              {announcements.map((ann) => (
                <li key={ann.id}>
                  <h3>{ann.title}</h3>
                  <p>{ann.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No announcements yet.</p>
          )}
        </div>

        {/* Assignments Section */}
        <div className="card assignments-card">
          <h2>Your Assignments</h2>
          {assignments.length > 0 ? (
            <ul>
              {assignments.map((assign) => (
                <li key={assign.id}>
                  <h3>{assign.title}</h3>
                  <p>Due: {new Date(assign.dueDate).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No assignments yet.</p>
          )}
        </div>

        {/* Library Resources Section */}
        <div className="card library-card">
          <h2>Available Resources</h2>
          {resources.length > 0 ? (
            <ul>
              {resources.map((resource) => (
                <li key={resource.id}>
                  <h3>{resource.title}</h3>
                  <p>Available: {resource.availableCopies}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No resources available.</p>
          )}
        </div>

        {/* Submit Complaint Section */}
        <div className="card complaint-card">
          <h2>Submit a Complaint</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            handleSubmitComplaint({
              title: formData.get('title') as string,
              description: formData.get('description') as string,
            });
            (e.currentTarget as HTMLFormElement).reset();
          }}>
            <input type="text" name="title" placeholder="Complaint Title" required />
            <textarea name="description" placeholder="Describe your complaint..." required></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      {loading && <p className="loading">Loading dashboard...</p>}
    </div>
  );
};

export default StudentDashboard;
