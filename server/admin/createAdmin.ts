import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/User"
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const username = "admin";
    const email = "admin@example.com";
    const password = "Admin123!"; // change to a strong password

    // Check if admin already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
      coins: 1000, // optional starting coins
    });

    console.log("Admin user created:", adminUser);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
