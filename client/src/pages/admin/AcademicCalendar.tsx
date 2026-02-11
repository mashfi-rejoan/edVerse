import React, { useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import AdminModal from '../../components/AdminModal';
import { CalendarDays, CalendarRange, Plus, Trash2, Copy, CheckCircle, Edit } from 'lucide-react';

interface Holiday {
  id: string;
  date: string;
  reason: string;
}

interface CalendarEntry {
  id: string;
  academicYear: string;
  semester: string;
  status: 'Active' | 'Inactive';
  dates: {
    semesterStart: string;
    semesterEnd: string;
    classStart: string;
    classEnd: string;
    registrationStart: string;
    registrationEnd: string;
    lateRegStart: string;
    lateRegEnd: string;
    dropAddStart: string;
    dropAddEnd: string;
    midtermStart: string;
    midtermEnd: string;
    finalStart: string;
    finalEnd: string;
    gradeSubmission: string;
  };
  holidays: Holiday[];
}

const emptyDates = {
  semesterStart: '',
  semesterEnd: '',
  classStart: '',
  classEnd: '',
  registrationStart: '',
  registrationEnd: '',
  lateRegStart: '',
  lateRegEnd: '',
  dropAddStart: '',
  dropAddEnd: '',
  midtermStart: '',
  midtermEnd: '',
  finalStart: '',
  finalEnd: '',
  gradeSubmission: ''
};

const AcademicCalendar: React.FC = () => {
  const [entries, setEntries] = useState<CalendarEntry[]>([
    {
      id: '1',
      academicYear: '2026',
      semester: 'Spring',
      status: 'Active',
      dates: {
        semesterStart: '2026-01-10',
        semesterEnd: '2026-05-20',
        classStart: '2026-01-15',
        classEnd: '2026-05-05',
        registrationStart: '2026-01-01',
        registrationEnd: '2026-01-08',
        lateRegStart: '2026-01-09',
        lateRegEnd: '2026-01-12',
        dropAddStart: '2026-01-16',
        dropAddEnd: '2026-01-22',
        midtermStart: '2026-03-10',
        midtermEnd: '2026-03-18',
        finalStart: '2026-05-08',
        finalEnd: '2026-05-18',
        gradeSubmission: '2026-05-25'
      },
      holidays: [
        { id: 'h1', date: '2026-02-21', reason: 'International Mother Language Day' },
        { id: 'h2', date: '2026-03-26', reason: 'Independence Day' }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState<'form' | 'calendar' | 'list'>('form');
  const [formData, setFormData] = useState<CalendarEntry>({
    id: '',
    academicYear: '2026',
    semester: 'Spring',
    status: 'Inactive',
    dates: { ...emptyDates },
    holidays: []
  });
  const [holidayDraft, setHolidayDraft] = useState({ date: '', reason: '' });
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [selectedCloneId, setSelectedCloneId] = useState('');

  const activeEntry = entries.find((entry) => entry.status === 'Active');

  const handleAddHoliday = () => {
    if (!holidayDraft.date || !holidayDraft.reason) return;
    setFormData((prev) => ({
      ...prev,
      holidays: [
        ...prev.holidays,
        { id: `h-${Date.now()}`, date: holidayDraft.date, reason: holidayDraft.reason }
      ]
    }));
    setHolidayDraft({ date: '', reason: '' });
  };

  const handleRemoveHoliday = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      holidays: prev.holidays.filter((holiday) => holiday.id !== id)
    }));
  };

  const handleSaveCalendar = () => {
    const newEntry: CalendarEntry = {
      ...formData,
      id: formData.id || String(Date.now())
    };

    setEntries((prev) => {
      const filtered = prev.filter((entry) => entry.id !== newEntry.id);
      const updated = newEntry.status === 'Active'
        ? filtered.map((entry) => ({ ...entry, status: 'Inactive' as const }))
        : filtered;
      return [...updated, newEntry];
    });

    setFormData({
      id: '',
      academicYear: formData.academicYear,
      semester: formData.semester,
      status: 'Inactive',
      dates: { ...emptyDates },
      holidays: []
    });
  };

  const handleEditEntry = (entry: CalendarEntry) => {
    setActiveTab('form');
    setFormData({ ...entry });
  };

  const handleDeleteEntry = (entry: CalendarEntry) => {
    if (entry.status === 'Active') {
      alert('Active calendar cannot be deleted.');
      return;
    }
    setEntries((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleClone = () => {
    const source = entries.find((entry) => entry.id === selectedCloneId);
    if (!source) return;
    setFormData({
      ...source,
      id: '',
      status: 'Inactive',
      academicYear: source.academicYear,
      semester: source.semester
    });
    setShowCloneModal(false);
    setActiveTab('form');
  };

  const calendarList = useMemo(() => {
    return entries.sort((a, b) => (a.academicYear > b.academicYear ? -1 : 1));
  }, [entries]);

  const eventBlocks = useMemo(() => {
    if (!activeEntry) return [];
    return [
      { label: 'Registration', color: 'bg-blue-100 text-blue-700', date: activeEntry.dates.registrationStart },
      { label: 'Classes Begin', color: 'bg-green-100 text-green-700', date: activeEntry.dates.classStart },
      { label: 'Midterm', color: 'bg-red-100 text-red-700', date: activeEntry.dates.midtermStart },
      { label: 'Final', color: 'bg-purple-100 text-purple-700', date: activeEntry.dates.finalStart }
    ];
  }, [activeEntry]);

  return (
    <div className="p-6">
        <PageHeader
          title="Academic Calendar"
          subtitle="Configure semester dates, holidays, and deadlines"
          icon={<CalendarRange size={24} className="text-white" />}
          action={{
            label: 'Clone Previous',
            onClick: () => setShowCloneModal(true),
            variant: 'secondary'
          }}
        />

        <div className="mt-6 flex gap-3 flex-wrap">
          {['form', 'calendar', 'list'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tab === 'form' ? 'Calendar Form' : tab === 'calendar' ? 'Calendar View' : 'List View'}
            </button>
          ))}
        </div>

        {activeTab === 'form' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                <input
                  value={formData.academicYear}
                  onChange={(e) => setFormData((prev) => ({ ...prev, academicYear: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData((prev) => ({ ...prev, semester: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                >
                  {['Spring', 'Summer', 'Fall'].map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as CalendarEntry['status'] }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.dates).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="date"
                    value={value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dates: { ...prev.dates, [key]: e.target.value }
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Holidays</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="date"
                  value={holidayDraft.date}
                  onChange={(e) => setHolidayDraft((prev) => ({ ...prev, date: e.target.value }))}
                  className="px-4 py-3 border border-gray-200 rounded-lg"
                />
                <input
                  value={holidayDraft.reason}
                  onChange={(e) => setHolidayDraft((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="Holiday reason"
                  className="px-4 py-3 border border-gray-200 rounded-lg"
                />
                <button
                  onClick={handleAddHoliday}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={18} /> Add Holiday
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {formData.holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{holiday.reason}</p>
                      <p className="text-xs text-gray-500">{holiday.date}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveHoliday(holiday.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {formData.holidays.length === 0 && (
                  <p className="text-sm text-gray-500">No holidays added.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setFormData({
                    id: '',
                    academicYear: formData.academicYear,
                    semester: formData.semester,
                    status: 'Inactive',
                    dates: { ...emptyDates },
                    holidays: []
                  })
                }
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Clear
              </button>
              <button
                onClick={handleSaveCalendar}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Calendar
              </button>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {eventBlocks.map((event) => (
                <div key={event.label} className={`rounded-xl px-4 py-3 ${event.color}`}>
                  <p className="text-xs font-semibold">{event.label}</p>
                  <p className="text-sm font-semibold">{event.date || 'TBD'}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(activeEntry?.holidays || []).map((holiday) => (
                <div key={holiday.id} className="border border-gray-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-900">{holiday.reason}</p>
                  <p className="text-xs text-gray-500">{holiday.date}</p>
                </div>
              ))}
              {activeEntry?.holidays?.length === 0 && (
                <p className="text-sm text-gray-500">No holidays added for active calendar.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="mt-6 space-y-4">
            {calendarList.map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {entry.semester} {entry.academicYear}
                    </p>
                    <p className="text-xs text-gray-500">Status: {entry.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <Edit size={14} className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry)}
                      className="px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={14} className="inline mr-1" /> Delete
                    </button>
                    {entry.status !== 'Active' && (
                      <button
                        onClick={() =>
                          setEntries((prev) =>
                            prev.map((item) =>
                              item.id === entry.id ? { ...item, status: 'Active' } : { ...item, status: 'Inactive' }
                            )
                          )
                        }
                        className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                      >
                        <CheckCircle size={14} className="inline mr-1" /> Mark Active
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AdminModal
          title="Clone Previous Calendar"
          open={showCloneModal}
          onClose={() => setShowCloneModal(false)}
          size="md"
        >
          <div className="space-y-4">
            <select
              value={selectedCloneId}
              onChange={(e) => setSelectedCloneId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg"
            >
              <option value="">Select calendar</option>
              {entries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.semester} {entry.academicYear}
                </option>
              ))}
            </select>
            <button
              onClick={handleClone}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Copy size={16} className="inline mr-2" /> Clone Calendar
            </button>
          </div>
        </AdminModal>
      </div>
  );
};

export default AcademicCalendar;
