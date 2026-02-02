import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import AdminForm, { FormField } from '../../components/AdminForm';
import { Plus, Edit, Trash2, Eye, UserX, UserCheck, Upload, Download, Phone, Mail, Calendar, Award } from 'lucide-react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getTeachers();
      if (response.success) {
        setTeachers(response.data || []);
      }
    } catch (err) {
      setError('Failed to load teachers');
      console.error(err);
      // Mock data for demo
      setTeachers([
        { 
          id: '1', 
          name: 'Dr. Ahmed Khan', 
          email: 'ahmed@example.com', 
          phone: '+8801712345678',
          department: 'CSE', 
          designation: 'Professor',
          specialization: 'Machine Learning',
          teacherId: 'CSE-T-001',
          status: 'Active',
          coursesAssigned: 3,
          joinDate: '2022-01-15' 
        },
        { 
          id: '2', 
          name: 'Prof. Fatima Ali', 
          email: 'fatima@example.com',
          phone: '+8801798765432',
          department: 'CSE', 
          designation: 'Associate Professor',
          specialization: 'Database Systems',
          teacherId: 'CSE-T-002',
          status: 'Active',
          coursesAssigned: 2,
          joinDate: '2021-06-20' 
        },
        { 
          id: '3', 
          name: 'Dr. Karim Rahman', 
          email: 'karim@example.com',
          phone: '+8801656789012',
          department: 'CSE', 
          designation: 'Assistant Professor',
          specialization: 'Web Development',
          teacherId: 'CSE-T-003',
          status: 'Inactive',
          coursesAssigned: 0,
          joinDate: '2023-03-10' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formFields: FormField[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'teacher@example.com' },
    { name: 'phone', label: 'Phone Number', type: 'text', required: true, placeholder: '+8801712345678' },
    { name: 'department', label: 'Department', type: 'select', required: true, options: [
      { label: 'CSE', value: 'CSE' },
      { label: 'EEE', value: 'EEE' },
      { label: 'CE', value: 'CE' }
    ]},
    { name: 'designation', label: 'Designation', type: 'select', required: true, options: [
      { label: 'Professor', value: 'Professor' },
      { label: 'Associate Professor', value: 'Associate Professor' },
      { label: 'Assistant Professor', value: 'Assistant Professor' },
      { label: 'Lecturer', value: 'Lecturer' }
    ]},
    { name: 'specialization', label: 'Specialization', type: 'text', required: true, placeholder: 'e.g., Machine Learning' },
    { name: 'status', label: 'Status', type: 'select', required: true, options: [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' }
    ]}
  ];

  const handleViewTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowDetailModal(true);
  };

  const handleToggleStatus = (teacher: any) => {
    const newStatus = teacher.status === 'Active' ? 'Inactive' : 'Active';
    setTeachers(teachers.map(t => 
      t.id === teacher.id ? { ...t, status: newStatus } : t
    ));
  };

  const handleBulkUpload = () => {
    if (uploadFile) {
      alert('Bulk upload feature - CSV processing would happen here');
      setShowBulkUpload(false);
      setUploadFile(null);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "fullName,email,phone,teacherId,department,designation,specialization,status\nDr. John Doe,john@example.com,+880171234567,CSE-T-004,CSE,Professor,AI,Active";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teacher_upload_template.csv';
    a.click();
  };

  // Generate Teacher ID based on Department, Year, and Serial
  const generateTeacherId = (department: string): string => {
    const year = new Date().getFullYear().toString().slice(-2);
    const serialNumber = String(teachers.filter(t => t.department === department).length + 1).padStart(3, '0');
    return `${department}-T-${year}-${serialNumber}`;
  };

  // Generate default password from phone number
  const generateDefaultPassword = (phoneNumber: string): string => {
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-7);
    return `edverse@${cleanPhone}`;
  };

  const handleAddTeacher = (data: any) => {
    // Generate ID and password
    const generatedId = generateTeacherId(data.department);
    const generatedPassword = generateDefaultPassword(data.phone);

    const newTeacher = {
      id: String(teachers.length + 1),
      ...data,
      teacherId: generatedId,
      defaultPassword: generatedPassword,
      status: data.status || 'Active',
      coursesAssigned: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setTeachers([...teachers, newTeacher]);
    setShowModal(false);

    // Show success notification with ID and password
    alert(`Teacher added successfully!\n\nTeacher ID: ${generatedId}\nDefault Password: ${generatedPassword}\n\nPlease share these credentials with the teacher.`);
  };

  const handleEditTeacher = (teacher: any) => {
    setEditingId(teacher.id);
    setShowModal(true);
  };

  const handleDeleteTeacher = (teacher: any) => {
    if (confirm(`Delete ${teacher.name}?`)) {
      setTeachers(teachers.filter(t => t.id !== teacher.id));
    }
  };

  const columns = [
    { key: 'teacherId', label: 'Teacher ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'coursesAssigned', label: 'Courses', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const actions = [
    { label: 'View', onClick: handleViewTeacher, color: 'green' as const, icon: <Eye size={18} /> },
    { label: 'Edit', onClick: handleEditTeacher, color: 'blue' as const, icon: <Edit size={18} /> },
    { 
      label: 'Toggle Status', 
      onClick: handleToggleStatus, 
      color: 'purple' as const, 
      icon: (teacher: any) => teacher.status === 'Active' ? <UserX size={18} /> : <UserCheck size={18} />
    },
    { label: 'Delete', onClick: handleDeleteTeacher, color: 'red' as const, icon: <Trash2 size={18} /> }
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <PageHeader
          title="Teachers Management"
          subtitle="Manage all faculty members"
          action={{
            label: 'Add Teacher',
            onClick: () => {
              setEditingId(null);
              setShowModal(true);
            },
            variant: 'primary'
          }}
          icon={<Plus size={24} className="text-white" />}
        />

        {/* Bulk Upload Button */}
        <div className="mt-6 flex gap-3">
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

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={teachers}
            actions={actions}
            searchable
            searchFields={['name', 'email', 'teacherId', 'designation']}
          />
        </div>

        {/* Add/Edit Modal */}
        <AdminModal
          title={editingId ? 'Edit Teacher' : 'Add New Teacher'}
          open={showModal}
          onClose={() => setShowModal(false)}
          size="lg"
        >
          <div className="space-y-6">
            {/* Info Alert for Add Mode */}
            {!editingId && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Auto-Generation:</strong> Teacher ID and default password will be automatically generated based on department and phone number.
                </p>
              </div>
            )}
            <AdminForm
              fields={formFields}
              onSubmit={handleAddTeacher}
              onCancel={() => setShowModal(false)}
              submitText={editingId ? 'Update' : 'Add Teacher'}
            />
          </div>
        </AdminModal>

        {/* Teacher Detail Modal */}
        <AdminModal
          title="Teacher Details"
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          size="lg"
        >
          {selectedTeacher && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-center gap-4 pb-6 border-b">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{selectedTeacher.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedTeacher.name}</h3>
                  <p className="text-gray-600">{selectedTeacher.designation}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedTeacher.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedTeacher.status}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-1">
                      <Award size={16} />
                      Teacher ID
                    </label>
                    <p className="text-gray-900">{selectedTeacher.teacherId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-1">
                      <Mail size={16} />
                      Email
                    </label>
                    <p className="text-gray-900">{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-1">
                      <Phone size={16} />
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedTeacher.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Department</label>
                    <p className="text-gray-900">{selectedTeacher.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Specialization</label>
                    <p className="text-gray-900">{selectedTeacher.specialization}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-1">
                      <Calendar size={16} />
                      Join Date
                    </label>
                    <p className="text-gray-900">{selectedTeacher.joinDate}</p>
                  </div>
                </div>
              </div>

              {/* Courses Section */}
              <div className="pt-6 border-t">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Assigned Courses</h4>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{selectedTeacher.coursesAssigned}</p>
                  <p className="text-sm text-gray-600">Courses This Semester</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditTeacher(selectedTeacher);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Teacher
                </button>
                <button
                  onClick={() => {
                    handleToggleStatus(selectedTeacher);
                    setShowDetailModal(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    selectedTeacher.status === 'Active' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {selectedTeacher.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          )}
        </AdminModal>

        {/* Bulk Upload Modal */}
        <AdminModal
          title="Bulk Upload Teachers"
          open={showBulkUpload}
          onClose={() => setShowBulkUpload(false)}
          size="md"
        >
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Instructions:</strong>
              </p>
              <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                <li>Download the CSV template first</li>
                <li>Fill in teacher details following the format</li>
                <li>Upload the completed CSV file</li>
                <li>System will validate and import teachers</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploadFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {uploadFile.name}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBulkUpload}
                disabled={!uploadFile}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  uploadFile 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Upload & Import
              </button>
              <button
                onClick={() => setShowBulkUpload(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </AdminModal>
      </div>
    </AdminDashboardLayout>
  );
};

export default TeacherManagement;
