import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './features/dashboards/StudentDashboard';
import TeacherDashboard from './features/dashboards/TeacherDashboard';
import AdminDashboard from './features/dashboards/AdminDashboard';
import ModeratorDashboard from './components/ModeratorDashboard';
import CafeteriaManagerDashboard from './components/CafeteriaManagerDashboard';
import LibrarianDashboard from './components/LibrarianDashboard';
import Courses from './features/courses/Courses';
import Attendance from './features/attendance/Attendance';
import Grades from './features/grades/Grades';
import Timetable from './features/timetable/Timetable';
import Assignments from './features/assignments/Assignments';
import Library from './features/library/Library';
import Complaints from './features/complaints/Complaints';
import BloodDonation from './features/blood-donation/BloodDonation';
import Settings from './features/settings/Settings';
import Chatbot from './components/Chatbot';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/courses"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/grades"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Grades />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/timetable"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Timetable />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/assignments"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Assignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/library"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Library />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/complaints"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Complaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/blood"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <BloodDonation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/settings"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Settings />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator"
          element={
            <ProtectedRoute allowedRoles={['moderator']}>
              <ModeratorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cafeteria-manager"
          element={
            <ProtectedRoute allowedRoles={['cafeteria-manager']}>
              <CafeteriaManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/librarian"
          element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <LibrarianDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
};

export default App;
