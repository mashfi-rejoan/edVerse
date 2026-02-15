import axios from 'axios';
import { apiUrl } from '../utils/apiBase';

// API base path
const API_BASE = apiUrl('/api');

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRequest = typeof originalRequest?.url === 'string'
      && originalRequest.url.includes('/auth/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          return Promise.reject(error);
        }
        const response = await axios.post(`${API_BASE}/auth/refresh`, {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Log error details
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    return Promise.reject(error);
  }
);

export interface RegisterData {
  name: string;
  email: string;
  universityId: string;
  password: string;
  role?: string;
  phone?: string;
  bloodGroup?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  universityId: string;
  role: string;
  phone?: string;
  photoUrl?: string;
  bloodGroup?: string;
  isBloodDonor?: boolean;
  bloodDonorAvailable?: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', data);
      const { user, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.user;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Invalid user data in storage:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
};

export default authService;
