import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Plus, Filter } from 'lucide-react';
import TeacherDashboardLayout from '../../components/TeacherDashboardLayout';
import RoomList from './RoomList';
import BookingForm from './BookingForm';
import MyBookings from './MyBookings';

const RoomBooking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'my-bookings'>('available');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data - will be replaced with API calls
  const mockRooms = [
    {
      _id: '1',
      roomNumber: '301',
      roomName: 'Computer Lab A',
      building: 'Building A',
      floor: 3,
      capacity: 40,
      type: 'lab',
      facilities: ['Computers', 'Projector', 'AC', 'WiFi'],
      isAvailable: true,
      maintenanceStatus: 'active'
    },
    {
      _id: '2',
      roomNumber: '204',
      roomName: 'Classroom B',
      building: 'Building A',
      floor: 2,
      capacity: 50,
      type: 'classroom',
      facilities: ['Projector', 'Whiteboard', 'AC'],
      isAvailable: true,
      maintenanceStatus: 'active'
    },
    {
      _id: '3',
      roomNumber: '105',
      roomName: 'Seminar Hall',
      building: 'Building B',
      floor: 1,
      capacity: 25,
      type: 'seminar',
      facilities: ['Projector', 'AC', 'WiFi', 'Video Conference'],
      isAvailable: true,
      maintenanceStatus: 'active'
    },
    {
      _id: '4',
      roomNumber: '401',
      roomName: 'Auditorium',
      building: 'Building C',
      floor: 4,
      capacity: 200,
      type: 'auditorium',
      facilities: ['Sound System', 'Projector', 'Stage', 'AC'],
      isAvailable: true,
      maintenanceStatus: 'active'
    }
  ];

  const mockBookings = [
    {
      _id: '1',
      roomNumber: '301',
      roomName: 'Computer Lab A',
      bookedBy: 'TEACHER001',
      teacherName: 'Dr. Ahmed Khan',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:30',
      duration: 90,
      purpose: 'Extra Class',
      courseCode: 'CS201',
      courseName: 'Data Structures',
      status: 'confirmed',
      notes: 'Programming practice session'
    },
    {
      _id: '2',
      roomNumber: '204',
      roomName: 'Classroom B',
      bookedBy: 'TEACHER001',
      teacherName: 'Dr. Ahmed Khan',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '15:30',
      duration: 90,
      purpose: 'Meeting',
      courseCode: 'CS210',
      courseName: 'Database Systems',
      status: 'confirmed',
      notes: 'Department meeting'
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch rooms
    setLoading(true);
    setTimeout(() => {
      setRooms(mockRooms);
      setLoading(false);
    }, 500);
  }, [filterType, selectedDate]);

  useEffect(() => {
    // Simulate API call to fetch bookings
    setBookings(mockBookings);
  }, []);

  const handleBookingSubmit = (bookingData: any) => {
    // Add to bookings list
    const newBooking = {
      ...bookingData,
      _id: Date.now().toString(),
      bookedBy: 'TEACHER001',
      teacherName: 'Dr. Ahmed Khan',
      status: 'confirmed'
    };
    
    // Save to localStorage
    const savedBookings = localStorage.getItem('room_bookings');
    const allBookings = savedBookings ? JSON.parse(savedBookings) : [];
    allBookings.push(newBooking);
    localStorage.setItem('room_bookings', JSON.stringify(allBookings));
    
    setBookings([...bookings, newBooking]);
    setShowBookingForm(false);
    setSelectedRoom(null);
  };

  const handleCancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.filter(b => b._id !== bookingId);
    localStorage.setItem('room_bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  };

  const filteredRooms = filterType === 'all' 
    ? rooms 
    : rooms.filter(r => r.type === filterType);

  return (
    <TeacherDashboardLayout title="Room Booking">
      <div className="space-y-6">
        {/* Header Panel */}
        <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MapPin size={40} className="text-blue-300 flex-shrink-0" />
              <div>
                <h1 className="text-3xl font-bold mb-1">Room Booking</h1>
                <p className="text-blue-100">Book rooms for extra classes and meetings</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedRoom(null);
                setShowBookingForm(true);
              }}
              className="bg-[#0C2B4E] hover:bg-[#1A3D64] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition whitespace-nowrap font-medium"
            >
              <Plus size={20} />
              Book Room
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'available'
                ? 'bg-[#0C2B4E] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              Available Rooms
            </div>
          </button>
          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'my-bookings'
                ? 'bg-[#0C2B4E] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              My Bookings
            </div>
          </button>
        </div>

        {/* Available Rooms Tab */}
        {activeTab === 'available' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Room Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="classroom">Classroom</option>
                    <option value="lab">Lab</option>
                    <option value="seminar">Seminar</option>
                    <option value="auditorium">Auditorium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Capacity
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Any Capacity</option>
                    <option value="20">Up to 20</option>
                    <option value="50">20 - 50</option>
                    <option value="100">50 - 100</option>
                    <option value="200">100+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Room List */}
            <RoomList 
              rooms={filteredRooms} 
              loading={loading}
              onSelectRoom={(room) => {
                setSelectedRoom(room);
                setShowBookingForm(true);
              }}
            />
          </div>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'my-bookings' && (
          <MyBookings 
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <BookingForm
              room={selectedRoom}
              onSubmit={handleBookingSubmit}
              onCancel={() => {
                setShowBookingForm(false);
                setSelectedRoom(null);
              }}
            />
          </div>
        )}
      </div>
    </TeacherDashboardLayout>
  );
};

export default RoomBooking;
