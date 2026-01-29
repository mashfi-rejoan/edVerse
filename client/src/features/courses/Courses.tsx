import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { BookOpen, Users, Calendar, GraduationCap } from 'lucide-react';

interface Course {
  _id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  schedule: string;
  room: string;
  enrolled: number;
  capacity: number;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      _id: '1',
      code: 'CS201',
      name: 'Data Structures',
      instructor: 'Dr. Sarah Johnson',
      credits: 3,
      schedule: 'Mon, Wed, Fri 09:00-10:00',
      room: 'A-204',
      enrolled: 45,
      capacity: 50
    },
    {
      _id: '2',
      code: 'CS210',
      name: 'Database Systems',
      instructor: 'Prof. Michael Chen',
      credits: 3,
      schedule: 'Tue, Thu 11:00-12:30',
      room: 'Lab-3',
      enrolled: 38,
      capacity: 40
    },
    {
      _id: '3',
      code: 'CS230',
      name: 'Computer Networks',
      instructor: 'Dr. Emily Rodriguez',
      credits: 3,
      schedule: 'Mon, Wed 14:00-15:30',
      room: 'B-105',
      enrolled: 42,
      capacity: 50
    },
    {
      _id: '4',
      code: 'CS240',
      name: 'Operating Systems',
      instructor: 'Prof. David Williams',
      credits: 4,
      schedule: 'Tue, Thu 14:00-16:00',
      room: 'A-301',
      enrolled: 35,
      capacity: 40
    }
  ]);
  const [loading, setLoading] = useState(false);

  return (
    <DashboardLayout title="Courses">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <GraduationCap size={18} />
            <span>{courses.length} courses enrolled</span>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce((sum, c) => sum + c.credits, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Class Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(courses.reduce((sum, c) => sum + c.enrolled, 0) / courses.length)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.code}</h3>
                  <p className="text-base text-gray-700 font-medium">{course.name}</p>
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                  {course.credits} Credits
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} />
                  <span>{course.instructor}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{course.schedule}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen size={16} />
                  <span>Room: {course.room}</span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Enrollment</span>
                    <span className="font-medium text-gray-900">
                      {course.enrolled}/{course.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  View Details
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                  Resources
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Courses;
