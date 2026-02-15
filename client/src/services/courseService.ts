import axios, { AxiosInstance } from 'axios';
import { apiUrl } from '../utils/apiBase';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class CourseService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: apiUrl('/api/courses'),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getSemesters(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/semesters');
    return response.data;
  }

  async getStudentCourses(studentId: string, params: Record<string, string | number>): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/student/${studentId}/courses`, { params });
    return response.data;
  }

  async getAvailableCourses(params: Record<string, string | number>): Promise<ApiResponse<any>> {
    const response = await this.api.get('/courses/available', { params });
    return response.data;
  }

  async enroll(payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/enroll', payload);
    return response.data;
  }

  async drop(payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/drop', payload);
    return response.data;
  }

  async getMaterials(courseId: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/course/${courseId}/materials`);
    return response.data;
  }
}

export default new CourseService();
