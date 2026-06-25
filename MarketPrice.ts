import { mongoose } from "../db.js";

const marketPriceSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  cropNameTa: { type: String, default: "" },
  price: { type: Number, required: true },
  unit: { type: String, default: "per quintal" },
  market: { type: String, default: "" },
  location: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  priceHistory: [{
    price: { type: Number },
    date: { type: Date },
  }],
}, { timestamps: true });

export const MarketPrice = mongoose.models.MarketPrice || mongoose.model("MarketPrice", marketPriceSchema);
