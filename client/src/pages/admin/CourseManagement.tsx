import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import AdminForm, { FormField } from '../../components/AdminForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCourses();
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
      // Mock data for demo
      setCourses([
        { id: '1', code: 'CSE101', title: 'Programming Fundamentals', credits: 3, semester: 1 },
        { id: '2', code: 'CSE201', title: 'Data Structures', credits: 3, semester: 2 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formFields: FormField[] = [
    { name: 'code', label: 'Course Code', type: 'text', required: true, placeholder: 'CSE101' },
    { name: 'title', label: 'Course Title', type: 'text', required: true, placeholder: 'Programming Fundamentals' },
    { name: 'credits', label: 'Credits', type: 'number', required: true },
    { name: 'semester', label: 'Semester', type: 'select', required: true, options: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: '7', value: '7' },
      { label: '8', value: '8' }
    ]},
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Course description' }
  ];

  const handleAddCourse = (data: any) => {
    console.log('Add course:', data);
    setShowModal(false);
  };

  const handleEditCourse = (course: any) => {
    setEditingId(course.id);
    setShowModal(true);
  };

  const handleDeleteCourse = (course: any) => {
    if (confirm(`Delete ${course.code}?`)) {
      setCourses(courses.filter(c => c.id !== course.id));
    }
  };

  const columns = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'credits', label: 'Credits' },
    { key: 'semester', label: 'Semester' }
  ];

  const actions = [
    { label: 'Edit', onClick: handleEditCourse, color: 'blue' as const, icon: <Edit size={18} /> },
    { label: 'Delete', onClick: handleDeleteCourse, color: 'red' as const, icon: <Trash2 size={18} /> }
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <PageHeader
          title="Courses Management"
          subtitle="Manage all courses"
          breadcrumb={['Admin', 'Courses']}
          action={{
            label: 'Add Course',
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
            data={courses}
            actions={actions}
            searchable
            searchFields={['code', 'title']}
          />
        </div>

        <AdminModal
          title={editingId ? 'Edit Course' : 'Add New Course'}
          open={showModal}
          onClose={() => setShowModal(false)}
          size="lg"
        >
          <AdminForm
            fields={formFields}
            onSubmit={handleAddCourse}
            onCancel={() => setShowModal(false)}
            submitText={editingId ? 'Update' : 'Add'}
          />
        </AdminModal>
      </div>
    </AdminDashboardLayout>
  );
};

export default CourseManagement;
