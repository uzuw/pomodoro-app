import { Request, Response, RequestHandler } from "express";
import User from "../models/User";
import mongoose from "mongoose";
import ShopItem from "../models/ShopItem";

interface AuthRequest extends Request {
  user?: { 
    id: string;
    role: string; // or just string if more roles later
  };
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
    //poplate replaces those ids with full documents

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



export const removeInventoryItem: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { itemId } = req.body;

    // 1️⃣ Auth check
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // 2️⃣ Validate itemId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: "Invalid item ID" });
      return;
    }

    // 3️⃣ Fetch item to know its price
    const item = await ShopItem.findById(itemId);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    // 4️⃣ Calculate 50% refund
    const refundAmount = Math.floor(item.money * 0.5);

    // 5️⃣ Atomic update:
    //    - Remove item ONLY if user owns it
    //    - Add refund coins
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        inventory: item._id, // ensures user owns item
      },
      {
        $pull: { inventory: item._id },
        $inc: { coins: refundAmount },
      },
      { new: true }
    ).populate("inventory");

    if (!updatedUser) {
      res.status(400).json({
        message: "Item not in inventory or user not found",
      });
      return;
    }

    res.status(200).json({
      message: "Item removed successfully",
      refunded: refundAmount,
      coins: updatedUser.coins,
      inventory: updatedUser.inventory,
    });

    return;
  } catch (error) {
    console.error("Remove inventory error:", error);
    res.status(500).json({
      message: "Failed to remove item",
    });
    return;
  }
};









