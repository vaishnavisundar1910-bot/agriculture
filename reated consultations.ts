import { Router } from "express";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
import { isDBConnected } from "../db.js";
import { demoConsultations, demoNotifications } from "../demo-data.js";

const router = Router();

type DemoConsultation = {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  expertId?: string | null;
  subject: string;
  description: string;
  status: string;
  category: string;
  messages: Array<{ senderId: string; senderName: string; content: string; timestamp: string }>;
  createdAt: string;
  updatedAt: string;
};

// GET /api/consultations
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (isDBConnected()) {
      const { Consultation } = await import("../models/Consultation.js");
      const filter: Record<string, unknown> = {};
      if (req.user!.role === "farmer" || req.user!.role === "livestock_owner") filter.userId = req.user!.id;
      const consultations = await Consultation.find(filter).populate("userId", "name email").populate("expertId", "name email").sort({ updatedAt: -1 });
      res.json(consultations);
      return;
    }
    let items = demoConsultations as DemoConsultation[];
    if (req.user!.role === "farmer" || req.user!.role === "livestock_owner") {
      items = items.filter((c) => c.userId === req.user!.id);
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/consultations/:id
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (isDBConnected()) {
      const { Consultation } = await import("../models/Consultation.js");
      const c = await Consultation.findById(req.params.id).populate("userId", "name email").populate("expertId", "name email");
      if (!c) { res.status(404).json({ error: "Not found" }); return; }
      res.json(c);
      return;
    }
    const c = (demoConsultations as DemoConsultation[]).find((c) => c._id === req.params.id);
    if (!c) { res.status(404).json({ error: "Not found" }); return; }
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// POST /api/consultations
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (isDBConnected()) {
      const { Consultation } = await import("../models/Consultation.js");
      const { Notification } = await import("../models/Notification.js");
      const consultation = await Consultation.create({ ...req.body, userId: req.user!.id });
      await Notification.create({ userId: req.user!.id, title: "Consultation Submitted", message: `Your consultation "${req.body.subject}" has been submitted.`, type: "consultation" });
      res.status(201).json(consultation);
      return;
    }
    const newC: DemoConsultation = {
      ...req.body,
      _id: `cons_${Date.now()}`,
      userId: req.user!.id,
      status: "pending",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    demoConsultations.push(newC);
    (demoNotifications as Array<Record<string, unknown>>).push({
      _id: `notif_${Date.now()}`,
      userId: req.user!.id,
      title: "Consultation Submitted",
      message: `Your consultation "${req.body.subject}" has been submitted and is pending review.`,
      type: "consultation",
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(newC);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// PUT /api/consultations/:id/status
router.put("/:id/status", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, expertId } = req.body;
    if (isDBConnected()) {
      const { Consultation } = await import("../models/Consultation.js");
      const update: Record<string, unknown> = { status };
      if (expertId) update.expertId = expertId;
      const c = await Consultation.findByIdAndUpdate(req.params.id, update, { new: true });
      res.json(c);
      return;
    }
    const idx = (demoConsultations as DemoConsultation[]).findIndex((c) => c._id === req.params.id);
    if (idx >= 0) {
      (demoConsultations as DemoConsultation[])[idx].status = status;
      (demoConsultations as DemoConsultation[])[idx].updatedAt = new Date().toISOString();
      res.json(demoConsultations[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// POST /api/consultations/:id/message
router.post("/:id/message", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { content, senderName } = req.body;
    if (isDBConnected()) {
      const { Consultation } = await import("../models/Consultation.js");
      const c = await Consultation.findByIdAndUpdate(req.params.id, {
        $push: { messages: { senderId: req.user!.id, senderName: senderName || "User", content, timestamp: new Date() } },
        status: "in_progress",
      }, { new: true });
      res.json(c);
      return;
    }
    const idx = (demoConsultations as DemoConsultation[]).findIndex((c) => c._id === req.params.id);
    if (idx >= 0) {
      (demoConsultations as DemoConsultation[])[idx].messages.push({ senderId: req.user!.id, senderName: senderName || "User", content, timestamp: new Date().toISOString() });
      (demoConsultations as DemoConsultation[])[idx].status = "in_progress";
      (demoConsultations as DemoConsultation[])[idx].updatedAt = new Date().toISOString();
      res.json(demoConsultations[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
