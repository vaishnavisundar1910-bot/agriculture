import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { ArrowLeft, FileText, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
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
  documents: string;
  applicationLink: string;
}

export default function SchemeDetailPage() {
  const { id } = useParams();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useTranslation();

  useEffect(() => {
    apiClient.get(`/api/schemes/${id}`).then(setScheme).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div></DashboardLayout>;
  if (!scheme) return <DashboardLayout><div className="text-center py-20 text-gray-500">Scheme not found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <Helmet><title>{scheme.title} — AgriVet AI</title></Helmet>
      <div className="max-w-3xl">
        <Link to="/schemes" className="flex items-center gap-2 text-green-700 hover:text-green-900 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Schemes
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-white">
            <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-medium capitalize mb-3 inline-block">{scheme.category}</span>
            <h1 className="text-xl font-bold font-heading leading-snug">
              {language === "ta" && scheme.titleTa ? scheme.titleTa : scheme.title}
            </h1>
            {language === "ta" && scheme.titleTa && (
              <p className="text-green-200 text-sm mt-1">{scheme.title}</p>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 font-heading">About this Scheme</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {language === "ta" && scheme.descriptionTa ? scheme.descriptionTa : scheme.description}
              </p>
            </div>

            {scheme.eligibility && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-2 font-heading flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {language === "ta" ? "தகுதி" : "Eligibility"}
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed bg-green-50 p-3 rounded-lg">{scheme.eligibility}</p>
              </div>
            )}

            {scheme.benefits && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-2 font-heading">
                  {language === "ta" ? "நன்மைகள்" : "Benefits"}
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed bg-amber-50 p-3 rounded-lg">{scheme.benefits}</p>
              </div>
            )}

            {scheme.documents && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-2 font-heading">
                  {language === "ta" ? "தேவையான ஆவணங்கள்" : "Required Documents"}
                </h2>
                <div className="space-y-1">
                  {scheme.documents.split(",").map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0" />
                      {doc.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scheme.applicationLink && (
              <div className="pt-2">
                <a href={scheme.applicationLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  {language === "ta" ? "ஆன்லைனில் விண்ணப்பிக்கவும்" : "Apply Online"}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
