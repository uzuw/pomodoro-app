import express from "express";
import { getCurrentUser } from "../controllers/userController";
import { protect } from "../middleware/auth";

const router = express.Router();

// GET logged-in user info
router.get("/me", protect, getCurrentUser);

export default router;
