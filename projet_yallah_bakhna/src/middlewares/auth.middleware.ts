import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      user: {
        userId: number;
        login: string;
        role: string;
      };
    }
  }
}


const JWT_SECRET = process.env.JWT_SECRET || "secret";

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded as { userId: number; login: string; role: string; }; // Injecte userId, login, role
    next();
  } catch {
    return res.status(403).json({ message: "Token invalide ou expiré" });
  }
}
