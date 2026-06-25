import { Router } from "express";
import { User } from "../models/User.js";
import { Scheme } from "../models/Scheme.js";
import { Consultation } from "../models/Consultation.js";
import { Disease } from "../models/Disease.js";
import { Livestock } from "../models/Livestock.js";
import { adminMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

// GET /api/admin/stats
router.get("/stats", adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, activeSchemes, pendingConsultations, totalDiseases, totalLivestock] = await Promise.all([
      User.countDocuments(),
      Scheme.countDocuments({ isActive: true }),
      Consultation.countDocuments({ status: "pending" }),
      Disease.countDocuments(),
      Livestock.countDocuments(),
    ]);

    // User growth by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ totalUsers, activeSchemes, pendingConsultations, totalDiseases, totalLivestock, userGrowth });
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/admin/users
router.get("/users", adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { search, role } = req.query;
    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// PUT /api/admin/users/:id
router.put("/users/:id", adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/admin/consultations
router.get("/consultations", adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const consultations = await Consultation.find()
      .populate("userId", "name email")
      .populate("expertId", "name email")
      .sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/admin/reports
router.get("/reports", adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [usersByRole, consultationsByStatus, schemesByCategory] = await Promise.all([
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Consultation.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Scheme.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);
    res.json({ usersByRole, consultationsByStatus, schemesByCategory });
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
