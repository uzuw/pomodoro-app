// routes/shopRoutes.ts
import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/shopControllers"

const router = express.Router();

router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);



//buying the items from the shop (updating inventory)

import { buyItem } from "../controllers/shopControllers";
import { protect } from "../middleware/auth";

router.post("/buy", protect, buyItem);

export default router;


