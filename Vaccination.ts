import { mongoose } from "../db.js";

const vaccinationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  livestockId: { type: mongoose.Schema.Types.ObjectId, ref: "Livestock", default: null },
  livestockName: { type: String, default: "" },
  livestockType: { type: String, default: "" },
  vaccineName: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  completedDate: { type: Date, default: null },
  status: { type: String, enum: ["scheduled", "completed", "overdue"], default: "scheduled" },
  reminderSent: { type: Boolean, default: false },
  notes: { type: String, default: "" },
}, { timestamps: true });

export const Vaccination = mongoose.models.Vaccination || mongoose.model("Vaccination", vaccinationSchema);
