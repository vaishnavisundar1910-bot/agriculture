import { Router } from "express";
import { Livestock } from "../models/Livestock.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

// GET /api/livestock
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const livestock = await Livestock.find({ userId: req.user!.id }).sort({ createdAt: -1 });
    res.json(livestock);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// POST /api/livestock
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const item = await Livestock.create({ ...req.body, userId: req.user!.id });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// PUT /api/livestock/:id
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const item = await Livestock.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      req.body,
      { new: true }
    );
    if (!item) { res.status(404).json({ error: "Not found" }); return; }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// DELETE /api/livestock/:id
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await Livestock.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
