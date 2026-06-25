import { mongoose } from "../db.js";

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleTa: { type: String, default: "" },
  description: { type: String, required: true },
  descriptionTa: { type: String, default: "" },
  category: { type: String, enum: ["agriculture", "dairy", "goat", "poultry", "state", "central"], required: true },
  eligibility: { type: String, default: "" },
  benefits: { type: String, default: "" },
  documents: { type: String, default: "" },
  applicationLink: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Scheme = mongoose.models.Scheme || mongoose.model("Scheme", schemeSchema);
