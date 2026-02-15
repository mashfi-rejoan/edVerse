import axios, { AxiosInstance } from 'axios';
import { apiUrl } from '../utils/apiBase';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class MarksService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: apiUrl('/api/marks'),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getMarks(courseCode: string, section: string, evaluationType: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/${courseCode}/${section}/${evaluationType}`);
    return response.data;
  }

  async saveMarks(payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/', payload);
    return response.data;
  }
}

export default new MarksService();
