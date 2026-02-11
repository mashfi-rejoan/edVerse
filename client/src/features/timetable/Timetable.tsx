import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { CalendarDays } from 'lucide-react';

interface ClassItem {
  course: string;
  courseCode: string;
  time: string;
  room: string;
  roomCode: string;
  instructor: string;
  instructorCode: string;
}

interface DaySchedule {
  day: string;
  date: number;
  classes: ClassItem[];
}

const Timetable = () => {
    // Get current semester based on month
    const getCurrentSemester = () => {
      const now = new Date();
      const month = now.getMonth() + 1; // 1-12
      const year = now.getFullYear();
      
      // Spring: January-May, Fall: August-December
      if (month >= 1 && month <= 5) {
        return `Spring ${year}`;
      } else {
        return `Fall ${year}`;
      }
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

    const to24Hour = (timeLabel: string) => {
      const [timePart, periodRaw] = timeLabel.trim().split(' ');
      const period = periodRaw.toUpperCase();
      let [hour, min] = timePart.split(':').map(Number);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      return { hour, min };
    };

    const getSlotKey = (timeLabel: string) => {
      const { hour } = to24Hour(timeLabel);
      return `${hour.toString().padStart(2, '0')}:00`;
    };

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

  const [schedule] = useState<DaySchedule[]>([
    {
      day: 'Sunday',
      date: 3,
      classes: [
        {
          course: 'Database Systems',
          courseCode: 'CSE 207',
          time: '1:30 PM - 2:45 PM',
          room: '2',
          roomCode: 'S20',
          instructor: 'Farha Akter Munmun',
          instructorCode: 'FAM',
        },
        {
          course: 'Computer Architecture',
          courseCode: 'CSE 215',
          time: '2:45 PM - 4 PM',
          room: '2',
          roomCode: 'S20',
          instructor: 'Sworna Akter',
          instructorCode: 'SRA',
        },
        {
          course: 'Algorithm',
          courseCode: 'CSE 231',
          time: '4 PM - 5:15 PM',
          room: '2',
          roomCode: 'S16',
          instructor: 'Ilisha Nowrin',
          instructorCode: 'IN',
        }
      ]
    },
    {
      day: 'Monday',
      date: 2,
      classes: [
        {
          course: 'Complex Variables and Statistics',
          courseCode: 'MAT 231',
          time: '11:45 AM - 1:00 PM',
          room: '2',
          roomCode: 'S18',
          instructor: 'Md. Khabir Islam',
          instructorCode: '',
        },
        {
          course: 'Operating Systems LAB',
          courseCode: 'CSE 210',
          time: '1:30 PM - 4:00 PM',
          room: '2',
          roomCode: 'S17',
          instructor: 'Samoon Al Razi Oman',
          instructorCode: '',
        }
      ]
    },
    {
      day: 'Tuesday',
      date: 2,
      classes: [
        {
          course: 'Database Systems',
          courseCode: 'CSE 207',
          time: '2:45 PM - 4:00 PM',
          room: '2',
          roomCode: '710',
          instructor: 'Farha Akter Munmun',
          instructorCode: 'FAM',
        },
        {
          course: 'Algorithms LAB',
          courseCode: 'CSE 232',
          time: '4:00 PM - 6:30 PM',
          room: '2',
          roomCode: 'S18',
          instructor: 'Ilisha Nowrin',
          instructorCode: 'IN',
        }
      ]
    },
    {
      day: 'Wednesday',
      date: 3,
      classes: [
        {
          course: 'Algorithm',
          courseCode: 'CSE 231',
          time: '9:15 AM - 10:30 AM',
          room: '2',
          roomCode: 'S16',
          instructor: 'Ilisha Nowrin',
          instructorCode: 'IN',
        },
        {
          course: 'Operating Systems',
          courseCode: 'CSE 209',
          time: '10:30 AM - 11:45 AM',
          room: '2',
          roomCode: 'S16',
          instructor: 'Rafid Nahiyan Farabi',
          instructorCode: 'RNF',
        },
        {
          course: 'Computer Architecture',
          courseCode: 'CSE 215',
          time: '11:45 AM - 1:00 PM',
          room: '2',
          roomCode: 'S16',
          instructor: 'Sworna Akter',
          instructorCode: 'SRA',
        }
      ]
    },
    {
      day: 'Thursday',
      date: 3,
      classes: [
        {
          course: 'Complex Variables and Statistics',
          courseCode: 'MAT 231',
          time: '8:00 AM - 9:15 AM',
          room: '3',
          roomCode: '802',
          instructor: 'Md. Khabir Islam',
          instructorCode: '',
        },
        {
          course: 'Operating Systems',
          courseCode: 'CSE 209',
          time: '9:15 AM - 10:30 AM',
          room: '2',
          roomCode: '710',
          instructor: 'Samoon Al Razi Oman',
          instructorCode: '',
        },
        {
          course: 'Database Systems LAB',
          courseCode: 'CSE 208',
          time: '10:30 AM - 1:00 PM',
          room: '2',
          roomCode: '218',
          instructor: 'Farha Akter Munmun',
          instructorCode: 'FAM',
        }
      ]
    }
  ]);

  const routineData = schedule.flatMap((daySchedule) =>
    daySchedule.classes.map((item) => {
      const [startLabel, endLabel] = item.time.split('-').map((part) => part.trim());
      return {
        day: daySchedule.day,
        courseCode: item.courseCode,
        courseName: item.course,
        room: `${item.room}${item.roomCode ? ` | ${item.roomCode}` : ''}`,
        instructor: item.instructor,
        timeRange: item.time,
        slotKey: getSlotKey(startLabel),
        startLabel,
        endLabel
      };
    })
  );

  const getClassForSlot = (day: string, slotStart: string) =>
    routineData.find((item) => item.day === day && item.slotKey === slotStart);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <DashboardLayout title="Timetable">
      <div className="space-y-6">
        {/* Header Panel */}
        <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <CalendarDays size={40} className="text-blue-300 flex-shrink-0" />
            <div>
              <h1 className="text-3xl font-bold mb-1">Class Schedule</h1>
              <p className="text-blue-100">Weekly routine for {getCurrentSemester()}</p>
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
                  const isSelectedDay = day === todayName;
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
                              <p className="text-xs mt-1">Room {classItem.room}</p>
                              <p className="text-xs mt-1">{classItem.instructor}</p>
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
    </DashboardLayout>
  );
};

export default Timetable;
