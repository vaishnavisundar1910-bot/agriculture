import { Router } from "express";
import { Crop } from "../models/Crop.js";
import { authMiddleware, adminMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

// GET /api/crops
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { season, search } = req.query;
    const filter: Record<string, unknown> = {};
    if (season && season !== "all") filter.season = season;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { nameTa: { $regex: search, $options: "i" } },
      ];
    }
    const crops = await Crop.find(filter).sort({ name: 1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/crops/:id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) { res.status(404).json({ error: "Crop not found" }); return; }
    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// POST /api/crops (admin)
router.post("/", adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const crop = await Crop.create(req.body);
    res.status(201).json(crop);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
