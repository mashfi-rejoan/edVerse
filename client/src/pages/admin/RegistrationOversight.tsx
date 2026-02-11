import React, { useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import { FileDown, Eye, CheckCircle, XCircle, Filter, ClipboardCheck } from 'lucide-react';

interface RegistrationRequest {
  id: string;
  studentName: string;
  studentId: string;
  email: string;
  courseCode: string;
  section: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestType: 'Add' | 'Drop' | 'Swap';
  submittedAt: string;
}

const RegistrationOversight: React.FC = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([
    {
      id: '1',
      studentName: 'Muhammad Ali',
      studentId: 'CSE21001',
      email: 'ali@student.edu.bd',
      courseCode: 'CSE201',
      section: '1',
      status: 'Pending',
      requestType: 'Add',
      submittedAt: '2026-01-12'
    },
    {
      id: '2',
      studentName: 'Zainab Khan',
      studentId: 'CSE21002',
      email: 'zainab@student.edu.bd',
      courseCode: 'CSE203',
      section: '2',
      status: 'Approved',
      requestType: 'Drop',
      submittedAt: '2026-01-10'
    },
    {
      id: '3',
      studentName: 'Rafiul Hasan',
      studentId: 'CSE20011',
      email: 'rafiul@student.edu.bd',
      courseCode: 'CSE305',
      section: '1',
      status: 'Rejected',
      requestType: 'Swap',
      submittedAt: '2026-01-11'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({ status: 'All', type: 'All' });

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchStatus = filters.status === 'All' || req.status === filters.status;
      const matchType = filters.type === 'All' || req.requestType === filters.type;
      return matchStatus && matchType;
    });
  }, [requests, filters]);

  const handleApprove = (req: RegistrationRequest) => {
    setRequests((prev) => prev.map((item) => (item.id === req.id ? { ...item, status: 'Approved' } : item)));
  };

  const handleReject = (req: RegistrationRequest) => {
    setRequests((prev) => prev.map((item) => (item.id === req.id ? { ...item, status: 'Rejected' } : item)));
  };

  const columns = [
    { key: 'studentName', label: 'Student', sortable: true },
    { key: 'studentId', label: 'Student ID', sortable: true },
    { key: 'courseCode', label: 'Course', sortable: true },
    { key: 'section', label: 'Section', sortable: true },
    { key: 'requestType', label: 'Type', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: RegistrationRequest['status']) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'Approved'
              ? 'bg-green-100 text-green-700'
              : value === 'Rejected'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {value}
        </span>
      )
    }
  ];

  const actions = [
    { label: 'View', onClick: (req: RegistrationRequest) => { setSelectedRequest(req); setShowDetailModal(true); }, color: 'blue' as const, icon: <Eye size={18} /> },
    { label: 'Approve', onClick: handleApprove, color: 'green' as const, icon: <CheckCircle size={18} /> },
    { label: 'Reject', onClick: handleReject, color: 'red' as const, icon: <XCircle size={18} /> }
  ];

  return (
    <div className="p-6">
        <PageHeader
          title="Registration Oversight"
          subtitle="Review add/drop requests and export registration data"
          icon={<ClipboardCheck size={24} className="text-white" />}
          action={{
            label: 'Export CSV',
            onClick: () => alert('CSV export will be available in next iteration.'),
            variant: 'secondary'
          }}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="px-4 py-3 border border-gray-200 rounded-lg"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
            className="px-4 py-3 border border-gray-200 rounded-lg"
          >
            <option value="All">All Types</option>
            <option value="Add">Add</option>
            <option value="Drop">Drop</option>
            <option value="Swap">Swap</option>
          </select>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
            <FileDown size={16} /> Export to CSV / Excel
          </div>
        </div>

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={filteredRequests}
            actions={actions}
            searchable
            searchFields={['studentName', 'studentId', 'courseCode', 'section']}
          />
        </div>

        <AdminModal
          title="Request Details"
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          size="md"
        >
          {selectedRequest && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{selectedRequest.studentName}</p>
                <p className="text-xs text-gray-500">{selectedRequest.studentId} • {selectedRequest.email}</p>
              </div>
              <div className="text-sm text-gray-700">
                <p>Course: {selectedRequest.courseCode} (Section {selectedRequest.section})</p>
                <p>Request Type: {selectedRequest.requestType}</p>
                <p>Submitted: {selectedRequest.submittedAt}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(selectedRequest)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedRequest)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </AdminModal>
      </div>
  );
};

export default RegistrationOversight;
