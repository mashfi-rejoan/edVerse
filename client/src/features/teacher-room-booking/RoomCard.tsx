import React from 'react';
import { MapPin, Users, Building2, Check } from 'lucide-react';

interface RoomCardProps {
  room: any;
  onBook: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'classroom':
        return 'bg-blue-500';
      case 'lab':
        return 'bg-purple-500';
      case 'seminar':
        return 'bg-green-500';
      case 'auditorium':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoomTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition group border border-gray-200">
      {/* Header */}
      <div className={`${getRoomTypeColor(room.type)} p-4 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">{room.roomName}</h3>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
            {getRoomTypeLabel(room.type)}
          </span>
        </div>
        <p className="text-white text-opacity-90">Room #{room.roomNumber}</p>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Building2 size={16} />
          <span className="text-sm">{room.building} • Floor {room.floor}</span>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Users size={16} />
          <span className="text-sm">Capacity: {room.capacity} people</span>
        </div>

        {/* Facilities */}
        <div className="mb-4">
          <p className="text-gray-800 text-sm font-semibold mb-2">Facilities:</p>
          <div className="flex flex-wrap gap-2">
            {room.facilities.map((facility: string, index: number) => (
              <span
                key={index}
                className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-green-400 mb-4">
          <Check size={16} />
          <span className="text-sm font-semibold">Available Today</span>
        </div>

        {/* Book Button */}
        <button
          onClick={onBook}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 rounded-lg transition transform group-hover:scale-105"
        >
          Book Room
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
