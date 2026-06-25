import { Router } from "express";
import { Consultation } from "../models/Consultation.js";
import { Notification } from "../models/Notification.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

// GET /api/consultations
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.user!.role === "farmer" || req.user!.role === "livestock_owner") {
      filter.userId = req.user!.id;
    }
    const consultations = await Consultation.find(filter)
      .populate("userId", "name email")
      .populate("expertId", "name email")
      .sort({ updatedAt: -1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/consultations/:id
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate("userId", "name email")
      .populate("expertId", "name email");
    if (!consultation) { res.status(404).json({ error: "Not found" }); return; }
    res.json(consultation);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// POST /api/consultations
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const consultation = await Consultation.create({ ...req.body, userId: req.user!.id });
    // Create notification for admin
    await Notification.create({
      userId: req.user!.id,
      title: "Consultation Submitted",
      message: `Your consultation "${req.body.subject}" has been submitted and is pending review.`,
      type: "consultation",
    });
    res.status(201).json(consultation);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// PUT /api/consultations/:id/status
router.put("/:id/status", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, expertId } = req.body;
    const update: Record<string, unknown> = { status };
    if (expertId) update.expertId = expertId;
    const consultation = await Consultation.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!consultation) { res.status(404).json({ error: "Not found" }); return; }
    // Notify user
    await Notification.create({
      userId: consultation.userId,
      title: "Consultation Status Updated",
      message: `Your consultation "${consultation.subject}" status changed to ${status}.`,
      type: "consultation",
    });
    res.json(consultation);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// POST /api/consultations/:id/message
router.post("/:id/message", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          messages: {
            senderId: req.user!.id,
            senderName: req.body.senderName || "User",
            content,
            timestamp: new Date(),
          },
        },
        status: "in_progress",
      },
      { new: true }
    );
    res.json(consultation);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
