import { useState, useEffect, useRef } from 'react';
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
  UserCircle,
  Bell
} from 'lucide-react';
import edVerseLogo from '../assets/edverse-wordmark.svg';
import { apiUrl } from '../utils/apiBase';

interface TeacherDashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

interface UpcomingEvent {
  _id: string;
  title: string;
  startDate: string;
  endDate?: string;
  category: string;
}

const TeacherDashboardLayout = ({ children, title }: TeacherDashboardLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState('');
  const eventsRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setProfilePhoto(currentUser?.photoUrl ? apiUrl(currentUser.photoUrl) : null);
    
    // Listen for profile photo updates
    const handlePhotoUpdate = () => {
      const updatedUser = authService.getCurrentUser();
      setProfilePhoto(updatedUser?.photoUrl ? apiUrl(updatedUser.photoUrl) : null);
    };
    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);
    return () => window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
  }, []);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError('');
        const token = authService.getAccessToken();
        const today = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 45);

        const response = await fetch(
          apiUrl(`/api/calendar/events?from=${today.toISOString().slice(0, 10)}&to=${end.toISOString().slice(0, 10)}`),
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setUpcomingEvents(data.data || []);
      } catch (error) {
        setEventsError('Unable to load events.');
      } finally {
        setEventsLoading(false);
      }
    };

    fetchUpcomingEvents();
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
    { label: 'Dashboard', href: '/teacher', icon: <Home size={16} /> },
    { label: 'Classroom', href: '/teacher/classroom', icon: <BookOpen size={16} /> },
    { label: 'Course Overview', href: '/teacher/courses', icon: <BarChart3 size={16} /> },
    { label: 'Attendance', href: '/teacher/attendance', icon: <Users size={16} /> },
    { label: 'Marks Entry', href: '/teacher/marks', icon: <FileText size={16} /> },
    { label: 'Room Booking', href: '/teacher/room-booking', icon: <DoorOpen size={16} /> },
    { label: 'Calendar', href: '/teacher/calendar', icon: <CalendarDays size={16} /> },
    { label: 'Routine', href: '/teacher/routine', icon: <CalendarDays size={16} /> },
    { label: 'Blood Donation', href: '/teacher/blood-donation', icon: <HeartPulse size={16} /> }
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
                {user?.name?.charAt(0) || 'T'}
              </span>
            )}
          </div>
          <h3 className="text-white font-bold text-lg mt-3 text-center">{user?.name || 'Teacher'}</h3>
          <p className="text-white/60 text-sm">{user?.universityId || 'Teacher ID'}</p>
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
        <header className="bg-white border-b border-gray-200 px-8 h-14 sticky top-0 z-10">
          <div className="h-full grid grid-cols-3 items-center">
            <div className="flex items-center">
              <img
                src={edVerseLogo}
                alt="edVerse"
                className="h-12 w-auto"
              />
            </div>

            <div className="justify-self-center" />

            <div className="justify-self-end flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative" ref={eventsRef}>
                <button
                  onClick={() => setEventsOpen((open) => !open)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <CalendarDays size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-[#1D546C] rounded-full">
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
                      {eventsLoading && (
                        <p className="px-5 py-4 text-sm text-gray-500">Loading events...</p>
                      )}
                      {eventsError && !eventsLoading && (
                        <p className="px-5 py-4 text-sm text-red-500">{eventsError}</p>
                      )}
                      {!eventsLoading && !eventsError && upcomingEvents.length === 0 && (
                        <p className="px-5 py-4 text-sm text-gray-500">No upcoming events.</p>
                      )}
                      {!eventsLoading && !eventsError && upcomingEvents.map((event) => {
                        const start = new Date(event.startDate);
                        const end = event.endDate ? new Date(event.endDate) : null;
                        const dateLabel = end && event.endDate !== event.startDate
                          ? `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          : start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                        return (
                          <div
                            key={event._id}
                            className="px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-[#F8FAFC] transition"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{dateLabel}</p>
                              </div>
                              <span className="text-[10px] font-semibold text-[#0C2B4E] bg-[#E7F0FA] px-2 py-1 rounded-full border border-[#D6E4F5]">
                                {event.category}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-5 py-3 bg-[#F8FAFC] text-xs text-gray-500 flex items-center justify-between">
                      <span>Showing {upcomingEvents.length} upcoming items</span>
                      <button
                        onClick={() => navigate('/teacher/calendar')}
                        className="text-[#1A3D64] font-semibold hover:underline"
                      >
                        View Calendar
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
