import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

const JWT_SECRET = process.env.JWT_SECRET || "agrivet-secret-key-2024";

export function generateToken(payload: { id: string; role: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { id: string; role: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string };
  } catch {
    return null;
  }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  req.user = decoded;
  next();
}

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  });
}
