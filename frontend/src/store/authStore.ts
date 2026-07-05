import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  _hasHydrated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (val: boolean) => void;
}

interface JwtPayload {
  sub: string; // user id
  role: Role;
  exp: number;
}

export const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // Check if token has expired (with 5 second buffer)
    return decoded.exp * 1000 > Date.now() + 5000;
  } catch {
    return false;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setTokens: (access: string, refresh: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(access);
          set({
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            user: { id: parseInt(decoded.sub), email: '', role: decoded.role },
          });
        } catch (error) {
          console.error("Failed to decode token", error);
        }
      },

      setUser: (user: User) => set({ user }),

      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
      },

      setHasHydrated: (val: boolean) => set({ _hasHydrated: val }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // Only persist these fields, NOT _hasHydrated
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate auth store:', error);
          return;
        }
        if (state) {
          // Validate the token on rehydration — if expired, wipe the session
          if (!isValidToken(state.accessToken)) {
            state.logout();
          }
          state.setHasHydrated(true);
        }
      },
    }
  )
);
