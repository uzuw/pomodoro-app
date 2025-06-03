// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  coins: number;
  inventory: mongoose.Types.ObjectId[]; // references ShopItem
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coins: { type: Number, default: 100 }, // or any starting amount
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "ShopItem" }],
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
