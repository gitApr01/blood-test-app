import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: "ADMIN" | "USER" };
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing Authorization header" });
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });
    const secret = process.env.JWT_SECRET || "secret";
    const payload = jwt.verify(token, secret) as any;
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
