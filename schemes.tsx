import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { FileText, Search, ExternalLink, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";
import { useTranslation } from "@/i18n/useTranslation";

interface Scheme {
  _id: string;
  title: string;
  titleTa: string;
  description: string;
  descriptionTa: string;
  category: string;
  eligibility: string;
  benefits: string;
  applicationLink: string;
}

const categories = [
  { value: "all", label: "All", labelTa: "அனைத்தும்" },
  { value: "agriculture", label: "Agriculture", labelTa: "விவசாயம்" },
  { value: "dairy", label: "Dairy", labelTa: "பால் பண்ணை" },
  { value: "goat", label: "Goat", labelTa: "ஆடு" },
  { value: "poultry", label: "Poultry", labelTa: "கோழி" },
  { value: "state", label: "State", labelTa: "மாநில" },
  { value: "central", label: "Central", labelTa: "மத்திய" },
];

const categoryColors: Record<string, string> = {
  agriculture: "bg-green-100 text-green-700 border-green-200",
  dairy: "bg-blue-100 text-blue-700 border-blue-200",
  goat: "bg-amber-100 text-amber-700 border-amber-200",
  poultry: "bg-orange-100 text-orange-700 border-orange-200",
  state: "bg-purple-100 text-purple-700 border-purple-200",
  central: "bg-red-100 text-red-700 border-red-200",
};

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { language } = useTranslation();

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category !== "all") params.set("category", category);
        const data = await apiClient.get(`/api/schemes?${params}`);
        setSchemes(data);
      } catch {}
      setLoading(false);
    };
    const timer = setTimeout(fetchSchemes, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <DashboardLayout>
      <Helmet><title>Government Schemes — AgriVet AI</title></Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
          <FileText className="w-6 h-6 text-green-700" />
          {language === "ta" ? "அரசு திட்டங்கள்" : "Government Schemes"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {language === "ta" ? "விவசாயிகளுக்கான அரசு திட்டங்கள் மற்றும் மானியங்கள்" : "Government schemes and subsidies for farmers"}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={language === "ta" ? "திட்டங்கள் தேடு..." : "Search schemes..."}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button key={cat.value} onClick={() => setCategory(cat.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat.value ? "bg-green-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>
            {language === "ta" ? cat.labelTa : cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : schemes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No schemes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map((scheme) => (
            <div key={scheme._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryColors[scheme.category] || "bg-gray-100 text-gray-700"}`}>
                  {scheme.category}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 font-heading mb-2 leading-snug">
                {language === "ta" && scheme.titleTa ? scheme.titleTa : scheme.title}
              </h3>
              {language === "ta" && scheme.titleTa && (
                <p className="text-xs text-gray-400 mb-2">{scheme.title}</p>
              )}
              <p className="text-sm text-gray-600 line-clamp-2 flex-1 mb-4">
                {language === "ta" && scheme.descriptionTa ? scheme.descriptionTa : scheme.description}
              </p>
              <div className="flex gap-2 mt-auto">
                <Link to={`/schemes/${scheme._id}`} className="flex-1 text-center px-3 py-2 border border-green-200 text-green-700 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors">
                  View Details
                </Link>
                {scheme.applicationLink && (
                  <a href={scheme.applicationLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 bg-green-700 text-white rounded-lg text-xs font-medium hover:bg-green-800 transition-colors">
                    Apply <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
