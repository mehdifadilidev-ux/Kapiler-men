import { create } from 'zustand';
import type { AdminProfile } from '@kpil/shared';

interface AuthState {
  accessToken: string | null;
  admin: AdminProfile | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (token: string, admin: AdminProfile) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

function decodeToken(token: string): AdminProfile | null {
  try {
    const parts = token.split('.');
    const payload = parts[1];
    if (!payload) return null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const decoded: { sub?: string; email?: string } = JSON.parse(atob(payload));
    if (!decoded.sub || !decoded.email) return null;
    return { id: decoded.sub, email: decoded.email };
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  admin: null,
  isAuthenticated: false,

  setAuth: (accessToken, admin) => {
    localStorage.setItem('accessToken', accessToken);
    set({ accessToken, admin, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    set({ accessToken: null, admin: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const admin = decodeToken(token);
    if (admin) {
      set({ accessToken: token, admin, isAuthenticated: true });
    } else {
      localStorage.removeItem('accessToken');
    }
  },
}));
