import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Award, TrendingUp, BarChart3 } from 'lucide-react';

interface Grade {
  course: string;
  courseCode: string;
  midterm: number;
  final: number;
  ct: number;
  assignment: number;
  attendance: number;
  total: number;
  grade: string;
  credits: number;
  semester: string;
  year: number;
}

const Grades = () => {
  const [selectedSemester, setSelectedSemester] = useState('Spring 2026');
  const [grades] = useState<Grade[]>([
    {
      course: 'Software Development II',
      courseCode: 'CSE200',
      midterm: 27,
      final: 36,
      ct: 14,
      assignment: 9,
      attendance: 5,
      total: 91,
      grade: 'A',
      credits: 0.75,
      semester: 'Spring',
      year: 2026
    },
    {
      course: 'Digital Logic Design',
      courseCode: 'CSE205',
      midterm: 25,
      final: 34,
      ct: 13,
      assignment: 8,
      attendance: 4,
      total: 84,
      grade: 'A-',
      credits: 3,
      semester: 'Spring',
      year: 2026
    },
    {
      course: 'Database Systems',
      courseCode: 'CSE207',
      midterm: 22,
      final: 30,
      ct: 12,
      assignment: 7,
      attendance: 4,
      total: 75,
      grade: 'B+',
      credits: 3,
      semester: 'Spring',
      year: 2026
    },
    {
      course: 'Database Systems Lab',
      courseCode: 'CSE208',
      midterm: 20,
      final: 28,
      ct: 10,
      assignment: 7,
      attendance: 3,
      total: 68,
      grade: 'B',
      credits: 1.5,
      semester: 'Spring',
      year: 2026
    },
    {
      course: 'Principles of Economics',
      courseCode: 'ECO201',
      midterm: 26,
      final: 35,
      ct: 13,
      assignment: 8,
      attendance: 5,
      total: 87,
      grade: 'A',
      credits: 3,
      semester: 'Spring',
      year: 2026
    },
    {
      course: 'Data Structures',
      courseCode: 'CS201',
      midterm: 28,
      final: 37,
      ct: 14,
      assignment: 9,
      attendance: 5,
      total: 93,
      grade: 'A',
      credits: 3,
      semester: 'Fall',
      year: 2025
    },
    {
      course: 'Computer Networks',
      courseCode: 'CS230',
      midterm: 24,
      final: 33,
      ct: 13,
      assignment: 8,
      attendance: 4,
      total: 82,
      grade: 'A-',
      credits: 3,
      semester: 'Fall',
      year: 2025
    }
  ].sort((a, b) => a.courseCode.localeCompare(b.courseCode)));

  const filteredGrades = grades.filter(
    grade => `${grade.semester} ${grade.year}` === selectedSemester
  );

  // Check if selected semester is completed (not current semester)
  const isCompletedSemester = selectedSemester !== 'Spring 2026';

  const calculateCGPA = () => {
    const gradePoints: { [key: string]: number } = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D': 1.0, 'F': 0.0
    };

    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach(grade => {
      totalPoints += gradePoints[grade.grade] * grade.credits;
      totalCredits += grade.credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const calculateSGPA = () => {
    const gradePoints: { [key: string]: number } = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D': 1.0, 'F': 0.0
    };

    let totalPoints = 0;
    let totalCredits = 0;

    filteredGrades.forEach(grade => {
      totalPoints += gradePoints[grade.grade] * grade.credits;
      totalCredits += grade.credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const cgpa = calculateCGPA();
  const sgpa = calculateSGPA();

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <DashboardLayout title="Grades">
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-[#0C2B4E] via-[#1A3D64] to-[#1D546C] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Academic Performance</h1>
                <p className="text-white/80 mt-1">View GPA, grades, and semester progress</p>
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

        {/* CGPA, SGPA and Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Award size={24} />
              <p className="text-sm opacity-90">Current CGPA</p>
            </div>
            <p className="text-4xl font-bold">{cgpa}</p>
            <p className="text-sm opacity-75 mt-2">Out of 4.00</p>
          </div>

          {isCompletedSemester && (
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Award size={24} />
                <p className="text-sm opacity-90">Semester GPA</p>
              </div>
              <p className="text-4xl font-bold">{sgpa}</p>
              <p className="text-sm opacity-75 mt-2">Out of 4.00</p>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredGrades.length > 0 
                    ? Math.round(filteredGrades.reduce((sum, g) => sum + g.total, 0) / filteredGrades.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredGrades.reduce((sum, g) => sum + g.credits, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Course Grades</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mid
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Final
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CT
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    A/P
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map((grade) => (
                  <tr key={grade.courseCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{grade.courseCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{grade.course}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{grade.credits}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{grade.midterm}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{grade.final}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{grade.ct}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{grade.assignment}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{grade.attendance}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-semibold text-gray-900">{grade.total}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h2>
          <div className="space-y-3">
            {['A', 'A-', 'B+', 'B'].map((gradeLevel) => {
              const count = filteredGrades.filter(g => g.grade === gradeLevel).length;
              const percentage = filteredGrades.length > 0 ? (count / filteredGrades.length) * 100 : 0;
              return (
                <div key={gradeLevel}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{gradeLevel}</span>
                    <span className="text-sm text-gray-600">{count} courses ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getGradeColor(gradeLevel)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Grades;
