import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { TrendingUp, Search, TrendingDown, Minus, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";
import { useTranslation } from "@/i18n/useTranslation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MarketPrice {
  _id: string;
  cropName: string;
  cropNameTa: string;
  price: number;
  unit: string;
  market: string;
  location: string;
  date: string;
  priceHistory: Array<{ price: number; date: string }>;
}

export default function MarketPricesPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<MarketPrice | null>(null);
  const [trendDays, setTrendDays] = useState(30);
  const { language } = useTranslation();

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("crop", search);
        const data = await apiClient.get(`/api/market-prices?${params}`);
        setPrices(data);
        if (data.length > 0 && !selectedCrop) setSelectedCrop(data[0]);
      } catch {}
      setLoading(false);
    };
    const timer = setTimeout(fetchPrices, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const getPriceChange = (crop: MarketPrice) => {
    const history = crop.priceHistory;
    if (history.length < 2) return 0;
    const prev = history[history.length - 2]?.price || crop.price;
    return ((crop.price - prev) / prev) * 100;
  };

  const chartData = selectedCrop?.priceHistory
    .slice(-trendDays)
    .map((h) => ({ date: new Date(h.date).toLocaleDateString("en", { month: "short", day: "numeric" }), price: h.price })) || [];

  return (
    <DashboardLayout>
      <Helmet><title>Market Prices — AgriVet AI</title></Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-700" />
          {language === "ta" ? "சந்தை விலைகள்" : "Market Prices"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {language === "ta" ? "தமிழ்நாடு APMC சந்தை விலைகள்" : "Live crop prices from Tamil Nadu APMCs"}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={language === "ta" ? "பயிர் தேடு..." : "Search crops..."}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Price Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Crop</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Price</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Change</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">Market</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {prices.map((p) => {
                    const change = getPriceChange(p);
                    return (
                      <tr key={p._id} onClick={() => setSelectedCrop(p)}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedCrop?._id === p._id ? "bg-green-50" : ""}`}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 text-sm">
                            {language === "ta" && p.cropNameTa ? p.cropNameTa : p.cropName}
                          </p>
                          <p className="text-xs text-gray-400">{p.unit}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-semibold text-gray-900 text-sm">₹{p.price.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`flex items-center justify-end gap-1 text-xs font-medium ${change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-500"}`}>
                            {change > 0 ? <TrendingUp className="w-3 h-3" /> : change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                            {Math.abs(change).toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <p className="text-xs text-gray-500">{p.market}</p>
                          <p className="text-xs text-gray-400">{p.location}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            {selectedCrop ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm font-heading">
                      {language === "ta" && selectedCrop.cropNameTa ? selectedCrop.cropNameTa : selectedCrop.cropName}
                    </h3>
                    <p className="text-xs text-gray-500">{language === "ta" ? "விலை போக்கு" : "Price Trend"}</p>
                  </div>
                  <div className="flex gap-1">
                    {[7, 30, 90].map((d) => (
                      <button key={d} onClick={() => setTrendDays(d)}
                        className={`px-2 py-1 rounded text-xs font-medium ${trendDays === d ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600"}`}>
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 font-heading mb-4">
                  ₹{selectedCrop.price.toLocaleString()}
                  <span className="text-xs text-gray-400 font-normal ml-1">{selectedCrop.unit}</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
                    <Tooltip formatter={(v) => [`₹${v}`, "Price"]} />
                    <Line type="monotone" dataKey="price" stroke="#166534" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Select a crop to view trend</p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
