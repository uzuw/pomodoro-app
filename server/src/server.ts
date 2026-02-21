import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import shopRoutes from "./routes/shopRoutes"; 
import userRoutes from "./routes/userRoutes"





dotenv.config();
const app = express();



// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());




// Connect to the database
connectDB();




// Routes
app.use("/api/user",userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes); 










app.get("/", (_req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
