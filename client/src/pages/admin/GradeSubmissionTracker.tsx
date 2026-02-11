import React, { useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import { Bell, CheckCircle, Clock, Send, ShieldCheck } from 'lucide-react';

interface GradeRecord {
  id: string;
  courseCode: string;
  section: string;
  teacher: string;
  status: 'Submitted' | 'Pending' | 'Overdue';
  dueDate: string;
  submittedDate?: string;
  distribution?: Record<string, number>;
}

const GradeSubmissionTracker: React.FC = () => {
  const [records, setRecords] = useState<GradeRecord[]>([
    {
      id: 'G-01',
      courseCode: 'CSE201',
      section: '1',
      teacher: 'Dr. Ahmed Khan',
      status: 'Submitted',
      dueDate: '2026-05-20',
      submittedDate: '2026-05-18',
      distribution: { A: 12, 'A-': 8, B: 10, C: 3, F: 1 }
    },
    {
      id: 'G-02',
      courseCode: 'CSE203',
      section: '2',
      teacher: 'Prof. Fatima Ali',
      status: 'Pending',
      dueDate: '2026-05-20'
    },
    {
      id: 'G-03',
      courseCode: 'CSE305',
      section: '1',
      teacher: 'Dr. Karim Rahman',
      status: 'Overdue',
      dueDate: '2026-05-18'
    }
  ]);

  const [selectedRecord, setSelectedRecord] = useState<GradeRecord | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const summary = useMemo(() => {
    return {
      submitted: records.filter((r) => r.status === 'Submitted').length,
      pending: records.filter((r) => r.status === 'Pending').length,
      overdue: records.filter((r) => r.status === 'Overdue').length
    };
  }, [records]);

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate).getTime();
    const now = Date.now();
    return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  };

  const columns = [
    { key: 'courseCode', label: 'Course', sortable: true },
    { key: 'section', label: 'Section', sortable: true },
    { key: 'teacher', label: 'Teacher', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: GradeRecord['status']) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'Submitted'
              ? 'bg-green-100 text-green-700'
              : value === 'Overdue'
              ? 'bg-red-100 text-red-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {value}
        </span>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true
    },
    {
      key: 'daysRemaining',
      label: 'Days Remaining',
      sortable: true,
      render: (_: any, item: GradeRecord) => getDaysRemaining(item.dueDate)
    }
  ];

  const handleSendReminder = (record: GradeRecord) => {
    alert(`Reminder sent to ${record.teacher} for ${record.courseCode}-${record.section}`);
  };

  const handleApprove = (record: GradeRecord) => {
    setSelectedRecord(record);
    setShowApprovalModal(true);
  };

  const actions = [
    { label: 'Reminder', onClick: handleSendReminder, color: 'blue' as const, icon: <Bell size={18} /> },
    { label: 'Approve', onClick: handleApprove, color: 'green' as const, icon: <ShieldCheck size={18} /> }
  ];

  return (
    <div className="p-6 space-y-6">
        <PageHeader
          title="Grade Submission Tracker"
          subtitle="Monitor submissions and approve grade distributions"
          icon={<Clock size={24} className="text-white" />}
          action={{
            label: 'Send All Reminders',
            onClick: () => alert('Reminders sent to all pending/overdue instructors.'),
            variant: 'secondary'
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Submitted</p>
            <p className="text-2xl font-semibold text-gray-900">{summary.submitted}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-2xl font-semibold text-gray-900">{summary.pending}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Overdue</p>
            <p className="text-2xl font-semibold text-gray-900">{summary.overdue}</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={records}
          actions={actions}
          searchable
          searchFields={['courseCode', 'section', 'teacher']}
        />

        <AdminModal
          title="Grade Approval"
          open={showApprovalModal}
          onClose={() => setShowApprovalModal(false)}
          size="lg"
        >
          {selectedRecord && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900">
                  {selectedRecord.courseCode} - Section {selectedRecord.section}
                </p>
                <p className="text-xs text-gray-500">Instructor: {selectedRecord.teacher}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedRecord.distribution ? (
                  Object.entries(selectedRecord.distribution).map(([grade, count]) => (
                    <div key={grade} className="border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Grade {grade}</p>
                      <p className="text-lg font-semibold text-gray-900">{count} students</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No distribution uploaded yet.</p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    setRecords((prev) =>
                      prev.map((item) =>
                        item.id === selectedRecord.id ? { ...item, status: 'Submitted' } : item
                      )
                    )
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle size={16} className="inline mr-2" /> Approve Grades
                </button>
                <button
                  onClick={() => alert('Grades rejected and instructor notified.')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject Grades
                </button>
              </div>
            </div>
          )}
        </AdminModal>
      </div>
  );
};

export default GradeSubmissionTracker;
