"use client";

import { useState } from "react";
import Image from "next/image";
import { shopItems, ShopCategory, ShopItem } from "../api/assets/shopItems";

const categories: ShopCategory[] = Object.keys(shopItems) as ShopCategory[];

const ShopPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | "all">("all");

  const getFilteredItems = (): ShopItem[] => {
    if (selectedCategory === "all") {
      return Object.values(shopItems).flat();
    }
    return shopItems[selectedCategory];
  };

  const filteredItems = getFilteredItems();

  return (
    <div
      className="min-h-screen bg-cover bg-center px-6 md:px-40 py-10 font-minecraft text-brown-800"
      style={{ backgroundImage: "url('/backgrounds/overworld.jpg')" }}
    >
      <div className="bg-white/20 backdrop-blur-sm rounded-xl shadow-xl px-6 py-8">
        <h1 className="text-5xl font-extrabold text-center text-[#5e2a84] mb-10 drop-shadow-lg">
          🧁 Boutiques
        </h1>

        {/* Filter buttons */}
        <div className="flex justify-center flex-wrap gap-3 mb-12 bg-white/10 p-4 rounded-xl shadow-inner backdrop-blur-md">
          {(["all", ...categories] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full transition font-semibold border-2 text-sm md:text-base ${
                selectedCategory === category
                  ? "bg-[#e9d5ff] text-[#5e2a84] border-[#c084fc]"
                  : "bg-black/10 text-[#5e2a84] border-[#e9d5ff] hover:bg-[#f3e8ff]"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Item grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 text-center shadow-lg border border-purple-100 hover:scale-105 transition-all duration-200"
            >
              <div className="w-full h-[100px] flex items-center justify-center mb-3">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="mx-auto drop-shadow-lg"
                />
              </div>
              <h3 className="text-lg font-bold text-[#7e3af2]">{item.title}</h3>
              <p className="text-pink-500 font-semibold mt-1">{item.money} coins</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
