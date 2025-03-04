// src/services/api.ts
import axios, { AxiosInstance } from 'axios';
import { AuthCredentials, SignupCredentials, AuthResponse } from '../types/auth.types';
import { IUser } from '../types/user.types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common errors here (e.g., 401, 403)
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('token');
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string | null): void {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Auth endpoints
  async signin(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/signin', credentials);
    return response.data;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/signup', credentials);
    return response.data;
  }

  // User endpoints
  async getUser(id: string): Promise<IUser> {
    const response = await this.api.get(`/users/${id}`);
    return response.data.data;
  }
}

export const apiService = new ApiService();