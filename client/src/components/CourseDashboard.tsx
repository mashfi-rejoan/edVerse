import React, { useEffect, useState } from 'react';
import './CourseDashboard.css';
import { getSemesterCourses, addCourse, dropCourse, retakeCourse, getEnrollmentHistory, getCourseCapacity } from '../utils/apiBase';

const theme = {
  primary: '#1D546C',
  secondary: '#1A3D64',
  accent: '#0C2B4E',
  light: '#F4F4F4',
  white: '#FFFFFF',
};

function CapacityIndicator({ fillRatio, status }) {
  let color = theme.primary;
  if (status === 'Full') color = '#B91C1C';
  else if (status === 'Almost Full') color = '#F59E42';
  else if (status === 'Available') color = '#059669';
  return (
    <div className="capacity-indicator" style={{ color }}>
      <strong>Capacity:</strong> <span>{status}</span> <span style={{ marginLeft: 8 }}>[{Math.round(fillRatio * 100)}%]</span>
    </div>
  );
}

export default function CourseDashboard({ studentId, semesterId }) {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [courseRes, enrollRes, histRes] = await Promise.all([
        getSemesterCourses(semesterId, studentId),
        getEnrollmentHistory(studentId),
        getSemesterCourses(semesterId)
      ]);
      setCourses(courseRes.courses || []);
      setEnrollments(courseRes.enrollments || []);
      setHistory(histRes.history || []);
      setLoading(false);
    }
    fetchData();
  }, [studentId, semesterId]);

  async function handleAdd(courseId) {
    setActionMsg('');
    const res = await addCourse(studentId, courseId, semesterId);
    setActionMsg(res.message);
  }
  async function handleDrop(courseId) {
    setActionMsg('');
    const res = await dropCourse(studentId, courseId, semesterId);
    setActionMsg(res.message);
  }
  async function handleRetake(courseId) {
    setActionMsg('');
    const res = await retakeCourse(studentId, courseId, semesterId);
    setActionMsg(res.message);
  }

  return (
    <div className="course-dashboard" style={{ background: theme.light, color: theme.primary }}>
      <h2 style={{ color: theme.accent }}>Course Management</h2>
      {actionMsg && <div className="action-msg">{actionMsg}</div>}
      {loading ? <div>Loading...</div> : (
        <>
          <section className="course-list">
            <h3>Available Courses</h3>
            <table className="course-table">
              <thead>
                <tr style={{ background: theme.secondary, color: theme.white }}>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Credits</th>
                  <th>Capacity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id}>
                    <td>{course.code}</td>
                    <td>{course.title}</td>
                    <td>{course.credits}</td>
                    <td>
                      <CapacityIndicator fillRatio={course.fillRatio} status={course.status} />
                    </td>
                    <td>
                      <button className="add-btn" onClick={() => handleAdd(course._id)} disabled={course.status === 'Full'}>Add</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="enrollment-list">
            <h3>Current Enrollments</h3>
            <table className="enrollment-table">
              <thead>
                <tr style={{ background: theme.secondary, color: theme.white }}>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Credits</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map(enr => (
                  <tr key={enr._id}>
                    <td>{enr.course.code}</td>
                    <td>{enr.course.title}</td>
                    <td>{enr.status}</td>
                    <td>{enr.course.credits}</td>
                    <td>
                      <button className="drop-btn" onClick={() => handleDrop(enr.course._id)} disabled={enr.status === 'Dropped'}>Drop</button>
                      <button className="retake-btn" onClick={() => handleRetake(enr.course._id)} disabled={enr.status !== 'Completed'}>Retake</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="history-list">
            <h3>Enrollment History</h3>
            <table className="history-table">
              <thead>
                <tr style={{ background: theme.secondary, color: theme.white }}>
                  <th>Semester</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Credits</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {history.map(sem => (
                  sem.courses.map(c => (
                    <tr key={sem.semester._id + '-' + c.courseId}>
                      <td>{sem.semester.name}</td>
                      <td>{c.code} - {c.title}</td>
                      <td>{c.status}</td>
                      <td>{c.credits}</td>
                      <td>{c.grade || '-'}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
