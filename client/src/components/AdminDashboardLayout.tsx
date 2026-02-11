import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService, { User } from '../services/authService';
import edVerseLogo from '../assets/edverse-wordmark.svg';
import {
  LogOut,
  Home,
  BookOpen,
  Users,
  Settings,
  BarChart3,
  Calendar,
  ClipboardList,
  AlertCircle,
  Zap,
  MessageSquare,
  DoorOpen,
  Shield,
  Menu,
  X
} from 'lucide-react';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminDashboardLayout = ({ children, title = 'Admin Panel' }: AdminDashboardLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <Home size={16} /> },
    { label: 'Teachers', href: '/admin/teachers', icon: <Users size={16} /> },
    { label: 'Students', href: '/admin/students', icon: <BookOpen size={16} /> },
    { label: 'Courses', href: '/admin/courses', icon: <ClipboardList size={16} /> },
    { label: 'Sections', href: '/admin/course-sections', icon: <Zap size={16} /> },
    { label: 'Routine', href: '/admin/routine', icon: <Calendar size={16} /> },
    { label: 'Academic Calendar', href: '/admin/academic-calendar', icon: <Calendar size={16} /> },
    { label: 'Calendar', href: '/admin/calendar', icon: <Calendar size={16} /> },
    { label: 'Registration', href: '/admin/registration-settings', icon: <ClipboardList size={16} /> },
    { label: 'Registrations', href: '/admin/registrations', icon: <BarChart3 size={16} /> },
    { label: 'Exams', href: '/admin/exams', icon: <AlertCircle size={16} /> },
    { label: 'Complaints', href: '/admin/complaints', icon: <MessageSquare size={16} /> },
    { label: 'Announcements', href: '/admin/announcements', icon: <Zap size={16} /> },
    { label: 'Rooms', href: '/admin/rooms', icon: <DoorOpen size={16} /> },
    { label: 'Reports', href: '/admin/reports', icon: <BarChart3 size={16} /> }
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#1a1f3a] text-white shadow-xl flex flex-col transition-all ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-40`}
      >
        {/* Logo Section */}
        <div className="bg-[#0f1322] px-6 py-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Shield size={22} className="text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Admin</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="px-4 pt-6 pb-4 flex-1 overflow-y-auto" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent'
        }}>
          <style>{`
            .sidebar-scroll::-webkit-scrollbar {
              width: 4px;
            }
            .sidebar-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .sidebar-scroll::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
            }
            .sidebar-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }
          `}</style>
          <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-3 px-3">Main Menu</p>
          <nav className="space-y-1 sidebar-scroll">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/30'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center justify-center w-5 h-5">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel - Settings & Logout */}
        <div className="px-4 py-4 border-t border-white/5 bg-[#0f1322]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/settings')}
              className="flex-1 flex items-center justify-center p-3 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-all"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center p-3 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-64 w-full min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-800"
              >
                <Menu size={24} />
              </button>
              <img
                src={edVerseLogo}
                alt="edVerse"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                <p className="text-xs text-gray-500 mt-0.5">CSE Department • BSc Program</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:block">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboardLayout;
