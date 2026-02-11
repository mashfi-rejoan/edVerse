import { useState, useEffect } from 'react';
import TeacherDashboardLayout from '../../components/TeacherDashboardLayout';
import authService from '../../services/authService';
import { 
  BookOpen, 
  TrendingUp,
  TrendingDown,
  Minus,
  Save,
  Search,
  FileText
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

const evaluationTypes = [
  { value: 'ct', label: 'CT', defaultMax: 15 },
  { value: 'assignment', label: 'Assignments/Presentation', defaultMax: 10 },
  { value: 'mid', label: 'Mid', defaultMax: 30 },
  { value: 'final', label: 'Final', defaultMax: 40 }
];

const MarksManager = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS201');
  const [selectedSection, setSelectedSection] = useState('1');
  const [evaluationType, setEvaluationType] = useState('ct');
  const [students, setStudents] = useState(mockStudents);
  const [marks, setMarks] = useState<Record<string, number | null>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const user = authService.getCurrentUser();

  // Get max marks from evaluation type
  const selectedEvalType = evaluationTypes.find(e => e.value === evaluationType);
  const maxMarks = selectedEvalType?.defaultMax || 15;

  const selectedCourseData = mockCourses.find(c => c.courseCode === selectedCourse);
  const filteredStudents = students.filter(s => s.section === selectedSection);
  const searchedStudents = filteredStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.includes(searchTerm)
  );

  // Fetch marks from database when course/section/evaluationType changes
  useEffect(() => {
    const fetchMarks = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from API
        const response = await fetch(
          `http://localhost:4000/api/marks/${selectedCourse}/${selectedSection}/${evaluationType}`
        );
        const result = await response.json();

        if (result.success && result.data && result.data.records) {
          // Convert records array to marks object
          const fetchedMarks: Record<string, number | null> = {};
          filteredStudents.forEach(student => {
            const record = result.data.records.find((r: any) => r.studentId === student.studentId);
            fetchedMarks[student.studentId] = record ? record.marksObtained : null;
          });
          setMarks(fetchedMarks);
        } else {
          // No data in database, try localStorage
          const storageKey = `marks_${selectedCourse}_${selectedSection}_${evaluationType}`;
          const savedMarks = localStorage.getItem(storageKey);
          
          if (savedMarks) {
            setMarks(JSON.parse(savedMarks));
          } else {
            // Initialize with null
            const initialMarks: Record<string, number | null> = {};
            filteredStudents.forEach(student => {
              initialMarks[student.studentId] = null;
            });
            setMarks(initialMarks);
          }
        }
      } catch (error) {
        console.error('Error fetching marks:', error);
        // Fallback to localStorage
        const storageKey = `marks_${selectedCourse}_${selectedSection}_${evaluationType}`;
        const savedMarks = localStorage.getItem(storageKey);
        
        if (savedMarks) {
          setMarks(JSON.parse(savedMarks));
        } else {
          const initialMarks: Record<string, number | null> = {};
          filteredStudents.forEach(student => {
            initialMarks[student.studentId] = null;
          });
          setMarks(initialMarks);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarks();
  }, [selectedCourse, selectedSection, evaluationType, filteredStudents.length]);

  // Calculate statistics
  const enteredMarks = Object.values(marks).filter(m => m !== null) as number[];
  const totalEntered = enteredMarks.length;
  const average = enteredMarks.length > 0 
    ? (enteredMarks.reduce((sum, m) => sum + m, 0) / enteredMarks.length).toFixed(2)
    : '0.00';
  const highest = enteredMarks.length > 0 ? Math.max(...enteredMarks) : 0;
  const lowest = enteredMarks.length > 0 ? Math.min(...enteredMarks) : 0;
  const passCount = enteredMarks.filter(m => (m / maxMarks) * 100 >= 40).length;
  const passRate = totalEntered > 0 ? ((passCount / totalEntered) * 100).toFixed(1) : '0.0';

  const handleMarksChange = (studentId: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    // Validate marks
    if (numValue !== null && (numValue < 0 || numValue > maxMarks)) {
      alert(`Marks must be between 0 and ${maxMarks}`);
      return;
    }

    setMarks(prev => ({
      ...prev,
      [studentId]: numValue
    }));
  };

  const handleSaveMarks = async () => {
    // Check if at least one mark is entered
    if (totalEntered === 0) {
      alert('Please enter marks for at least one student');
      return;
    }

    setIsSaving(true);
    
    // Prepare data for backend
    const marksData = {
      courseCode: selectedCourse,
      courseName: selectedCourseData?.courseName,
      section: selectedSection,
      teacherId: user?.id || 'T2020001',
      teacherName: user?.name || 'Dr. Ahmed Rahman',
      evaluationType,
      maxMarks,
      records: filteredStudents
        .filter(student => marks[student.studentId] !== null)
        .map(student => ({
          studentId: student.studentId,
          studentName: student.name,
          marksObtained: marks[student.studentId],
          percentage: parseFloat(((marks[student.studentId]! / maxMarks) * 100).toFixed(2))
        })),
      statistics: {
        totalStudents: filteredStudents.length,
        totalEntered,
        average: parseFloat(average),
        highest,
        lowest,
        passCount,
        passRate: parseFloat(passRate)
      }
    };

    try {
      // Save to database
      const response = await fetch('http://localhost:4000/api/marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(marksData)
      });

      const result = await response.json();

      if (result.success) {
        // Also save to localStorage as backup
        const storageKey = `marks_${selectedCourse}_${selectedSection}_${evaluationType}`;
        localStorage.setItem(storageKey, JSON.stringify(marks));
        
        setIsSaving(false);
        alert('Marks saved successfully!');
      } else {
        throw new Error(result.message || 'Failed to save marks');
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      
      // Save to localStorage as fallback
      const storageKey = `marks_${selectedCourse}_${selectedSection}_${evaluationType}`;
      localStorage.setItem(storageKey, JSON.stringify(marks));
      
      setIsSaving(false);
      alert('Saved to local storage (Database connection failed)');
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 80) return 'A+';
    if (percentage >= 75) return 'A';
    if (percentage >= 70) return 'A-';
    if (percentage >= 65) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 55) return 'B-';
    if (percentage >= 50) return 'C+';
    if (percentage >= 45) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  return (
    <TeacherDashboardLayout title="Marks Manager">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0C2B4E] via-[#1A3D64] to-[#1D546C] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Enter Marks</h1>
              <p className="text-white/80 mt-1">Record student evaluation marks and grades</p>
            </div>
          </div>
        </div>

        {/* Filters & Configuration */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 min-w-[900px]">
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

            {/* Evaluation Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Evaluation Type
              </label>
              <select
                value={evaluationType}
                onChange={(e) => setEvaluationType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
              >
                {evaluationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
            <p className="text-xs text-gray-600 font-medium">Total Students</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{filteredStudents.length}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-md">
            <p className="text-xs text-blue-700 font-medium">Entered</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{totalEntered}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-md">
            <p className="text-xs text-green-700 font-medium">Average</p>
            <p className="text-2xl font-bold text-green-900 mt-1">{average}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-md">
            <p className="text-xs text-purple-700 font-medium">Highest</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">{highest}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-md">
            <p className="text-xs text-orange-700 font-medium">Lowest</p>
            <p className="text-2xl font-bold text-orange-900 mt-1">{lowest}</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 shadow-md">
            <p className="text-xs text-indigo-700 font-medium">Pass Rate</p>
            <p className="text-2xl font-bold text-indigo-900 mt-1">{passRate}%</p>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] p-4 text-white">
            <h3 className="text-lg font-bold">Student List - Enter Marks (out of {maxMarks})</h3>
          </div>
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading marks...</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="space-y-3">
                {searchedStudents.length > 0 ? (
                  searchedStudents.map((student) => {
                    const studentMarks = marks[student.studentId];
                    const percentage = studentMarks !== null ? (studentMarks / maxMarks) * 100 : 0;
                    const gradeLetter = studentMarks !== null ? getGradeLetter(percentage) : '-';
                    const gradeColor = studentMarks !== null ? getGradeColor(percentage) : 'text-gray-400';

                    return (
                      <div
                        key={student.studentId}
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#0C2B4E] hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {/* Marks Input */}
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max={maxMarks}
                                step="0.5"
                                value={studentMarks === null ? '' : studentMarks}
                                onChange={(e) => handleMarksChange(student.studentId, e.target.value)}
                                placeholder="0"
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
                              />
                              <span className="text-gray-500 font-medium">/ {maxMarks}</span>
                            </div>

                            {/* Percentage & Grade */}
                            {studentMarks !== null && (
                              <div className="flex items-center gap-3 min-w-[120px]">
                                <div className="text-right">
                                  <p className={`text-lg font-bold ${gradeColor}`}>
                                    {percentage.toFixed(1)}%
                                  </p>
                                  <p className={`text-sm font-semibold ${gradeColor}`}>
                                    Grade: {gradeLetter}
                                  </p>
                                </div>
                                {percentage >= 80 ? (
                                  <TrendingUp className="w-5 h-5 text-green-600" />
                                ) : percentage >= 40 ? (
                                  <Minus className="w-5 h-5 text-yellow-600" />
                                ) : (
                                  <TrendingDown className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No students found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={handleSaveMarks}
            disabled={isSaving || totalEntered === 0 || isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Marks'}
          </button>
        </div>
      </div>
    </TeacherDashboardLayout>
  );
};

export default MarksManager;
