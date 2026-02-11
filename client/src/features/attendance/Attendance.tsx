import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AttendanceRecord {
  course: string;
  courseCode: string;
  totalClasses: number;
  attended: number;
  percentage: number;
  status: 'Good' | 'Warning' | 'Critical';
  semester: string;
  year: number;
}

const Attendance = () => {
  const [selectedSemester, setSelectedSemester] = useState('Spring 2026');
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      course: 'Software Development II',
      courseCode: 'CSE200',
      totalClasses: 40,
      attended: 38,
      percentage: 95,
      status: 'Good' as const,
      semester: 'Spring',
      year: 2026
    },
    {
      course: 'Principles of Economics',
      courseCode: 'ECO201',
      totalClasses: 36,
      attended: 32,
      percentage: 89,
      status: 'Good' as const,
      semester: 'Spring',
      year: 2026
    },
    {
      course: 'Database Systems',
      courseCode: 'CSE207',
      totalClasses: 38,
      attended: 29,
      percentage: 76,
      status: 'Warning' as const,
      semester: 'Spring',
      year: 2026
    },
    {
      course: 'Database Systems Lab',
      courseCode: 'CSE208',
      totalClasses: 20,
      attended: 13,
      percentage: 65,
      status: 'Critical' as const,
      semester: 'Spring',
      year: 2026
    },
    {
      course: 'Digital Logic Design',
      courseCode: 'CSE205',
      totalClasses: 35,
      attended: 30,
      percentage: 86,
      status: 'Good' as const,
      semester: 'Spring',
      year: 2026
    }
  ].sort((a, b) => a.courseCode.localeCompare(b.courseCode)));

  const filteredRecords = attendanceRecords.filter(
    record => `${record.semester} ${record.year}` === selectedSemester
  );

  const overallAttendance = filteredRecords.length > 0
    ? Math.round(
        filteredRecords.reduce((sum, r) => sum + r.percentage, 0) / filteredRecords.length
      )
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return 'bg-green-100 text-green-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Warning':
        return <AlertCircle className="text-yellow-600" size={20} />;
      case 'Critical':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Attendance">
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-[#0C2B4E] via-[#1A3D64] to-[#1D546C] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Attendance Record</h1>
                <p className="text-white/80 mt-1">Track your attendance by semester</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2">
              <label className="text-sm font-medium text-white/80">Semester:</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-transparent text-white text-sm font-semibold focus:outline-none"
              >
                <option value="Spring 2026">Spring 2026</option>
                <option value="Fall 2025">Fall 2025</option>
                <option value="Spring 2025">Spring 2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall</p>
                <p className="text-2xl font-bold text-gray-900">{overallAttendance}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Good Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredRecords.filter(r => r.status === 'Good').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredRecords.filter(r => r.status === 'Warning').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredRecords.filter(r => r.status === 'Critical').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Course-wise Attendance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attended
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.courseCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{record.courseCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{record.attended}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{record.totalClasses}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-semibold text-gray-900">{record.percentage}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              record.percentage >= 80
                                ? 'bg-green-600'
                                : record.percentage >= 60
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }`}
                            style={{ width: `${record.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Attendance Guidelines</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span><strong>80% or above:</strong> Good standing - Keep it up!</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span><strong>70-80%:</strong> Warning - Improve attendance to avoid penalties</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span><strong>Below 60%:</strong> Critical - Risk of not being allowed to sit for exams</span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
