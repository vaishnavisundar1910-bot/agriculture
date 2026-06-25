import { Router } from "express";
import { Scheme } from "../models/Scheme.js";
import { authMiddleware, adminMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

// GET /api/schemes
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter: Record<string, unknown> = { isActive: true };
    if (category && category !== "all") filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const schemes = await Scheme.find(filter).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/schemes/:id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) { res.status(404).json({ error: "Scheme not found" }); return; }
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// POST /api/schemes (admin)
router.post("/", adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json(scheme);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// PUT /api/schemes/:id (admin)
router.put("/:id", adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// DELETE /api/schemes/:id (admin)
router.delete("/:id", adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await Scheme.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
