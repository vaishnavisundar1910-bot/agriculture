import { Router } from "express";
import { MarketPrice } from "../models/MarketPrice.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /api/market-prices
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { crop, location } = req.query;
    const filter: Record<string, unknown> = {};
    if (crop) filter.cropName = { $regex: crop, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    const prices = await MarketPrice.find(filter).sort({ date: -1 });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

// GET /api/market-prices/trends/:cropName
router.get("/trends/:cropName", authMiddleware, async (req, res) => {
  try {
    const { days = "30" } = req.query;
    const price = await MarketPrice.findOne({ cropName: { $regex: req.params.cropName, $options: "i" } });
    if (!price) { res.status(404).json({ error: "Crop not found" }); return; }
    const daysNum = parseInt(days as string);
    const history = price.priceHistory.slice(-daysNum);
    res.json({ cropName: price.cropName, history, currentPrice: price.price, unit: price.unit });
  } catch (err) {
    res.status(500).json({ error: "Failed", message: String(err) });
  }
});

export default router;
