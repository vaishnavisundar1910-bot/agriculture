import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Search, Sprout, Loader2, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";
import { useTranslation } from "@/i18n/useTranslation";

interface Crop {
  _id: string;
  name: string;
  nameTa: string;
  season: string;
  soilType: string;
  cultivationGuide: string;
}

const seasonColors: Record<string, string> = {
  Kharif: "bg-green-100 text-green-700",
  Rabi: "bg-blue-100 text-blue-700",
  Zaid: "bg-amber-100 text-amber-700",
};

const cropEmojis: Record<string, string> = {
  "Rice (Paddy)": "🌾", Wheat: "🌾", Cotton: "🌿", Sugarcane: "🎋",
  Banana: "🍌", Tomato: "🍅", Onion: "🧅", Groundnut: "🥜",
  Turmeric: "🌿", Chilli: "🌶️", Coconut: "🥥", Maize: "🌽",
};

export default function AgriculturePage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("all");
  const { language } = useTranslation();

  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (season !== "all") params.set("season", season);
        const data = await apiClient.get(`/api/crops?${params}`);
        setCrops(data);
      } catch {}
      setLoading(false);
    };
    const timer = setTimeout(fetchCrops, 300);
    return () => clearTimeout(timer);
  }, [search, season]);

  return (
    <DashboardLayout>
      <Helmet><title>Agriculture — AgriVet AI</title></Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
          <Sprout className="w-6 h-6 text-green-700" /> Agriculture Guide
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {language === "ta" ? "பயிர் சாகுபடி வழிகாட்டி" : "Crop cultivation guides for Tamil Nadu farmers"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === "ta" ? "பயிர் தேடு..." : "Search crops..."}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={season} onChange={(e) => setSeason(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white">
            <option value="all">All Seasons</option>
            <option value="Kharif">Kharif (Samba)</option>
            <option value="Rabi">Rabi (Navarai)</option>
            <option value="Zaid">Zaid (Kuruvai)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : crops.length === 0 ? (
        <div className="text-center py-20">
          <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No crops found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {crops.map((crop) => (
            <Link key={crop._id} to={`/agriculture/${crop._id}`}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group">
              <div className="text-4xl mb-3">{cropEmojis[crop.name] || "🌱"}</div>
              <h3 className="font-semibold text-gray-900 font-heading group-hover:text-green-700 transition-colors">
                {language === "ta" && crop.nameTa ? crop.nameTa : crop.name}
              </h3>
              {language === "ta" && crop.nameTa && (
                <p className="text-xs text-gray-500 mt-0.5">{crop.name}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${seasonColors[crop.season] || "bg-gray-100 text-gray-700"}`}>
                  {crop.season}
                </span>
                <span className="text-xs text-gray-400">{crop.soilType?.split(",")[0]}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
