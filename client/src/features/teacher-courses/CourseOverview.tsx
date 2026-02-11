import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeacherDashboardLayout from '../../components/TeacherDashboardLayout';
import authService from '../../services/authService';
import { 
  BookOpen, 
  Users,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Download
} from 'lucide-react';

// Mock data
const mockCourses = [
  { courseCode: 'CS201', courseName: 'Data Structures', sections: ['1', '2'] },
  { courseCode: 'CS210', courseName: 'Database Systems', sections: ['1'] },
  { courseCode: 'CS301', courseName: 'Software Engineering', sections: ['1'] }
];

const mockStudents = [
  { studentId: '2024510183', name: 'Mashfi Rejoan Saikat', section: '1' },
  { studentId: '2024510184', name: 'Rahat Ahmed', section: '1' },
  { studentId: '2024510185', name: 'Nusrat Jahan', section: '1' },
  { studentId: '2024510186', name: 'Tasnim Rahman', section: '1' },
  { studentId: '2024510187', name: 'Fahim Hasan', section: '1' },
  { studentId: '2024510188', name: 'Sabrina Khan', section: '1' },
  { studentId: '2024510189', name: 'Tanvir Islam', section: '1' },
  { studentId: '2024510190', name: 'Fariha Aziz', section: '1' },
  { studentId: '2024510191', name: 'Imran Hossain', section: '2' },
  { studentId: '2024510192', name: 'Sadia Akter', section: '2' }
];

interface StudentPerformance {
  studentId: string;
  name: string;
  section: string;
  attendancePercentage: number;
  attendanceMarks: number;
  ct: number | null;
  assignment: number | null;
  mid: number | null;
  final: number | null;
  totalMarks: number;
  grade: string;
  isAtRisk: boolean;
}

// Function to calculate attendance marks (0-5) based on percentage
const getAttendanceMarks = (percentage: number): number => {
  if (percentage >= 91) return 5;
  if (percentage >= 86) return 4;
  if (percentage >= 81) return 3;
  if (percentage >= 76) return 2;
  if (percentage >= 70) return 1;
  return 0;
};

