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
    const originalRequest = error.config as any;
    if (!originalRequest) return Promise.reject(error);

    // If 401 Unauthorized, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (refreshToken && !originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/refresh')) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
          if (res.data && res.data.access_token) {
            setTokens(res.data.access_token, res.data.refresh_token || refreshToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
