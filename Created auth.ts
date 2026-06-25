import { Router } from "express";
import bcrypt from "bcryptjs";
import { generateToken, authMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
import { isDBConnected } from "../db.js";
import { demoUsers, initDemoAdmin } from "../demo-data.js";

const router = Router();

function getUserModel() {
  if (!isDBConnected()) return null;
  // Dynamic import to avoid mongoose errors when not connected
  return null; // Will use demo data
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    await initDemoAdmin();
    const { name, email, password, role, phone, location } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email and password are required" });
      return;
    }

    if (isDBConnected()) {
      const { User } = await import("../models/User.js");
      const existing = await User.findOne({ email });
      if (existing) { res.status(400).json({ error: "Email already registered" }); return; }
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed, role: role || "farmer", phone, location });
      const token = generateToken({ id: user._id.toString(), role: user.role, email: user.email });
      res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location, language: user.language } });
      return;
    }

    // Demo mode
    const existing = demoUsers.find((u) => u.email === email);
    if (existing) { res.status(400).json({ error: "Email already registered" }); return; }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      _id: `user_${Date.now()}`,
      name, email, password: hashed,
      role: role || "farmer",
      phone: phone || "", location: location || "",
      language: "en", profileImage: "", isActive: true,
      createdAt: new Date().toISOString(),
    };
    demoUsers.push(newUser);
    const token = generateToken({ id: newUser._id, role: newUser.role, email: newUser.email });
    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, phone: newUser.phone, location: newUser.location, language: newUser.language } });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", message: String(err) });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    await initDemoAdmin();
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: "Email and password required" }); return; }

    if (isDBConnected()) {
      const { User } = await import("../models/User.js");
      const user = await User.findOne({ email });
      if (!user) { res.status(401).json({ error: "Invalid credentials" }); return; }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) { res.status(401).json({ error: "Invalid credentials" }); return; }
      const token = generateToken({ id: user._id.toString(), role: user.role, email: user.email });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location, language: user.language, profileImage: user.profileImage } });
      return;
    }

    // Demo mode
    const user = demoUsers.find((u) => u.email === email);
    if (!user) { res.status(401).json({ error: "Invalid credentials" }); return; }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) { res.status(401).json({ error: "Invalid credentials" }); return; }
    const token = generateToken({ id: user._id, role: user.role, email: user.email });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location, language: user.language, profileImage: user.profileImage } });
  } catch (err) {
    res.status(500).json({ error: "Login failed", message: String(err) });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  res.json({ message: "If that email exists, a reset link has been sent." });
});

// GET /api/auth/profile
router.get("/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (isDBConnected()) {
      const { User } = await import("../models/User.js");
      const user = await User.findById(req.user!.id).select("-password");
      if (!user) { res.status(404).json({ error: "User not found" }); return; }
      res.json(user);
      return;
    }
    const user = demoUsers.find((u) => u._id === req.user!.id);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    const { password: _pw, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// PUT /api/auth/profile
router.put("/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, location, language, profileImage } = req.body;
    if (isDBConnected()) {
      const { User } = await import("../models/User.js");
      const user = await User.findByIdAndUpdate(req.user!.id, { name, phone, location, language, profileImage }, { new: true }).select("-password");
      res.json(user);
      return;
    }
    const idx = demoUsers.findIndex((u) => u._id === req.user!.id);
    if (idx >= 0) {
      demoUsers[idx] = { ...demoUsers[idx], name: name || demoUsers[idx].name, phone: phone || demoUsers[idx].phone, location: location || demoUsers[idx].location, language: language || demoUsers[idx].language };
      const { password: _pw, ...safeUser } = demoUsers[idx];
      res.json(safeUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// PUT /api/auth/change-password
router.put("/change-password", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (isDBConnected()) {
      const { User } = await import("../models/User.js");
      const user = await User.findById(req.user!.id);
      if (!user) { res.status(404).json({ error: "User not found" }); return; }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) { res.status(400).json({ error: "Current password is incorrect" }); return; }
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.json({ message: "Password changed successfully" });
      return;
    }
    const user = demoUsers.find((u) => u._id === req.user!.id);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) { res.status(400).json({ error: "Current password is incorrect" }); return; }
    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
