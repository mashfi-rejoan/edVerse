import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './features/dashboards/StudentDashboard';
import TeacherDashboard from './features/dashboards/TeacherDashboard';
import AdminDashboard from './features/dashboards/AdminDashboard';

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
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cafeteria-manager"
          element={
            <ProtectedRoute allowedRoles={['cafeteria-manager']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/librarian"
          element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
