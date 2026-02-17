import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const protect: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
    return;
  }
};
