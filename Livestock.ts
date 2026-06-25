import { mongoose } from "../db.js";

const livestockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["cow", "buffalo", "goat", "sheep", "poultry", "pet"], required: true },
  name: { type: String, required: true },
  breed: { type: String, default: "" },
  age: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  healthStatus: { type: String, enum: ["healthy", "sick", "recovering", "unknown"], default: "healthy" },
  vaccinations: [{ type: String }],
  pregnancyStatus: { type: String, default: "not_pregnant" },
  notes: { type: String, default: "" },
}, { timestamps: true });

export const Livestock = mongoose.models.Livestock || mongoose.model("Livestock", livestockSchema);
