import { Router } from "express";
import { Disease } from "../models/Disease.js";
import { authMiddleware, adminMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

// GET /api/diseases
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { type, search } = req.query;
    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { affectedSpecies: { $regex: search, $options: "i" } },
      ];
    }
    const diseases = await Disease.find(filter).sort({ name: 1 });
    res.json(diseases);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/diseases/:id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) { res.status(404).json({ error: "Not found" }); return; }
    res.json(disease);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// POST /api/diseases (admin)
router.post("/", adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json(disease);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
