import mongoose from "mongoose";

let isConnected = false;
let connectionAttempted = false;

export async function connectDB(): Promise<void> {
  if (isConnected || connectionAttempted) return;
  connectionAttempted = true;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("MONGODB_URI not set — running in demo mode (in-memory data)");
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err instanceof Error ? err.message : String(err));
    console.log("Running in demo mode with in-memory data");
  }
}

export function isDBConnected(): boolean {
  return isConnected;
}

export async function closeConnection(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}

export { mongoose };
