import { create } from 'zustand';
export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,

  login: () => set({ isAuthenticated: true }),

  logout: () => set({ isAuthenticated: false }),
}));
