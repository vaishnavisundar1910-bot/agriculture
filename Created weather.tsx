import { useEffect, useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Cloud, Search, Droplets, Wind, Thermometer, Eye, Loader2, AlertTriangle, Sprout } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/i18n/useTranslation";

interface WeatherData {
  city: string;
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    condition: string;
    pressure: number;
    visibility: number;
  };
  forecast: Array<{
    date: string;
    temp: { min: number; max: number };
    description: string;
    icon: string;
    humidity: number;
  }>;
  farmingRecommendations: string[];
  alerts: string[];
  note?: string;
}

const weatherIcons: Record<string, string> = {
  Clear: "☀️", Clouds: "⛅", Rain: "🌧️", Drizzle: "🌦️",
  Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Fog: "🌫️",
};

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuthStore();
  const { language } = useTranslation();

  useEffect(() => {
    const defaultCity = user?.location?.split(",")[0]?.trim() || "Chennai";
    setCity(defaultCity);
    setSearchCity(defaultCity);
    fetchWeather(defaultCity);
  }, [user?.location]);

  const fetchWeather = async (c: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.get(`/api/weather?city=${encodeURIComponent(c)}`);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity.trim());
      fetchWeather(searchCity.trim());
    }
  };

  return (
    <DashboardLayout>
      <Helmet><title>Weather — AgriVet AI</title></Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
          <Cloud className="w-6 h-6 text-green-700" />
          {language === "ta" ? "வானிலை" : "Weather Dashboard"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {language === "ta" ? "உங்கள் பகுதியின் வானிலை மற்றும் விவசாய பரிந்துரைகள்" : "Real-time weather with farming recommendations"}
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium">
          Search
        </button>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : weather ? (
        <div className="space-y-5">
          {weather.note && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              ℹ️ {weather.note}
            </div>
          )}

          {/* Current Weather */}
          <div className="bg-gradient-to-br from-green-700 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">{weather.city}</p>
                <div className="flex items-end gap-3 mt-1">
                  <span className="text-6xl font-bold font-heading">{weather.current.temp}°C</span>
                  <span className="text-5xl">{weatherIcons[weather.current.condition] || "🌤️"}</span>
                </div>
                <p className="text-green-100 capitalize mt-1">{weather.current.description}</p>
                <p className="text-green-300 text-sm">Feels like {weather.current.feelsLike}°C</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-green-600">
              {[
                { icon: Droplets, label: "Humidity", value: `${weather.current.humidity}%` },
                { icon: Wind, label: "Wind", value: `${weather.current.windSpeed} km/h` },
                { icon: Eye, label: "Visibility", value: `${weather.current.visibility} km` },
                { icon: Thermometer, label: "Pressure", value: `${weather.current.pressure} hPa` },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className="w-4 h-4 text-green-300" />
                  <div>
                    <p className="text-xs text-green-300">{stat.label}</p>
                    <p className="text-sm font-semibold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4 font-heading">
              {language === "ta" ? "5-நாள் முன்னறிவிப்பு" : "5-Day Forecast"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {weather.forecast.map((day) => (
                <div key={day.date} className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium">
                    {new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                  </p>
                  <div className="text-2xl my-2">{weatherIcons[day.description?.split(" ").pop() || ""] || "🌤️"}</div>
                  <p className="text-sm font-semibold text-gray-900">{Math.round(day.temp.max)}°</p>
                  <p className="text-xs text-gray-400">{Math.round(day.temp.min)}°</p>
                  <p className="text-xs text-blue-500 mt-1">{day.humidity}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Farming Recommendations */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4 font-heading flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-600" />
              {language === "ta" ? "விவசாய பரிந்துரைகள்" : "Farming Recommendations"}
            </h2>
            <div className="space-y-2">
              {weather.farmingRecommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
