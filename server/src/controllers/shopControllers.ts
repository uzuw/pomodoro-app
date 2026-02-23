import { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import ShopItem from "../models/ShopItem";
import User from "../models/User";
import { deductCoins } from "../services/coinService";

/* ===========================
   GET ALL ITEMS
=========================== */
export const getAllItems: RequestHandler = async (_req, res) => {
  try {
    const items = await ShopItem.find();
     res.status(200).json(items);
     return
  } catch (error) {
    console.error("Get All Items Error:", error);
     res.status(500).json({ error: "Failed to fetch items." });
     return
  }
};

/* ===========================
   GET ITEM BY ID
=========================== */
export const getItemById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
       res.status(400).json({ error: "Invalid item ID." });
       return
    }

    const item = await ShopItem.findById(id);

    if (!item) {
       res.status(404).json({ error: "Item not found." });
       return
    }

     res.status(200).json(item);
     return
  } catch (error) {
    console.error("Get Item Error:", error);
     res.status(500).json({ error: "Failed to fetch item." });
     return
  }
};

/* ===========================
   CREATE ITEM
=========================== */
export const createItem: RequestHandler = async (req, res) => {
  try {
    const newItem = await ShopItem.create(req.body);
     res.status(201).json(newItem);
     return
  } catch (error) {
    console.error("Create Item Error:", error);
     res.status(400).json({ error: "Failed to create item." });
     return
  }
};

/* ===========================
   UPDATE ITEM
=========================== */
export const updateItem: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
       res.status(400).json({ error: "Invalid item ID." });
       return
    }

    const updated = await ShopItem.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
       res.status(404).json({ error: "Item not found." });
       return
    }

     res.status(200).json(updated);
     return
  } catch (error) {
    console.error("Update Item Error:", error);
     res.status(400).json({ error: "Failed to update item." });
     return

  }
};

/* ===========================
   DELETE ITEM
=========================== */
export const deleteItem: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
       res.status(400).json({ error: "Invalid item ID." });
       return
    }

    const deleted = await ShopItem.findByIdAndDelete(id);

    if (!deleted) {
       res.status(404).json({ error: "Item not found." });
       return
    }

     res.status(200).json({ message: "Item deleted." });
     return
  } catch (error) {
    console.error("Delete Item Error:", error);
     res.status(500).json({ error: "Failed to delete item." });
     return
  }
};

/* ===========================
   BUY ITEM
=========================== */

interface AuthRequest extends Request {
  user?: { 
    id: string;
    role: string; // or just string if more roles later
  };
}



export const buyItem: RequestHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { itemId } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: "Invalid item ID" });
      return;
    }

    // Fetch item
    const item = await ShopItem.findById(itemId);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    // Deduct coins
    const updatedUser = await deductCoins(userId, item.money, "BUY_ITEM");
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Add item to inventory (duplicates automatically prevented)
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { inventory: item._id } },
      { new: true }
    );

    res.status(200).json({
      message: "Item purchased successfully",
      coins: updatedUser.coins,
    });
    return; // ✅ important: exit without returning the Response object
  } catch (error) {
    console.error("Buy Item Error:", error);
    res.status(500).json({ message: "Purchase failed" });
    return;
  }
};

