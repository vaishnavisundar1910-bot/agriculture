import { mongoose } from "../db.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["farmer", "livestock_owner", "expert", "admin"], default: "farmer" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  language: { type: String, enum: ["en", "ta"], default: "en" },
  profileImage: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
