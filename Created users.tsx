import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Users, Search, Loader2, Shield, User } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  location: string;
  isActive: boolean;
  createdAt: string;
}

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  expert: "bg-purple-100 text-purple-700",
  farmer: "bg-green-100 text-green-700",
  livestock_owner: "bg-blue-100 text-blue-700",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (roleFilter !== "all") params.set("role", roleFilter);
        const data = await apiClient.get(`/api/admin/users?${params}`);
        setUsers(data);
      } catch {}
      setLoading(false);
    };
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await apiClient.put(`/api/admin/users/${id}`, { isActive: !isActive });
      setUsers(users.map((u) => u._id === id ? { ...u, isActive: !isActive } : u));
    } catch {}
  };

  return (
    <DashboardLayout>
      <Helmet><title>User Management — AgriVet AI Admin</title></Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
          <Users className="w-6 h-6 text-green-700" /> User Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} total users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white">
          <option value="all">All Roles</option>
          <option value="farmer">Farmer</option>
          <option value="livestock_owner">Livestock Owner</option>
          <option value="expert">Expert</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden md:table-cell">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {u.role === "admin" ? <Shield className="w-4 h-4 text-red-600" /> : <User className="w-4 h-4 text-green-700" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[u.role] || "bg-gray-100 text-gray-700"}`}>
                        {u.role?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-500">{u.location || "—"}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(u._id, u.isActive)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${u.isActive ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700" : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
