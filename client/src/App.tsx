import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './features/auth/Login';
import ForgotPassword from './features/auth/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './features/dashboards/StudentDashboard';
import TeacherDashboard from './features/dashboards/TeacherDashboard';
import AdminDashboard from './features/dashboards/AdminDashboard';
import ModeratorDashboard from './components/ModeratorDashboard';
import CafeteriaManagerDashboard from './components/CafeteriaManagerDashboard';
import LibrarianDashboard from './components/LibrarianDashboard';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminDashboardLayout from './components/AdminDashboardLayout';
import AdminDashboardPage from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';
import TeacherManagement from './pages/admin/TeacherManagement';
import StudentManagement from './pages/admin/StudentManagement';
import CourseManagement from './pages/admin/CourseManagement';
import SectionManagement from './pages/admin/SectionManagement';
import RoutineManagement from './pages/admin/RoutineManagement';
import AcademicCalendar from './pages/admin/AcademicCalendar';
import EventCalendar from './pages/admin/EventCalendar';
import RegistrationPortal from './pages/admin/RegistrationPortal';
import RegistrationOversight from './pages/admin/RegistrationOversight';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import AnnouncementManagement from './pages/admin/AnnouncementManagement';
import ExamScheduleManagement from './pages/admin/ExamScheduleManagement';
import GradeSubmissionTracker from './pages/admin/GradeSubmissionTracker';
import ReportGeneration from './pages/admin/ReportGeneration';
import CourseManagementFeature from './features/courses/CourseManagement';
import Attendance from './features/attendance/Attendance';
import Grades from './features/grades/Grades';
import Timetable from './features/timetable/Timetable';
import Achieve from './features/achieve/Achieve';
import Library from './features/library/Library';
import Cafeteria from './features/cafeteria/Cafeteria';
import Complaints from './features/complaints/Complaints';
import BloodDonation from './features/blood-donation/BloodDonation';
import Settings from './features/settings/Settings';
import StudentProfile from './features/student-profile/StudentProfile';
import Chatbot from './components/Chatbot';
import StudentClassroom from './features/student-classroom/Classroom';
import StudentEventCalendar from './features/event-calendar/StudentEventCalendar';

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
import TeacherEventCalendar from './features/event-calendar/TeacherEventCalendar';

const AdminShell = () => {
  return (
    <AdminDashboardLayout>
      <Outlet />
    </AdminDashboardLayout>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
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
          path="/student/classroom"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentClassroom />
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
          path="/student/calendar"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentEventCalendar />
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
        {/* NEW ADMIN PANEL ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminShell />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="teachers" element={<TeacherManagement />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="course-sections" element={<SectionManagement />} />
          <Route path="routine" element={<RoutineManagement />} />
          <Route path="academic-calendar" element={<AcademicCalendar />} />
          <Route path="calendar" element={<EventCalendar />} />
          <Route path="registration-settings" element={<RegistrationPortal />} />
          <Route path="registrations" element={<RegistrationOversight />} />
          <Route path="exams" element={<ExamScheduleManagement />} />
          <Route path="grade-submission" element={<GradeSubmissionTracker />} />
          <Route path="complaints" element={<ComplaintManagement />} />
          <Route path="announcements" element={<AnnouncementManagement />} />
          <Route path="rooms" element={<div className="p-6 text-center">Coming Soon - Room Management</div>} />
          <Route path="reports" element={<ReportGeneration />} />
        </Route>
        {/* END NEW ADMIN PANEL ROUTES */}

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
          path="/teacher/calendar"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherEventCalendar />
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
