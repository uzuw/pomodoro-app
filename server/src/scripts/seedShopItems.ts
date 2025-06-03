import mongoose from "mongoose";
import dotenv from "dotenv";
import ShopItem from "../models/ShopItem";

dotenv.config();

const seedItems = [
  {
    title: "Night Sky",
    image: "/shop/backgrounds/night.png",
    money: 200,
    category: "backgrounds",
  },
  {
    title: "Cute Clock",
    image: "/shop/clocks/future.png",
    money: 150,
    category: "clocks",
  },
  {
    title: "Wizard Hat",
    image: "/shop/costumes/wizard.png",
    money: 300,
    category: "costumes",
  },
  {
    title: "Fluffy Cat",
    image: "/shop/pets/cat.png",
    money: 250,
    category: "pets",
  },
];

mongoose
  .connect(process.env.MONGO_URI!)
  .then(async () => {
    await ShopItem.deleteMany({});
    await ShopItem.insertMany(seedItems);
    console.log("Shop items seeded successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to seed items:", err);
    process.exit(1);
  });