import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';

const BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token expiration & errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // If 401 Unauthorized, we log out for now. 
    // TODO: Implement refresh token flow if a refresh endpoint exists.
    if (error.response?.status === 401) {
      // Avoid infinite loops if the refresh itself fails
      if (!originalRequest.url?.includes('/auth/login')) {
         useAuthStore.getState().logout();
         window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
