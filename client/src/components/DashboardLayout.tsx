import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import authService, { User } from '../services/authService';
import { LogOut, Bell, Home, BookOpen, CalendarDays, BarChart3, ClipboardList, Library, MessageSquare, HeartPulse, Settings } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  const navItems = [
    { label: 'Dashboard', href: '/student', icon: <Home size={16} /> },
    { label: 'Courses', href: '/student/courses', icon: <BookOpen size={16} /> },
    { label: 'Attendance', href: '/student/attendance', icon: <CalendarDays size={16} /> },
    { label: 'Grades', href: '/student/grades', icon: <BarChart3 size={16} /> },
    { label: 'Timetable', href: '/student/timetable', icon: <CalendarDays size={16} /> },
    { label: 'Assignments', href: '/student/assignments', icon: <ClipboardList size={16} /> },
    { label: 'Library', href: '/student/library', icon: <Library size={16} /> },
    { label: 'Complaints', href: '/student/complaints', icon: <MessageSquare size={16} /> },
    { label: 'Blood Donation', href: '/student/blood', icon: <HeartPulse size={16} /> },
    { label: 'Settings', href: '/student/settings', icon: <Settings size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-light flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white shadow-lg flex-shrink-0 flex flex-col">
        <div className="bg-[#0C2B4E] px-4 py-8 flex flex-col items-center border-b border-white/10">
          <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-white/60">
              {user?.name?.charAt(0) || 'S'}
            </span>
          </div>
          <p className="mt-4 text-base font-semibold text-white">{user?.name || 'Student Name'}</p>
          <p className="text-sm text-white/70">{user?.universityId || 'Student ID'}</p>
        </div>

        <div className="px-4 pt-6 pb-4 flex-1 bg-[#070738]">
          <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-4">Main Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/student' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                    isActive 
                      ? 'bg-white/15 text-white font-semibold shadow-sm' 
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center justify-center w-5 h-5">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-4 py-4 border-t border-white/10 bg-[#070738]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/75 hover:bg-white/10 hover:text-white transition w-full"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-primary">edVerse</h1>
              <span className="text-sm text-gray-400 font-medium">{title}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {user?.name?.charAt(0) || 'S'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-8 py-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
