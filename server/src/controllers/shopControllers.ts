// controllers/shopController.ts
import { Request, Response } from "express";
import ShopItem from "../models/ShopItem";

// Get all items
export const getAllItems = async (_req: Request, res: Response) => {
  try {
    const items = await ShopItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items." });
  }
};

// Get single item by ID
export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await ShopItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item." });
  }
};

// Create item
export const createItem = async (req: Request, res: Response) => {
  try {
    const newItem = await ShopItem.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: "Failed to create item." });
  }
};

// Update item
export const updateItem = async (req: Request, res: Response) => {
  try {
    const updated = await ShopItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Item not found." });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update item." });
  }
};

// Delete item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const deleted = await ShopItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Item not found." });
    res.json({ message: "Item deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item." });
  }
};
