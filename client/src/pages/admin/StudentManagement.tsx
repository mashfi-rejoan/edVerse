import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import AdminForm, { FormField } from '../../components/AdminForm';
import {
  Plus,
  Edit,
  Eye,
  UserX,
  UserCheck,
  Upload,
  Download,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  BadgeCheck,
  AlertTriangle
} from 'lucide-react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const DEPARTMENTS = [
  { label: 'CSE', value: 'CSE', deptId: '1' },
  { label: 'EEE', value: 'EEE', deptId: '2' },
  { label: 'CE', value: 'CE', deptId: '3' }
];

type AcademicStanding = 'Good' | 'Warning' | 'Probation';
type StudentStatus = 'Active' | 'Graduated' | 'Suspended';

interface StudentCourse {
  code: string;
  name: string;
  grade?: string;
  attendance?: number;
}

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  batch: string;
  section: string;
  status: StudentStatus;
  bloodGroup?: string;
  registeredCourses: StudentCourse[];
  attendance: number;
  cgpa: number;
  academicStanding: AcademicStanding;
  defaultPassword?: string;
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  const [formDefaults, setFormDefaults] = useState<Record<string, any>>({});
  const [filters, setFilters] = useState({ batch: 'All', section: 'All', status: 'All' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStudents();
      if (response.success) {
        const studentRows = (response.data?.students || []).map((student: any) => ({
          id: student._id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          studentId: student.universityId,
          batch: student.batch,
          section: student.section,
          status: student.status,
          bloodGroup: student.bloodGroup,
          registeredCourses: [],
          attendance: 0,
          cgpa: student.cgpa ?? 0,
          academicStanding: student.academicStanding ?? 'Good'
        }));
        setStudents(studentRows);
      }
    } catch (err) {
      setError('Failed to load students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formFields: FormField[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'student@example.com',
      validation: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value || ''))) return 'Invalid email format';
        const exists = students.some(
          (student) => student.email.toLowerCase() === String(value).toLowerCase() && student.id !== editingId
        );
        return exists ? 'Email already exists' : null;
      }
    },
    { name: 'phone', label: 'Phone Number', type: 'text', required: true, placeholder: '+88017123456789' },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: DEPARTMENTS.map((dept) => ({ label: dept.label, value: dept.value }))
    },
    {
      name: 'batch',
      label: 'Batch',
      type: 'select',
      required: true,
      options: [
        { label: '2021', value: '2021' },
        { label: '2022', value: '2022' },
        { label: '2023', value: '2023' },
        { label: '2024', value: '2024' },
        { label: '2025', value: '2025' }
      ]
    },
    {
      name: 'section',
      label: 'Section',
      type: 'select',
      required: true,
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' }
      ]
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Graduated', value: 'Graduated' },
        { label: 'Suspended', value: 'Suspended' }
      ]
    },
    {
      name: 'bloodGroup',
      label: 'Blood Group',
      type: 'select',
      options: [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' }
      ]
    }
  ];

  const resolveDeptId = (department: string): string | null => {
    const match = DEPARTMENTS.find((dept) => dept.value === department);
    return match ? match.deptId : null;
  };

  const resolveDepartmentFromStudentId = (studentId: string): string => {
    if (!studentId || studentId.length < 5) return '';
    const deptId = studentId.substring(4, 5);
    const match = DEPARTMENTS.find((dept) => dept.deptId === deptId);
    return match ? match.value : '';
  };

  const generateDefaultPassword = (phoneNumber: string): string => {
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-6);
    return `edverse@${cleanPhone}`;
  };

  const handleViewStudent = (student: StudentRecord) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleAddStudent = async (data: any) => {
    if (editingId) {
      try {
        const response = await adminService.updateStudent(editingId, {
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          batch: data.batch,
          section: data.section,
          status: data.status,
          bloodGroup: data.bloodGroup
        });
        if (response.success) {
          await fetchStudents();
        }
      } catch (err) {
        console.error(err);
        setError('Failed to update student');
      }
    } else {
      const deptId = resolveDeptId(data.department);
      if (!deptId) {
        setError('Please select a valid department');
        return;
      }
      const generatedPassword = generateDefaultPassword(data.phone);
      try {
        const response = await adminService.createStudent({
          deptId,
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          batch: data.batch,
          section: data.section,
          semester: 1,
          status: data.status || 'Active',
          bloodGroup: data.bloodGroup,
          password: generatedPassword
        });
        if (response.success) {
          await fetchStudents();
          const createdId = response.data?.universityId || 'Generated by system';
          alert(
            `Student added successfully!\n\nStudent ID: ${createdId}\nDefault Password: ${generatedPassword}\n\nShare these credentials with the student.`
          );
        }
      } catch (err) {
        console.error(err);
        setError('Failed to create student');
      }
    }
    setShowModal(false);
    setEditingId(null);
    setFormDefaults({});
  };

  const handleEditStudent = (student: StudentRecord) => {
    setEditingId(student.id);
    setFormDefaults({
      fullName: student.name,
      email: student.email,
      phone: student.phone,
      department: resolveDepartmentFromStudentId(student.studentId),
      batch: student.batch,
      section: student.section,
      status: student.status,
      bloodGroup: student.bloodGroup || ''
    });
    setShowModal(true);
  };

  const handleGraduateStudent = async (student: StudentRecord) => {
    try {
      const response = await adminService.updateStudent(student.id, { status: 'Graduated' });
      if (response.success) {
        setStudents((prev) =>
          prev.map((s) => (s.id === student.id ? { ...s, status: 'Graduated' } : s))
        );
      }
    } catch (err) {
      console.error(err);
      setError('Failed to graduate student');
    }
  };

  const handleSuspendStudent = async (student: StudentRecord) => {
    try {
      const response = await adminService.updateStudent(student.id, { status: 'Suspended' });
      if (response.success) {
        setStudents((prev) =>
          prev.map((s) => (s.id === student.id ? { ...s, status: 'Suspended' } : s))
        );
      }
    } catch (err) {
      console.error(err);
      setError('Failed to suspend student');
    }
  };

  const handleReactivateStudent = async (student: StudentRecord) => {
    try {
      const response = await adminService.updateStudent(student.id, { status: 'Active' });
      if (response.success) {
        setStudents((prev) =>
          prev.map((s) => (s.id === student.id ? { ...s, status: 'Active' } : s))
        );
      }
    } catch (err) {
      console.error(err);
      setError('Failed to reactivate student');
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      'Name,Email,Phone,StudentId,Batch,Section,Status\n' +
      'Rafiul Hasan,rafiul@student.edu.bd,+8801712345678,CSE21011,2022,A,Active';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_upload_template.csv';
    a.click();
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
    if (!previewRows.length) return;

    const nextIndex = students.length + 1;
    const newStudents: StudentRecord[] = previewRows.map((row, idx) => ({
      id: String(nextIndex + idx),
      name: row.Name || row.name || 'Unnamed Student',
      email: row.Email || row.email || '',
      phone: row.Phone || row.phone || '',
      studentId: row.StudentId || row.studentId || `CSE${nextIndex + idx}`,
      batch: row.Batch || row.batch || '2024',
      section: row.Section || row.section || 'A',
      status: (row.Status || row.status || 'Active') as StudentStatus,
      registeredCourses: [],
      attendance: 0,
      cgpa: 0,
      academicStanding: 'Good'
    }));

    setStudents((prev) => [...prev, ...newStudents]);
    setShowBulkUpload(false);
    setUploadFile(null);
    setPreviewRows([]);
  };

  const filteredStudents = students.filter((student) => {
    const matchesBatch = filters.batch === 'All' || student.batch === filters.batch;
    const matchesSection = filters.section === 'All' || student.section === filters.section;
    const matchesStatus = filters.status === 'All' || student.status === filters.status;
    return matchesBatch && matchesSection && matchesStatus;
  });

  const studentsWithStats = filteredStudents.map((student) => ({
    ...student,
    registeredCoursesCount: student.registeredCourses?.length || 0,
    attendancePercent: student.attendance
  }));

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'studentId', label: 'Student ID', sortable: true },
    { key: 'batch', label: 'Batch', sortable: true },
    { key: 'section', label: 'Section', sortable: true },
    { key: 'registeredCoursesCount', label: 'Courses', sortable: true },
    {
      key: 'attendancePercent',
      label: 'Attendance',
      sortable: true,
      render: (value: number) => `${value}%`
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: StudentStatus) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'Active'
              ? 'bg-green-100 text-green-700'
              : value === 'Graduated'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value}
        </span>
      )
    }
  ];

  const actions = [
    { label: 'View', onClick: handleViewStudent, color: 'blue' as const, icon: <Eye size={18} /> },
    { label: 'Edit', onClick: handleEditStudent, color: 'green' as const, icon: <Edit size={18} /> },
    { label: 'Graduate', onClick: handleGraduateStudent, color: 'green' as const, icon: <GraduationCap size={18} /> },
    { label: 'Suspend', onClick: handleSuspendStudent, color: 'red' as const, icon: <UserX size={18} /> }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner text="Loading students..." />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
        <PageHeader
          title="Students Management"
          subtitle="Manage students, batches, and academic status"
          action={{
            label: 'Add Student',
            onClick: () => {
              setEditingId(null);
              setFormDefaults({});
              setShowModal(true);
            },
            variant: 'primary'
          }}
          icon={<Plus size={24} className="text-white" />}
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
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.batch}
            onChange={(e) => setFilters((prev) => ({ ...prev, batch: e.target.value }))}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0C2B4E]"
          >
            <option value="All">All Batches</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <select
            value={filters.section}
            onChange={(e) => setFilters((prev) => ({ ...prev, section: e.target.value }))}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0C2B4E]"
          >
            <option value="All">All Sections</option>
            <option value="1">Section 1</option>
            <option value="2">Section 2</option>
            <option value="3">Section 3</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0C2B4E]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Graduated">Graduated</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={studentsWithStats}
            actions={actions}
            searchable
            searchFields={['name', 'email', 'studentId', 'batch', 'section']}
            rowClick={handleViewStudent}
          />
        </div>

        <AdminModal
          title={editingId ? 'Edit Student' : 'Add New Student'}
          open={showModal}
          onClose={() => setShowModal(false)}
          size="lg"
        >
          <div className="space-y-6">
            {!editingId && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Auto-Generation:</strong> Student ID and default password will be generated using batch, section, and phone number.
                </p>
              </div>
            )}
            <AdminForm
              fields={formFields}
              onSubmit={handleAddStudent}
              onCancel={() => setShowModal(false)}
              submitText={editingId ? 'Update' : 'Add'}
              defaultValues={formDefaults}
            />
          </div>
        </AdminModal>

        <AdminModal
          title="Student Details"
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          size="lg"
        >
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-500">Student ID: {selectedStudent.studentId}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedStudent.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : selectedStudent.status === 'Graduated'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedStudent.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <Mail size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{selectedStudent.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <Phone size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{selectedStudent.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <AlertTriangle size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Blood Group</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedStudent.bloodGroup || 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <BookOpen size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Batch & Section</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedStudent.batch} - {selectedStudent.section}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <BadgeCheck size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Academic Standing</p>
                    <p className="text-sm font-medium text-gray-900">{selectedStudent.academicStanding}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-blue-600 font-semibold">CGPA</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedStudent.cgpa.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-green-600 font-semibold">Attendance</p>
                  <p className="text-2xl font-bold text-green-900">{selectedStudent.attendance}%</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-purple-600 font-semibold">Courses Registered</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {selectedStudent.registeredCourses.length}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Registered Courses</h4>
                <div className="space-y-3">
                  {selectedStudent.registeredCourses.map((course) => (
                    <div key={course.code} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{course.name}</p>
                        <p className="text-xs text-gray-500">{course.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{course.grade || 'N/A'}</p>
                        <p className="text-xs text-gray-500">Attendance: {course.attendance || 0}%</p>
                      </div>
                    </div>
                  ))}
                  {selectedStudent.registeredCourses.length === 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <AlertTriangle size={16} />
                      No courses assigned yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {selectedStudent.status === 'Suspended' ? (
                  <button
                    onClick={() => handleReactivateStudent(selectedStudent)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <UserCheck size={16} className="inline mr-2" />
                    Reactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleSuspendStudent(selectedStudent)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <UserX size={16} className="inline mr-2" />
                    Suspend
                  </button>
                )}
                {selectedStudent.status !== 'Graduated' && (
                  <button
                    onClick={() => handleGraduateStudent(selectedStudent)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <GraduationCap size={16} className="inline mr-2" />
                    Graduate
                  </button>
                )}
                <button
                  onClick={() => handleEditStudent(selectedStudent)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Edit size={16} className="inline mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </AdminModal>

        <AdminModal
          title="Bulk Upload Students"
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
                id="student-csv-upload"
              />
              <label htmlFor="student-csv-upload" className="cursor-pointer text-blue-600 font-medium">
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
                Upload Students
              </button>
            </div>
          </div>
        </AdminModal>
      </div>
  );
};

export default StudentManagement;
