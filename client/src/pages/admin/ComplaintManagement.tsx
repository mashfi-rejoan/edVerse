import React, { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  MessageSquare,
  Send,
  UserCheck,
  UserPlus
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

interface ComplaintComment {
  id: string;
  author: string;
  time: string;
  text: string;
}

interface ComplaintRecord {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedRole: 'Student' | 'Teacher' | 'Staff';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Withdrawn' | 'Pending';
  category: 'Academic' | 'Facility' | 'Conduct' | 'Other' | 'Administration' | 'Technical' | 'Harassment' | 'Lost and Found';
  assignedTo: string | null;
  submittedAt: string;
  assignedAt?: string;
  resolution?: string;
  comments: ComplaintComment[];
}

const staffMembers = ['Admin Office', 'Facility Team', 'Academic Board', 'Discipline Committee'];

const ComplaintManagement: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({ status: 'All', priority: 'All', category: 'All', assignee: 'All' });
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigneeDraft, setAssigneeDraft] = useState('');
  const [commentDraft, setCommentDraft] = useState('');
  const [resolutionDraft, setResolutionDraft] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await adminService.getComplaints();
      if (response.success) {
        const complaintRows = (response.data?.complaints || []).map((complaint: any) => ({
          id: complaint._id,
          title: complaint.title,
          description: complaint.description,
          submittedBy: complaint.submittedByName || complaint.createdBy?.name || 'Anonymous',
          submittedRole: complaint.submittedRole || 'Student',
          priority: complaint.priority || 'Medium',
          status: complaint.status || 'Open',
          category: complaint.category || 'Other',
          assignedTo: complaint.assignedTo || null,
          submittedAt: complaint.createdAt ? new Date(complaint.createdAt).toISOString().slice(0, 10) : '',
          assignedAt: complaint.assignedAt ? new Date(complaint.assignedAt).toISOString().slice(0, 10) : undefined,
          resolution: complaint.resolution,
          comments: (complaint.comments || []).map((comment: any, index: number) => ({
            id: `${complaint._id}-${index}`,
            author: comment.author,
            time: comment.time ? new Date(comment.time).toISOString().slice(0, 16).replace('T', ' ') : '',
            text: comment.text
          }))
        }));
        setComplaints(complaintRows);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const matchStatus = filters.status === 'All' || item.status === filters.status;
      const matchPriority = filters.priority === 'All' || item.priority === filters.priority;
      const matchCategory = filters.category === 'All' || item.category === filters.category;
      const matchAssignee =
        filters.assignee === 'All' || (item.assignedTo || 'Unassigned') === filters.assignee;
      return matchStatus && matchPriority && matchCategory && matchAssignee;
    });
  }, [complaints, filters]);

  const totalComplaints = complaints.length;
  const openComplaints = complaints.filter((c) => c.status === 'Open').length;
  const inProgressComplaints = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;

  const avgResolution = useMemo(() => {
    const resolved = complaints.filter((c) => c.status === 'Resolved' && c.submittedAt && c.assignedAt);
    if (resolved.length === 0) return 0;
    const totalDays = resolved.reduce((sum, item) => {
      const start = new Date(item.submittedAt).getTime();
      const end = new Date(item.assignedAt || item.submittedAt).getTime();
      return sum + Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    }, 0);
    return Math.round(totalDays / resolved.length);
  }, [complaints]);

  const priorityData = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    complaints.forEach((c) => {
      counts[c.priority] += 1;
    });
    return [
      { name: 'High', value: counts.High },
      { name: 'Medium', value: counts.Medium },
      { name: 'Low', value: counts.Low }
    ];
  }, [complaints]);

  const getDaysOpen = (date: string) => {
    const start = new Date(date).getTime();
    const now = Date.now();
    return Math.max(1, Math.ceil((now - start) / (1000 * 60 * 60 * 24)));
  };

  const columns = [
    { key: 'id', label: 'Complaint ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'submittedBy', label: 'Submitted By', sortable: true },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value: ComplaintRecord['priority']) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'High'
              ? 'bg-red-100 text-red-700'
              : value === 'Medium'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: ComplaintRecord['status']) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'Resolved'
              ? 'bg-green-100 text-green-700'
              : value === 'In Progress'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {value}
        </span>
      )
    },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      sortable: true,
      render: (value: string | null) => value || 'Unassigned'
    },
    { key: 'submittedAt', label: 'Date', sortable: true },
    {
      key: 'daysOpen',
      label: 'Days Open',
      sortable: true,
      render: (_: any, item: ComplaintRecord) => getDaysOpen(item.submittedAt)
    }
  ];

  const handleView = (complaint: ComplaintRecord) => {
    setSelectedComplaint(complaint);
    setResolutionDraft(complaint.resolution || '');
    setShowDetailModal(true);
  };

  const handleAssign = (complaint: ComplaintRecord) => {
    setSelectedComplaint(complaint);
    setAssigneeDraft(complaint.assignedTo || '');
    setShowAssignModal(true);
  };

  const handleResolve = async (complaint: ComplaintRecord) => {
    try {
      const response = await adminService.updateComplaint(complaint.id, {
        status: 'Resolved',
        resolution: resolutionDraft || complaint.resolution,
        resolvedAt: new Date().toISOString()
      });
      if (response.success) {
        await fetchComplaints();
        setShowDetailModal(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to resolve complaint');
    }
  };

  const handleReopen = async (complaint: ComplaintRecord) => {
    try {
      const response = await adminService.updateComplaint(complaint.id, {
        status: 'Open',
        resolution: ''
      });
      if (response.success) {
        await fetchComplaints();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to reopen complaint');
    }
  };

  const handleSaveAssignment = async () => {
    if (!selectedComplaint) return;
    try {
      const response = await adminService.updateComplaint(selectedComplaint.id, {
        assignedTo: assigneeDraft,
        status: 'In Progress',
        assignedAt: new Date().toISOString()
      });
      if (response.success) {
        await fetchComplaints();
        setShowAssignModal(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to assign complaint');
    }
  };

  const handleAddComment = async () => {
    if (!selectedComplaint || !commentDraft.trim()) return;
    const nextComments: ComplaintComment[] = [
      ...selectedComplaint.comments,
      {
        id: `c-${Date.now()}`,
        author: 'Admin',
        time: new Date().toISOString().slice(0, 16).replace('T', ' '),
        text: commentDraft
      }
    ];

    try {
      const response = await adminService.updateComplaint(selectedComplaint.id, {
        comments: nextComments.map((comment) => ({
          author: comment.author,
          time: new Date(comment.time),
          text: comment.text
        }))
      });
      if (response.success) {
        await fetchComplaints();
        setCommentDraft('');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to add comment');
    }
  };

  const actions = [
    { label: 'View', onClick: handleView, color: 'blue' as const, icon: <MessageSquare size={18} /> },
    { label: 'Assign', onClick: handleAssign, color: 'green' as const, icon: <UserPlus size={18} /> },
    { label: 'Resolve', onClick: handleResolve, color: 'red' as const, icon: <CheckCircle size={18} /> }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner text="Loading complaints..." />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
        <PageHeader
          title="Complaint Management"
          subtitle="Track, assign, and resolve student & teacher complaints"
          icon={<AlertTriangle size={24} className="text-white" />}
        />

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-2xl font-semibold text-gray-900">{totalComplaints}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Open</p>
            <p className="text-2xl font-semibold text-gray-900">{openComplaints}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">In Progress</p>
            <p className="text-2xl font-semibold text-gray-900">{inProgressComplaints}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Resolved</p>
            <p className="text-2xl font-semibold text-gray-900">{resolvedComplaints}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Avg Resolution (days)</p>
            <p className="text-2xl font-semibold text-gray-900">{avgResolution}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Priority Distribution</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priorityData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {priorityData.map((entry, idx) => (
                      <Cell
                        key={entry.name}
                        fill={['#ef4444', '#f59e0b', '#10b981'][idx % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="px-4 py-3 border border-gray-200 rounded-lg"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
                className="px-4 py-3 border border-gray-200 rounded-lg"
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="px-4 py-3 border border-gray-200 rounded-lg"
              >
                <option value="All">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Facility">Facility</option>
                <option value="Conduct">Conduct</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={filters.assignee}
                onChange={(e) => setFilters((prev) => ({ ...prev, assignee: e.target.value }))}
                className="px-4 py-3 border border-gray-200 rounded-lg"
              >
                <option value="All">All Assignees</option>
                <option value="Unassigned">Unassigned</option>
                {staffMembers.map((staff) => (
                  <option key={staff} value={staff}>
                    {staff}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <DataTable
                columns={columns}
                data={filteredComplaints}
                actions={actions}
                searchable
                searchFields={['id', 'title', 'submittedBy', 'assignedTo']}
              />
            </div>
          </div>
        </div>

        <AdminModal
          title="Complaint Details"
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          size="lg"
        >
          {selectedComplaint && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedComplaint.title}</h3>
                <p className="text-xs text-gray-500">{selectedComplaint.id} • {selectedComplaint.submittedAt}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                  Submitted by {selectedComplaint.submittedBy} ({selectedComplaint.submittedRole})
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                  Assigned to: {selectedComplaint.assignedTo || 'Unassigned'}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-700">{selectedComplaint.description}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resolution</label>
                <textarea
                  value={resolutionDraft}
                  onChange={(e) => setResolutionDraft(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Comments</label>
                <div className="space-y-3">
                  {selectedComplaint.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">{comment.author} • {comment.time}</p>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                  {selectedComplaint.comments.length === 0 && (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    placeholder="Add comment"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {selectedComplaint.status !== 'Resolved' ? (
                  <button
                    onClick={() => handleResolve(selectedComplaint)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="inline mr-2" /> Mark Resolved
                  </button>
                ) : (
                  <button
                    onClick={() => handleReopen(selectedComplaint)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Reopen
                  </button>
                )}
                <button
                  onClick={() => handleAssign(selectedComplaint)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <UserCheck size={16} className="inline mr-2" /> Assign
                </button>
              </div>
            </div>
          )}
        </AdminModal>

        <AdminModal
          title="Assign Complaint"
          open={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          size="md"
        >
          <div className="space-y-4">
            <select
              value={assigneeDraft}
              onChange={(e) => setAssigneeDraft(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg"
            >
              <option value="">Select staff</option>
              {staffMembers.map((staff) => (
                <option key={staff} value={staff}>
                  {staff}
                </option>
              ))}
            </select>
            <button
              onClick={handleSaveAssignment}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Assignment
            </button>
          </div>
        </AdminModal>
      </div>
  );
};

export default ComplaintManagement;
