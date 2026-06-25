import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  language?: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateProfile: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const u = localStorage.getItem("agrivet_user");
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  })(),
  token: localStorage.getItem("agrivet_token"),
  isAuthenticated: !!localStorage.getItem("agrivet_token"),
  login: (token, user) => {
    localStorage.setItem("agrivet_token", token);
    localStorage.setItem("agrivet_user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("agrivet_token");
    localStorage.removeItem("agrivet_user");
    set({ token: null, user: null, isAuthenticated: false });
  },
  updateProfile: (updates) => {
    set((state) => {
      const updated = state.user ? { ...state.user, ...updates } : null;
      if (updated) localStorage.setItem("agrivet_user", JSON.stringify(updated));
      return { user: updated };
    });
  },
}));
