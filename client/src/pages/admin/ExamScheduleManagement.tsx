import React, { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import AdminModal from '../../components/AdminModal';
import DataTable from '../../components/DataTable';
import { CalendarCheck, Plus, Wand2, Upload, Download } from 'lucide-react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

interface ExamSchedule {
  id: string;
  examType: 'Midterm' | 'Final' | 'Quiz' | 'Assignment';
  courseCode: string;
  courseName: string;
  section: string;
  semester: string;
  academicYear: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  totalMarks: number;
  status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';
}

interface ExamScheduleFormState {
  examType: ExamSchedule['examType'];
  courseCode: string;
  courseName: string;
  section: string;
  semester: string;
  academicYear: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  totalMarks: number;
  status: ExamSchedule['status'];
}

const ExamScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExamScheduleFormState>({
    examType: 'Midterm',
    courseCode: '',
    courseName: '',
    section: 'A',
    semester: 'Spring',
    academicYear: '2026',
    date: '',
    startTime: '09:00',
    endTime: '12:00',
    room: 'Room 101',
    totalMarks: 100,
    status: 'Scheduled'
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await adminService.getExams();
      if (response.success) {
        const examRows = (response.data?.exams || []).map((exam: any) => ({
          id: exam._id,
          examType: exam.examType,
          courseCode: exam.courseCode,
          courseName: exam.courseName,
          section: exam.section,
          semester: exam.semester,
          academicYear: exam.academicYear,
          date: exam.date ? new Date(exam.date).toISOString().slice(0, 10) : '',
          startTime: exam.startTime,
          endTime: exam.endTime,
          room: exam.room,
          totalMarks: exam.totalMarks,
          status: exam.status
        }));
        setSchedules(examRows);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const scheduleStats = useMemo(() => {
    return {
      total: schedules.length,
      scheduled: schedules.filter((s) => s.status === 'Scheduled').length,
      ongoing: schedules.filter((s) => s.status === 'Ongoing').length,
      completed: schedules.filter((s) => s.status === 'Completed').length
    };
  }, [schedules]);

  const handleOpenForm = (schedule?: ExamSchedule) => {
    if (schedule) {
      setEditingId(schedule.id);
      setFormData({
        examType: schedule.examType,
        courseCode: schedule.courseCode,
        courseName: schedule.courseName,
        section: schedule.section,
        semester: schedule.semester,
        academicYear: schedule.academicYear,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room,
        totalMarks: schedule.totalMarks,
        status: schedule.status
      });
    } else {
      setEditingId(null);
      setFormData({
        examType: 'Midterm',
        courseCode: '',
        courseName: '',
        section: 'A',
        semester: 'Spring',
        academicYear: '2026',
        date: '',
        startTime: '09:00',
        endTime: '12:00',
        room: 'Room 101',
        totalMarks: 100,
        status: 'Scheduled'
      });
    }
    setShowModal(true);
  };

  const handleSaveSchedule = async () => {
    try {
      const resolvedCourseCode =
        formData.courseCode ||
        formData.courseName.trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8) ||
        'SUBJ101';
      if (editingId) {
        const response = await adminService.updateExam(editingId, {
          examType: formData.examType,
          courseCode: resolvedCourseCode,
          courseName: formData.courseName,
          section: formData.section,
          semester: formData.semester,
          academicYear: formData.academicYear,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          duration: 180,
          room: formData.room,
          totalMarks: formData.totalMarks,
          status: formData.status
        });
        if (response.success) {
          await fetchExams();
        }
      } else {
        const response = await adminService.createExam({
          examType: formData.examType,
          courseCode: resolvedCourseCode,
          courseName: formData.courseName,
          section: formData.section,
          semester: formData.semester,
          academicYear: formData.academicYear,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          duration: 180,
          room: formData.room,
          totalMarks: formData.totalMarks,
          status: formData.status
        });
        if (response.success) {
          await fetchExams();
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save exam');
    }
  };

  const handleAutoGenerate = () => {
    const generated: ExamSchedule = {
      id: `EX-${100 + schedules.length + 1}`,
      examType: formData.examType as ExamSchedule['examType'],
      courseCode: formData.courseCode || 'CSE101',
      courseName: formData.courseName || 'Sample Course',
      section: formData.section || 'A',
      semester: formData.semester,
      academicYear: formData.academicYear,
      date: formData.date || '2026-03-15',
      startTime: formData.startTime || '09:00',
      endTime: formData.endTime || '12:00',
      room: formData.room || 'Room 101',
      totalMarks: formData.totalMarks || 100,
      status: 'Scheduled'
    };
    setSchedules((prev) => [...prev, generated]);
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
    const newSchedules: ExamSchedule[] = previewRows.map((row, idx) => ({
      id: `EX-${200 + schedules.length + idx + 1}`,
      examType: (row.ExamName || row.examName || row.ExamType || row.examType || 'Midterm') as ExamSchedule['examType'],
      courseCode: row.CourseCode || row.courseCode || 'CSE101',
      courseName: row.SubjectName || row.subjectName || row.CourseName || row.courseName || 'Course Name',
      section: row.Section || row.section || 'A',
      semester: row.Semester || row.semester || 'Spring',
      academicYear: row.AcademicYear || row.academicYear || '2026',
      date: row.Date || row.date || '2026-03-10',
      startTime: row.StartTime || row.startTime || '09:00',
      endTime: row.EndTime || row.endTime || '12:00',
      room: row.RoomNumber || row.roomNumber || row.Room || row.room || 'Room 101',
      totalMarks: Number(row.TotalMarks || row.totalMarks || 100),
      status: (row.Status || row.status || 'Scheduled') as ExamSchedule['status']
    }));

    setSchedules((prev) => [...prev, ...newSchedules]);
    setShowBulkUpload(false);
    setUploadFile(null);
    setPreviewRows([]);
  };

  const downloadTemplate = () => {
    const csvContent =
      'ExamName,SubjectName,CourseCode,Section,Semester,AcademicYear,Date,StartTime,EndTime,RoomNumber,TotalMarks,Status\n' +
      'Midterm,Programming Fundamentals,CSE101,A,Spring,2026,2026-03-10,09:00,12:00,Room 101,100,Scheduled';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam_schedule_template.csv';
    a.click();
  };

  const columns = [
    { key: 'examType', label: 'Exam Type', sortable: true },
    { key: 'courseCode', label: 'Course', sortable: true },
    { key: 'section', label: 'Section', sortable: true },
    { key: 'semester', label: 'Semester', sortable: true },
    { key: 'academicYear', label: 'Year', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'startTime', label: 'Start', sortable: true },
    { key: 'endTime', label: 'End', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: ExamSchedule['status']) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'Completed'
              ? 'bg-green-100 text-green-700'
              : value === 'Ongoing'
              ? 'bg-blue-100 text-blue-700'
              : value === 'Cancelled'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {value}
        </span>
      )
    }
  ];

  const actions = [
    { label: 'Edit', onClick: handleOpenForm, color: 'green' as const, icon: <Plus size={18} /> }
  ];

  return (
    <div className="p-6 space-y-6">
        <PageHeader
          title="Exam Schedule"
          subtitle="Create and manage midterm/final schedules"
          icon={<CalendarCheck size={24} className="text-white" />}
          action={{
            label: 'Create Schedule',
            onClick: () => handleOpenForm(),
            variant: 'primary'
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Total Schedules</p>
            <p className="text-2xl font-semibold text-gray-900">{scheduleStats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Scheduled</p>
            <p className="text-2xl font-semibold text-gray-900">{scheduleStats.scheduled}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Ongoing</p>
            <p className="text-2xl font-semibold text-gray-900">{scheduleStats.ongoing}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Completed</p>
            <p className="text-2xl font-semibold text-gray-900">{scheduleStats.completed}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Upload size={18} /> Bulk Upload
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download size={18} /> Download Template
          </button>
        </div>

        <DataTable columns={columns} data={schedules} actions={actions} searchable searchFields={['examType', 'semester', 'academicYear']} />

        <AdminModal title={editingId ? 'Edit Exam Schedule' : 'Create Exam Schedule'} open={showModal} onClose={() => setShowModal(false)} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name</label>
                <input
                  value={formData.courseName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      courseName: e.target.value,
                      courseCode:
                        prev.courseCode ||
                        e.target.value.trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8)
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Name</label>
                <select
                  value={formData.examType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      examType: e.target.value as ExamSchedule['examType']
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                >
                  <option value="Midterm">Midterm</option>
                  <option value="Final">Final</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Assignment">Assignment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Room Number</label>
                <input
                  value={formData.room}
                  onChange={(e) => setFormData((prev) => ({ ...prev, room: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                <input
                  value={formData.section}
                  onChange={(e) => setFormData((prev) => ({ ...prev, section: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as ExamSchedule['status']
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAutoGenerate}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Wand2 size={16} /> Auto-generate Schedule
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </AdminModal>

        <AdminModal title="Bulk Schedule Upload" open={showBulkUpload} onClose={() => setShowBulkUpload(false)} size="lg">
          <div className="space-y-4">
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleBulkFileChange(e.target.files?.[0] || null)}
                className="hidden"
                id="exam-csv-upload"
              />
              <label htmlFor="exam-csv-upload" className="cursor-pointer text-blue-600 font-medium">
                Click to upload CSV
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Headers: ExamName, SubjectName, CourseCode, Section, Semester, AcademicYear, Date, StartTime, EndTime,
                RoomNumber, TotalMarks, Status
              </p>
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
                Upload Schedule
              </button>
            </div>
          </div>
        </AdminModal>
      </div>
  );
};

export default ExamScheduleManagement;
