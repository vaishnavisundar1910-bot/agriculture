import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { MessageSquare, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";

interface Consultation {
  _id: string;
  subject: string;
  status: string;
  category: string;
  userId: { name: string; email: string };
  expertId?: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  assigned: "bg-blue-100 text-blue-700",
  in_progress: "bg-green-100 text-green-700",
  resolved: "bg-gray-100 text-gray-700",
};

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/admin/consultations").then(setConsultations).catch(console.error).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiClient.put(`/api/consultations/${id}/status`, { status });
      setConsultations(consultations.map((c) => c._id === id ? { ...c, status } : c));
    } catch {}
  };

  return (
    <DashboardLayout>
      <Helmet><title>Consultation Management — AgriVet AI Admin</title></Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-green-700" /> Consultation Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">{consultations.length} total consultations</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {consultations.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">{c.subject}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{c.userId?.name}</p>
                      <p className="text-xs text-gray-400">{c.userId?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500 capitalize">{c.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] || "bg-gray-100 text-gray-700"}`}>
                        {c.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}
                        className="px-2 py-1 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500">
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
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
