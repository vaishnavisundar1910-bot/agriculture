import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Beef, Plus, Edit2, Trash2, Loader2, X, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";
import { useTranslation } from "@/i18n/useTranslation";

interface LivestockItem {
  _id: string;
  type: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  healthStatus: string;
  pregnancyStatus: string;
  notes: string;
}

const typeEmojis: Record<string, string> = { cow: "🐄", buffalo: "🐃", goat: "🐐", sheep: "🐑", poultry: "🐔", pet: "🐾" };
const healthColors: Record<string, string> = {
  healthy: "bg-green-100 text-green-700",
  sick: "bg-red-100 text-red-700",
  recovering: "bg-amber-100 text-amber-700",
  unknown: "bg-gray-100 text-gray-700",
};

const defaultForm = { type: "cow", name: "", breed: "", age: 0, weight: 0, healthStatus: "healthy", pregnancyStatus: "not_pregnant", notes: "" };

export default function LivestockPage() {
  const [livestock, setLivestock] = useState<LivestockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<LivestockItem | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const { t, language } = useTranslation();

  const fetchLivestock = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/api/livestock");
      setLivestock(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchLivestock(); }, []);

  const openAdd = () => { setEditItem(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (item: LivestockItem) => { setEditItem(item); setForm({ type: item.type, name: item.name, breed: item.breed, age: item.age, weight: item.weight, healthStatus: item.healthStatus, pregnancyStatus: item.pregnancyStatus, notes: item.notes }); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await apiClient.put(`/api/livestock/${editItem._id}`, form);
        setSuccess("Animal updated successfully!");
      } else {
        await apiClient.post("/api/livestock", form);
        setSuccess("Animal added successfully!");
      }
      setShowModal(false);
      fetchLivestock();
      setTimeout(() => setSuccess(""), 3000);
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/api/livestock/${id}`);
      setLivestock(livestock.filter((l) => l._id !== id));
      setDeleteId(null);
    } catch {}
  };

  return (
    <DashboardLayout>
      <Helmet><title>Livestock — AgriVet AI</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <Beef className="w-6 h-6 text-green-700" /> {t("livestock")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{language === "ta" ? "உங்கள் கால்நடைகளை நிர்வகிக்கவும்" : "Manage your livestock"}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2.5 rounded-lg hover:bg-green-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> {t("addAnimal")}
        </button>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : livestock.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <div className="text-5xl mb-3">🐄</div>
          <p className="text-gray-500 font-medium">No livestock added yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add Animal" to get started</p>
          <button onClick={openAdd} className="mt-4 bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Add Your First Animal</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {livestock.map((item) => (
            <div key={item._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{typeEmojis[item.type] || "🐾"}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 font-heading">{item.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{item.type} • {item.breed || "Unknown breed"}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${healthColors[item.healthStatus]}`}>
                  {item.healthStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                <div><span className="text-gray-400">Age:</span> {item.age} months</div>
                <div><span className="text-gray-400">Weight:</span> {item.weight} kg</div>
                {item.pregnancyStatus !== "not_pregnant" && (
                  <div className="col-span-2 text-amber-600 font-medium">🤰 {item.pregnancyStatus}</div>
                )}
              </div>
              {item.notes && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.notes}</p>}
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => setDeleteId(item._id)} className="flex items-center justify-center gap-1 px-3 py-1.5 border border-red-200 rounded-lg text-xs text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 font-heading">{editItem ? "Edit Animal" : "Add Animal"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    {["cow", "buffalo", "goat", "sheep", "poultry", "pet"].map((t) => (
                      <option key={t} value={t}>{typeEmojis[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Lakshmi" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Breed</label>
                  <input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. HF Cross" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Health Status</label>
                  <select value={form.healthStatus} onChange={(e) => setForm({ ...form, healthStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="healthy">Healthy</option>
                    <option value="sick">Sick</option>
                    <option value="recovering">Recovering</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Age (months)</label>
                  <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" placeholder="Any additional notes..." />
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

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-bold text-gray-900 mb-2">Delete Animal?</h3>
            <p className="text-gray-500 text-sm mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
