import express from "express";
import { grantCoins } from "../controllers/adminController";
import { protect, authorize} from "../middleware/auth";



const router = express.Router();

// Protect route and allow only admin
router.post("/grant-coins", protect, authorize("admin"), grantCoins);


export default router;
