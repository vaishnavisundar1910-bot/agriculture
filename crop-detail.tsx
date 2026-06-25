import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { ArrowLeft, Sprout, Droplets, Bug, FlaskConical, Loader2 } from "lucide-react";
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
  fertilizerRecommendation: string;
  irrigationInfo: string;
  pestInfo: string;
}

export default function CropDetailPage() {
  const { cropId } = useParams();
  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useTranslation();

  useEffect(() => {
    apiClient.get(`/api/crops/${cropId}`).then(setCrop).catch(console.error).finally(() => setLoading(false));
  }, [cropId]);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div></DashboardLayout>;
  if (!crop) return <DashboardLayout><div className="text-center py-20 text-gray-500">Crop not found</div></DashboardLayout>;

  const sections = [
    { icon: Sprout, title: "Cultivation Guide", titleTa: "சாகுபடி வழிகாட்டி", content: crop.cultivationGuide, color: "text-green-700 bg-green-50" },
    { icon: FlaskConical, title: "Fertilizer Recommendation", titleTa: "உர பரிந்துரை", content: crop.fertilizerRecommendation, color: "text-blue-700 bg-blue-50" },
    { icon: Droplets, title: "Irrigation Management", titleTa: "நீர்ப்பாசன மேலாண்மை", content: crop.irrigationInfo, color: "text-sky-700 bg-sky-50" },
    { icon: Bug, title: "Pest & Disease Management", titleTa: "பூச்சி & நோய் மேலாண்மை", content: crop.pestInfo, color: "text-red-700 bg-red-50" },
  ];

  return (
    <DashboardLayout>
      <Helmet><title>{crop.name} — AgriVet AI</title></Helmet>
      <div className="mb-6">
        <Link to="/agriculture" className="flex items-center gap-2 text-green-700 hover:text-green-900 text-sm font-medium mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Agriculture
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🌱</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">
              {language === "ta" && crop.nameTa ? crop.nameTa : crop.name}
            </h1>
            {language === "ta" && crop.nameTa && <p className="text-gray-500 text-sm">{crop.name}</p>}
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Season: {crop.season}</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">Soil: {crop.soilType?.split(",")[0]}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`flex items-center gap-2 mb-3 p-2 rounded-lg w-fit ${section.color}`}>
              <section.icon className="w-5 h-5" />
              <h2 className="font-semibold text-sm font-heading">
                {language === "ta" ? section.titleTa : section.title}
              </h2>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {section.content || "Information not available"}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
