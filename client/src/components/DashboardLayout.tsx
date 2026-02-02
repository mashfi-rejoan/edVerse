import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService, { User } from '../services/authService';
import { LogOut, Bell, Home, BookOpen, CalendarDays, BarChart3, ClipboardList, Library, MessageSquare, HeartPulse, Settings, Trophy, UtensilsCrossed, UserCircle } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(
    localStorage.getItem('studentProfilePhoto')
  );
  const [eventsOpen, setEventsOpen] = useState(false);
  const eventsRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const upcomingEvents = [
    { title: 'Spring Cultural Night', date: 'Feb 08, 2026', type: 'Cultural Program' },
    { title: 'Tech Conference 2026', date: 'Feb 18, 2026', type: 'Conference' },
    { title: '2nd Installment Due', date: 'Feb 12, 2026', type: 'Installment' },
    { title: 'Midterm Examination', date: 'Feb 13 - Feb 20, 2026', type: 'Exam' },
    { title: 'Shab-e-Barat Holiday', date: 'Feb 04, 2026', type: 'Holiday' },
    { title: 'Final Examination', date: 'Apr 23 - Apr 30, 2026', type: 'Exam' },
  ];

  useEffect(() => {
    setUser(authService.getCurrentUser());
    const handlePhotoUpdate = () => {
      setProfilePhoto(localStorage.getItem('studentProfilePhoto'));
    };
    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);
    return () => window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (eventsRef.current && !eventsRef.current.contains(event.target as Node)) {
        setEventsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  const navItems = [
    { label: 'Dashboard', href: '/student', icon: <Home size={16} /> },
    { label: 'Registration', href: '/student/courses', icon: <BookOpen size={16} /> },
    { label: 'Courses', href: '/student/my-courses', icon: <BookOpen size={16} /> },
    { label: 'Routine', href: '/student/timetable', icon: <CalendarDays size={16} /> },
    { label: 'Attendance', href: '/student/attendance', icon: <BarChart3 size={16} /> },
    { label: 'Assignments', href: '/student/assignments', icon: <ClipboardList size={16} /> },
    { label: 'Achieve', href: '/student/achieve', icon: <Trophy size={16} /> },
    { label: 'Library', href: '/student/library', icon: <Library size={16} /> },
    { label: 'Cafeteria', href: '/student/cafeteria', icon: <UtensilsCrossed size={16} /> },
    { label: 'Blood Donation', href: '/student/blood', icon: <HeartPulse size={16} /> },
    { label: 'Complaints', href: '/student/complaints', icon: <MessageSquare size={16} /> }
  ];

  return (
    <div className="h-screen bg-light">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-primary text-white shadow-lg flex flex-col">
        <div className="bg-[#0C2B4E] px-4 py-8 flex flex-col items-center border-b border-white/10">
          <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-white/60">
                {user?.name?.charAt(0) || 'S'}
              </span>
            )}
          </div>
          <p className="mt-4 text-base font-semibold text-white">{user?.name || 'Student Name'}</p>
          <p className="text-sm text-white/70">{user?.universityId || 'Student ID'}</p>
        </div>

        <div className="px-4 pt-6 pb-4 flex-1 bg-[#070738] overflow-y-auto">
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

        <div className="px-4 py-4 border-t border-white/10 bg-[#070738] mt-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/student/profile')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white/75 hover:bg-white/10 hover:text-white transition"
              title="Profile"
            >
              <UserCircle size={18} />
            </button>
            <button
              onClick={() => navigate('/student/settings')}
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

      {/* Main Content Area */}
      <div className="ml-64 h-screen flex flex-col min-w-0">
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

              <div className="relative pl-4 border-l border-gray-200" ref={eventsRef}>
                <button
                  onClick={() => setEventsOpen((open) => !open)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#F4F6FA] hover:bg-[#EAF0F7] border border-[#E2E8F0] shadow-sm transition"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0C2B4E]/10 flex items-center justify-center">
                    <CalendarDays size={16} className="text-[#0C2B4E]" />
                  </div>
                  <span className="text-sm font-semibold text-[#0C2B4E]">Events</span>
                  <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-[#1D546C] rounded-full">
                    {upcomingEvents.length}
                  </span>
                </button>

                {eventsOpen && (
                  <div className="absolute right-0 mt-3 w-96 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-5 py-4 bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64]">
                      <p className="text-sm font-semibold text-white">Upcoming Events</p>
                      <p className="text-xs text-white/80">Admin announcements & academic calendar</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto bg-white">
                      {upcomingEvents.map((event, index) => (
                        <div
                          key={index}
                          className="px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-[#F8FAFC] transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                            </div>
                            <span className="text-[10px] font-semibold text-[#0C2B4E] bg-[#E7F0FA] px-2 py-1 rounded-full border border-[#D6E4F5]">
                              {event.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-5 py-3 bg-[#F8FAFC] text-xs text-gray-500">
                      Showing {upcomingEvents.length} upcoming items
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-8 py-6 overflow-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
