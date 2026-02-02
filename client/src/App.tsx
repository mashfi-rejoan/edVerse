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
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminDashboardPage from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';
import TeacherManagement from './pages/admin/TeacherManagement';
import StudentManagement from './pages/admin/StudentManagement';
import CourseManagement from './pages/admin/CourseManagement';
import CourseManagementFeature from './features/courses/CourseManagement';
import Courses from './features/courses/Courses';
import Attendance from './features/attendance/Attendance';
import Grades from './features/grades/Grades';
import Timetable from './features/timetable/Timetable';
import Assignments from './features/assignments/Assignments';
import Achieve from './features/achieve/Achieve';
import Library from './features/library/Library';
import Cafeteria from './features/cafeteria/Cafeteria';
import Complaints from './features/complaints/Complaints';
import BloodDonation from './features/blood-donation/BloodDonation';
import Settings from './features/settings/Settings';
import StudentProfile from './features/student-profile/StudentProfile';
import Chatbot from './components/Chatbot';

// Teacher Components
import TeacherDashboardMain from './features/teacher-dashboard/TeacherDashboard';
import AttendanceManager from './features/teacher-attendance/AttendanceManager';
import MarksManager from './features/teacher-marks/MarksManager';
import CourseOverview from './features/teacher-courses/CourseOverview';
import Classroom from './features/teacher-classroom/Classroom';
import RoomBooking from './features/teacher-room-booking/RoomBooking';
import TeacherRoutine from './features/teacher-routine/TeacherRoutine';
import BloodDonationTeacher from './features/teacher-blood-donation/BloodDonation';
import TeacherSettings from './features/teacher-settings/TeacherSettings';
import TeacherProfile from './features/teacher-profile/TeacherProfile';

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
              <CourseManagementFeature />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-courses"
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
          path="/student/achieve"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Achieve />
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
          path="/student/cafeteria"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Cafeteria />
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
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        
        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboardMain />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/attendance"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <AttendanceManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/marks"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <MarksManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/courses"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <CourseOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/classroom"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Classroom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/room-booking"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <RoomBooking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/routine"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherRoutine />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/blood-donation"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <BloodDonationTeacher />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/settings"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherProfile />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect /admin to new dashboard */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* NEW ADMIN PANEL ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedAdminRoute>
              <AdminProfile />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedAdminRoute>
              <AdminSettings />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/teachers"
          element={
            <ProtectedAdminRoute>
              <TeacherManagement />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedAdminRoute>
              <StudentManagement />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedAdminRoute>
              <CourseManagement />
            </ProtectedAdminRoute>
          }
        />

        {/* Placeholder routes for remaining admin modules - to be implemented in later phases */}
        <Route
          path="/admin/course-sections"
          element={
            <ProtectedAdminRoute>
              <div className="p-6 text-center">Coming Soon - Sections Management</div>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/routine"
          element={
            <ProtectedAdminRoute>
              <div className="p-6 text-center">Coming Soon - Routine Management</div>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/academic-calendar"
          element={
            <ProtectedAdminRoute>
              <div className="p-6 text-center">Coming Soon - Academic Calendar</div>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/registration-settings"
          element={
            <ProtectedAdminRoute>
              <div className="p-6 text-center">Coming Soon - Registration Portal</div>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/registrations"
          element={
            <ProtectedAdminRoute>
              <div className="p-6 text-center">Coming Soon - Registration Oversight</div>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/exams"
          element={
            <ProtectedAdminRoute>
              <div className="p-6 text-center">Coming Soon - Exam Schedule</div>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/grade-submission"
          element={
            <ProtectedAdminRoute>
              <div className="p-6 text-center">Coming Soon - Grade Submission</div>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedAdminRoute>
              <div className="p-6 text-center">Coming Soon - Complaint Management</div>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/announcements"
          element={
            <ProtectedAdminRoute>
              <div className="p-6 text-center">Coming Soon - Announcement Management</div>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/rooms"
          element={
            <ProtectedAdminRoute>
              <div className="p-6 text-center">Coming Soon - Room Management</div>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedAdminRoute>
              <div className="p-6 text-center">Coming Soon - Reports</div>
            </ProtectedAdminRoute>
          }
        />
        {/* END NEW ADMIN PANEL ROUTES */}

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
