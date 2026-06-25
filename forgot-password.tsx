import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Sprout, Loader2, CheckCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password — AgriVet AI</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-green-800 font-heading">AgriVet AI</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">Forgot Password</h1>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {sent ? (
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">Reset link sent!</p>
                <p className="text-gray-500 text-sm mt-1">Check your email for password reset instructions.</p>
                <Link to="/login" className="mt-4 inline-block text-green-700 font-semibold hover:text-green-900">Back to Login</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" placeholder="farmer@example.com" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Reset Link
                </button>
                <div className="text-center">
                  <Link to="/login" className="text-sm text-green-700 hover:text-green-900">Back to Login</Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
