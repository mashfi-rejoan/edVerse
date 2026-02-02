import React, { useState } from 'react';
import { X, Calendar, Clock, FileText, AlertCircle } from 'lucide-react';

interface BookingFormProps {
  room: any;
  onSubmit: (bookingData: any) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ room, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:30',
    purpose: 'Extra Class',
    courseCode: '',
    courseName: '',
    notes: ''
  });

  const [errors, setErrors] = useState<any>({});

  const purposes = [
    'Extra Class',
    'Meeting',
    'Lab Session',
    'Project Work',
    'Guest Lecture',
    'Exam',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    // Date validation
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      newErrors.date = 'Cannot book room for past dates';
    }

    // Time validation
    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    const startHour = parseInt(formData.startTime.split(':')[0]);
    const endHour = parseInt(formData.endTime.split(':')[0]);

    if (startHour < 8 || endHour > 18) {
      newErrors.startTime = 'Booking hours: 8:00 AM - 6:00 PM';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Calculate duration
    const [startHour, startMin] = formData.startTime.split(':').map(Number);
    const [endHour, endMin] = formData.endTime.split(':').map(Number);
    const duration = (endHour - startHour) * 60 + (endMin - startMin);

    const bookingData = {
      roomNumber: room.roomNumber,
      roomName: room.roomName,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration,
      purpose: formData.purpose,
      courseCode: formData.courseCode,
      courseName: formData.courseName,
      notes: formData.notes
    };

    onSubmit(bookingData);
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Book {room?.roomName}</h2>
          <p className="text-white text-opacity-80 text-sm">Room #{room?.roomNumber}</p>
        </div>
        <button
          onClick={onCancel}
          className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.date}
            </p>
          )}
        </div>

        {/* Time - Start and End */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock size={16} className="inline mr-2" />
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.startTime && (
              <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.endTime && (
              <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* Duration Display */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">
            Duration: <span className="font-semibold text-blue-600">
              {(() => {
                const [startHour, startMin] = formData.startTime.split(':').map(Number);
                const [endHour, endMin] = formData.endTime.split(':').map(Number);
                const duration = (endHour - startHour) * 60 + (endMin - startMin);
                const hours = Math.floor(duration / 60);
                const mins = duration % 60;
                return `${hours}h ${mins}m`;
              })()}
            </span>
          </p>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Purpose
          </label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {purposes.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Course Selection (Optional) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course Code (Optional)
            </label>
            <input
              type="text"
              name="courseCode"
              placeholder="e.g., CS201"
              value={formData.courseCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course Name (Optional)
            </label>
            <input
              type="text"
              name="courseName"
              placeholder="e.g., Data Structures"
              value={formData.courseName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FileText size={16} className="inline mr-2" />
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special requirements or notes..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
