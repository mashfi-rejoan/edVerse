import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import AdminForm, { FormField } from '../../components/AdminForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStudents();
      if (response.success) {
        setStudents(response.data || []);
      }
    } catch (err) {
      setError('Failed to load students');
      console.error(err);
      // Mock data for demo
      setStudents([
        { id: '1', name: 'Muhammad Ali', email: 'ali@student.edu.bd', studentId: 'CSE21001', semester: 3 },
        { id: '2', name: 'Zainab Khan', email: 'zainab@student.edu.bd', studentId: 'CSE21002', semester: 3 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formFields: FormField[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'student@example.com' },
    { name: 'studentId', label: 'Student ID', type: 'text', required: true, placeholder: 'CSE21001' },
    { name: 'semester', label: 'Semester', type: 'select', required: true, options: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' }
    ]},
    { name: 'phone', label: 'Phone', type: 'text', placeholder: '+88017123456789' }
  ];

  const handleAddStudent = (data: any) => {
    console.log('Add student:', data);
    setShowModal(false);
  };

  const handleEditStudent = (student: any) => {
    setEditingId(student.id);
    setShowModal(true);
  };

  const handleDeleteStudent = (student: any) => {
    if (confirm(`Delete ${student.name}?`)) {
      setStudents(students.filter(s => s.id !== student.id));
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'studentId', label: 'Student ID' },
    { key: 'email', label: 'Email' },
    { key: 'semester', label: 'Semester' }
  ];

  const actions = [
    { label: 'Edit', onClick: handleEditStudent, color: 'blue' as const, icon: <Edit size={18} /> },
    { label: 'Delete', onClick: handleDeleteStudent, color: 'red' as const, icon: <Trash2 size={18} /> }
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <PageHeader
          title="Students Management"
          subtitle="Manage all students"
          breadcrumb={['Admin', 'Students']}
          action={{
            label: 'Add Student',
            onClick: () => {
              setEditingId(null);
              setShowModal(true);
            },
            variant: 'primary'
          }}
          icon={<Plus size={24} className="text-[#0C2B4E]" />}
        />

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={students}
            actions={actions}
            searchable
            searchFields={['name', 'email', 'studentId']}
          />
        </div>

        <AdminModal
          title={editingId ? 'Edit Student' : 'Add New Student'}
          open={showModal}
          onClose={() => setShowModal(false)}
          size="lg"
        >
          <AdminForm
            fields={formFields}
            onSubmit={handleAddStudent}
            onCancel={() => setShowModal(false)}
            submitText={editingId ? 'Update' : 'Add'}
          />
        </AdminModal>
      </div>
    </AdminDashboardLayout>
  );
};

export default StudentManagement;
