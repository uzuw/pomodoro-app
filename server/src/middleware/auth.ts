import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: "user" | "admin";
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, invalid token" });
    return;
  }
};

import { RequestHandler } from "express";

export const authorize = (
  requiredRole: "user" | "admin"
): RequestHandler => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
};
