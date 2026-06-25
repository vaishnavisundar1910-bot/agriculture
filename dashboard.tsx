import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Beef, Syringe, Users, Bell, Plus, MessageSquare, Microscope, FileText, Cloud, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useTranslation } from "@/i18n/useTranslation";
import { apiClient } from "@/lib/api-client";

interface DashboardStats {
  livestock: number;
  vaccinations: number;
  consultations: number;
}

interface Scheme {
  _id: string;
  title: string;
  titleTa: string;
  category: string;
  description: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  agriculture: "bg-green-100 text-green-700",
  dairy: "bg-blue-100 text-blue-700",
  goat: "bg-amber-100 text-amber-700",
  poultry: "bg-orange-100 text-orange-700",
  state: "bg-purple-100 text-purple-700",
  central: "bg-red-100 text-red-700",
};

const notifTypeIcons: Record<string, string> = {
  weather: "🌤️",
  disease: "🦠",
  vaccination: "💉",
  scheme: "📋",
  consultation: "👨‍⚕️",
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { notifications, unreadCount } = useNotificationStore();
  const { t, language } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({ livestock: 0, vaccinations: 0, consultations: 0 });
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [livestockData, vaccinationsData, consultationsData, schemesData] = await Promise.allSettled([
          apiClient.get("/api/livestock"),
          apiClient.get("/api/vaccinations/upcoming"),
          apiClient.get("/api/consultations"),
          apiClient.get("/api/schemes?limit=3"),
        ]);

        setStats({
          livestock: livestockData.status === "fulfilled" ? livestockData.value.length : 0,
          vaccinations: vaccinationsData.status === "fulfilled" ? vaccinationsData.value.length : 0,
          consultations: consultationsData.status === "fulfilled" ? consultationsData.value.filter((c: { status: string }) => c.status !== "resolved").length : 0,
        });

        if (schemesData.status === "fulfilled") {
          setSchemes(schemesData.value.slice(0, 3));
        }
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: t("myLivestock"), value: stats.livestock, icon: Beef, color: "bg-green-50 text-green-700", link: "/livestock" },
    { label: t("upcomingVaccinations"), value: stats.vaccinations, icon: Syringe, color: "bg-blue-50 text-blue-700", link: "/vaccinations" },
    { label: t("activeConsultations"), value: stats.consultations, icon: Users, color: "bg-amber-50 text-amber-700", link: "/consultations" },
    { label: t("unreadNotifications"), value: unreadCount, icon: Bell, color: "bg-red-50 text-red-700", link: "/notifications" },
  ];

  const quickActions = [
    { label: t("addLivestock"), icon: Plus, link: "/livestock", color: "bg-green-700 hover:bg-green-800" },
    { label: t("askAI"), icon: MessageSquare, link: "/chat", color: "bg-blue-600 hover:bg-blue-700" },
    { label: t("detectDisease"), icon: Microscope, link: "/disease-detection", color: "bg-purple-600 hover:bg-purple-700" },
    { label: t("viewSchemes"), icon: FileText, link: "/schemes", color: "bg-amber-600 hover:bg-amber-700" },
    { label: t("weather"), icon: Cloud, link: "/weather", color: "bg-sky-600 hover:bg-sky-700" },
    { label: t("marketPrices"), icon: TrendingUp, link: "/market-prices", color: "bg-rose-600 hover:bg-rose-700" },
  ];

  return (
    <DashboardLayout>
      <Helmet><title>Dashboard — AgriVet AI</title></Helmet>

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          {t("welcome")}, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {language === "ta" ? "உங்கள் பண்ணையை நிர்வகிக்க AgriVet AI உதவுகிறது" : "AgriVet AI is here to help manage your farm"}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((card) => (
              <Link key={card.label} to={card.link} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-heading">{card.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4 font-heading">{t("quickActions")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.link}
                  className={`${action.color} text-white rounded-xl p-3 flex flex-col items-center gap-2 text-center transition-colors`}>
                  <action.icon className="w-5 h-5" />
                  <span className="text-xs font-medium leading-tight">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Schemes */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 font-heading">{t("recentSchemes")}</h2>
                <Link to="/schemes" className="text-green-700 text-sm font-medium flex items-center gap-1 hover:text-green-900">
                  {t("viewAll")} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {schemes.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No schemes found</p>
              ) : (
                <div className="space-y-3">
                  {schemes.map((scheme) => (
                    <Link key={scheme._id} to={`/schemes/${scheme._id}`}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 mt-0.5 ${categoryColors[scheme.category] || "bg-gray-100 text-gray-700"}`}>
                        {scheme.category}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {language === "ta" && scheme.titleTa ? scheme.titleTa : scheme.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{scheme.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 font-heading">{t("notifications")}</h2>
                <Link to="/notifications" className="text-green-700 text-sm font-medium flex items-center gap-1 hover:text-green-900">
                  {t("viewAll")} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {notifications.length === 0 ? (
                <div className="text-center py-6">
                  <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(0, 5).map((notif: Notification) => (
                    <div key={notif._id} className={`flex items-start gap-3 p-3 rounded-lg ${!notif.isRead ? "bg-green-50" : ""}`}>
                      <span className="text-lg flex-shrink-0">{notifTypeIcons[notif.type] || "📢"}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notif.message}</p>
                      </div>
                      {!notif.isRead && <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0 mt-1.5" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
