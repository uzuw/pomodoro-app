import { RequestHandler } from "express";
import ShopItem from "../models/ShopItem";

// Get all items
export const getAllItems: RequestHandler = async (_req, res) => {
  try {
    const items = await ShopItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items." });
  }
};

// Get single item by ID
export const getItemById: RequestHandler = async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.id);

    if (!item) {
      res.status(404).json({ error: "Item not found." });
      return;
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item." });
  }
};

// Create item
export const createItem: RequestHandler = async (req, res) => {
  try {
    const newItem = await ShopItem.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: "Failed to create item." });
  }
};

// Update item
export const updateItem: RequestHandler = async (req, res) => {
  try {
    const updated = await ShopItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ error: "Item not found." });
      return;
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update item." });
  }
};

// Delete item
export const deleteItem: RequestHandler = async (req, res) => {
  try {
    const deleted = await ShopItem.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: "Item not found." });
      return;
    }

    res.json({ message: "Item deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item." });
  }
};
