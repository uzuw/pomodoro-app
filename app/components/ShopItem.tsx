"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ShopCategory = "pets" | "clocks" | "backgrounds" | "costumes";

interface ShopItem {
  _id: string;
  title: string;
  image: string;
  money: number;
  category: ShopCategory;
}

const ShopItems = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "priceAsc" | "priceDesc">("name");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop`);
        const data = await res.json();

        if (data) {
          setItems(data);
        } else {
          setError("Failed to fetch shop items");
        }
      } catch (err) {
        setError("Error fetching shop items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    selectedCategory === "all" ? true : item.category === selectedCategory
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name") return a.title.localeCompare(b.title);
    if (sortBy === "priceAsc") return a.money - b.money;
    if (sortBy === "priceDesc") return b.money - a.money;
    return 0;
  });

  if (loading) return <p className="text-center mt-10">Loading items...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="px-6 py-10 bg-[#fbedcf] min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#a0522d]">🧁 Boutique Items</h1>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex gap-3 flex-wrap">
          {["all", "pets", "clocks", "backgrounds", "costumes"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as ShopCategory | "all")}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === cat ? "bg-pink-300 text-white" : "bg-white"
              }`}
            >
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <select
          className="px-3 py-2 border rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="name">Sort by Name (A-Z)</option>
          <option value="priceAsc">Sort by Price (Low to High)</option>
          <option value="priceDesc">Sort by Price (High to Low)</option>
        </select>
      </div>

      {/* Items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {sortedItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl p-4 text-center shadow-lg border border-pink-100 hover:scale-105 transition-all duration-200"
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
            <h3 className="text-lg font-bold text-[#d2691e]">{item.title}</h3>
            <p className="text-pink-500 font-semibold mt-1">{item.money} coins</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopItems;
