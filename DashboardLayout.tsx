import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { useNotificationStore } from "@/store/notificationStore";
import { useAuthStore } from "@/store/authStore";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { fetchNotifications } = useNotificationStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 pt-16 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
