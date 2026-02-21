import { Request, Response, RequestHandler } from "express";
import User from "../models/User";
import mongoose from "mongoose";


interface AuthRequest extends Request {
  user?: { id: string };
}
//get user inventory

export const getUserInventory: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized to get inventory" });
      return;
    }

    const user = await User.findById(userId).populate("inventory");
    //poplate replaces those ids with full documents

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({
      coins: user.coins,
      inventory: user.inventory,
    });
    return;
  } catch (error) {
    console.error("Get Inventory Error", error);
    res.status(500).json({
      message: "Failed to fetch inventory",
    });
    return;
  }
};

export const removeInventoryItem: RequestHandler = async (
  req:AuthRequest, res:Response
)=>{

try{
  const userId=req.user?.id;
  const {itemId}=req.body;

  if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

  if(!mongoose.isValidObjectId(itemId)){
    res.status(400).json({
      message:"Invalid item ID"
    })
  }

  const updatedUser=await User.findByIdAndUpdate(userId,
    {$pull:{inventory:itemId}},//removes item if id exists
    {new:true}
      ).populate("inventory");


        if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({
      message: "Item removed from inventory",
      coins: updatedUser.coins,
      inventory: updatedUser.inventory,
    });
    return;

}


      
catch(error){
  console.error("Remove inventory error",error);
  res.status(500).json({
    message:"failed to remove item"
  })
}









} 