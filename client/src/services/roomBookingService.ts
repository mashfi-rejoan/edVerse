import axios, { AxiosInstance } from 'axios';
import { apiUrl } from '../utils/apiBase';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class RoomBookingService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: apiUrl('/api/room-booking'),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getRooms(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/rooms');
    return response.data;
  }

  async getAvailableRooms(date: string, startTime: string, endTime: string): Promise<ApiResponse<any>> {
    const response = await this.api.get('/rooms/available', {
      params: { date, startTime, endTime }
    });
    return response.data;
  }

  async createBooking(payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/room-booking', payload);
    return response.data;
  }

  async getBookings(bookedBy: string): Promise<ApiResponse<any>> {
    const response = await this.api.get('/room-booking', { params: { bookedBy } });
    return response.data;
  }

  async cancelBooking(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.delete(`/room-booking/${id}`);
    return response.data;
  }
}

export default new RoomBookingService();
