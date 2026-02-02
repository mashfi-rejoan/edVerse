import React from 'react';
import { MapPin, Users, Zap, Wifi, Award } from 'lucide-react';
import RoomCard from './RoomCard';

interface Room {
  _id: string;
  roomNumber: string;
  roomName: string;
  building: string;
  floor: number;
  capacity: number;
  type: string;
  facilities: string[];
  isAvailable: boolean;
  maintenanceStatus: string;
}

interface RoomListProps {
  rooms: Room[];
  loading: boolean;
  onSelectRoom: (room: Room) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, loading, onSelectRoom }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg h-64 animate-pulse border border-gray-200"
          />
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center border border-gray-200 shadow-sm">
        <MapPin size={48} className="mx-auto text-gray-400 mb-4 opacity-60" />
        <h3 className="text-gray-800 text-xl font-semibold mb-2">No rooms available</h3>
        <p className="text-gray-600">Try changing your filters or select a different date</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard
          key={room._id}
          room={room}
          onBook={() => onSelectRoom(room)}
        />
      ))}
    </div>
  );
};

export default RoomList;
