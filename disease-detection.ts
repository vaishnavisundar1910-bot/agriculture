import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.js";
import { readFileSync, unlinkSync } from "node:fs";

const router = Router();
const upload = multer({ dest: "/tmp/uploads/", limits: { fileSize: 10 * 1024 * 1024 } });

async function analyzeWithGemini(prompt: string, imageBase64?: string, mimeType?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return JSON.stringify({
      diseaseName: "Demo Mode",
      confidence: 75,
      symptoms: ["Configure GEMINI_API_KEY for real AI analysis"],
      causes: ["API key not configured"],
      prevention: ["Add your Gemini API key to enable disease detection"],
      treatment: ["Visit a local agricultural extension officer for diagnosis"],
    });
  }

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
  if (imageBase64 && mimeType) {
    parts.push({ inlineData: { mimeType, data: imageBase64 } });
  }
  parts.push({ text: prompt });

  const result = await model.generateContent(parts as Parameters<typeof model.generateContent>[0]);
  return result.response.text();
}

// POST /api/disease-detection/crop
router.post("/crop", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    let imageBase64: string | undefined;
    let mimeType: string | undefined;

    if (req.file) {
      const buffer = readFileSync(req.file.path);
      imageBase64 = buffer.toString("base64");
      mimeType = req.file.mimetype;
      try { unlinkSync(req.file.path); } catch {}
    }

    const prompt = `Analyze this crop image for diseases. Provide a JSON response with:
{
  "diseaseName": "name of the disease or 'Healthy' if no disease",
  "confidence": number between 0-100,
  "symptoms": ["list of visible symptoms"],
  "causes": ["list of causes"],
  "prevention": ["prevention methods"],
  "treatment": ["treatment recommendations"],
  "severity": "low|medium|high"
}
Only respond with valid JSON, no markdown.`;

    const rawResponse = await analyzeWithGemini(prompt, imageBase64, mimeType);

    let result;
    try {
      const cleaned = rawResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        diseaseName: "Analysis Complete",
        confidence: 70,
        symptoms: ["Image analyzed — please consult an agricultural expert for confirmation"],
        causes: ["Multiple potential causes identified"],
        prevention: ["Maintain proper crop hygiene", "Use certified seeds", "Regular field monitoring"],
        treatment: ["Consult local agricultural extension officer", "Apply appropriate fungicide/pesticide"],
        severity: "medium",
        rawResponse,
      };
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Detection failed", message: String(err) });
  }
});

// POST /api/disease-detection/animal
router.post("/animal", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { symptoms, animalType } = req.body;
    let imageBase64: string | undefined;
    let mimeType: string | undefined;

    if (req.file) {
      const buffer = readFileSync(req.file.path);
      imageBase64 = buffer.toString("base64");
      mimeType = req.file.mimetype;
      try { unlinkSync(req.file.path); } catch {}
    }

    const prompt = `You are a veterinary AI assistant. Analyze ${animalType || "animal"} health.
${symptoms ? `Reported symptoms: ${symptoms}` : ""}
${imageBase64 ? "Also analyze the provided image." : ""}

Provide a JSON response with:
{
  "diseaseName": "most likely disease name",
  "confidence": number between 0-100,
  "symptoms": ["list of symptoms"],
  "causes": ["list of causes"],
  "prevention": ["prevention methods"],
  "treatment": ["treatment recommendations"],
  "urgency": "low|medium|high|emergency",
  "veterinaryAdvice": "brief advice"
}
Only respond with valid JSON, no markdown.`;

    const rawResponse = await analyzeWithGemini(prompt, imageBase64, mimeType);

    let result;
    try {
      const cleaned = rawResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        diseaseName: "Requires Veterinary Examination",
        confidence: 60,
        symptoms: symptoms ? symptoms.split(",").map((s: string) => s.trim()) : ["Symptoms noted"],
        causes: ["Multiple potential causes — professional diagnosis needed"],
        prevention: ["Regular vaccination", "Proper nutrition", "Clean water and shelter"],
        treatment: ["Consult a licensed veterinarian immediately"],
        urgency: "medium",
        veterinaryAdvice: "Please consult a qualified veterinarian for accurate diagnosis and treatment.",
      };
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Detection failed", message: String(err) });
  }
});

export default router;
