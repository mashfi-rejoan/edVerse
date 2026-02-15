import axios, { AxiosInstance } from 'axios';
import { apiUrl } from '../utils/apiBase';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class AnalyticsService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: apiUrl('/api/analytics'),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getStudentDashboard(studentId: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/student/${studentId}`);
    return response.data;
  }
}

export default new AnalyticsService();
