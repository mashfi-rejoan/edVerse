import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
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
} from '../../features/event-calendar/calendarUtils';

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

const categoryStyles: Record<CalendarEvent['category'], string> = {
  Event: 'bg-blue-100 text-blue-700',
  Holiday: 'bg-emerald-100 text-emerald-700',
  Exam: 'bg-red-100 text-red-700',
  Academic: 'bg-purple-100 text-purple-700',
  Notice: 'bg-amber-100 text-amber-700',
  Deadline: 'bg-slate-100 text-slate-700'
};

const emptyForm = {
  title: '',
  description: '',
  startDate: formatDateInput(new Date()),
  endDate: '',
  category: 'Event' as CalendarEvent['category'],
  location: '',
  allDay: true
};

const EventCalendar = () => {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const buildAuthHeaders = (includeJson = false) => {
    const token = authService.getAccessToken();
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    if (includeJson) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');

      const from = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
      const to = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);

      const response = await fetch(
        apiUrl(`/api/calendar/events?from=${formatDateInput(from)}&to=${formatDateInput(to)}`),
        {
          headers: buildAuthHeaders()
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

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    if (!editingId) {
      setFormData((prev) => ({
        ...prev,
        startDate: formatDateInput(date),
        endDate: prev.endDate || formatDateInput(date)
      }));
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      description: event.description || '',
      startDate: formatDateInput(new Date(event.startDate)),
      endDate: event.endDate ? formatDateInput(new Date(event.endDate)) : '',
      category: event.category,
      location: event.location || '',
      allDay: event.allDay !== false
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this event?');
    if (!confirmed) return;

    try {
      const response = await fetch(apiUrl(`/api/calendar/events/${id}`), {
        method: 'DELETE',
        headers: buildAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      if (editingId === id) {
        setEditingId(null);
        setFormData(emptyForm);
      }

      fetchEvents();
    } catch (err) {
      setError('Unable to delete event.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const payload = {
        ...formData,
        endDate: formData.endDate || undefined
      };

      const response = await fetch(
        apiUrl(editingId ? `/api/calendar/events/${editingId}` : '/api/calendar/events'),
        {
          method: editingId ? 'PUT' : 'POST',
          headers: buildAuthHeaders(true),
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      setEditingId(null);
      setFormData(emptyForm);
      fetchEvents();
    } catch (err) {
      setError('Unable to save event.');
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, startDate: formatDateInput(selectedDate), endDate: '' });
  };

  return (
    <div className="p-6 space-y-6">
        <PageHeader
          title="Calendar"
          subtitle="Manage campus-wide events and deadlines"
          icon={<CalendarDays size={24} className="text-white" />}
        />

        <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-6">
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

            <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mt-6">
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
                    onClick={() => handleSelectDate(day)}
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

            <div className="mt-6">
              {loading && <p className="text-sm text-gray-500">Loading events...</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>

          <div className="space-y-6">
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

              {selectedEvents.length === 0 && (
                <p className="text-sm text-gray-500">No events scheduled for this day.</p>
              )}

              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <div key={event._id} className="border border-gray-100 rounded-xl p-3">
                    <div className="flex items-center justify-between gap-2">
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
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Event Form</p>
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingId ? 'Update Event' : 'Create Event'}
                  </h3>
                </div>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as CalendarEvent['category'] }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    {Object.keys(categoryStyles).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg min-h-[90px]"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={formData.allDay}
                  onChange={(e) => setFormData((prev) => ({ ...prev, allDay: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                All day event
              </label>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {editingId ? 'Update Event' : 'Create Event'}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default EventCalendar;
