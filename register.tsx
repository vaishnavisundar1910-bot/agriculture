import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Sprout, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api-client";
import { useTranslation } from "@/i18n/useTranslation";

const roles = [
  { value: "farmer", label: "Farmer", labelTa: "விவசாயி" },
  { value: "livestock_owner", label: "Livestock Owner", labelTa: "கால்நடை உரிமையாளர்" },
  { value: "expert", label: "Expert / Consultant", labelTa: "நிபுணர்" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "farmer", phone: "", location: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const data = await apiClient.post("/api/auth/register", form);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Register — AgriVet AI</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-green-800 font-heading">AgriVet AI</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">{t("register")}</h1>
            <p className="text-gray-600 text-sm mt-1">புதிய கணக்கு உருவாக்கவும்</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("name")}</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" placeholder="Rajan Kumar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")}</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" placeholder="farmer@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("password")}</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm pr-10" placeholder="Min 6 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("role")}</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white">
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>{r.label} — {r.labelTa}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("phone")}</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("location")}</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" placeholder="Chennai, TN" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("signUp")}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t("hasAccount")}{" "}
                <Link to="/login" className="text-green-700 font-semibold hover:text-green-900">{t("signIn")}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
