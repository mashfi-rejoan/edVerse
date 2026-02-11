import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import AdminForm, { FormField } from '../../components/AdminForm';
import {
  Plus,
  Edit,
  Eye,
  Archive,
  RotateCcw,
  Calendar,
  Layers,
  Users,
  BookOpen
} from 'lucide-react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

type OfferingStatus = 'Yes' | 'No';

interface CourseRecord {
  id: string;
  code: string;
  title: string;
  credits: number;
  semester: number;
  description?: string;
  prerequisites: string[];
  isOffered: boolean;
  offeringTerm?: string;
  archived?: boolean;
  hasSections?: boolean;
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showOfferingModal, setShowOfferingModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseRecord | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, any>>({});
  const [filters, setFilters] = useState({ semester: 'All' });
  const [offeringYear, setOfferingYear] = useState('2026');
  const [offeringSemester, setOfferingSemester] = useState('Spring');
  const [maxStudents, setMaxStudents] = useState(45);
  const [estimatedEnrollment, setEstimatedEnrollment] = useState(120);
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);

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
        {
          id: '1',
          code: 'CSE101',
          title: 'Programming Fundamentals',
          credits: 3,
          semester: 1,
          description: 'Introduction to programming basics with C/C++',
          prerequisites: [],
          isOffered: true,
          offeringTerm: 'Spring 2026',
          archived: false,
          hasSections: true
        },
        {
          id: '2',
          code: 'CSE201',
          title: 'Data Structures',
          credits: 3,
          semester: 2,
          description: 'Core data structures and algorithms',
          prerequisites: ['CSE101'],
          isOffered: true,
          offeringTerm: 'Spring 2026',
          archived: false
        },
        {
          id: '3',
          code: 'CSE205',
          title: 'Digital Logic Design',
          credits: 3,
          semester: 2,
          description: 'Digital logic, gates, circuits, and combinational design',
          prerequisites: ['CSE101'],
          isOffered: false,
          offeringTerm: undefined,
          archived: false
        },
        {
          id: '4',
          code: 'CSE305',
          title: 'Operating Systems',
          credits: 3,
          semester: 5,
          description: 'Process management, memory, and file systems',
          prerequisites: ['CSE201'],
          isOffered: false,
          offeringTerm: undefined,
          archived: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formFields: FormField[] = [
    {
      name: 'code',
      label: 'Course Code',
      type: 'text',
      required: true,
      placeholder: 'CSE101',
      validation: (value) => {
        const code = String(value || '').toUpperCase();
        if (!/^CSE\d{3}$/.test(code)) return 'Course code must be in format CSE101';
        const exists = courses.some(
          (course) => course.code.toUpperCase() === code && course.id !== editingId
        );
        return exists ? 'Course code already exists' : null;
      }
    },
    {
      name: 'title',
      label: 'Course Name',
      type: 'text',
      required: true,
      placeholder: 'Programming Fundamentals'
    },
    {
      name: 'credits',
      label: 'Credit Hours',
      type: 'number',
      required: true,
      validation: (value) => {
        const credit = Number(value);
        if (Number.isNaN(credit)) return 'Credit hours must be a number';
        if (credit < 1 || credit > 4) return 'Credits must be between 1 and 4';
        return null;
      }
    },
    {
      name: 'semester',
      label: 'Semester',
      type: 'select',
      required: true,
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' }
      ]
    },
    {
      name: 'prerequisites',
      label: 'Prerequisites',
      type: 'multiselect',
      options: courses
        .filter((course) => !course.archived)
        .map((course) => ({ label: `${course.code} - ${course.title}`, value: course.code }))
    },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Course description' },
    {
      name: 'isOffered',
      label: 'Offering Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ]
    }
  ];

  const handleViewCourse = (course: CourseRecord) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  const handleAddCourse = (data: any) => {
    const isOffered = data.isOffered === 'Yes';
    if (editingId) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingId
            ? {
                ...course,
                code: String(data.code || '').toUpperCase(),
                title: data.title,
                credits: Number(data.credits),
                semester: Number(data.semester),
                prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [],
                description: data.description,
                isOffered,
                offeringTerm: isOffered ? course.offeringTerm || `${offeringSemester} ${offeringYear}` : undefined
              }
            : course
        )
      );
    } else {
      const newCourse: CourseRecord = {
        id: String(courses.length + 1),
        code: String(data.code || '').toUpperCase(),
        title: data.title,
        credits: Number(data.credits),
        semester: Number(data.semester),
        prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [],
        description: data.description,
        isOffered,
        offeringTerm: isOffered ? `${offeringSemester} ${offeringYear}` : undefined,
        archived: false
      };
      setCourses((prev) => [...prev, newCourse]);
    }

    setShowModal(false);
    setEditingId(null);
    setFormDefaults({});
  };

  const handleEditCourse = (course: CourseRecord) => {
    setEditingId(course.id);
    setFormDefaults({
      code: course.code,
      title: course.title,
      credits: course.credits,
      semester: String(course.semester),
      prerequisites: course.prerequisites,
      description: course.description,
      isOffered: course.isOffered ? 'Yes' : 'No'
    });
    setShowModal(true);
  };

  const handleArchiveCourse = (course: CourseRecord) => {
    if (course.hasSections) {
      alert('Cannot archive course while sections are active.');
      return;
    }
    if (confirm(`Archive ${course.code}?`)) {
      setCourses((prev) =>
        prev.map((item) => (item.id === course.id ? { ...item, archived: true } : item))
      );
    }
  };

  const handleRestoreCourse = (course: CourseRecord) => {
    setCourses((prev) =>
      prev.map((item) => (item.id === course.id ? { ...item, archived: false } : item))
    );
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSemester =
      filters.semester === 'All' || String(course.semester) === String(filters.semester);
    return matchesSemester;
  });

  const coursesWithStats = filteredCourses.map((course) => ({
    ...course,
    prerequisitesCount: course.prerequisites?.length || 0,
    offeringStatus: course.isOffered ? 'Yes' : 'No'
  }));

  const columns = [
    { key: 'code', label: 'Course Code', sortable: true },
    { key: 'title', label: 'Course Name', sortable: true },
    { key: 'credits', label: 'Credit Hours', sortable: true },
    { key: 'semester', label: 'Semester', sortable: true },
    { key: 'prerequisitesCount', label: 'Prerequisites', sortable: true },
    {
      key: 'offeringStatus',
      label: 'Offering',
      sortable: true,
      render: (value: OfferingStatus) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {value}
        </span>
      )
    },
    {
      key: 'archived',
      label: 'Status',
      sortable: true,
      render: (value: boolean) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
          }`}
        >
          {value ? 'Archived' : 'Active'}
        </span>
      )
    }
  ];

  const actions = [
    { label: 'View', onClick: handleViewCourse, color: 'blue' as const, icon: <Eye size={18} /> },
    { label: 'Edit', onClick: handleEditCourse, color: 'green' as const, icon: <Edit size={18} /> },
    { label: 'Archive', onClick: handleArchiveCourse, color: 'red' as const, icon: <Archive size={18} /> }
  ];

  const getSectionLabels = (count: number) => {
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return labels.slice(0, count).map((label) => `Section ${label}`);
  };

  const offeringPreview = selectedOfferings.map((courseId) => {
    const course = courses.find((item) => item.id === courseId);
    if (!course) return null;
    const sections = Math.max(1, Math.ceil(estimatedEnrollment / maxStudents));
    return {
      code: course.code,
      title: course.title,
      sections: getSectionLabels(sections)
    };
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner text="Loading courses..." />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
        <PageHeader
          title="Courses Management"
          subtitle="Manage courses, prerequisites, and offerings"
          action={{
            label: 'Add Course',
            onClick: () => {
              setEditingId(null);
              setFormDefaults({});
              setShowModal(true);
            },
            variant: 'primary'
          }}
          icon={<BookOpen size={24} className="text-white" />}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowOfferingModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar size={18} />
            Setup Course Offering
          </button>
          <button
            onClick={() => setFilters({ semester: 'All' })}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={18} />
            Reset Filters
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.semester}
            onChange={(e) => setFilters({ semester: e.target.value })}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0C2B4E]"
          >
            <option value="All">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={String(sem)}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={coursesWithStats}
            actions={actions}
            searchable
            searchFields={['code', 'title']}
            rowClick={handleViewCourse}
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
            defaultValues={formDefaults}
          />
        </AdminModal>

        <AdminModal
          title="Course Details"
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          size="lg"
        >
          {selectedCourse && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{selectedCourse.title}</h3>
                  <p className="text-sm text-gray-500">{selectedCourse.code}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedCourse.archived
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {selectedCourse.archived ? 'Archived' : 'Active'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Credits</p>
                  <p className="text-xl font-semibold text-gray-900">{selectedCourse.credits}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Semester</p>
                  <p className="text-xl font-semibold text-gray-900">{selectedCourse.semester}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Offering Status</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {selectedCourse.isOffered ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.prerequisites.length > 0 ? (
                    selectedCourse.prerequisites.map((course) => (
                      <span key={course} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                        {course}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No prerequisites</span>
                  )}
                </div>
              </div>

              {selectedCourse.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedCourse.description}</p>
                </div>
              )}

              {selectedCourse.offeringTerm && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} /> Offered in {selectedCourse.offeringTerm}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {!selectedCourse.archived ? (
                  <button
                    onClick={() => handleArchiveCourse(selectedCourse)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Archive size={16} className="inline mr-2" />
                    Archive Course
                  </button>
                ) : (
                  <button
                    onClick={() => handleRestoreCourse(selectedCourse)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <RotateCcw size={16} className="inline mr-2" />
                    Restore Course
                  </button>
                )}
                <button
                  onClick={() => handleEditCourse(selectedCourse)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Edit size={16} className="inline mr-2" />
                  Edit Course
                </button>
              </div>
            </div>
          )}
        </AdminModal>

        <AdminModal
          title="Course Offering Setup"
          open={showOfferingModal}
          onClose={() => setShowOfferingModal(false)}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                <select
                  value={offeringYear}
                  onChange={(e) => setOfferingYear(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                >
                  {['2025', '2026', '2027', '2028'].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
                <select
                  value={offeringSemester}
                  onChange={(e) => setOfferingSemester(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                >
                  {['Spring', 'Summer', 'Fall'].map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Courses to Offer</label>
              <div className="border border-gray-200 rounded-lg max-h-56 overflow-auto">
                {courses.filter((course) => !course.archived).map((course) => (
                  <label key={course.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <input
                      type="checkbox"
                      checked={selectedOfferings.includes(course.id)}
                      onChange={(e) => {
                        setSelectedOfferings((prev) =>
                          e.target.checked
                            ? [...prev, course.id]
                            : prev.filter((id) => id !== course.id)
                        );
                      }}
                      className="h-4 w-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{course.code}</p>
                      <p className="text-xs text-gray-500">{course.title}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Students / Section</label>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-gray-400" />
                  <input
                    type="number"
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(Number(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Enrollment</label>
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-gray-400" />
                  <input
                    type="number"
                    value={estimatedEnrollment}
                    onChange={(e) => setEstimatedEnrollment(Number(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Section Preview</h4>
              <div className="space-y-3">
                {offeringPreview.map((item) =>
                  item ? (
                    <div key={item.code} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">{item.code}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.title}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.sections.map((section) => (
                          <span key={section} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
                {offeringPreview.length === 0 && (
                  <p className="text-sm text-gray-500">Select courses to see section preview.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowOfferingModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCourses((prev) =>
                    prev.map((course) =>
                      selectedOfferings.includes(course.id)
                        ? { ...course, isOffered: true, offeringTerm: `${offeringSemester} ${offeringYear}` }
                        : course
                    )
                  );
                  setShowOfferingModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Publish Offering
              </button>
            </div>
          </div>
        </AdminModal>
      </div>
  );
};

export default CourseManagement;
