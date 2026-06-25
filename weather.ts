import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

function getFarmingRecommendations(weather: { main: { temp: number; humidity: number }; weather: Array<{ main: string }> }): string[] {
  const recommendations: string[] = [];
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const condition = weather.weather[0]?.main?.toLowerCase() || "";

  if (condition.includes("rain")) {
    recommendations.push("Avoid pesticide spraying — rain will wash away chemicals");
    recommendations.push("Good time to transplant seedlings");
    recommendations.push("Check drainage in fields to prevent waterlogging");
  } else if (condition.includes("clear") || condition.includes("sunny")) {
    recommendations.push("Ideal day for harvesting and drying crops");
    recommendations.push("Good conditions for pesticide/fertilizer application");
    recommendations.push("Ensure adequate irrigation for crops");
  } else if (condition.includes("cloud")) {
    recommendations.push("Moderate conditions — suitable for most farm activities");
    recommendations.push("Good day for transplanting and weeding");
  }

  if (temp > 35) {
    recommendations.push("High temperature — increase irrigation frequency");
    recommendations.push("Provide shade for livestock during peak hours (11am-3pm)");
  } else if (temp < 15) {
    recommendations.push("Cool weather — protect sensitive crops from cold stress");
    recommendations.push("Ensure livestock have warm shelter");
  }

  if (humidity > 80) {
    recommendations.push("High humidity — watch for fungal diseases in crops");
    recommendations.push("Ensure good ventilation in poultry and livestock sheds");
  } else if (humidity < 30) {
    recommendations.push("Low humidity — increase irrigation to prevent crop stress");
  }

  return recommendations.length > 0 ? recommendations : ["Weather conditions are suitable for normal farming activities"];
}

// GET /api/weather
router.get("/", authMiddleware, async (req, res) => {
  try {
    const city = (req.query.city as string) || "Chennai";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      // Return mock data when no API key
      const mockData = {
        city,
        current: {
          temp: 32,
          feelsLike: 36,
          humidity: 72,
          windSpeed: 14,
          description: "Partly cloudy",
          icon: "02d",
          condition: "Clouds",
          pressure: 1012,
          visibility: 10,
        },
        forecast: Array.from({ length: 5 }, (_, i) => ({
          date: new Date(Date.now() + i * 86400000).toISOString().split("T")[0],
          temp: { min: 26 + Math.random() * 4, max: 32 + Math.random() * 5 },
          description: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"][i],
          icon: ["01d", "02d", "03d", "10d", "01d"][i],
          humidity: 65 + Math.floor(Math.random() * 20),
        })),
        farmingRecommendations: [
          "Good conditions for most farming activities",
          "Moderate temperature — suitable for field work",
          "Monitor soil moisture levels",
          "Good day for applying fertilizers",
        ],
        alerts: [],
        note: "Configure OPENWEATHER_API_KEY for real weather data",
      };
      res.json(mockData);
      return;
    }

    // Fetch current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    if (!currentRes.ok) {
      res.status(400).json({ error: "City not found or weather API error" });
      return;
    }
    const current = await currentRes.json() as {
      main: { temp: number; feels_like: number; humidity: number; pressure: number };
      wind: { speed: number };
      weather: Array<{ description: string; icon: string; main: string }>;
      visibility: number;
    };

    // Fetch 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json() as {
      list: Array<{
        dt_txt: string;
        main: { temp_min: number; temp_max: number; humidity: number };
        weather: Array<{ description: string; icon: string }>;
      }>;
    };

    // Group forecast by day
    const dailyForecast: Record<string, { temps: number[]; humidity: number[]; descriptions: string[]; icons: string[] }> = {};
    forecastData.list?.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyForecast[date]) {
        dailyForecast[date] = { temps: [], humidity: [], descriptions: [], icons: [] };
      }
      dailyForecast[date].temps.push(item.main.temp_min, item.main.temp_max);
      dailyForecast[date].humidity.push(item.main.humidity);
      dailyForecast[date].descriptions.push(item.weather[0]?.description || "");
      dailyForecast[date].icons.push(item.weather[0]?.icon || "");
    });

    const forecast = Object.entries(dailyForecast).slice(0, 5).map(([date, data]) => ({
      date,
      temp: { min: Math.min(...data.temps), max: Math.max(...data.temps) },
      description: data.descriptions[0],
      icon: data.icons[0],
      humidity: Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length),
    }));

    const farmingRecommendations = getFarmingRecommendations({
      main: { temp: current.main.temp, humidity: current.main.humidity },
      weather: current.weather,
    });

    res.json({
      city,
      current: {
        temp: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6),
        description: current.weather[0]?.description,
        icon: current.weather[0]?.icon,
        condition: current.weather[0]?.main,
        pressure: current.main.pressure,
        visibility: Math.round((current.visibility || 10000) / 1000),
      },
      forecast,
      farmingRecommendations,
      alerts: [],
    });
  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed", message: String(err) });
  }
});

export default router;
