import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { addCoins } from "../services/coinService";
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const grantCoins = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, amount } = req.body;

    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    if (!mongoose.isValidObjectId(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    if (typeof amount !== "number" || amount <= 0) {
      res.status(400).json({ message: "Invalid coin amount" });
      return;
    }

    const user = await addCoins(userId, amount, "ADMIN_GRANT");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Coins granted successfully",
      coins: user.coins,
    });
    return; // <- make sure to return void
  } catch (error) {
    console.error("Grant Coins Error:", error);
    res.status(500).json({ message: "Failed to grant coins" });
    return;
  }
};
