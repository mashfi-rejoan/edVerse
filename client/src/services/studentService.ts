import axios, { AxiosError, AxiosInstance } from 'axios';
import { apiUrl } from '../utils/apiBase';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class StudentService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: apiUrl('/api/student'),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  async getProfile(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/profile');
    return response.data;
  }

  async updateProfile(payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.put('/profile', payload);
    return response.data;
  }

  async changePassword(payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/change-password', payload);
    return response.data;
  }

  async uploadPhoto(formData: FormData): Promise<ApiResponse<any>> {
    const response = await this.api.post('/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async getCourses(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/courses');
    return response.data;
  }

  async getRoutine(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/routine');
    return response.data;
  }

  async getAttendance(params?: Record<string, string>): Promise<ApiResponse<any>> {
    const response = await this.api.get('/attendance', { params });
    return response.data;
  }

  async getGrades(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/grades');
    return response.data;
  }

  async getAnnouncements(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/announcements');
    return response.data;
  }
}

export default new StudentService();
