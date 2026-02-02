import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { MessageSquare, Send, XCircle } from 'lucide-react';
import authService from '../../services/authService';
import { apiUrl } from '../../utils/apiBase';

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  withdrawnAt?: string;
}

const COMPLAINT_CATEGORIES = [
  'Academic',
  'Facility',
  'Faculty',
  'Administration',
  'Technical',
  'Harassment',
  'Other',
];

const Complaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl('/api/shared/complaints'));
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      setSubmitting(true);
      const user = authService.getCurrentUser();
      const response = await fetch(apiUrl('/api/shared/complaints'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          createdBy: user?.id
        })
      });

      if (response.ok) {
        const newComplaint = await response.json();
        // Ensure state is properly updated with new complaint
        setComplaints(prevComplaints => [newComplaint, ...prevComplaints]);
        setTitle('');
        setDescription('');
        setCategory('Academic');
        alert('Complaint submitted successfully!');
      } else {
        throw new Error('Failed to submit complaint');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async (complaintId: string) => {
    if (!confirm('Are you sure you want to withdraw this complaint?')) return;

    try {
      const response = await fetch(apiUrl(`/api/shared/complaints/${complaintId}/withdraw`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Use functional update to ensure latest state
        setComplaints(prevComplaints =>
          prevComplaints.map((c) =>
            c._id === complaintId ? { ...c, status: 'Withdrawn', withdrawnAt: new Date().toISOString() } : c
          )
        );
        alert('Complaint withdrawn successfully. Moderators have been notified.');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to withdraw complaint');
      }
    } catch (error) {
      console.error('Error withdrawing complaint:', error);
      alert('Failed to withdraw complaint. Please try again.');
    }
  };

  return (
    <DashboardLayout title="Complaints">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Submit & Track Complaints</h1>

        {/* Submit Complaint Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Send size={20} />
            Submit a Complaint
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of your issue"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about your complaint..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
            >
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare size={20} />
            Your Complaints
          </h2>

          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No complaints submitted yet</p>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{complaint.title}</h3>
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {complaint.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          complaint.status === 'Resolved'
                            ? 'bg-green-100 text-green-800'
                            : complaint.status === 'Withdrawn'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {complaint.status}
                      </span>
                      {complaint.status === 'Pending' && (
                        <button
                          onClick={() => handleWithdraw(complaint._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                          title="Withdraw complaint"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{complaint.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                    {complaint.status === 'Withdrawn' && complaint.withdrawnAt && (
                      <p className="text-xs text-gray-500">
                        Withdrawn on {new Date(complaint.withdrawnAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Complaints;
