import { Request, Response, RequestHandler } from "express";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: { id: string };
}
//get user inventory

export const getUserInventory: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized to get inventory" });
      return;
    }

    const user = await User.findById(userId).populate("inventory");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({
      coins: user.coins,
      inventory: user.inventory,
    });
    return;
  } catch (error) {
    console.error("Get Inventory Error", error);
    res.status(500).json({
      message: "Failed to fetch inventory",
    });
    return;
  }
};
