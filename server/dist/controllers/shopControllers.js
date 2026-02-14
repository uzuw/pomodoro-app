"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.createItem = exports.getItemById = exports.getAllItems = void 0;
const ShopItem_1 = __importDefault(require("../models/ShopItem"));
// Get all items
const getAllItems = async (_req, res) => {
    try {
        const items = await ShopItem_1.default.find();
        res.json(items);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch items." });
    }
};
exports.getAllItems = getAllItems;
// Get single item by ID
const getItemById = async (req, res) => {
    try {
        const item = await ShopItem_1.default.findById(req.params.id);
        if (!item) {
            res.status(404).json({ error: "Item not found." });
            return;
        }
        res.json(item);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch item." });
    }
};
exports.getItemById = getItemById;
// Create item
const createItem = async (req, res) => {
    try {
        const newItem = await ShopItem_1.default.create(req.body);
        res.status(201).json(newItem);
    }
    catch (err) {
        res.status(400).json({ error: "Failed to create item." });
    }
};
exports.createItem = createItem;
// Update item
const updateItem = async (req, res) => {
    try {
        const updated = await ShopItem_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            res.status(404).json({ error: "Item not found." });
            return;
        }
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: "Failed to update item." });
    }
};
exports.updateItem = updateItem;
// Delete item
const deleteItem = async (req, res) => {
    try {
        const deleted = await ShopItem_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: "Item not found." });
            return;
        }
        res.json({ message: "Item deleted." });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete item." });
    }
};
exports.deleteItem = deleteItem;
