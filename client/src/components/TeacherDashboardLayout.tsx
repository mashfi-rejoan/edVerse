import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService, { User } from '../services/authService';
import { 
  LogOut, 
  Home, 
  BookOpen, 
  CalendarDays, 
  Users, 
  ClipboardCheck,
  FileText,
  DoorOpen,
  HeartPulse,
  Settings,
  BarChart3,
  UserCircle
} from 'lucide-react';

interface TeacherDashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const TeacherDashboardLayout = ({ children, title }: TeacherDashboardLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setProfilePhoto(localStorage.getItem('teacherProfilePhoto'));
    
    // Listen for profile photo updates
    const handlePhotoUpdate = () => {
      setProfilePhoto(localStorage.getItem('teacherProfilePhoto'));
    };
    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);
    return () => window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  const navItems = [
    { label: 'Dashboard', href: '/teacher', icon: <Home size={16} /> },
    { label: 'Classroom', href: '/teacher/classroom', icon: <BookOpen size={16} /> },
    { 
      label: 'Course Management', 
      href: '#', 
      icon: <ClipboardCheck size={16} />,
      subItems: [
        { label: 'Attendance', href: '/teacher/attendance', icon: <Users size={16} /> },
        { label: 'Marks Entry', href: '/teacher/marks', icon: <FileText size={16} /> },
        { label: 'Course Overview', href: '/teacher/courses', icon: <BarChart3 size={16} /> }
      ]
    },
    { label: 'Evaluation', href: '/teacher/evaluation', icon: <BarChart3 size={16} /> },
    { label: 'Room Booking', href: '/teacher/room-booking', icon: <DoorOpen size={16} /> },
    { label: 'Routine', href: '/teacher/routine', icon: <CalendarDays size={16} /> },
    { label: 'Blood Donation', href: '/teacher/blood-donation', icon: <HeartPulse size={16} /> }
  ];

  return (
    <div className="h-screen bg-light">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-primary text-white shadow-lg flex flex-col">
        <div className="bg-[#0C2B4E] px-4 py-8 flex flex-col items-center border-b border-white/10">
          <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden">
            <span className="text-2xl font-bold text-white/60">
              {user?.name?.charAt(0) || 'T'}
            </span>
          </div>
          <h3 className="text-white font-bold text-lg mt-3 text-center">{user?.name || 'Teacher'}</h3>
          <p className="text-white/60 text-sm">{user?.universityId || 'Teacher ID'}</p>
          <p className="text-white/50 text-xs mt-1">Teacher Portal</p>
        </div>

        <div className="px-4 pt-6 pb-4 flex-1 bg-[#070738] overflow-y-auto">
          <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-4">Main Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || 
                               (item.href !== '/teacher' && location.pathname.startsWith(item.href));
              
              if (item.subItems) {
                return (
                  <div key={item.label}>
                    <div className="px-3 py-2.5 text-white/75 text-sm font-semibold flex items-center gap-3">
                      <span className="flex items-center justify-center w-5 h-5">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.subItems.map((subItem) => {
                      const subActive = location.pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className={`ml-3 flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                            subActive
                              ? 'bg-white/15 text-white font-semibold shadow-sm'
                              : 'text-white/75 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center justify-center w-5 h-5">{subItem.icon}</span>
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                );
              }

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

        <div className="px-4 py-4 border-t border-white/10 bg-[#070738] mt-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/teacher/profile')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white/75 hover:bg-white/10 hover:text-white transition"
              title="Profile"
            >
              <UserCircle size={18} />
            </button>
            <button
              onClick={() => navigate('/teacher/settings')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white/75 hover:bg-white/10 hover:text-white transition"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white/75 hover:bg-white/10 hover:text-white transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
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

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboardLayout;
