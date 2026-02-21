import { Request, Response } from "express";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ message: "Unauthorized" });
  return}


    const user = await User.findById(userId).populate("inventory");
    if (!user) { res.status(404).json({ message: "User not found" });
  return}

    res.status(200).json({
      name: user.username,
      email: user.email,
      profilePic: user.profilePic,
      coins: user.coins,
      purchasedItems: user.inventory, // populated ShopItem documents
    });

    return 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });

    return
  }
};
