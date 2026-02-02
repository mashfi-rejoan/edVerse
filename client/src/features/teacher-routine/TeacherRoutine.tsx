import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import TeacherDashboardLayout from '../../components/TeacherDashboardLayout';

const TeacherRoutine: React.FC = () => {
  const [routineData, setRoutineData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [todayClasses, setTodayClasses] = useState<any[]>([]);

  // Mock routine data
  const mockRoutine = [
    {
      _id: '1',
      courseCode: 'CS201',
      courseName: 'Data Structures',
      section: 'A',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      room: '204',
      building: 'Building A',
      instructor: 'Dr. Ahmed Khan'
    },
    {
      _id: '2',
      courseCode: 'CS210',
      courseName: 'Database Systems',
      section: 'A',
      day: 'Monday',
      startTime: '11:00',
      endTime: '12:30',
      room: '301',
      building: 'Building A',
      instructor: 'Dr. Ahmed Khan'
    },
    {
      _id: '3',
      courseCode: 'CS201',
      courseName: 'Data Structures',
      section: 'B',
      day: 'Wednesday',
      startTime: '14:00',
      endTime: '15:30',
      room: '204',
      building: 'Building A',
      instructor: 'Dr. Ahmed Khan'
    },
    {
      _id: '4',
      courseCode: 'CS210',
      courseName: 'Database Systems',
      section: 'B',
      day: 'Tuesday',
      startTime: '10:00',
      endTime: '11:30',
      room: '301',
      building: 'Building A',
      instructor: 'Dr. Ahmed Khan'
    },
    {
      _id: '5',
      courseCode: 'CS301',
      courseName: 'Software Engineering',
      section: 'A',
      day: 'Friday',
      startTime: '09:00',
      endTime: '11:00',
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

  useEffect(() => {
    // Get today's classes
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date(selectedDate);
    const dayName = daysOfWeek[today.getDay()];

    const todayClasses = routineData
      .filter(item => item.day === dayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    setTodayClasses(todayClasses);
  }, [selectedDate, routineData]);

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isClassTime = (startTime: string) => {
    const [hour, min] = startTime.split(':').map(Number);
    const classTime = hour * 60 + min;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    return currentTime >= classTime && currentTime < classTime + 90;
  };

  const isUpcoming = (startTime: string) => {
    const [hour, min] = startTime.split(':').map(Number);
    const classTime = hour * 60 + min;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    return currentTime < classTime;
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

        {/* Date Selector */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Today's Classes Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={24} className="text-[#0C2B4E]" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{getDayName(selectedDate)}'s Schedule</h2>
              <p className="text-gray-600 text-sm">{formatDate(selectedDate)}</p>
            </div>
          </div>

          {todayClasses.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-3 opacity-40" />
              <p className="text-gray-600">No classes scheduled for {getDayName(selectedDate)}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayClasses.map((classItem) => (
                <div
                  key={classItem._id}
                  className={`rounded-lg p-4 transition ${
                    isClassTime(classItem.startTime)
                      ? 'bg-green-50 border-2 border-green-300'
                      : isUpcoming(classItem.startTime)
                      ? 'bg-blue-50 border border-blue-300'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{classItem.courseName}</h3>
                      <p className="text-gray-600 text-sm">{classItem.courseCode} - Section {classItem.section}</p>
                    </div>
                    {isClassTime(classItem.startTime) && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <CheckCircle size={16} />
                        In Progress
                      </span>
                    )}
                    {isUpcoming(classItem.startTime) && !isClassTime(classItem.startTime) && (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Upcoming
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span className="text-sm font-semibold">
                        {classItem.startTime} - {classItem.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span className="text-sm font-semibold">
                        Room {classItem.room}, {classItem.building}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Schedule</h2>

          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{day}</h3>
                
                {weeklyRoutine[day].length === 0 ? (
                  <p className="text-gray-500 text-sm">No classes</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {weeklyRoutine[day].map((classItem) => (
                      <div
                        key={classItem._id}
                        className="bg-gray-50 rounded-lg p-4 hover:shadow-sm transition border border-gray-100"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{classItem.courseName}</p>
                            <p className="text-gray-600 text-sm">
                              {classItem.courseCode} - Section {classItem.section}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-800 font-semibold text-sm">
                              {classItem.startTime} - {classItem.endTime}
                            </p>
                            <p className="text-gray-600 text-xs">
                              Room {classItem.room}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Hours/Week</h3>
            <p className="text-4xl font-bold text-[#0C2B4E]">
              {routineData.reduce((acc, item) => {
                const [startHour, startMin] = item.startTime.split(':').map(Number);
                const [endHour, endMin] = item.endTime.split(':').map(Number);
                const duration = (endHour - startHour) * 60 + (endMin - startMin);
                return acc + duration / 60;
              }, 0).toFixed(1)}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Classes</h3>
            <p className="text-4xl font-bold text-[#0C2B4E]">{routineData.length}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Unique Courses</h3>
            <p className="text-4xl font-bold text-[#0C2B4E]">
              {new Set(routineData.map(item => item.courseCode)).size}
            </p>
          </div>
        </div>
      </div>
    </TeacherDashboardLayout>
  );
};

export default TeacherRoutine;
