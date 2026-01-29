import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Award, TrendingUp, BarChart3 } from 'lucide-react';

interface Grade {
  course: string;
  courseCode: string;
  midterm: number;
  quiz: number;
  assignment: number;
  final: number;
  total: number;
  grade: string;
  credits: number;
}

const Grades = () => {
  const [grades] = useState<Grade[]>([
    {
      course: 'Data Structures',
      courseCode: 'CS201',
      midterm: 85,
      quiz: 90,
      assignment: 88,
      final: 87,
      total: 87,
      grade: 'A',
      credits: 3
    },
    {
      course: 'Database Systems',
      courseCode: 'CS210',
      midterm: 82,
      quiz: 85,
      assignment: 90,
      final: 85,
      total: 85,
      grade: 'A-',
      credits: 3
    },
    {
      course: 'Computer Networks',
      courseCode: 'CS230',
      midterm: 78,
      quiz: 80,
      assignment: 85,
      final: 82,
      total: 81,
      grade: 'B+',
      credits: 3
    },
    {
      course: 'Operating Systems',
      courseCode: 'CS240',
      midterm: 88,
      quiz: 92,
      assignment: 90,
      final: 89,
      total: 89,
      grade: 'A',
      credits: 4
    }
  ]);

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

    return (totalPoints / totalCredits).toFixed(2);
  };

  const cgpa = calculateCGPA();

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <DashboardLayout title="Grades">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Academic Performance</h1>
        </div>

        {/* CGPA and Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Award size={24} />
              <p className="text-sm opacity-90">Current CGPA</p>
            </div>
            <p className="text-4xl font-bold">{cgpa}</p>
            <p className="text-sm opacity-75 mt-2">Out of 4.00</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(grades.reduce((sum, g) => sum + g.total, 0) / grades.length)}%
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
                  {grades.reduce((sum, g) => sum + g.credits, 0)}
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
                    Course
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Midterm
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Final
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grades.map((grade) => (
                  <tr key={grade.courseCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{grade.course}</div>
                      <div className="text-xs text-gray-500">{grade.courseCode}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{grade.midterm}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{grade.quiz}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{grade.assignment}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{grade.final}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-semibold text-gray-900">{grade.total}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{grade.credits}</span>
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
              const count = grades.filter(g => g.grade === gradeLevel).length;
              const percentage = (count / grades.length) * 100;
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
