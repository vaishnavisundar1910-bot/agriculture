import { useEffect } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { useNotificationStore } from "@/store/notificationStore";
import { useTranslation } from "@/i18n/useTranslation";

const typeIcons: Record<string, string> = {
  weather: "🌤️", disease: "🦠", vaccination: "💉", scheme: "📋", consultation: "👨‍⚕️",
};

const typeColors: Record<string, string> = {
  weather: "bg-sky-100 text-sky-700",
  disease: "bg-red-100 text-red-700",
  vaccination: "bg-blue-100 text-blue-700",
  scheme: "bg-green-100 text-green-700",
  consultation: "bg-purple-100 text-purple-700",
};

export default function NotificationsPage() {
  const { notifications, unreadCount, fetchNotifications, markRead, markAllRead } = useNotificationStore();
  const { language } = useTranslation();

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <DashboardLayout>
      <Helmet><title>Notifications — AgriVet AI</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <Bell className="w-6 h-6 text-green-700" />
            {language === "ta" ? "அறிவிப்புகள்" : "Notifications"}
          </h1>
          {unreadCount > 0 && (
            <p className="text-gray-500 text-sm mt-1">{unreadCount} unread notifications</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No notifications yet</p>
          <p className="text-gray-400 text-sm mt-1">You'll see weather alerts, vaccination reminders, and scheme updates here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div key={notif._id}
              onClick={() => !notif.isRead && markRead(notif._id)}
              className={`bg-white rounded-xl p-4 shadow-sm border transition-all cursor-pointer ${!notif.isRead ? "border-green-200 bg-green-50/50" : "border-gray-100 hover:bg-gray-50"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${typeColors[notif.type] || "bg-gray-100"}`}>
                  {typeIcons[notif.type] || "📢"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-medium ${!notif.isRead ? "text-gray-900" : "text-gray-700"}`}>{notif.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">{timeAgo(notif.createdAt)}</span>
                      {!notif.isRead && <div className="w-2 h-2 bg-green-600 rounded-full" />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                  <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${typeColors[notif.type] || "bg-gray-100 text-gray-600"}`}>
                    {notif.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
