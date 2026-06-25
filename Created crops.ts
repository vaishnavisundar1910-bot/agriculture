import { Router } from "express";
import { authMiddleware, adminMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
import { isDBConnected } from "../db.js";
import { demoCrops, type DemoCrop } from "../demo-data.js";

const router = Router();

// GET /api/crops
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { season, search } = req.query;

    if (isDBConnected()) {
      const { Crop } = await import("../models/Crop.js");
      const filter: Record<string, unknown> = {};
      if (season && season !== "all") filter.season = season;
      if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { nameTa: { $regex: search, $options: "i" } }];
      const crops = await Crop.find(filter).sort({ name: 1 });
      res.json(crops);
      return;
    }

    let filtered = [...demoCrops];
    if (season && season !== "all") filtered = filtered.filter((c) => c.season === season);
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(q) || c.nameTa.toLowerCase().includes(q));
    }
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/crops/:id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    if (isDBConnected()) {
      const { Crop } = await import("../models/Crop.js");
      const crop = await Crop.findById(req.params.id);
      if (!crop) { res.status(404).json({ error: "Crop not found" }); return; }
      res.json(crop);
      return;
    }
    const crop = demoCrops.find((c) => c._id === req.params.id);
    if (!crop) { res.status(404).json({ error: "Crop not found" }); return; }
    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// POST /api/crops (admin)
router.post("/", adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (isDBConnected()) {
      const { Crop } = await import("../models/Crop.js");
      const crop = await Crop.create(req.body);
      res.status(201).json(crop);
      return;
    }
    const newCrop: DemoCrop = { ...req.body, _id: `crop_${Date.now()}` };
    demoCrops.push(newCrop);
    res.status(201).json(newCrop);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
