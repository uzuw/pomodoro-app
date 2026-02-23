import express from "express";
import { registerUser,loginUser } from "../controllers/authController";

const router=express.Router();


//POST API api/auth/register
router.post('/register',registerUser);

router.post('/login',loginUser);

export default router;


