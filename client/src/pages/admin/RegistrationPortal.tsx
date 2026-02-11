import React, { useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import AdminForm, { FormField } from '../../components/AdminForm';
import AdminModal from '../../components/AdminModal';
import { CalendarCheck, FileEdit, Edit, PlayCircle, PauseCircle, Copy } from 'lucide-react';

interface RegistrationWindow {
  id: string;
  term: string;
  academicYear: string;
  status: 'Open' | 'Closed' | 'Scheduled';
  startDate: string;
  endDate: string;
  maxCredits: number;
  lateRegStart?: string;
  lateRegEnd?: string;
  dropAddStart?: string;
  dropAddEnd?: string;
}

const RegistrationPortal: React.FC = () => {
  const [windows, setWindows] = useState<RegistrationWindow[]>([
    {
      id: '1',
      term: 'Spring',
      academicYear: '2026',
      status: 'Open',
      startDate: '2026-01-01',
      endDate: '2026-01-08',
      maxCredits: 18,
      lateRegStart: '2026-01-09',
      lateRegEnd: '2026-01-12',
      dropAddStart: '2026-01-16',
      dropAddEnd: '2026-01-22'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, any>>({});

  const formFields: FormField[] = [
    { name: 'term', label: 'Semester', type: 'select', required: true, options: [
      { label: 'Spring', value: 'Spring' },
      { label: 'Summer', value: 'Summer' },
      { label: 'Fall', value: 'Fall' }
    ]},
    { name: 'academicYear', label: 'Academic Year', type: 'text', required: true, placeholder: '2026' },
    { name: 'status', label: 'Status', type: 'select', required: true, options: [
      { label: 'Open', value: 'Open' },
      { label: 'Closed', value: 'Closed' },
      { label: 'Scheduled', value: 'Scheduled' }
    ]},
    { name: 'startDate', label: 'Registration Start', type: 'date', required: true },
    { name: 'endDate', label: 'Registration End', type: 'date', required: true },
    { name: 'lateRegStart', label: 'Late Reg Start', type: 'date' },
    { name: 'lateRegEnd', label: 'Late Reg End', type: 'date' },
    { name: 'dropAddStart', label: 'Drop/Add Start', type: 'date' },
    { name: 'dropAddEnd', label: 'Drop/Add End', type: 'date' },
    { name: 'maxCredits', label: 'Max Credits', type: 'number', required: true }
  ];

  const handleSaveWindow = (data: any) => {
    if (editingId) {
      setWindows((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                term: data.term,
                academicYear: data.academicYear,
                status: data.status,
                startDate: data.startDate,
                endDate: data.endDate,
                lateRegStart: data.lateRegStart,
                lateRegEnd: data.lateRegEnd,
                dropAddStart: data.dropAddStart,
                dropAddEnd: data.dropAddEnd,
                maxCredits: Number(data.maxCredits)
              }
            : item
        )
      );
    } else {
      const newWindow: RegistrationWindow = {
        id: String(Date.now()),
        term: data.term,
        academicYear: data.academicYear,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        lateRegStart: data.lateRegStart,
        lateRegEnd: data.lateRegEnd,
        dropAddStart: data.dropAddStart,
        dropAddEnd: data.dropAddEnd,
        maxCredits: Number(data.maxCredits)
      };
      setWindows((prev) => [...prev, newWindow]);
    }

    setShowModal(false);
    setEditingId(null);
    setFormDefaults({});
  };

  const handleEdit = (window: RegistrationWindow) => {
    setEditingId(window.id);
    setFormDefaults({
      term: window.term,
      academicYear: window.academicYear,
      status: window.status,
      startDate: window.startDate,
      endDate: window.endDate,
      lateRegStart: window.lateRegStart,
      lateRegEnd: window.lateRegEnd,
      dropAddStart: window.dropAddStart,
      dropAddEnd: window.dropAddEnd,
      maxCredits: window.maxCredits
    });
    setShowModal(true);
  };

  const handleStatusChange = (window: RegistrationWindow, status: RegistrationWindow['status']) => {
    setWindows((prev) =>
      prev.map((item) => (item.id === window.id ? { ...item, status } : item))
    );
  };

  const latestWindow = useMemo(() => {
    return windows[windows.length - 1];
  }, [windows]);

  return (
    <div className="p-6">
        <PageHeader
          title="Registration Portal"
          subtitle="Configure registration windows and policies"
          icon={<FileEdit size={24} className="text-white" />}
          action={{
            label: 'New Window',
            onClick: () => {
              setEditingId(null);
              setFormDefaults({});
              setShowModal(true);
            },
            variant: 'primary'
          }}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestWindow && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500">Current Window</p>
              <p className="text-lg font-semibold text-gray-900">
                {latestWindow.term} {latestWindow.academicYear}
              </p>
              <p className="text-sm text-gray-600">{latestWindow.startDate} → {latestWindow.endDate}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  latestWindow.status === 'Open'
                    ? 'bg-green-100 text-green-700'
                    : latestWindow.status === 'Scheduled'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {latestWindow.status}
              </span>
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Max Credits</p>
            <p className="text-2xl font-semibold text-gray-900">{latestWindow?.maxCredits || 18}</p>
            <p className="text-sm text-gray-500">Per student registration</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Quick Actions</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => latestWindow && handleStatusChange(latestWindow, 'Open')}
                className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg"
              >
                <PlayCircle size={14} className="inline mr-1" /> Open
              </button>
              <button
                onClick={() => latestWindow && handleStatusChange(latestWindow, 'Closed')}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg"
              >
                <PauseCircle size={14} className="inline mr-1" /> Close
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg"
              >
                <Edit size={14} className="inline mr-1" /> Edit
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700">All Registration Windows</h3>
            <div className="mt-4 space-y-3">
              {windows.map((window) => (
                <div key={window.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{window.term} {window.academicYear}</p>
                    <p className="text-xs text-gray-500">{window.startDate} → {window.endDate}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">Max {window.maxCredits} credits</span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        window.status === 'Open'
                          ? 'bg-green-100 text-green-700'
                          : window.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {window.status}
                    </span>
                    <button
                      onClick={() => handleEdit(window)}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg"
                    >
                      <Edit size={12} className="inline mr-1" /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AdminModal
          title={editingId ? 'Edit Registration Window' : 'Create Registration Window'}
          open={showModal}
          onClose={() => setShowModal(false)}
          size="lg"
        >
          <AdminForm
            fields={formFields}
            onSubmit={handleSaveWindow}
            onCancel={() => setShowModal(false)}
            submitText={editingId ? 'Update Window' : 'Create Window'}
            defaultValues={formDefaults}
          />
        </AdminModal>

        <AdminModal
          title="Clone Previous Window"
          open={showModal && false}
          onClose={() => setShowModal(false)}
          size="md"
        >
          <button
            onClick={() => setShowModal(false)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Copy size={16} className="inline mr-2" /> Clone Window
          </button>
        </AdminModal>
      </div>
  );
};

export default RegistrationPortal;