const CourseOverview = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS201');
  const [isLoading, setIsLoading] = useState(false);
  const [studentPerformances, setStudentPerformances] = useState<StudentPerformance[]>([]);
  const user = authService.getCurrentUser();

  const selectedCourseData = mockCourses.find(c => c.courseCode === selectedCourse);

  // Fetch all data for the course
  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        // Fetch marks for all evaluation types
        const evaluationTypes = ['ct', 'assignment', 'mid', 'final'];
        const sections = selectedCourseData?.sections || [];
        
        const performances: StudentPerformance[] = [];

        for (const section of sections) {
          const sectionStudents = mockStudents.filter(s => s.section === section);
          
          for (const student of sectionStudents) {
            // Mock attendance (in real app, fetch from attendance API)
            const attendancePercentage = 75 + Math.random() * 25; // Random 75-100%
            const attendanceMarks = getAttendanceMarks(attendancePercentage);

            const performance: StudentPerformance = {
              studentId: student.studentId,
              name: student.name,
              section: student.section,
              attendancePercentage: attendancePercentage,
              attendanceMarks: attendanceMarks,
              ct: null,
              assignment: null,
              mid: null,
              final: null,
              totalMarks: 0,
              grade: '-',
              isAtRisk: false
            };

            // Fetch marks for each evaluation type
            for (const evalType of evaluationTypes) {
              try {
                const response = await fetch(
                  `http://localhost:4000/api/marks/${selectedCourse}/${section}/${evalType}`
                );
                const result = await response.json();
                
                console.log(`Fetched ${evalType} for ${selectedCourse}/${section}:`, result);

                if (result.success && result.data && result.data.records) {
                  const record = result.data.records.find((r: any) => r.studentId === student.studentId);
                  if (record) {
                    console.log(`Found ${evalType} record for ${student.studentId}:`, record);
                    if (evalType === 'ct') performance.ct = record.marksObtained;
                    else if (evalType === 'assignment') performance.assignment = record.marksObtained;
                    else if (evalType === 'mid') performance.mid = record.marksObtained;
                    else if (evalType === 'final') performance.final = record.marksObtained;
                  }
                } else {
                  // Fallback to localStorage if API returns no data
                  const storageKey = `marks_${selectedCourse}_${section}_${evalType}`;
                  const savedMarks = localStorage.getItem(storageKey);
                  console.log(`No API data for ${evalType}, checking localStorage with key: ${storageKey}`);
                  if (savedMarks) {
                    console.log(`Found in localStorage:`, savedMarks);
                    const savedMarksObj = JSON.parse(savedMarks);
                    const marks = savedMarksObj[student.studentId];
                    if (marks !== null && marks !== undefined) {
                      console.log(`${evalType} marks for ${student.studentId}: ${marks}`);
                      if (evalType === 'ct') performance.ct = marks;
                      else if (evalType === 'assignment') performance.assignment = marks;
                      else if (evalType === 'mid') performance.mid = marks;
                      else if (evalType === 'final') performance.final = marks;
                    }
                  }
                }
              } catch (error) {
                console.error(`Error fetching ${evalType} marks:`, error);
                // Also try localStorage on error
                const storageKey = `marks_${selectedCourse}_${section}_${evalType}`;
                const savedMarks = localStorage.getItem(storageKey);
                if (savedMarks) {
                  const savedMarksObj = JSON.parse(savedMarks);
                  const marks = savedMarksObj[student.studentId];
                  if (marks !== null && marks !== undefined) {
                    if (evalType === 'ct') performance.ct = marks;
                    else if (evalType === 'assignment') performance.assignment = marks;
                    else if (evalType === 'mid') performance.mid = marks;
                    else if (evalType === 'final') performance.final = marks;
                  }
                }
              }
            }

            // Calculate total marks (out of 100: Attendance-5, CT-15, Assignment-10, Mid-30, Final-40)
            const ct = performance.ct || 0;
            const assignment = performance.assignment || 0;
            const mid = performance.mid || 0;
            const final = performance.final || 0;
            performance.totalMarks = performance.attendanceMarks + ct + assignment + mid + final;

            // Calculate percentage and grade (out of 100)
            const percentage = performance.totalMarks;
            if (percentage >= 80) performance.grade = 'A+';
            else if (percentage >= 75) performance.grade = 'A';
            else if (percentage >= 70) performance.grade = 'A-';
            else if (percentage >= 65) performance.grade = 'B+';
            else if (percentage >= 60) performance.grade = 'B';
            else if (percentage >= 55) performance.grade = 'B-';
            else if (percentage >= 50) performance.grade = 'C+';
            else if (percentage >= 45) performance.grade = 'C';
            else if (percentage >= 40) performance.grade = 'D';
            else performance.grade = 'F';

            // Identify at-risk students (low attendance marks or failing)
            performance.isAtRisk = performance.attendanceMarks < 2 || percentage < 40;

            performances.push(performance);
          }
        }

        setStudentPerformances(performances);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [selectedCourse, selectedCourseData?.sections]);

  // Calculate statistics
  const totalStudents = studentPerformances.length;
  const avgAttendance = totalStudents > 0
    ? (studentPerformances.reduce((sum, s) => sum + s.attendancePercentage, 0) / totalStudents).toFixed(1)
    : '0.0';
  const avgMarks = totalStudents > 0
    ? (studentPerformances.reduce((sum, s) => sum + s.totalMarks, 0) / totalStudents).toFixed(2)
    : '0.00';
  const passCount = studentPerformances.filter(s => s.totalMarks >= 40).length;
  const passRate = totalStudents > 0 ? ((passCount / totalStudents) * 100).toFixed(1) : '0.0';
  const atRiskCount = studentPerformances.filter(s => s.isAtRisk).length;

  // Grade distribution
  const gradeDistribution = {
    'A+': studentPerformances.filter(s => s.grade === 'A+').length,
    'A': studentPerformances.filter(s => s.grade === 'A').length,
    'A-': studentPerformances.filter(s => s.grade === 'A-').length,
    'B+': studentPerformances.filter(s => s.grade === 'B+').length,
    'B': studentPerformances.filter(s => s.grade === 'B').length,
    'B-': studentPerformances.filter(s => s.grade === 'B-').length,
    'C+': studentPerformances.filter(s => s.grade === 'C+').length,
    'C': studentPerformances.filter(s => s.grade === 'C').length,
    'D': studentPerformances.filter(s => s.grade === 'D').length,
    'F': studentPerformances.filter(s => s.grade === 'F').length
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'text-green-600 bg-green-50';
    if (['B+', 'B', 'B-'].includes(grade)) return 'text-blue-600 bg-blue-50';
    if (['C+', 'C'].includes(grade)) return 'text-yellow-600 bg-yellow-50';
    if (grade === 'D') return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <TeacherDashboardLayout title="Course Overview">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0C2B4E] via-[#1A3D64] to-[#1D546C] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Course Overview</h1>
                <p className="text-white/80 mt-1">Complete analytics and student performance</p>
              </div>
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {mockCourses.map(course => (
                <option key={course.courseCode} value={course.courseCode} className="text-gray-900">
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Students</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalStudents}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-blue-700 font-medium">Avg Attendance</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{avgAttendance}%</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-green-700 font-medium">Avg Marks</p>
            <p className="text-3xl font-bold text-green-900 mt-1">{avgMarks}/100</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-purple-700 font-medium">Pass Rate</p>
            <p className="text-3xl font-bold text-purple-900 mt-1">{passRate}%</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm text-red-700 font-medium">At Risk</p>
            <p className="text-3xl font-bold text-red-900 mt-1">{atRiskCount}</p>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] p-4 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Grade Distribution
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-5 lg:grid-cols-10 gap-3">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center">
                  <div className={`${getGradeColor(grade)} rounded-lg p-3 mb-2`}>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{grade}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/teacher/attendance"
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:border-[#0C2B4E] group"
          >
            <Calendar className="w-8 h-8 text-[#0C2B4E] mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-gray-900">Mark Attendance</h4>
            <p className="text-sm text-gray-600 mt-1">Record today's attendance</p>
          </Link>

          <Link
            to="/teacher/marks"
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:border-[#0C2B4E] group"
          >
            <FileText className="w-8 h-8 text-[#0C2B4E] mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-gray-900">Enter Marks</h4>
            <p className="text-sm text-gray-600 mt-1">Record evaluation marks</p>
          </Link>

          <Link
            to="/teacher/classroom"
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:border-[#0C2B4E] group"
          >
            <BookOpen className="w-8 h-8 text-[#0C2B4E] mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-gray-900">Classroom</h4>
            <p className="text-sm text-gray-600 mt-1">View posts and materials</p>
          </Link>

          <button
            onClick={() => alert('Download feature coming soon!')}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:border-[#0C2B4E] group text-left"
          >
            <Download className="w-8 h-8 text-[#0C2B4E] mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-gray-900">Download Report</h4>
            <p className="text-sm text-gray-600 mt-1">Export grade sheet</p>
          </button>
        </div>

        {/* Student Performance List */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] p-4 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Student Performance
            </h3>
          </div>
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading student data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Student</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Section</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Attend %</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Attend/5</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">CT/15</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Assg/10</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Mid/30</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Final/40</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Total/100</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Grade</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {studentPerformances.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.studentId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm font-medium">
                          {student.section}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className={`font-semibold ${
                            student.attendancePercentage >= 75 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {student.attendancePercentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-lg">
                        {student.attendanceMarks}/5
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        {student.ct !== null ? student.ct : '-'}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        {student.assignment !== null ? student.assignment : '-'}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        {student.mid !== null ? student.mid : '-'}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        {student.final !== null ? student.final : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-lg">{student.totalMarks}/100</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full font-bold ${getGradeColor(student.grade)}`}>
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {student.isAtRisk ? (
                          <span className="flex items-center justify-center gap-1 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs font-semibold">At Risk</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-semibold">Good</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </TeacherDashboardLayout>
  );
};

export default CourseOverview;
