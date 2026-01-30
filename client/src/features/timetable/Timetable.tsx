import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Clock, MapPin } from 'lucide-react';

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

    // Color mapping for each unique course
    const courseColors: { [key: string]: string } = {
      'CSE 207': 'bg-purple-100 border-purple-300',
      'CSE 215': 'bg-red-100 border-red-300',
      'CSE 231': 'bg-pink-100 border-pink-300',
      'MAT 231': 'bg-indigo-100 border-indigo-300',
      'CSE 210': 'bg-blue-100 border-blue-300',
      'CSE 232': 'bg-cyan-100 border-cyan-300',
      'CSE 209': 'bg-teal-100 border-teal-300',
      'CSE 208': 'bg-emerald-100 border-emerald-300',
    };

    const getCourseColor = (courseCode: string) => {
      return courseColors[courseCode] || 'bg-gray-100 border-gray-300';
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

  return (
    <DashboardLayout title="Timetable">
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0C2B4E]">Class Schedule | {getCurrentSemester()}</h1>
          <p className="text-gray-600 mt-2">Your weekly class timetable</p>
        </div>

        {/* Weekly Schedule Grid */}
        <div className="grid grid-cols-5 gap-4">
          {schedule.map((daySchedule, dayIndex) => (
            <div key={dayIndex} className="flex flex-col">
              {/* Day Header */}
              <div className="bg-[#0C2B4E] text-white rounded-t-lg p-4 text-center">
                <div className="font-semibold text-lg">{daySchedule.day}</div>
                <div className="text-sm opacity-90">{daySchedule.date}</div>
              </div>

              {/* Classes for the day */}
              <div className="space-y-3 mt-3">
                {daySchedule.classes.map((classItem, classIndex) => (
                  <div
                    key={classIndex}
                      className={`${getCourseColor(classItem.courseCode)} border-l-4 rounded-lg p-4 hover:shadow-md transition-shadow`}
                  >
                    {/* Course Name & Code */}
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                        {classItem.course} | {classItem.courseCode}
                      </h3>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 text-xs text-gray-700 mb-2">
                      <Clock size={14} />
                      <span>{classItem.time}</span>
                    </div>

                    {/* Room */}
                    <div className="flex items-center gap-2 text-xs text-gray-700 mb-2">
                      <MapPin size={14} />
                      <span>{classItem.room} | {classItem.roomCode}</span>
                    </div>

                    {/* Instructor */}
                    <div className="text-xs text-gray-700 mt-2 pt-2 border-t border-gray-300">
                      {classItem.instructor}
                      {classItem.instructorCode && ` | ${classItem.instructorCode}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Timetable;
