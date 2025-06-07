"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type ShopCategory = "pets" | "clocks" | "backgrounds" | "costumes";

export interface ShopItem {
  _id: string;
  title: string;
  image: string;
  money: number;
  category: ShopCategory;
}

const ShopPage = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | "all">("all");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/shop");
        const data = await res.json();
        if (data.success) {
          setItems(data.items);
        } else {
          console.error("Failed to fetch shop items");
        }
      } catch (error) {
        console.error("Error fetching shop items:", error);
      }
    };

    fetchItems();
  }, []);

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const categories: (ShopCategory | "all")[] = ["all", "pets", "clocks", "backgrounds", "costumes"];

  return (
    <div className="min-h-screen bg-[#fbedcf] px-6 md:px-40 py-10 font-minecraft text-[#6b3e26]">
      <h1 className="text-5xl font-extrabold text-center text-[#a0522d] mb-10 drop-shadow">
        🧁 Boutiques
      </h1>

      {/* Category Buttons */}
      <div className="flex justify-center flex-wrap gap-3 mb-12 bg-orange-200 p-4 rounded-xl shadow-inner">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full transition font-semibold shadow-sm border-2 ${
              selectedCategory === category
                ? "bg-[#f9c6c9] text-[#6b3e26] border-[#f4a9ab]"
                : "bg-white text-[#6b3e26] border-[#f4d9d9] hover:bg-[#fdeeee]"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl p-4 text-center shadow-lg border border-pink-100 hover:scale-105 transition-all duration-200"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={100}
              height={100}
              className="mx-auto drop-shadow-lg"
            />
            <h3 className="text-lg font-bold text-[#d2691e]">{item.title}</h3>
            <p className="text-pink-500 font-semibold mt-1">{item.money} coins</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
