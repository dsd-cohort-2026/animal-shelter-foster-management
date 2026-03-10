import { create } from 'zustand';
export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  role: null, // 'STAFF' | 'USER' | null

  login: () => set({ isAuthenticated: true, role: 'STAFF' }),

  logout: () => set({ isAuthenticated: false, role: null }),

  setRole: (role) => set({ role }),
}));
