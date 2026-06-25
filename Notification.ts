import { mongoose } from "../db.js";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["weather", "disease", "vaccination", "scheme", "consultation"], default: "scheme" },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
