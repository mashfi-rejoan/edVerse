import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import authService from '../../services/authService';
import { apiUrl } from '../../utils/apiBase';
import {
  addDays,
  formatDateInput,
  formatDisplayDate,
  formatMonthLabel,
  getCalendarDays,
  isDateInRange,
  isSameDay,
  toDateKey
} from './calendarUtils';

interface CalendarEvent {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  category: 'Event' | 'Holiday' | 'Exam' | 'Academic' | 'Notice' | 'Deadline';
  location?: string;
  allDay?: boolean;
}

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

interface EventCalendarViewProps {
  Layout: React.ComponentType<LayoutProps>;
  title?: string;
}

const categoryStyles: Record<CalendarEvent['category'], string> = {
  Event: 'bg-blue-100 text-blue-700',
  Holiday: 'bg-emerald-100 text-emerald-700',
  Exam: 'bg-red-100 text-red-700',
  Academic: 'bg-purple-100 text-purple-700',
  Notice: 'bg-amber-100 text-amber-700',
  Deadline: 'bg-slate-100 text-slate-700'
};

const EventCalendarView = ({ Layout, title = 'Calendar' }: EventCalendarViewProps) => {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const calendarDays = useMemo(() => getCalendarDays(viewDate), [viewDate]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    events.forEach((event) => {
      const start = new Date(event.startDate);
      const end = event.endDate ? new Date(event.endDate) : start;
      let cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      while (cursor <= last) {
        const key = toDateKey(cursor);
        const existing = map.get(key) || [];
        map.set(key, [...existing, event]);
        cursor = addDays(cursor, 1);
      }
    });

    return map;
  }, [events]);

  const selectedEvents = useMemo(() => {
    return events.filter((event) => isDateInRange(selectedDate, event.startDate, event.endDate));
  }, [events, selectedDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');

      const from = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
      const to = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
      const token = authService.getAccessToken();

      const response = await fetch(
        apiUrl(`/api/calendar/events?from=${formatDateInput(from)}&to=${formatDateInput(to)}`),
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.data || []);
    } catch (err) {
      setError('Unable to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [viewDate]);

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <Layout title={title}>
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-500">Monthly Overview</p>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-[#1A3D64]" />
                {formatMonthLabel(viewDate)}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewDate(new Date())}
                className="px-3 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {calendarDays.map((day) => {
                const dayKey = toDateKey(day);
                const dayEvents = eventsByDay.get(dayKey) || [];
                const isCurrentMonth = day.getMonth() === viewDate.getMonth();
                const isSelected = isSameDay(day, selectedDate);

                return (
                  <button
                    key={dayKey}
                    onClick={() => setSelectedDate(day)}
                    className={`h-24 rounded-xl border text-left p-2 transition ${
                      isSelected
                        ? 'border-[#1A3D64] bg-[#E7F0FA]'
                        : 'border-gray-100 hover:border-[#CBD5F5] hover:bg-[#F8FAFF]'
                    } ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    <div className="text-sm font-semibold">{day.getDate()}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <span
                          key={event._id}
                          className={`inline-flex w-2 h-2 rounded-full ${categoryStyles[event.category]}`}
                          title={event.title}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[10px] text-gray-400">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Selected Date</p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <span className="text-xs font-semibold text-gray-500">{selectedEvents.length} Events</span>
            </div>

            {loading && <p className="text-sm text-gray-500">Loading events...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && !error && selectedEvents.length === 0 && (
              <p className="text-sm text-gray-500">No events scheduled for this day.</p>
            )}

            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <div key={event._id} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">{event.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryStyles[event.category]}`}>
                      {event.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDisplayDate(event.startDate)}
                    {event.endDate && event.endDate !== event.startDate
                      ? ` - ${formatDisplayDate(event.endDate)}`
                      : ''}
                  </p>
                  {event.location && <p className="text-xs text-gray-500">{event.location}</p>}
                  {event.description && <p className="text-xs text-gray-600 mt-2">{event.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventCalendarView;
