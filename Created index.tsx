import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Users, FileText, MessageSquare, Microscope, Beef, Loader2, ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AdminStats {
  totalUsers: number;
  activeSchemes: number;
  pendingConsultations: number;
  totalDiseases: number;
  totalLivestock: number;
  userGrowth: Array<{ _id: { year: number; month: number }; count: number }>;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/admin/stats").then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  const chartData = stats?.userGrowth.map((g) => ({
    month: MONTHS[g._id.month - 1],
    users: g.count,
  })) || [];

  const statCards = stats ? [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-50 text-blue-700", link: "/admin/users" },
    { label: "Active Schemes", value: stats.activeSchemes, icon: FileText, color: "bg-green-50 text-green-700", link: "/admin/schemes" },
    { label: "Pending Consultations", value: stats.pendingConsultations, icon: MessageSquare, color: "bg-amber-50 text-amber-700", link: "/admin/consultations" },
    { label: "Disease Records", value: stats.totalDiseases, icon: Microscope, color: "bg-red-50 text-red-700", link: "/admin" },
    { label: "Total Livestock", value: stats.totalLivestock, icon: Beef, color: "bg-purple-50 text-purple-700", link: "/admin" },
  ] : [];

  return (
    <DashboardLayout>
      <Helmet><title>Admin Dashboard — AgriVet AI</title></Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and management</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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

          {/* User Growth Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4 font-heading">User Growth (Last 6 Months)</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#166534" fill="#dcfce7" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">No growth data yet</div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Manage Users", link: "/admin/users", icon: Users, desc: "View and manage all registered users" },
              { label: "Manage Schemes", link: "/admin/schemes", icon: FileText, desc: "Add, edit, and manage government schemes" },
              { label: "Manage Consultations", link: "/admin/consultations", icon: MessageSquare, desc: "Review and assign expert consultations" },
            ].map((action) => (
              <Link key={action.label} to={action.link} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                  <action.icon className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 font-heading mb-1">{action.label}</h3>
                <p className="text-xs text-gray-500">{action.desc}</p>
                <div className="flex items-center gap-1 text-green-700 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                  Go <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
