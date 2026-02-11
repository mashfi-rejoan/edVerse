import React, { useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import AdminModal from '../../components/AdminModal';
import { Eye, Users, UserPlus, Edit, AlertTriangle } from 'lucide-react';

interface SectionRecord {
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  assignedTeacher: string | null;
  enrolledCount: number;
  capacity: number;
  status: 'Active' | 'Full' | 'Closed';
}

interface TeacherRecord {
  id: string;
  name: string;
  designation: string;
  workload: number;
}

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  studentId: string;
  registeredAt: string;
  grade?: string;
}

const SectionManagement: React.FC = () => {
  const [sections, setSections] = useState<SectionRecord[]>([
    {
      id: '1',
      courseCode: 'CSE201',
      courseName: 'Data Structures',
      section: '1',
      assignedTeacher: 'Dr. Ahmed Khan',
      enrolledCount: 42,
      capacity: 45,
      status: 'Active'
    },
    {
      id: '2',
      courseCode: 'CSE201',
      courseName: 'Data Structures',
      section: '2',
      assignedTeacher: null,
      enrolledCount: 0,
      capacity: 45,
      status: 'Closed'
    },
    {
      id: '3',
      courseCode: 'CSE305',
      courseName: 'Operating Systems',
      section: '1',
      assignedTeacher: 'Prof. Fatima Ali',
      enrolledCount: 45,
      capacity: 45,
      status: 'Full'
    }
  ]);

  const [teachers] = useState<TeacherRecord[]>([
    { id: 't1', name: 'Dr. Ahmed Khan', designation: 'Professor', workload: 3 },
    { id: 't2', name: 'Prof. Fatima Ali', designation: 'Associate Professor', workload: 4 },
    { id: 't3', name: 'Dr. Karim Rahman', designation: 'Assistant Professor', workload: 2 }
  ]);

  const [selectedSection, setSelectedSection] = useState<SectionRecord | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [capacityValue, setCapacityValue] = useState<number>(45);
  const [filters, setFilters] = useState({ course: 'All', section: 'All' });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(false);

  const studentsBySection: Record<string, StudentRecord[]> = {
    '1': [
      { id: 's1', name: 'Muhammad Ali', email: 'ali@student.edu.bd', studentId: 'CSE21001', registeredAt: '2026-01-10', grade: 'A' },
      { id: 's2', name: 'Zainab Khan', email: 'zainab@student.edu.bd', studentId: 'CSE21002', registeredAt: '2026-01-11', grade: 'B+' }
    ],
    '2': [],
    '3': [
      { id: 's3', name: 'Rafiul Hasan', email: 'rafiul@student.edu.bd', studentId: 'CSE20011', registeredAt: '2026-01-12', grade: 'B' }
    ]
  };

  const filteredSections = useMemo(() => {
    return sections.filter((section) => {
      const matchCourse = filters.course === 'All' || section.courseCode === filters.course;
      const matchSection = filters.section === 'All' || section.section === filters.section;
      return matchCourse && matchSection;
    });
  }, [sections, filters]);

  const handleAssignTeacher = (section: SectionRecord) => {
    setSelectedSection(section);
    setSelectedTeacherId('');
    setShowAssignModal(true);
  };

  const handleViewStudents = (section: SectionRecord) => {
    setSelectedSection(section);
    setShowStudentsModal(true);
  };

  const handleEditCapacity = (section: SectionRecord) => {
    setSelectedSection(section);
    setCapacityValue(section.capacity);
    setShowCapacityModal(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedSection) return;
    const teacher = teachers.find((t) => t.id === selectedTeacherId);
    if (!teacher) return;

    if (teacher.workload >= 4) {
      alert('This teacher already has the maximum workload (4 courses).');
      return;
    }

    setSections((prev) =>
      prev.map((item) =>
        item.id === selectedSection.id ? { ...item, assignedTeacher: teacher.name } : item
      )
    );
    setShowAssignModal(false);
  };

  const handleConfirmCapacity = () => {
    if (!selectedSection) return;
    if (capacityValue < selectedSection.enrolledCount) {
      alert('New capacity cannot be lower than current enrolled students.');
      return;
    }
    setSections((prev) =>
      prev.map((item) =>
        item.id === selectedSection.id ? { ...item, capacity: capacityValue } : item
      )
    );
    setShowCapacityModal(false);
  };

  const columns = [
    { key: 'courseCode', label: 'Course Code', sortable: true },
    { key: 'courseName', label: 'Course Name', sortable: true },
    { key: 'section', label: 'Section', sortable: true },
    { key: 'assignedTeacher', label: 'Assigned Teacher', sortable: true, render: (value: string | null) => value || 'Unassigned' },
    { key: 'enrolledCount', label: 'Enrolled', sortable: true },
    { key: 'capacity', label: 'Capacity', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: SectionRecord['status']) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'Active'
              ? 'bg-green-100 text-green-700'
              : value === 'Full'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {value}
        </span>
      )
    }
  ];

  const actions = [
    { label: 'Assign', onClick: handleAssignTeacher, color: 'blue' as const, icon: <UserPlus size={18} /> },
    { label: 'Students', onClick: handleViewStudents, color: 'green' as const, icon: <Eye size={18} /> },
    { label: 'Capacity', onClick: handleEditCapacity, color: 'red' as const, icon: <Edit size={18} /> }
  ];

  return (
    <div className="p-6">
        <PageHeader
          title="Section Management"
          subtitle="Assign teachers, manage capacity, and view enrollments"
          icon={<Users size={24} className="text-white" />}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={filters.course}
            onChange={(e) => setFilters((prev) => ({ ...prev, course: e.target.value }))}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0C2B4E]"
          >
            <option value="All">All Courses</option>
            {Array.from(new Set(sections.map((s) => s.courseCode))).map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <select
            value={filters.section}
            onChange={(e) => setFilters((prev) => ({ ...prev, section: e.target.value }))}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0C2B4E]"
          >
            <option value="All">All Sections</option>
            {['A', 'B', 'C', 'D'].map((section) => (
              <option key={section} value={section}>
                Section {section}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={filteredSections}
            actions={actions}
            searchable
            searchFields={['courseCode', 'courseName', 'assignedTeacher']}
          />
        </div>

        <AdminModal
          title="Assign Teacher"
          open={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {selectedSection ? `${selectedSection.courseCode} - Section ${selectedSection.section}` : ''}
            </p>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg"
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.designation})
                </option>
              ))}
            </select>
            {selectedTeacherId && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                Workload: {teachers.find((t) => t.id === selectedTeacherId)?.workload}/4 courses
              </div>
            )}
            <button
              onClick={handleConfirmAssign}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Assign Teacher
            </button>
          </div>
        </AdminModal>

        <AdminModal
          title="Enrolled Students"
          open={showStudentsModal}
          onClose={() => setShowStudentsModal(false)}
          size="lg"
        >
          {selectedSection && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {selectedSection.courseCode} - Section {selectedSection.section}
              </p>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left">Student</th>
                      <th className="px-4 py-2 text-left">Student ID</th>
                      <th className="px-4 py-2 text-left">Registered</th>
                      <th className="px-4 py-2 text-left">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(studentsBySection[selectedSection.id] || []).map((student) => (
                      <tr key={student.id} className="border-t border-gray-200">
                        <td className="px-4 py-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-gray-700">{student.studentId}</td>
                        <td className="px-4 py-2 text-gray-700">{student.registeredAt}</td>
                        <td className="px-4 py-2 text-gray-700">{student.grade || 'N/A'}</td>
                      </tr>
                    ))}
                    {(studentsBySection[selectedSection.id] || []).length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                          No students enrolled yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </AdminModal>

        <AdminModal
          title="Edit Capacity"
          open={showCapacityModal}
          onClose={() => setShowCapacityModal(false)}
          size="sm"
        >
          {selectedSection && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {selectedSection.courseCode} - Section {selectedSection.section}
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                <input
                  type="number"
                  value={capacityValue}
                  onChange={(e) => setCapacityValue(Number(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>
              {capacityValue < selectedSection.enrolledCount && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle size={16} />
                  Capacity cannot be less than enrolled students.
                </div>
              )}
              <button
                onClick={handleConfirmCapacity}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Capacity
              </button>
            </div>
          )}
        </AdminModal>
      </div>
  );
};

export default SectionManagement;
