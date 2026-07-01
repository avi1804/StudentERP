import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

export type Role = 'admin' | 'faculty' | 'student';

export interface User {
  id: number;
  email: string;
  role: Role;
  full_name?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

interface JwtPayload {
  sub: string; // user id
  role: Role;
  exp: number;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setTokens: (access: string, refresh: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(access);
          set({
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            // Basic user info from token. We can fetch full profile later.
            user: { id: parseInt(decoded.sub), email: '', role: decoded.role }, 
          });
        } catch (error) {
          console.error("Failed to decode token", error);
        }
      },

      setUser: (user: User) => set({ user }),

      logout: () => set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // saves to localStorage by default
    }
  )
);
