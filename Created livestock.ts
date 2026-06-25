import { Router } from "express";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
import { isDBConnected } from "../db.js";
import { demoLivestock } from "../demo-data.js";

const router = Router();

// GET /api/livestock
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (isDBConnected()) {
      const { Livestock } = await import("../models/Livestock.js");
      const livestock = await Livestock.find({ userId: req.user!.id }).sort({ createdAt: -1 });
      res.json(livestock);
      return;
    }
    const items = (demoLivestock as Array<{ userId: string }>).filter((l) => l.userId === req.user!.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// POST /api/livestock
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (isDBConnected()) {
      const { Livestock } = await import("../models/Livestock.js");
      const item = await Livestock.create({ ...req.body, userId: req.user!.id });
      res.status(201).json(item);
      return;
    }
    const newItem = { ...req.body, _id: `ls_${Date.now()}`, userId: req.user!.id, createdAt: new Date().toISOString() };
    demoLivestock.push(newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// PUT /api/livestock/:id
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (isDBConnected()) {
      const { Livestock } = await import("../models/Livestock.js");
      const item = await Livestock.findOneAndUpdate({ _id: req.params.id, userId: req.user!.id }, req.body, { new: true });
      if (!item) { res.status(404).json({ error: "Not found" }); return; }
      res.json(item);
      return;
    }
    const idx = (demoLivestock as Array<{ _id: string; userId: string }>).findIndex((l) => l._id === req.params.id && l.userId === req.user!.id);
    if (idx >= 0) {
      (demoLivestock as Array<Record<string, unknown>>)[idx] = { ...(demoLivestock as Array<Record<string, unknown>>)[idx], ...req.body };
      res.json(demoLivestock[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// DELETE /api/livestock/:id
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (isDBConnected()) {
      const { Livestock } = await import("../models/Livestock.js");
      await Livestock.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
      res.json({ message: "Deleted" });
      return;
    }
    const idx = (demoLivestock as Array<{ _id: string; userId: string }>).findIndex((l) => l._id === req.params.id && l.userId === req.user!.id);
    if (idx >= 0) demoLivestock.splice(idx, 1);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
