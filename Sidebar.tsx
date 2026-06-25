import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Sprout, Beef, FileText, MessageSquare,
  Microscope, Cloud, TrendingUp, Syringe, Users, Bell,
  User, Settings, LogOut, Menu, X, ChevronRight, Shield,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useTranslation } from "@/i18n/useTranslation";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, key: "dashboard" as const },
  { path: "/agriculture", icon: Sprout, key: "agriculture" as const },
  { path: "/livestock", icon: Beef, key: "livestock" as const },
  { path: "/schemes", icon: FileText, key: "schemes" as const },
  { path: "/chat", icon: MessageSquare, key: "chat" as const },
  { path: "/disease-detection", icon: Microscope, key: "diseaseDetection" as const },
  { path: "/weather", icon: Cloud, key: "weather" as const },
  { path: "/market-prices", icon: TrendingUp, key: "marketPrices" as const },
  { path: "/vaccinations", icon: Syringe, key: "vaccinations" as const },
  { path: "/consultations", icon: Users, key: "consultations" as const },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-green-900 text-white">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-green-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg font-heading">AgriVet AI</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-green-700 transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                isActive
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-green-100 hover:bg-green-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{t(item.key)}</span>}
            </Link>
          );
        })}

        {user?.role === "admin" && (
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
              location.pathname.startsWith("/admin")
                ? "bg-amber-600 text-white"
                : "text-green-100 hover:bg-green-800"
            )}
          >
            <Shield className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{t("admin")}</span>}
          </Link>
        )}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-green-700 space-y-1">
        <LanguageToggle collapsed={collapsed} />
        <Link
          to="/notifications"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-100 hover:bg-green-800 text-sm font-medium relative"
        >
          <Bell className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>{t("notifications")}</span>}
          {unreadCount > 0 && (
            <span className="absolute top-1.5 left-6 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
        <Link
          to="/profile"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-100 hover:bg-green-800 text-sm font-medium"
        >
          <User className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>{t("profile")}</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-900/30 text-sm font-medium"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>{t("logout")}</span>}
        </button>

        {!collapsed && user && (
          <div className="mt-2 px-3 py-2 bg-green-800 rounded-lg">
            <p className="text-xs font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-green-300 capitalize">{user.role?.replace("_", " ")}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-green-800 text-white rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-50 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={cn("hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300", collapsed ? "w-16" : "w-64")}>
        <SidebarContent />
      </div>
    </>
  );
}
