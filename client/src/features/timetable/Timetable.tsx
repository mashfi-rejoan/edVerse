import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';

interface ScheduleItem {
  day: string;
  time: string;
  course: string;
  courseCode: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  instructor: string;
}

const Timetable = () => {
  const [selectedDay, setSelectedDay] = useState('All');
  const [schedule] = useState<ScheduleItem[]>([
    {
      day: 'Monday',
      time: '09:00 - 10:00',
      course: 'Data Structures',
      courseCode: 'CS201',
      room: 'A-204',
      type: 'Lecture',
      instructor: 'Dr. Sarah Johnson'
    },
    {
      day: 'Monday',
      time: '14:00 - 15:30',
      course: 'Computer Networks',
      courseCode: 'CS230',
      room: 'B-105',
      type: 'Lecture',
      instructor: 'Dr. Emily Rodriguez'
    },
    {
      day: 'Tuesday',
      time: '11:00 - 12:30',
      course: 'Database Systems',
      courseCode: 'CS210',
      room: 'Lab-3',
      type: 'Lab',
      instructor: 'Prof. Michael Chen'
    },
    {
      day: 'Tuesday',
      time: '14:00 - 16:00',
      course: 'Operating Systems',
      courseCode: 'CS240',
      room: 'A-301',
      type: 'Lecture',
      instructor: 'Prof. David Williams'
    },
    {
      day: 'Wednesday',
      time: '09:00 - 10:00',
      course: 'Data Structures',
      courseCode: 'CS201',
      room: 'A-204',
      type: 'Lecture',
      instructor: 'Dr. Sarah Johnson'
    },
    {
      day: 'Wednesday',
      time: '14:00 - 15:30',
      course: 'Computer Networks',
      courseCode: 'CS230',
      room: 'B-105',
      type: 'Lecture',
      instructor: 'Dr. Emily Rodriguez'
    },
    {
      day: 'Thursday',
      time: '11:00 - 12:30',
      course: 'Database Systems',
      courseCode: 'CS210',
      room: 'Lab-3',
      type: 'Tutorial',
      instructor: 'Prof. Michael Chen'
    },
    {
      day: 'Thursday',
      time: '14:00 - 16:00',
      course: 'Operating Systems',
      courseCode: 'CS240',
      room: 'A-301',
      type: 'Lecture',
      instructor: 'Prof. David Williams'
    },
    {
      day: 'Friday',
      time: '09:00 - 10:00',
      course: 'Data Structures',
      courseCode: 'CS201',
      room: 'A-204',
      type: 'Tutorial',
      instructor: 'Dr. Sarah Johnson'
    }
  ]);

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredSchedule = selectedDay === 'All'
    ? schedule
    : schedule.filter(item => item.day === selectedDay);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Lecture':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Lab':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Tutorial':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCurrentDay = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[new Date().getDay()];
  };

  const todayClasses = schedule.filter(item => item.day === getCurrentDay());

  return (
    <DashboardLayout title="Timetable">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Class Schedule</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon size={18} />
            <span>Current Semester</span>
          </div>
        </div>

        {/* Today's Classes */}
        {todayClasses.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Today's Classes ({getCurrentDay()})</h2>
            <div className="space-y-3">
              {todayClasses.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <Clock className="text-blue-600 mb-1" size={20} />
                      <span className="text-xs font-medium text-gray-600">{item.time}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.course}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-600">{item.courseCode}</span>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin size={14} />
                          {item.room}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day Filter */}
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedDay === day
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSchedule.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">{item.day}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.course}</h3>
                  <p className="text-sm text-gray-600">{item.courseCode}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>{item.time}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>Room {item.room}</span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Instructor:</span> {item.instructor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSchedule.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <CalendarIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No classes scheduled for {selectedDay}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Timetable;
