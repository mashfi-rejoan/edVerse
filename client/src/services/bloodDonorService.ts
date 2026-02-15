import axios, { AxiosError, AxiosInstance } from 'axios';
import { apiUrl } from '../utils/apiBase';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class BloodDonorService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: apiUrl('/api/blood-donor'),
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

  async getDonors(params?: Record<string, string>): Promise<ApiResponse<any>> {
    const response = await this.api.get('/donors', { params });
    return response.data;
  }

  async registerDonor(payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/register', payload);
    return response.data;
  }

  async getMyProfile(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/my-profile');
    return response.data;
  }

  async updateProfile(payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.put('/profile', payload);
    return response.data;
  }

  async recordDonation(payload: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/record-donation', payload);
    return response.data;
  }
}

export default new BloodDonorService();
