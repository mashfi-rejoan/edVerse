import React, { useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import { BarChart3, FileDown, FileSpreadsheet, FileText, Mail } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

interface ReportRow {
  id: string;
  label: string;
  value: number;
}

const ReportGeneration: React.FC = () => {
  const [activeReport, setActiveReport] = useState('Enrollment');
  const [showPreview, setShowPreview] = useState(false);

  const reportOptions = [
    'Enrollment',
    'Attendance',
    'Academic Performance',
    'Complaint Statistics',
    'Registration Statistics',
    'Teacher Workload',
    'Room Utilization'
  ];

  const reportData = useMemo<Record<string, ReportRow[]>>(
    () => ({
      Enrollment: [
        { id: '1', label: 'CSE201', value: 120 },
        { id: '2', label: 'CSE203', value: 98 },
        { id: '3', label: 'CSE305', value: 84 }
      ],
      Attendance: [
        { id: '1', label: 'Batch 2021', value: 86 },
        { id: '2', label: 'Batch 2022', value: 89 },
        { id: '3', label: 'Batch 2023', value: 91 }
      ],
      'Academic Performance': [
        { id: '1', label: 'GPA 3.5+', value: 132 },
        { id: '2', label: 'GPA 3.0-3.49', value: 164 },
        { id: '3', label: 'GPA < 3.0', value: 78 }
      ],
      'Complaint Statistics': [
        { id: '1', label: 'Open', value: 12 },
        { id: '2', label: 'In Progress', value: 6 },
        { id: '3', label: 'Resolved', value: 34 }
      ],
      'Registration Statistics': [
        { id: '1', label: 'Registered', value: 420 },
        { id: '2', label: 'Pending', value: 32 },
        { id: '3', label: 'Dropped', value: 15 }
      ],
      'Teacher Workload': [
        { id: '1', label: 'Dr. Ahmed Khan', value: 4 },
        { id: '2', label: 'Prof. Fatima Ali', value: 3 },
        { id: '3', label: 'Dr. Karim Rahman', value: 2 }
      ],
      'Room Utilization': [
        { id: '1', label: 'Room 201', value: 12 },
        { id: '2', label: 'Room 202', value: 9 },
        { id: '3', label: 'Lab-1', value: 15 }
      ]
    }),
    []
  );

  const currentData = reportData[activeReport] || [];

  const columns = [
    { key: 'label', label: 'Category', sortable: true },
    { key: 'value', label: 'Value', sortable: true }
  ];

  const handleExport = (type: 'pdf' | 'excel' | 'csv' | 'email') => {
    const label = type.toUpperCase();
    alert(`${label} export will be available in the next iteration.`);
  };

  return (
    <div className="p-6 space-y-6">
        <PageHeader
          title="Reports & Analytics"
          subtitle="Generate and export institutional performance reports"
          icon={<BarChart3 size={24} className="text-white" />}
          action={{
            label: 'Preview Report',
            onClick: () => setShowPreview(true),
            variant: 'primary'
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveReport(option)}
              className={`px-4 py-3 rounded-xl border text-sm font-semibold transition ${
                activeReport === option
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{activeReport} Overview</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData}>
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Export Options</h3>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <FileText size={16} /> Export PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <FileSpreadsheet size={16} /> Export Excel
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <FileDown size={16} /> Export CSV
            </button>
            <button
              onClick={() => handleExport('email')}
              className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Mail size={16} /> Email Report
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Detailed Data</h3>
          <DataTable columns={columns} data={currentData} searchable searchFields={['label']} />
        </div>

        <AdminModal
          title="Report Preview"
          open={showPreview}
          onClose={() => setShowPreview(false)}
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Preview for <span className="font-semibold text-gray-900">{activeReport}</span>
            </p>
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentData}>
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </AdminModal>
      </div>
  );
};

export default ReportGeneration;
