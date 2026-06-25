import { mongoose } from "../db.js";

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameTa: { type: String, default: "" },
  season: { type: String, default: "Kharif" },
  soilType: { type: String, default: "" },
  cultivationGuide: { type: String, default: "" },
  fertilizerRecommendation: { type: String, default: "" },
  irrigationInfo: { type: String, default: "" },
  pestInfo: { type: String, default: "" },
  image: { type: String, default: "" },
}, { timestamps: true });

export const Crop = mongoose.models.Crop || mongoose.model("Crop", cropSchema);
