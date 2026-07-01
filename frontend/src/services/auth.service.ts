import { apiClient } from '../api/axios';
import type { LoginCredentials, RegisterData, AuthResponse, UserResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // FastAPI OAuth2PasswordRequestForm expects URL encoded form data
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },

  register: async (data: RegisterData): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/auth/register', data);
    return response.data;
  },
  
  getProfile: async (): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/auth/test-token');
    return response.data;
  }
};
