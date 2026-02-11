import React, { useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import AdminModal from '../../components/AdminModal';
import { Calendar, Plus, Upload, Download, Printer, AlertTriangle, Clock, MapPin } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const ROOMS = ['201', '202', '204', '301', 'Lab-1'];
const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00'
];

interface ScheduleEntry {
  id: string;
  courseCode: string;
  section: string;
  teacher: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  building: string;
  color: string;
}

const colorPalette = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-amber-600', 'bg-rose-600'];

const RoutineManagement: React.FC = () => {
  const [activeDay, setActiveDay] = useState('Monday');
  const [entries, setEntries] = useState<ScheduleEntry[]>([
    {
      id: '1',
      courseCode: 'CSE201',
      section: '1',
      teacher: 'Dr. Ahmed Khan',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      room: '201',
      building: 'Building A',
      color: colorPalette[0]
    },
    {
      id: '2',
      courseCode: 'CSE203',
      section: '2',
      teacher: 'Prof. Fatima Ali',
      day: 'Monday',
      startTime: '11:00',
      endTime: '12:30',
      room: '202',
      building: 'Building A',
      color: colorPalette[1]
    },
    {
      id: '3',
      courseCode: 'CSE305',
      section: '1',
      teacher: 'Dr. Karim Rahman',
      day: 'Wednesday',
      startTime: '10:00',
      endTime: '12:00',
      room: 'Lab-1',
      building: 'Building B',
      color: colorPalette[2]
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    courseCode: '',
    section: '1',
    teacher: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    room: '201',
    building: 'Building A'
  });
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);

  const entriesForDay = useMemo(() => entries.filter((entry) => entry.day === activeDay), [entries, activeDay]);

  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const checkConflicts = (candidate: Omit<ScheduleEntry, 'id' | 'color'>, excludeId?: string) => {
    const issues: string[] = [];
    const candidateStart = timeToMinutes(candidate.startTime);
    const candidateEnd = timeToMinutes(candidate.endTime);

    if (candidateEnd - candidateStart > 180) {
      issues.push('Duration exceeds 3 hours.');
    }

    entries.forEach((entry) => {
      if (excludeId && entry.id === excludeId) return;
      if (entry.day !== candidate.day) return;
      const entryStart = timeToMinutes(entry.startTime);
      const entryEnd = timeToMinutes(entry.endTime);
      const overlap = candidateStart < entryEnd && candidateEnd > entryStart;
      const gap = Math.min(Math.abs(candidateStart - entryEnd), Math.abs(entryStart - candidateEnd));

      if (entry.room === candidate.room && overlap) {
        issues.push(`Room conflict with ${entry.courseCode}-${entry.section} (${entry.startTime}-${entry.endTime}).`);
      }

      if (entry.teacher === candidate.teacher && overlap) {
        issues.push(`Teacher conflict with ${entry.courseCode}-${entry.section} (${entry.startTime}-${entry.endTime}).`);
      }

      if ((entry.room === candidate.room || entry.teacher === candidate.teacher) && gap < 15) {
        issues.push(`Minimum 15-minute gap violated with ${entry.courseCode}-${entry.section}.`);
      }
    });

    return issues;
  };

  const handleOpenForm = (entry?: ScheduleEntry) => {
    if (entry) {
      setEditingId(entry.id);
      setFormData({
        courseCode: entry.courseCode,
        section: entry.section,
        teacher: entry.teacher,
        day: entry.day,
        startTime: entry.startTime,
        endTime: entry.endTime,
        room: entry.room,
        building: entry.building
      });
    } else {
      setEditingId(null);
      setFormData({
        courseCode: '',
        section: '1',
        teacher: '',
        day: activeDay,
        startTime: '09:00',
        endTime: '10:30',
        room: '201',
        building: 'Building A'
      });
    }
    setConflicts([]);
    setShowForm(true);
  };

  const handleFormChange = (name: string, value: string) => {
    const next = { ...formData, [name]: value };
    setFormData(next);
    const issues = checkConflicts(next, editingId || undefined);
    setConflicts(issues);
  };

  const handleSave = () => {
    const issues = checkConflicts(formData, editingId || undefined);
    setConflicts(issues);
    if (issues.length > 0) return;

    if (editingId) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingId
            ? { ...entry, ...formData }
            : entry
        )
      );
    } else {
      const newEntry: ScheduleEntry = {
        id: String(entries.length + 1),
        ...formData,
        color: colorPalette[entries.length % colorPalette.length]
      };
      setEntries((prev) => [...prev, newEntry]);
    }
    setShowForm(false);
  };

  const parseCsv = (text: string) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(',');
      return headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = (values[index] || '').trim();
        return acc;
      }, {});
    });
  };

  const handleBulkFileChange = (file: File | null) => {
    setUploadFile(file);
    if (!file) {
      setPreviewRows([]);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setPreviewRows(parseCsv(text));
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = () => {
    const newEntries: ScheduleEntry[] = previewRows.map((row, idx) => {
      const day = row.Day || row.day || 'Monday';
      const startTime = row.StartTime || row.startTime || '09:00';
      const endTime = row.EndTime || row.endTime || '10:30';
      return {
        id: String(entries.length + idx + 1),
        courseCode: row.CourseCode || row.courseCode || 'CSE101',
        section: row.Section || row.section || 'A',
        teacher: row.Teacher || row.teacher || 'TBD',
        day,
        startTime,
        endTime,
        room: row.Room || row.room || '201',
        building: row.Building || row.building || 'Building A',
        color: colorPalette[(entries.length + idx) % colorPalette.length]
      };
    });

    const conflictMessages = newEntries.flatMap((entry) =>
      checkConflicts(entry)
    );

    if (conflictMessages.length > 0) {
      alert('Conflicts detected. Please resolve conflicts before uploading.');
      return;
    }

    setEntries((prev) => [...prev, ...newEntries]);
    setShowBulkUpload(false);
    setUploadFile(null);
    setPreviewRows([]);
  };

  const downloadTemplate = () => {
    const csvContent =
      'CourseCode,Section,Day,StartTime,EndTime,Room,Building,Teacher\n' +
      'CSE101,A,Monday,09:00,10:30,201,Building A,Dr. Ahmed Khan';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'routine_upload_template.csv';
    a.click();
  };

  const reportByTeacher = useMemo(() => {
    return entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.teacher] = (acc[entry.teacher] || 0) + 1;
      return acc;
    }, {});
  }, [entries]);

  const reportByRoom = useMemo(() => {
    return entries.reduce<Record<string, number>>((acc, entry) => {
      const key = `${entry.building} ${entry.room}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [entries]);

  return (
    <div className="p-6">
        <PageHeader
          title="Routine Management"
          subtitle="Manage weekly schedules, detect conflicts, and export reports"
          icon={<Calendar size={24} className="text-white" />}
          action={{
            label: 'Add Class',
            onClick: () => handleOpenForm(),
            variant: 'primary'
          }}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload size={18} />
            Bulk Upload
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Download Template
          </button>
          <button
            onClick={() => setShowReports(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Printer size={18} />
            Reports
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeDay === day ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Time</th>
                {ROOMS.map((room) => (
                  <th key={room} className="px-4 py-3 text-left">
                    Room {room}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time) => (
                <tr key={time} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-gray-500">{time}</td>
                  {ROOMS.map((room) => {
                    const entry = entriesForDay.find(
                      (item) => item.room === room && item.startTime === time
                    );
                    return (
                      <td key={room} className="px-4 py-3">
                        {entry ? (
                          <button
                            onClick={() => handleOpenForm(entry)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-white ${entry.color}`}
                          >
                            <p className="text-xs font-semibold">{entry.courseCode}-{entry.section}</p>
                            <p className="text-[11px] opacity-90">{entry.teacher}</p>
                            <p className="text-[11px] opacity-90">
                              {entry.startTime} - {entry.endTime}
                            </p>
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {entriesForDay.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-xl p-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {entry.courseCode}-{entry.section}
                </p>
                <p className="text-xs text-gray-500">{entry.teacher}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <Clock size={14} /> {entry.startTime} - {entry.endTime}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <MapPin size={14} /> {entry.building} • Room {entry.room}
                </div>
              </div>
              <button
                onClick={() => handleOpenForm(entry)}
                className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        <AdminModal
          title={editingId ? 'Edit Schedule' : 'Add Schedule'}
          open={showForm}
          onClose={() => setShowForm(false)}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Code</label>
                <input
                  value={formData.courseCode}
                  onChange={(e) => handleFormChange('courseCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  placeholder="CSE201"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                <select
                  value={formData.section}
                  onChange={(e) => handleFormChange('section', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                >
                  {['A', 'B', 'C', 'D'].map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Teacher</label>
                <input
                  value={formData.teacher}
                  onChange={(e) => handleFormChange('teacher', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  placeholder="Dr. Ahmed Khan"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
                <select
                  value={formData.day}
                  onChange={(e) => handleFormChange('day', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleFormChange('startTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleFormChange('endTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Room</label>
                <select
                  value={formData.room}
                  onChange={(e) => handleFormChange('room', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                >
                  {ROOMS.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Building</label>
                <input
                  value={formData.building}
                  onChange={(e) => handleFormChange('building', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            {conflicts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle size={16} /> Conflicts detected
                </div>
                <ul className="list-disc list-inside">
                  {conflicts.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </AdminModal>

        <AdminModal
          title="Bulk Schedule Upload"
          open={showBulkUpload}
          onClose={() => setShowBulkUpload(false)}
          size="lg"
        >
          <div className="space-y-4">
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleBulkFileChange(e.target.files?.[0] || null)}
                className="hidden"
                id="routine-csv-upload"
              />
              <label htmlFor="routine-csv-upload" className="cursor-pointer text-blue-600 font-medium">
                Click to upload CSV
              </label>
              {uploadFile && <p className="text-sm text-gray-600 mt-2">Selected: {uploadFile.name}</p>}
            </div>

            {previewRows.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Preview</h4>
                <div className="max-h-48 overflow-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        {Object.keys(previewRows[0]).map((header) => (
                          <th key={header} className="px-3 py-2 text-left">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          {Object.values(row).map((value, i) => (
                            <td key={i} className="px-3 py-2 text-gray-700">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={downloadTemplate}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Download Template
              </button>
              <button
                onClick={handleBulkUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Routine
              </button>
            </div>
          </div>
        </AdminModal>

        <AdminModal
          title="Schedule Reports"
          open={showReports}
          onClose={() => setShowReports(false)}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Per Teacher</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(reportByTeacher).map(([teacher, count]) => (
                  <div key={teacher} className="border border-gray-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-900">{teacher}</p>
                    <p className="text-xs text-gray-500">{count} classes assigned</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Per Room Utilization</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(reportByRoom).map(([room, count]) => (
                  <div key={room} className="border border-gray-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-900">{room}</p>
                    <p className="text-xs text-gray-500">{count} classes scheduled</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => alert('PDF export will be available in next iteration.')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Export PDF
              </button>
              <button
                onClick={() => alert('Excel export will be available in next iteration.')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Export Excel
              </button>
            </div>
          </div>
        </AdminModal>
      </div>
  );
};

export default RoutineManagement;
