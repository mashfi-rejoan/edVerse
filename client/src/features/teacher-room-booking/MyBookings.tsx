import React, { useState } from 'react';
import { Trash2, MapPin, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface MyBookingsProps {
  bookings: any[];
  onCancelBooking: (bookingId: string) => void;
}

const MyBookings: React.FC<MyBookingsProps> = ({ bookings, onCancelBooking }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isUpcoming = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const upcomingBookings = bookings.filter(b => isUpcoming(b.date) && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => !isUpcoming(b.date) || b.status === 'cancelled');

  return (
    <div className="space-y-6">
      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar size={28} />
          Upcoming Bookings ({upcomingBookings.length})
        </h2>

        {upcomingBookings.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow-sm">
            <Calendar size={48} className="mx-auto text-gray-400 opacity-60 mb-3" />
            <p className="text-gray-600">No upcoming bookings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg p-6 hover:shadow-md transition border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{booking.roomName}</h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <MapPin size={16} />
                      Room #{booking.roomNumber}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-sm">{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span className="text-sm">{booking.startTime} - {booking.endTime}</span>
                  </div>
                </div>

                {/* Purpose and Course */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs">Purpose</p>
                      <p className="text-gray-800 font-semibold">{booking.purpose}</p>
                    </div>
                    {booking.courseCode && (
                      <div>
                        <p className="text-gray-600 text-xs">Course</p>
                        <p className="text-gray-800 font-semibold">{booking.courseCode}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="mb-4">
                    <p className="text-gray-600 text-xs mb-1">Notes</p>
                    <p className="text-gray-700 text-sm">{booking.notes}</p>
                  </div>
                )}

                {/* Duration */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    Duration: <span className="text-gray-800 font-semibold">{booking.duration} minutes</span>
                  </span>
                  
                  {booking.status !== 'completed' && (
                    <button
                      onClick={() => setShowConfirmDelete(booking._id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-semibold transition"
                    >
                      <Trash2 size={16} />
                      Cancel
                    </button>
                  )}
                </div>

                {/* Confirmation Dialog */}
                {showConfirmDelete === booking._id && (
                  <div className="mt-4 bg-red-50 border border-red-300 p-4 rounded-lg">
                    <p className="text-red-900 mb-3">Are you sure you want to cancel this booking?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onCancelBooking(booking._id);
                          setShowConfirmDelete(null);
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Yes, Cancel Booking
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(null)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
                      >
                        No, Keep It
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle size={28} />
            Past Bookings ({pastBookings.length})
          </h2>

          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-50 rounded-lg p-6 opacity-75 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{booking.roomName}</h3>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        Room #{booking.roomNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(booking.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
