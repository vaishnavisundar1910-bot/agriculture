import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Users, Plus, Send, X, Loader2, MessageSquare } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/i18n/useTranslation";

interface Consultation {
  _id: string;
  subject: string;
  description: string;
  status: string;
  category: string;
  messages: Array<{ senderId: string; senderName: string; content: string; timestamp: string }>;
  userId: { name: string; email: string };
  expertId?: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: "bg-amber-100 text-amber-700", label: "Pending" },
  assigned: { color: "bg-blue-100 text-blue-700", label: "Assigned" },
  in_progress: { color: "bg-green-100 text-green-700", label: "In Progress" },
  resolved: { color: "bg-gray-100 text-gray-700", label: "Resolved" },
};

const defaultForm = { subject: "", description: "", category: "crop" };

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const { user } = useAuthStore();
  const { language } = useTranslation();

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/api/consultations");
      setConsultations(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchConsultations(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post("/api/consultations", form);
      setShowModal(false);
      setForm(defaultForm);
      fetchConsultations();
    } catch {}
    setSaving(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selected) return;
    try {
      const updated = await apiClient.post(`/api/consultations/${selected._id}/message`, { content: message, senderName: user?.name });
      setMessage("");
      setSelected(updated);
      fetchConsultations();
    } catch {}
  };

  return (
    <DashboardLayout>
      <Helmet><title>Consultations — AgriVet AI</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <Users className="w-6 h-6 text-green-700" />
            {language === "ta" ? "நிபுணர் ஆலோசனைகள்" : "Expert Consultations"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {language === "ta" ? "நிபுணர்களிடம் ஆலோசனை பெறுங்கள்" : "Get expert advice from agricultural and veterinary experts"}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2.5 rounded-lg hover:bg-green-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> New Consultation
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5">
          {/* List */}
          <div className="lg:col-span-2 space-y-3">
            {consultations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No consultations yet</p>
                <button onClick={() => setShowModal(true)} className="mt-3 bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-green-800">Start Consultation</button>
              </div>
            ) : (
              consultations.map((c) => {
                const config = statusConfig[c.status] || statusConfig.pending;
                return (
                  <div key={c._id} onClick={() => setSelected(c)}
                    className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all ${selected?._id === c._id ? "border-green-300 bg-green-50" : "border-gray-100 hover:shadow-md"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{c.subject}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${config.color}`}>{config.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{c.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400 capitalize">{c.category}</span>
                      <span className="text-xs text-gray-400">{new Date(c.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900 font-heading">{selected.subject}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[selected.status]?.color}`}>
                      {statusConfig[selected.status]?.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{selected.description}</p>
                  {selected.expertId && (
                    <p className="text-xs text-green-700 mt-1">Expert: {selected.expertId.name}</p>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selected.messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    selected.messages.map((msg, i) => {
                      const isMe = msg.senderId?.toString() === user?.id;
                      return (
                        <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-green-700 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}>
                            {!isMe && <p className="text-xs font-medium mb-1 text-green-700">{msg.senderName}</p>}
                            <p>{msg.content}</p>
                            <p className={`text-xs mt-1 ${isMe ? "text-green-200" : "text-gray-400"}`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {selected.status !== "resolved" && (
                  <div className="p-4 border-t border-gray-100 flex gap-2">
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <button onClick={handleSendMessage} disabled={!message.trim()}
                      className="p-2 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-[300px]">
                <div className="text-center text-gray-400">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">Select a consultation to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Consultation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 font-heading">New Consultation</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. My cow has fever and reduced milk production" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="crop">Crop Issue</option>
                  <option value="livestock">Livestock Health</option>
                  <option value="scheme">Government Scheme</option>
                  <option value="general">General Query</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Describe your problem in detail..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />} Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
