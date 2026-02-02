import { useState, useEffect } from 'react';
import TeacherDashboardLayout from '../../components/TeacherDashboardLayout';
import authService from '../../services/authService';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Search,
  Filter
} from 'lucide-react';

// Mock data
const mockCourses = [
  { courseCode: 'CS201', courseName: 'Data Structures', sections: ['A', 'B'] },
  { courseCode: 'CS210', courseName: 'Database Systems', sections: ['A'] },
  { courseCode: 'CS301', courseName: 'Software Engineering', sections: ['A'] }
];

const mockStudents = [
  { studentId: '2024510183', name: 'Mashfi Rejoan Saikat', section: 'A', attendance: 92 },
  { studentId: '2024510184', name: 'Rahat Ahmed', section: 'A', attendance: 88 },
  { studentId: '2024510185', name: 'Nusrat Jahan', section: 'A', attendance: 95 },
  { studentId: '2024510186', name: 'Tasnim Rahman', section: 'A', attendance: 85 },
  { studentId: '2024510187', name: 'Fahim Hasan', section: 'A', attendance: 78 },
  { studentId: '2024510188', name: 'Sabrina Khan', section: 'A', attendance: 90 },
  { studentId: '2024510189', name: 'Tanvir Islam', section: 'A', attendance: 82 },
  { studentId: '2024510190', name: 'Fariha Aziz', section: 'A', attendance: 94 },
  { studentId: '2024510191', name: 'Imran Hossain', section: 'B', attendance: 87 },
  { studentId: '2024510192', name: 'Sadia Akter', section: 'B', attendance: 91 }
];

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
}

const AttendanceManager = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS201');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState(mockStudents);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const user = authService.getCurrentUser();

  const selectedCourseData = mockCourses.find(c => c.courseCode === selectedCourse);
  const filteredStudents = students.filter(s => s.section === selectedSection);
  const searchedStudents = filteredStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.includes(searchTerm)
  );

  // Initialize attendance as absent for all students when course or section changes
  useEffect(() => {
    const initialAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
    filteredStudents.forEach(student => {
      initialAttendance[student.studentId] = 'absent';
    });
    setAttendance(initialAttendance);
  }, [selectedCourse, selectedSection, filteredStudents.length]);

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;
  const lateCount = Object.values(attendance).filter(s => s === 'late').length;

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const newAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
    filteredStudents.forEach(student => {
      newAttendance[student.studentId] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    
    // Prepare data for backend
    const attendanceData = {
      courseCode: selectedCourse,
      courseName: selectedCourseData?.courseName,
      section: selectedSection,
      teacherId: user?.id || 'T2020001',
      teacherName: user?.name || 'Dr. Ahmed Rahman',
      date: selectedDate,
      records: filteredStudents.map(student => ({
        studentId: student.studentId,
        studentName: student.name,
        status: attendance[student.studentId] || 'present',
        markedAt: new Date().toISOString()
      })),
      totalStudents: filteredStudents.length,
      presentCount,
      absentCount,
      lateCount
    };

    try {
      // TODO: Replace with actual API call
      // await axios.post('/api/teacher/attendance', attendanceData);
      
      console.log('Attendance Data:', attendanceData);
      
      setTimeout(() => {
        setIsSaving(false);
        alert('Attendance saved successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error saving attendance:', error);
      setIsSaving(false);
      alert('Failed to save attendance. Please try again.');
    }
  };

  return (
    <TeacherDashboardLayout title="Attendance Manager">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0C2B4E] via-[#1A3D64] to-[#1D546C] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Mark Attendance</h1>
              <p className="text-white/80 mt-1">Record student attendance for today's class</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
              >
                {mockCourses.map(course => (
                  <option key={course.courseCode} value={course.courseCode}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
              >
                {selectedCourseData?.sections.map(section => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
              />
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Student
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 font-medium">Total Students</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{filteredStudents.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-md">
            <p className="text-sm text-green-700 font-medium">Present</p>
            <p className="text-3xl font-bold text-green-900 mt-1">{presentCount}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-md">
            <p className="text-sm text-red-700 font-medium">Absent</p>
            <p className="text-3xl font-bold text-red-900 mt-1">{absentCount}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-md">
            <p className="text-sm text-yellow-700 font-medium">Late</p>
            <p className="text-3xl font-bold text-yellow-900 mt-1">{lateCount}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleMarkAll('present')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll('absent')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <XCircle className="w-5 h-5" />
            Mark All Absent
          </button>
        </div>

        {/* Student List */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] p-4 text-white">
            <h3 className="text-lg font-bold">Student List</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {searchedStudents.length > 0 ? (
                searchedStudents.map((student) => (
                  <div
                    key={student.studentId}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#0C2B4E] hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                        <p className="text-xs text-gray-500 mt-1">Previous Attendance: {student.attendance}%</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(student.studentId, 'present')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            attendance[student.studentId] === 'present'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.studentId, 'late')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            attendance[student.studentId] === 'late'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.studentId, 'absent')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            attendance[student.studentId] === 'absent'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No students found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <CheckCircle className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>
    </TeacherDashboardLayout>
  );
};

export default AttendanceManager;
