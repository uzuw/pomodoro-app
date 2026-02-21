import { Request, Response, RequestHandler } from "express";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: { 
    id: string;
    role: string; // or just string if more roles later
  };
}

/* ===========================
   GET CURRENT USER INFO
=========================== */
export const getCurrentUser: RequestHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId)
      .select("-password") // never return password
      .populate("inventory"); // optional (remove if not needed yet)

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
    return;

  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
    return;
  }
};
