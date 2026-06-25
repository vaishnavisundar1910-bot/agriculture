import { mongoose } from "../db.js";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  senderName: { type: String },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const consultationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["pending", "assigned", "in_progress", "resolved"], default: "pending" },
  category: { type: String, default: "general" },
  attachments: [{ type: String }],
  messages: [messageSchema],
}, { timestamps: true });

export const Consultation = mongoose.models.Consultation || mongoose.model("Consultation", consultationSchema);
