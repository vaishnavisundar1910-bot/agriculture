import { mongoose } from "../db.js";

const diseaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameTa: { type: String, default: "" },
  type: { type: String, enum: ["crop", "animal"], required: true },
  affectedSpecies: { type: String, default: "" },
  symptoms: { type: String, default: "" },
  causes: { type: String, default: "" },
  prevention: { type: String, default: "" },
  treatment: { type: String, default: "" },
  images: [{ type: String }],
}, { timestamps: true });

export const Disease = mongoose.models.Disease || mongoose.model("Disease", diseaseSchema);
