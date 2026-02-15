import axios, { AxiosInstance } from 'axios';
import { apiUrl } from '../utils/apiBase';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ClassroomService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: apiUrl('/api/classroom'),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getPosts(courseCode: string, section?: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/course/${courseCode}`, {
      params: section ? { section } : undefined
    });
    return response.data;
  }

  async createPost(payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/', payload);
    return response.data;
  }

  async submitAssignment(postId: string, payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/${postId}/submit`, payload);
    return response.data;
  }

  async markViewed(postId: string, payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/${postId}/view`, payload);
    return response.data;
  }
}

export default new ClassroomService();
