import { Router } from "express";
import { ChatHistory } from "../models/ChatHistory.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

const SYSTEM_PROMPT = `You are AgriVet AI, an expert agricultural and veterinary assistant for Tamil Nadu farmers. 
Answer in the language the user writes in (Tamil or English). 
Provide practical, actionable advice about:
- Crops cultivation, fertilizers, irrigation, pest management
- Livestock health, diseases, nutrition, breeding
- Government schemes for farmers in Tamil Nadu and India
- Weather-based farming recommendations
- Market prices and selling strategies
- Soil health and organic farming

Always be helpful, concise, and use simple language that farmers can understand.
When answering in Tamil, use clear and simple Tamil language.`;

// POST /api/chat/message
router.post("/message", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { message, language, sessionId } = req.body;
    if (!message) { res.status(400).json({ error: "Message required" }); return; }

    const apiKey = process.env.GEMINI_API_KEY;
    let aiResponse = "";

    if (apiKey) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Get recent chat history for context
        let history: Array<{ role: string; parts: Array<{ text: string }> }> = [];
        if (sessionId) {
          const chatDoc = await ChatHistory.findById(sessionId);
          if (chatDoc) {
            history = chatDoc.messages.slice(-10).map((m: { role: string; content: string }) => ({
              role: m.role === "model" ? "model" : "user",
              parts: [{ text: m.content }],
            }));
          }
        }

        const chat = model.startChat({
          history,
          systemInstruction: SYSTEM_PROMPT,
        });

        const result = await chat.sendMessage(message);
        aiResponse = result.response.text();
      } catch (geminiErr) {
        console.error("Gemini error:", geminiErr);
        aiResponse = language === "ta"
          ? "மன்னிக்கவும், AI சேவை தற்போது கிடைக்கவில்லை. தயவுசெய்து GEMINI_API_KEY சரிபார்க்கவும்."
          : "Sorry, AI service is currently unavailable. Please check your GEMINI_API_KEY configuration.";
      }
    } else {
      // Demo responses when no API key
      const demoResponses: Record<string, string> = {
        default_en: "I'm AgriVet AI! To enable full AI responses, please configure your GEMINI_API_KEY. I can help with crop cultivation, livestock health, government schemes, weather guidance, and market prices for Tamil Nadu farmers.",
        default_ta: "நான் AgriVet AI! முழு AI பதில்களை இயக்க, உங்கள் GEMINI_API_KEY ஐ கட்டமைக்கவும். நான் பயிர் சாகுபடி, கால்நடை ஆரோக்கியம், அரசு திட்டங்கள் மற்றும் சந்தை விலைகள் பற்றி உதவ முடியும்.",
      };
      aiResponse = language === "ta" ? demoResponses.default_ta : demoResponses.default_en;
    }

    // Save to chat history
    let chatDoc;
    if (sessionId) {
      chatDoc = await ChatHistory.findByIdAndUpdate(
        sessionId,
        {
          $push: {
            messages: {
              $each: [
                { role: "user", content: message, timestamp: new Date() },
                { role: "model", content: aiResponse, timestamp: new Date() },
              ],
            },
          },
          language: language || "en",
        },
        { new: true }
      );
    } else {
      chatDoc = await ChatHistory.create({
        userId: req.user!.id,
        messages: [
          { role: "user", content: message, timestamp: new Date() },
          { role: "model", content: aiResponse, timestamp: new Date() },
        ],
        language: language || "en",
      });
    }

    res.json({ response: aiResponse, sessionId: chatDoc?._id });
  } catch (err) {
    res.status(500).json({ error: "Chat failed", message: String(err) });
  }
});

// GET /api/chat/history
router.get("/history", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await ChatHistory.find({ userId: req.user!.id })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select("_id messages language createdAt updatedAt");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/chat/session/:id
router.get("/session/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const session = await ChatHistory.findOne({ _id: req.params.id, userId: req.user!.id });
    if (!session) { res.status(404).json({ error: "Session not found" }); return; }
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// DELETE /api/chat/history
router.delete("/history", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await ChatHistory.deleteMany({ userId: req.user!.id });
    res.json({ message: "Chat history cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
