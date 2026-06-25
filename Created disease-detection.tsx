import { useState, useRef } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Microscope, Upload, X, Loader2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";
import { useTranslation } from "@/i18n/useTranslation";

interface DetectionResult {
  diseaseName: string;
  confidence: number;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  treatment: string[];
  severity?: string;
  urgency?: string;
  veterinaryAdvice?: string;
}

export default function DiseaseDetectionPage() {
  const [tab, setTab] = useState<"crop" | "animal">("crop");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [animalType, setAnimalType] = useState("cow");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useTranslation();

  const handleImageChange = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageChange(file);
  };

  const handleDetect = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      if (image) formData.append("image", image);
      if (tab === "animal") {
        formData.append("symptoms", symptoms);
        formData.append("animalType", animalType);
      }
      const data = await apiClient.postForm(`/api/disease-detection/${tab}`, formData);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Detection failed");
    }
    setLoading(false);
  };

  const severityColor = (s?: string) => {
    if (s === "high" || s === "emergency") return "text-red-600 bg-red-50";
    if (s === "medium") return "text-amber-600 bg-amber-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <DashboardLayout>
      <Helmet><title>Disease Detection — AgriVet AI</title></Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
          <Microscope className="w-6 h-6 text-green-700" />
          {language === "ta" ? "நோய் கண்டறிதல்" : "Disease Detection"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {language === "ta" ? "AI மூலம் பயிர் மற்றும் விலங்கு நோய்களை கண்டறியுங்கள்" : "AI-powered crop and animal disease detection"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["crop", "animal"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setResult(null); setImage(null); setImagePreview(null); }}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t ? "bg-green-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {t === "crop" ? (language === "ta" ? "🌾 பயிர் நோய்" : "🌾 Crop Disease") : (language === "ta" ? "🐄 விலங்கு நோய்" : "🐄 Animal Disease")}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          {/* Image Upload */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${imagePreview ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-green-50 cursor-pointer"}`}
          >
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                <button onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); setResult(null); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium text-sm">
                  {language === "ta" ? "படத்தை இங்கே இழுத்து விடுங்கள் அல்லது கிளிக் செய்யுங்கள்" : "Drag & drop image or click to upload"}
                </p>
                <p className="text-gray-400 text-xs mt-1">PNG, JPG up to 10MB</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])} />

          {/* Animal-specific fields */}
          {tab === "animal" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Animal Type</label>
                <select value={animalType} onChange={(e) => setAnimalType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white">
                  {["cow", "buffalo", "goat", "sheep", "poultry", "dog", "cat"].map((a) => (
                    <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "ta" ? "அறிகுறிகளை விவரிக்கவும்" : "Describe Symptoms"}
                </label>
                <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                  placeholder={language === "ta" ? "உதா: காய்ச்சல், வாய் புண்கள், நடக்க சிரமம்..." : "e.g., fever, mouth sores, difficulty walking, reduced milk..."} />
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <button onClick={handleDetect} disabled={loading || (!image && tab === "crop") || (tab === "animal" && !image && !symptoms)}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Microscope className="w-5 h-5" /> {language === "ta" ? "நோய் கண்டறி" : "Detect Disease"}</>}
          </button>
        </div>

        {/* Results */}
        <div>
          {!result && !loading && (
            <div className="bg-gray-50 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
              <Microscope className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">
                {language === "ta" ? "படத்தை பதிவேற்றி கண்டறிவு தொடங்கவும்" : "Upload an image to start detection"}
              </p>
              <p className="text-gray-400 text-sm mt-1">AI will analyze and provide diagnosis</p>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-700 to-green-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold font-heading">{result.diseaseName}</h2>
                  {(result.severity || result.urgency) && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(result.severity || result.urgency)}`}>
                      {result.severity || result.urgency}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-green-200 mb-1">
                    <span>Confidence</span>
                    <span>{result.confidence}%</span>
                  </div>
                  <div className="w-full bg-green-800 rounded-full h-2">
                    <div className="bg-amber-400 h-2 rounded-full transition-all" style={{ width: `${result.confidence}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {result.symptoms?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-1"><Info className="w-4 h-4 text-blue-500" /> Symptoms</h3>
                    <ul className="space-y-1">{result.symptoms.map((s, i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>{s}</li>)}</ul>
                  </div>
                )}
                {result.causes?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-amber-500" /> Causes</h3>
                    <ul className="space-y-1">{result.causes.map((c, i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span>{c}</li>)}</ul>
                  </div>
                )}
                {result.prevention?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Prevention</h3>
                    <ul className="space-y-1">{result.prevention.map((p, i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>{p}</li>)}</ul>
                  </div>
                )}
                {result.treatment?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-1">💊 Treatment</h3>
                    <ul className="space-y-1">{result.treatment.map((t, i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-2"><span className="text-purple-500 mt-0.5">→</span>{t}</li>)}</ul>
                  </div>
                )}
                {result.veterinaryAdvice && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800 font-medium">⚕️ {result.veterinaryAdvice}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
