import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Syringe, Plus, CheckCircle, AlertTriangle, Clock, X, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";
import { useTranslation } from "@/i18n/useTranslation";

interface Vaccination {
  _id: string;
  livestockName: string;
  livestockType: string;
  vaccineName: string;
  scheduledDate: string;
  completedDate?: string;
  status: "scheduled" | "completed" | "overdue";
  notes: string;
}

const statusConfig = {
  scheduled: { color: "bg-blue-100 text-blue-700", icon: Clock, label: "Scheduled" },
  completed: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Completed" },
  overdue: { color: "bg-red-100 text-red-700", icon: AlertTriangle, label: "Overdue" },
};

const defaultForm = { livestockName: "", livestockType: "cow", vaccineName: "", scheduledDate: "", notes: "" };

export default function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const { language } = useTranslation();

  const fetchVaccinations = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/api/vaccinations");
      setVaccinations(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchVaccinations(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post("/api/vaccinations", form);
      setShowModal(false);
      setForm(defaultForm);
      fetchVaccinations();
    } catch {}
    setSaving(false);
  };

  const markComplete = async (id: string) => {
    try {
      await apiClient.put(`/api/vaccinations/${id}`, { status: "completed" });
      fetchVaccinations();
    } catch {}
  };

  const filtered = filter === "all" ? vaccinations : vaccinations.filter((v) => v.status === filter);

  return (
    <DashboardLayout>
      <Helmet><title>Vaccinations — AgriVet AI</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <Syringe className="w-6 h-6 text-green-700" />
            {language === "ta" ? "தடுப்பூசி அட்டவணை" : "Vaccination Schedule"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {language === "ta" ? "உங்கள் கால்நடைகளின் தடுப்பூசி அட்டவணை" : "Track vaccination schedules for your livestock"}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2.5 rounded-lg hover:bg-green-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Scheduled", value: vaccinations.filter((v) => v.status === "scheduled").length, color: "bg-blue-50 text-blue-700" },
          { label: "Completed", value: vaccinations.filter((v) => v.status === "completed").length, color: "bg-green-50 text-green-700" },
          { label: "Overdue", value: vaccinations.filter((v) => v.status === "overdue").length, color: "bg-red-50 text-red-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <div className="text-2xl font-bold font-heading">{s.value}</div>
            <div className="text-xs font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {["all", "scheduled", "overdue", "completed"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${filter === f ? "bg-green-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <Syringe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No vaccinations found</p>
          <button onClick={() => setShowModal(true)} className="mt-3 bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Add Schedule</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((v) => {
            const config = statusConfig[v.status];
            const isOverdue = v.status === "overdue";
            return (
              <div key={v._id} className={`bg-white rounded-xl p-4 shadow-sm border ${isOverdue ? "border-red-200" : "border-gray-100"} flex items-center gap-4`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                  <config.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-sm">{v.vaccineName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {v.livestockName} ({v.livestockType}) • {new Date(v.scheduledDate).toLocaleDateString()}
                  </p>
                  {v.notes && <p className="text-xs text-gray-400 mt-0.5">{v.notes}</p>}
                </div>
                {v.status !== "completed" && (
                  <button onClick={() => markComplete(v._id)}
                    className="flex-shrink-0 px-3 py-1.5 bg-green-700 text-white rounded-lg text-xs font-medium hover:bg-green-800 transition-colors">
                    Mark Done
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 font-heading">Add Vaccination Schedule</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Animal Name *</label>
                  <input value={form.livestockName} onChange={(e) => setForm({ ...form, livestockName: e.target.value })} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Lakshmi" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Animal Type</label>
                  <select value={form.livestockType} onChange={(e) => setForm({ ...form, livestockType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    {["cow", "buffalo", "goat", "sheep", "poultry", "pet"].map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Vaccine Name *</label>
                <input value={form.vaccineName} onChange={(e) => setForm({ ...form, vaccineName: e.target.value })} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. FMD Vaccine" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Scheduled Date *</label>
                <input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" placeholder="Optional notes..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
