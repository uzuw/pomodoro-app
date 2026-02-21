import express from "express";
import { getCurrentUser } from "../controllers/userController";
import { protect } from "../middleware/auth";
import { getUserInventory,removeInventoryItem } from "../controllers/inventoryController";

const router = express.Router();

// GET logged-in user info
router.get("/me", protect, getCurrentUser);
router.get("/inventory",protect,getUserInventory);
router.post("/rinventory",protect,removeInventoryItem);

export default router;
