import React, { useState, useEffect, FormEvent } from 'react';
import './StudentDashboard.css';
import { apiUrl } from '../utils/apiBase';

interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  instructorName: string;
  credits: number;
  department: string;
  description: string;
  semester: string;
  year: number;
  enrollmentId?: string;
  enrollmentStatus?: string;
  grade?: string;
}

interface CourseMaterial {
  _id: string;
  title: string;
  description: string;
  type: string;
  fileUrl?: string;
  dueDate?: string;
  createdAt: string;
}

interface Semester {
  semester: string;
  year: number;
}

const StudentDashboard = () => {
  const [currentSemester, setCurrentSemester] = useState<Semester>({ semester: 'Spring', year: 2026 });
  const [selectedSemester, setSelectedSemester] = useState<Semester>({ semester: 'Spring', year: 2026 });
  const [availableSemesters, setAvailableSemesters] = useState<Semester[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseMaterials, setCourseMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available' | 'materials'>('enrolled');

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (selectedSemester.semester && selectedSemester.year) {
      fetchEnrolledCourses();
      if (activeTab === 'available') {
        fetchAvailableCourses();
      }
    }
  }, [selectedSemester, activeTab]);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseMaterials(selectedCourse._id);
    }
  }, [selectedCourse]);

  const fetchSemesters = async () => {
    try {
      const response = await fetch(apiUrl('/api/courses/semesters'), {
        credentials: 'include',
      });
      const data = await response.json();
      setCurrentSemester(data.current);
      setSelectedSemester(data.current);
      setAvailableSemesters(data.available || []);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        apiUrl(`/api/courses/student/${user.id}/courses?semester=${selectedSemester.semester}&year=${selectedSemester.year}`),
        { credentials: 'include' }
      );
      const data = await response.json();
      setEnrolledCourses(data.courses || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        apiUrl(`/api/courses/courses/available?semester=${selectedSemester.semester}&year=${selectedSemester.year}`),
        { credentials: 'include' }
      );
      const data = await response.json();
      
      // Filter out already enrolled courses
      const enrolledIds = enrolledCourses.map(c => c._id);
      const available = (data.courses || []).filter((c: Course) => !enrolledIds.includes(c._id));
      
      setAvailableCourses(available);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching available courses:', error);
      setLoading(false);
    }
  };

  const fetchCourseMaterials = async (courseId: string) => {
    try {
      const response = await fetch(apiUrl(`/api/courses/course/${courseId}/materials`), {
        credentials: 'include',
      });
      const data = await response.json();
      setCourseMaterials(data.materials || []);
    } catch (error) {
      console.error('Error fetching course materials:', error);
    }
  };

  const handleEnrollCourse = async (courseId: string) => {
    try {
      const response = await fetch(apiUrl('/api/courses/enroll'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          studentId: user.id,
          courseId,
          semester: selectedSemester.semester,
          year: selectedSemester.year,
        }),
      });

      if (response.ok) {
        alert('Successfully enrolled in course!');
        fetchEnrolledCourses();
        fetchAvailableCourses();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
    }
  };

  const handleDropCourse = async (enrollmentId: string) => {
    if (!confirm('Are you sure you want to drop this course?')) return;

    try {
      const response = await fetch(apiUrl('/api/courses/drop'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enrollmentId }),
      });

      if (response.ok) {
        alert('Course dropped successfully');
        fetchEnrolledCourses();
      } else {
        alert('Failed to drop course');
      }
    } catch (error) {
      console.error('Error dropping course:', error);
      alert('Failed to drop course');
    }
  };

  const handleSemesterChange = (semester: string, year: number) => {
    setSelectedSemester({ semester, year });
  };

  const isCurrentSemester = 
    selectedSemester.semester === currentSemester.semester && 
    selectedSemester.year === currentSemester.year;

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>

      {/* Semester Navigation */}
      <div className="semester-navigation">
        <div className="semester-selector">
          <label>Select Semester:</label>
          <select
            value={`${selectedSemester.semester}-${selectedSemester.year}`}
            onChange={(e) => {
              const [semester, year] = e.target.value.split('-');
              handleSemesterChange(semester, parseInt(year));
            }}
          >
            {availableSemesters.map((sem, idx) => (
              <option key={idx} value={`${sem.semester}-${sem.year}`}>
                {sem.semester} {sem.year}
                {sem.semester === currentSemester.semester && sem.year === currentSemester.year && ' (Current)'}
              </option>
            ))}
          </select>
        </div>

        <div className="semester-info">
          <span className="current-semester-badge">
            {isCurrentSemester ? '📅 Current Semester' : '📚 Past Semester'}
          </span>
          <span className="semester-details">
            {selectedSemester.semester} {selectedSemester.year}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="course-tabs">
        <button
          className={activeTab === 'enrolled' ? 'active' : ''}
          onClick={() => setActiveTab('enrolled')}
        >
          📖 My Courses ({enrolledCourses.length})
        </button>
        {isCurrentSemester && (
          <button
            className={activeTab === 'available' ? 'active' : ''}
            onClick={() => setActiveTab('available')}
          >
            ➕ Available Courses
          </button>
        )}
        {selectedCourse && (
          <button
            className={activeTab === 'materials' ? 'active' : ''}
            onClick={() => setActiveTab('materials')}
          >
            📚 Course Materials
          </button>
        )}
      </div>

      {/* Course Content */}
      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {/* Enrolled Courses Tab */}
            {activeTab === 'enrolled' && (
              <div className="courses-grid">
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map((course) => (
                    <div key={course._id} className="course-card">
                      <div className="course-header">
                        <h3>{course.courseName}</h3>
                        <span className="course-code">{course.courseCode}</span>
                      </div>
                      <div className="course-details">
                        <p><strong>Instructor:</strong> {course.instructorName || 'TBA'}</p>
                        <p><strong>Credits:</strong> {course.credits}</p>
                        <p><strong>Department:</strong> {course.department || 'N/A'}</p>
                        {course.description && <p className="course-description">{course.description}</p>}
                        {course.grade && (
                          <p className="course-grade"><strong>Grade:</strong> {course.grade}</p>
                        )}
                        <p className="course-status">
                          <strong>Status:</strong>{' '}
                          <span className={`status-badge ${course.enrollmentStatus?.toLowerCase()}`}>
                            {course.enrollmentStatus}
                          </span>
                        </p>
                      </div>
                      <div className="course-actions">
                        <button
                          className="btn-view"
                          onClick={() => {
                            setSelectedCourse(course);
                            setActiveTab('materials');
                          }}
                        >
                          📚 View Materials
                        </button>
                        {isCurrentSemester && course.enrollmentStatus === 'Enrolled' && (
                          <button
                            className="btn-drop"
                            onClick={() => handleDropCourse(course.enrollmentId!)}
                          >
                            ❌ Drop Course
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No enrolled courses for this semester</p>
                    {isCurrentSemester && (
                      <button onClick={() => setActiveTab('available')}>
                        Browse Available Courses
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Available Courses Tab */}
            {activeTab === 'available' && (
              <div className="courses-grid">
                {availableCourses.length > 0 ? (
                  availableCourses.map((course) => (
                    <div key={course._id} className="course-card available">
                      <div className="course-header">
                        <h3>{course.courseName}</h3>
                        <span className="course-code">{course.courseCode}</span>
                      </div>
                      <div className="course-details">
                        <p><strong>Instructor:</strong> {course.instructorName || 'TBA'}</p>
                        <p><strong>Credits:</strong> {course.credits}</p>
                        <p><strong>Department:</strong> {course.department || 'N/A'}</p>
                        {course.description && <p className="course-description">{course.description}</p>}
                      </div>
                      <div className="course-actions">
                        <button
                          className="btn-enroll"
                          onClick={() => handleEnrollCourse(course._id)}
                        >
                          ➕ Enroll
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No available courses for enrollment</p>
                  </div>
                )}
              </div>
            )}

            {/* Course Materials Tab */}
            {activeTab === 'materials' && selectedCourse && (
              <div className="materials-section">
                <div className="materials-header">
                  <button className="btn-back" onClick={() => setActiveTab('enrolled')}>
                    ← Back to Courses
                  </button>
                  <h2>{selectedCourse.courseName} - Materials</h2>
                </div>

                <div className="materials-list">
                  {courseMaterials.length > 0 ? (
                    courseMaterials.map((material) => (
                      <div key={material._id} className="material-card">
                        <div className="material-header">
                          <span className={`material-type ${material.type.toLowerCase()}`}>
                            {material.type}
                          </span>
                          <h3>{material.title}</h3>
                        </div>
                        {material.description && (
                          <p className="material-description">{material.description}</p>
                        )}
                        <div className="material-meta">
                          <span>📅 {new Date(material.createdAt).toLocaleDateString()}</span>
                          {material.dueDate && (
                            <span className="due-date">
                              ⏰ Due: {new Date(material.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {material.fileUrl && (
                          <div className="material-actions">
                            <a
                              href={material.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-download"
                            >
                              📥 Download
                            </a>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No materials available for this course yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
