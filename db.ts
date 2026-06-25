import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/agrivet";
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("MongoDB connected:", uri.replace(/\/\/.*@/, "//***@"));
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    // Don't crash — app works without DB in demo mode
  }
}

export async function closeConnection(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}

export { mongoose };
