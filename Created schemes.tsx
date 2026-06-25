import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { FileText, Plus, Edit2, Trash2, X, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";

interface Scheme {
  _id: string;
  title: string;
  titleTa: string;
  description: string;
  descriptionTa: string;
  category: string;
  eligibility: string;
  benefits: string;
  documents: string;
  applicationLink: string;
  isActive: boolean;
}

const defaultForm = { title: "", titleTa: "", description: "", descriptionTa: "", category: "agriculture", eligibility: "", benefits: "", documents: "", applicationLink: "", isActive: true };

export default function AdminSchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Scheme | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/api/schemes");
      setSchemes(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchSchemes(); }, []);

  const openAdd = () => { setEditItem(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (s: Scheme) => { setEditItem(s); setForm({ title: s.title, titleTa: s.titleTa, description: s.description, descriptionTa: s.descriptionTa, category: s.category, eligibility: s.eligibility, benefits: s.benefits, documents: s.documents, applicationLink: s.applicationLink, isActive: s.isActive }); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await apiClient.put(`/api/schemes/${editItem._id}`, form);
      } else {
        await apiClient.post("/api/schemes", form);
      }
      setShowModal(false);
      fetchSchemes();
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this scheme?")) return;
    try {
      await apiClient.delete(`/api/schemes/${id}`);
      setSchemes(schemes.filter((s) => s._id !== id));
    } catch {}
  };

  const toggleActive = async (s: Scheme) => {
    try {
      await apiClient.put(`/api/schemes/${s._id}`, { isActive: !s.isActive });
      setSchemes(schemes.map((sc) => sc._id === s._id ? { ...sc, isActive: !sc.isActive } : sc));
    } catch {}
  };

  return (
    <DashboardLayout>
      <Helmet><title>Scheme Management — AgriVet AI Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-700" /> Scheme Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">{schemes.length} schemes in database</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2.5 rounded-lg hover:bg-green-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Scheme
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Scheme</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {schemes.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">{s.title}</p>
                      {s.titleTa && <p className="text-xs text-gray-400">{s.titleTa}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">{s.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(s)} className={`flex items-center gap-1 text-xs font-medium ${s.isActive ? "text-green-600" : "text-gray-400"}`}>
                        {s.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {s.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 font-heading">{editItem ? "Edit Scheme" : "Add New Scheme"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title (English) *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title (Tamil)</label>
                  <input value={form.titleTa} onChange={(e) => setForm({ ...form, titleTa: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  {["agriculture", "dairy", "goat", "poultry", "state", "central"].map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description (English) *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description (Tamil)</label>
                <textarea value={form.descriptionTa} onChange={(e) => setForm({ ...form, descriptionTa: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Eligibility</label>
                <textarea value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Benefits</label>
                <textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Required Documents (comma-separated)</label>
                <input value={form.documents} onChange={(e) => setForm({ ...form, documents: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Aadhaar Card, Land Records, Bank Account" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Application Link</label>
                <input type="url" value={form.applicationLink} onChange={(e) => setForm({ ...form, applicationLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />} Save Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
