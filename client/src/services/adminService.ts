import axios, { AxiosInstance, AxiosError } from 'axios';
import { apiUrl } from '../utils/apiBase';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class AdminService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: apiUrl('/api/admin'),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor to include token
    this.api.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    // Add response interceptor for error handling
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

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Teachers
  async getTeachers(page?: number, limit?: number): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/teachers', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getTeacher(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createTeacher(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post('/teachers', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateTeacher(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.put(`/teachers/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteTeacher(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.delete(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Students
  async getStudents(page?: number, limit?: number): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/students', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getStudent(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createStudent(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post('/students', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateStudent(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.put(`/students/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Courses
  async getCourses(page?: number, limit?: number): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/courses', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCourse(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createCourse(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post('/courses', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCourse(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.put(`/courses/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Registrations
  async getRegistrations(page?: number, limit?: number): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/registrations', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRegistration(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get(`/registrations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateRegistration(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.put(`/registrations/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Exams
  async getExams(page?: number, limit?: number): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/exams', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createExam(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post('/exams', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateExam(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.put(`/exams/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Announcements
  async getAnnouncements(page?: number, limit?: number): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/announcements', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createAnnouncement(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post('/announcements', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateAnnouncement(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.put(`/announcements/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteAnnouncement(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.delete(`/announcements/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Profile & Settings
  async getAdminProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateAdminProfile(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.put('/profile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post('/change-password', { oldPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async uploadProfilePhoto(file: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await this.api.post('/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AdminService();
