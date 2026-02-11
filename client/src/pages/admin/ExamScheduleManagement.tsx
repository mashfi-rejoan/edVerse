import React, { useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import AdminModal from '../../components/AdminModal';
import DataTable from '../../components/DataTable';
import { CalendarCheck, Plus, Wand2, Upload, Download } from 'lucide-react';

interface ExamSchedule {
  id: string;
  examType: 'Midterm' | 'Final';
  semester: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Published';
}

interface ExamScheduleFormState {
  examType: ExamSchedule['examType'];
  semester: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: ExamSchedule['status'];
}

const ExamScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<ExamSchedule[]>([
    {
      id: 'EX-001',
      examType: 'Midterm',
      semester: 'Spring',
      academicYear: '2026',
      startDate: '2026-03-10',
      endDate: '2026-03-18',
      status: 'Published'
    },
    {
      id: 'EX-002',
      examType: 'Final',
      semester: 'Spring',
      academicYear: '2026',
      startDate: '2026-05-08',
      endDate: '2026-05-18',
      status: 'Draft'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExamScheduleFormState>({
    examType: 'Midterm',
    semester: 'Spring',
    academicYear: '2026',
    startDate: '',
    endDate: '',
    status: 'Draft'
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);

  const scheduleStats = useMemo(() => {
    return {
      total: schedules.length,
      published: schedules.filter((s) => s.status === 'Published').length,
      draft: schedules.filter((s) => s.status === 'Draft').length
    };
  }, [schedules]);

  const handleOpenForm = (schedule?: ExamSchedule) => {
    if (schedule) {
      setEditingId(schedule.id);
      setFormData({
        examType: schedule.examType,
        semester: schedule.semester,
        academicYear: schedule.academicYear,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        status: schedule.status
      });
    } else {
      setEditingId(null);
      setFormData({
        examType: 'Midterm',
        semester: 'Spring',
        academicYear: '2026',
        startDate: '',
        endDate: '',
        status: 'Draft'
      });
    }
    setShowModal(true);
  };

  const handleSaveSchedule = () => {
    if (editingId) {
      setSchedules((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item))
      );
    } else {
      const newSchedule: ExamSchedule = {
        id: `EX-${100 + schedules.length + 1}`,
        ...formData
      };
      setSchedules((prev) => [...prev, newSchedule]);
    }
    setShowModal(false);
  };

  const handleAutoGenerate = () => {
    const generated: ExamSchedule = {
      id: `EX-${100 + schedules.length + 1}`,
      examType: formData.examType as ExamSchedule['examType'],
      semester: formData.semester,
      academicYear: formData.academicYear,
      startDate: formData.startDate || '2026-03-15',
      endDate: formData.endDate || '2026-03-22',
      status: 'Draft'
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
      examType: (row.ExamType || row.examType || 'Midterm') as ExamSchedule['examType'],
      semester: row.Semester || row.semester || 'Spring',
      academicYear: row.AcademicYear || row.academicYear || '2026',
      startDate: row.StartDate || row.startDate || '2026-03-10',
      endDate: row.EndDate || row.endDate || '2026-03-18',
      status: (row.Status || row.status || 'Draft') as ExamSchedule['status']
    }));

    setSchedules((prev) => [...prev, ...newSchedules]);
    setShowBulkUpload(false);
    setUploadFile(null);
    setPreviewRows([]);
  };

  const downloadTemplate = () => {
    const csvContent =
      'ExamType,Semester,AcademicYear,StartDate,EndDate,Status\n' +
      'Midterm,Spring,2026,2026-03-10,2026-03-18,Published';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam_schedule_template.csv';
    a.click();
  };

  const columns = [
    { key: 'examType', label: 'Exam Type', sortable: true },
    { key: 'semester', label: 'Semester', sortable: true },
    { key: 'academicYear', label: 'Year', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: ExamSchedule['status']) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Total Schedules</p>
            <p className="text-2xl font-semibold text-gray-900">{scheduleStats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Published</p>
            <p className="text-2xl font-semibold text-gray-900">{scheduleStats.published}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Draft</p>
            <p className="text-2xl font-semibold text-gray-900">{scheduleStats.draft}</p>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type</label>
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
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData((prev) => ({ ...prev, semester: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                >
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                <input
                  value={formData.academicYear}
                  onChange={(e) => setFormData((prev) => ({ ...prev, academicYear: e.target.value }))}
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
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
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
