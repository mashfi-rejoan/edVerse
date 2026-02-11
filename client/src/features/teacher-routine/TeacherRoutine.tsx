import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import TeacherDashboardLayout from '../../components/TeacherDashboardLayout';

const TeacherRoutine: React.FC = () => {
  const [routineData, setRoutineData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Mock routine data
  const mockRoutine = [
    {
      _id: '1',
      courseCode: 'CS201',
      courseName: 'Data Structures',
      section: '1',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      room: '204',
      building: 'Building A',
      instructor: 'Dr. Ahmed Khan'
    },
    {
      _id: '2',
      courseCode: 'CS210',
      courseName: 'Database Systems',
      section: '1',
      day: 'Monday',
      startTime: '11:00',
      endTime: '12:00',
      room: '301',
      building: 'Building A',
      instructor: 'Dr. Ahmed Khan'
    },
    {
      _id: '3',
      courseCode: 'CS201',
      courseName: 'Data Structures',
      section: '2',
      day: 'Wednesday',
      startTime: '14:00',
      endTime: '15:00',
      room: '204',
      building: 'Building A',
      instructor: 'Dr. Ahmed Khan'
    },
    {
      _id: '4',
      courseCode: 'CS210',
      courseName: 'Database Systems',
      section: '2',
      day: 'Tuesday',
      startTime: '10:00',
      endTime: '11:00',
      room: '301',
      building: 'Building A',
      instructor: 'Dr. Ahmed Khan'
    },
    {
      _id: '5',
      courseCode: 'CS301',
      courseName: 'Software Engineering',
      section: '1',
      day: 'Friday',
      startTime: '09:00',
      endTime: '10:00',
      room: '105',
      building: 'Building B',
      instructor: 'Dr. Ahmed Khan'
    }
  ];

  useEffect(() => {
    // Load from localStorage or use mock data
    const saved = localStorage.getItem('teacher_routine');
    if (saved) {
      setRoutineData(JSON.parse(saved));
    } else {
      setRoutineData(mockRoutine);
      localStorage.setItem('teacher_routine', JSON.stringify(mockRoutine));
    }
  }, []);

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const timeSlots = [
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '13:00', end: '14:00', isBreak: true },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' }
  ];

  const to12Hour = (time: string) => {
    const [hour, min] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const adjusted = hour % 12 || 12;
    return `${adjusted.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${period}`;
  };

  const formatRange = (start: string, end: string) => `${to12Hour(start)} - ${to12Hour(end)}`;

  const getClassForSlot = (day: string, startTime: string) =>
    routineData.find((item) => item.day === day && item.startTime === startTime);

  const courseColorPool = [
    'bg-blue-50 border-blue-200 text-blue-900',
    'bg-emerald-50 border-emerald-200 text-emerald-900',
    'bg-purple-50 border-purple-200 text-purple-900',
    'bg-amber-50 border-amber-200 text-amber-900',
    'bg-rose-50 border-rose-200 text-rose-900',
    'bg-indigo-50 border-indigo-200 text-indigo-900'
  ];

  const getCourseStyle = (code: string) => {
    const index = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % courseColorPool.length;
    return courseColorPool[index];
  };

  const isCurrentSlot = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    return current >= startMin && current < endMin;
  };

  // Group classes by day for weekly view
  const weeklyRoutine: { [key: string]: any[] } = {};
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  daysOfWeek.forEach(day => {
    weeklyRoutine[day] = routineData.filter(item => item.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return (
    <TeacherDashboardLayout title="Teaching Schedule">
      <div className="space-y-6">
        {/* Header Panel */}
        <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <Calendar size={40} className="text-blue-300 flex-shrink-0" />
            <div>
              <h1 className="text-3xl font-bold mb-1">Teaching Schedule</h1>
              <p className="text-blue-100">View your weekly routine and today's classes</p>
            </div>
          </div>
        </div>


        {/* Weekly Routine Table */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Weekly Routine</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">Break</span>
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">Current Slot</span>
              <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold">Free</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-[980px] w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] text-white">
                  <th className="text-left text-sm font-semibold px-4 py-3">Day</th>
                  {timeSlots.map((slot) => (
                    <th key={slot.start} className="text-left text-sm font-semibold px-4 py-3">
                      {slot.isBreak ? 'Break' : formatRange(slot.start, slot.end)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map((day, index) => {
                  const isSelectedDay = day === getDayName(selectedDate);
                  return (
                    <tr key={day} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className={`px-4 py-4 text-sm font-bold ${isSelectedDay ? 'text-[#0C2B4E]' : 'text-gray-700'}`}>
                        {day}
                      </td>
                      {timeSlots.map((slot) => {
                        if (slot.isBreak) {
                          return (
                            <td key={`${day}-${slot.start}`} className="px-4 py-4">
                              <div className="rounded-lg bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-2 text-center">
                                01:00 PM - 02:00 PM
                              </div>
                            </td>
                          );
                        }

                        const classItem = getClassForSlot(day, slot.start);
                        const isNow = isSelectedDay && isCurrentSlot(slot.start, slot.end);

                        if (!classItem) {
                          return (
                            <td key={`${day}-${slot.start}`} className="px-4 py-4">
                              <div className={`rounded-lg border border-dashed border-gray-200 text-gray-400 text-xs font-semibold px-3 py-2 text-center ${isNow ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50'}`}>
                                Free
                              </div>
                            </td>
                          );
                        }

                        const colorStyle = getCourseStyle(classItem.courseCode);
                        return (
                          <td key={`${day}-${slot.start}`} className="px-4 py-4">
                            <div className={`rounded-lg border px-3 py-3 shadow-sm ${colorStyle} ${isNow ? 'ring-2 ring-green-300' : ''}`}>
                              <p className="text-sm font-bold">{classItem.courseCode}</p>
                              <p className="text-xs font-semibold mt-1">{classItem.courseName}</p>
                              <p className="text-xs mt-1">Section {classItem.section}</p>
                              <p className="text-xs mt-1">Room {classItem.room}</p>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </TeacherDashboardLayout>
  );
};

export default TeacherRoutine;
