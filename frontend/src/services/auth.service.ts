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
  },

  googleLogin: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google', { token });
    return response.data;
  },
  
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<{ message: string; reset_token: string }> => {
    const response = await apiClient.post<{ message: string; reset_token: string }>('/auth/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (email: string, reset_token: string, new_password: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', { email, reset_token, new_password });
    return response.data;
  },

  checkEmail: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/check-email', { email });
    return response.data;
  }
};
