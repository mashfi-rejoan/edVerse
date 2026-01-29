import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const ModeratorDashboard = () => {
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [pendingResources, setPendingResources] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time notifications
    setupNotificationListener();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/moderation/pending');
      const data = await response.json();
      
      setPendingComplaints(data.filter(item => item.itemType === 'Complaint'));
      setPendingResources(data.filter(item => item.itemType === 'Resource'));
      setPendingEvents(data.filter(item => item.itemType === 'Event'));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching moderation data:', error);
      setLoading(false);
    }
  };

  const setupNotificationListener = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Get from auth context
      const response = await fetch(`/api/notifications/user/${userId}`);
      const data = await response.json();
      setNotifications(data.filter(n => !n.read));
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/moderation/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewedBy: localStorage.getItem('userId') }),
      });
      const data = await response.json();
      alert('Item approved successfully!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving item:', error);
    }
  };

  const handleReject = async (id, reason) => {
    try {
      const response = await fetch(`/api/moderation/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, reviewedBy: localStorage.getItem('userId') }),
      });
      const data = await response.json();
      alert('Item rejected successfully!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting item:', error);
    }
  };

  return (
    <DashboardLayout title="Moderator Dashboard">
      <div className="space-y-6">
      {/* Notifications Alert */}
      {notifications.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">{notifications.length} new notification(s)</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Complaints */}
        <div className="card complaints-card">
          <h2>Pending Complaints ({pendingComplaints.length})</h2>
          {pendingComplaints.length > 0 ? (
            <ul>
              {pendingComplaints.map((complaint) => (
                <li key={complaint._id}>
                  <h3>{complaint.content}</h3>
                  <p>Submitted by: {complaint.submittedBy}</p>
                  <p>Date: {new Date(complaint.submittedAt).toLocaleDateString()}</p>
                  <div className="actions">
                    <button onClick={() => handleApprove(complaint._id)}>Approve</button>
                    <button onClick={() => handleReject(complaint._id, 'Invalid')}>Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending complaints.</p>
          )}
        </div>

        {/* Pending Resources */}
        <div className="card resources-card">
          <h2>Pending Resources ({pendingResources.length})</h2>
          {pendingResources.length > 0 ? (
            <ul>
              {pendingResources.map((resource) => (
                <li key={resource._id}>
                  <h3>{resource.content}</h3>
                  <p>Submitted by: {resource.submittedBy}</p>
                  <div className="actions">
                    <button onClick={() => handleApprove(resource._id)}>Approve</button>
                    <button onClick={() => handleReject(resource._id, 'Inappropriate')}>Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending resources.</p>
          )}
        </div>

        {/* Pending Events */}
        <div className="card events-card">
          <h2>Pending Events ({pendingEvents.length})</h2>
          {pendingEvents.length > 0 ? (
            <ul>
              {pendingEvents.map((event) => (
                <li key={event._id}>
                  <h3>{event.content}</h3>
                  <p>Submitted by: {event.submittedBy}</p>
                  <div className="actions">
                    <button onClick={() => handleApprove(event._id)}>Approve</button>
                    <button onClick={() => handleReject(event._id, 'Conflict')}>Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending events.</p>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="card notifications-card">
          <h2>Recent Notifications</h2>
          {notifications.length > 0 ? (
            <ul>
              {notifications.slice(0, 5).map((notif) => (
                <li key={notif._id}>
                  <p>{notif.message}</p>
                  <small>{new Date(notif.createdAt).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No new notifications.</p>
          )}
        </div>
      </div>

      {loading && <p className="text-center text-gray-500 py-4">Loading dashboard...</p>}
      </div>
    </DashboardLayout>
  );
};

export default ModeratorDashboard;
