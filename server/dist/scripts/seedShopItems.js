"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const ShopItem_1 = __importDefault(require("../models/ShopItem"));
dotenv_1.default.config();
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
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(async () => {
    await ShopItem_1.default.deleteMany({});
    await ShopItem_1.default.insertMany(seedItems);
    console.log("Shop items seeded successfully!");
    process.exit(0);
})
    .catch((err) => {
    console.error("Failed to seed items:", err);
    process.exit(1);
});
