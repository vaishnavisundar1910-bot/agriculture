import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {
    try {
      const data = await apiClient.get("/api/notifications");
      set({ notifications: data.notifications || [], unreadCount: data.unreadCount || 0 });
    } catch {}
  },
  markRead: async (id) => {
    try {
      await apiClient.put(`/api/notifications/${id}/read`, {});
      set((state) => ({
        notifications: state.notifications.map((n) => n._id === id ? { ...n, isRead: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {}
  },
  markAllRead: async () => {
    try {
      await apiClient.put("/api/notifications/read-all", {});
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch {}
  },
}));
