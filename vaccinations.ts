import { Router } from "express";
import { Vaccination } from "../models/Vaccination.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

// GET /api/vaccinations
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const vaccinations = await Vaccination.find({ userId: req.user!.id }).sort({ scheduledDate: 1 });
    // Auto-update overdue
    const now = new Date();
    for (const v of vaccinations) {
      if (v.status === "scheduled" && new Date(v.scheduledDate) < now) {
        v.status = "overdue";
        await v.save();
      }
    }
    res.json(vaccinations);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/vaccinations/upcoming
router.get("/upcoming", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming = await Vaccination.find({
      userId: req.user!.id,
      scheduledDate: { $gte: now, $lte: nextWeek },
      status: "scheduled",
    }).sort({ scheduledDate: 1 });
    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// POST /api/vaccinations
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const vaccination = await Vaccination.create({ ...req.body, userId: req.user!.id });
    res.status(201).json(vaccination);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// PUT /api/vaccinations/:id
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const update = { ...req.body };
    if (req.body.status === "completed") {
      update.completedDate = new Date();
    }
    const vaccination = await Vaccination.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      update,
      { new: true }
    );
    if (!vaccination) { res.status(404).json({ error: "Not found" }); return; }
    res.json(vaccination);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
