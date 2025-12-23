import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

// Permet à toutes les routes d'accéder à req.user qui contient l'objet IUser
declare module 'express' {
  interface Request {
    user?: IUser; 
  }
}
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.auth_token; // Récupère le token depuis le cookie
    if (!token) return res.status(401).json({ error: "Invalid token format " });

    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(payload.id).select("-password").exec();

    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
}
