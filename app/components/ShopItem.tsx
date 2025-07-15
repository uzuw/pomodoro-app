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

const ITEMS_PER_PAGE = 8;

const ShopItems = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "priceAsc" | "priceDesc">("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Reset page when filters/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, searchTerm]);

  // Filter by category
  const filteredByCategory = items.filter((item) =>
    selectedCategory === "all" ? true : item.category === selectedCategory
  );

  // Filter by search term (case insensitive)
  const filteredBySearch = filteredByCategory.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort filtered items
  const sortedItems = [...filteredBySearch].sort((a, b) => {
    if (sortBy === "name") return a.title.localeCompare(b.title);
    if (sortBy === "priceAsc") return a.money - b.money;
    if (sortBy === "priceDesc") return b.money - a.money;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goPrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };
  const goNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  if (loading) return <p className="text-center mt-10">Loading items...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="px-40 py-10 bg-[#f8e7c3] min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#a0522d]">🧁 Boutique Items</h1>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* Category Filter */}
        <div className="flex gap-3 flex-wrap">
          {["all", "pets", "clocks", "backgrounds", "costumes"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as ShopCategory | "all")}
              className={`px-4 py-2 rounded-full hover:scale-105 ${
                selectedCategory === cat ? "bg-pink-300 text-white" : "bg-white text-gray-700"
              }`}
            >
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <select
          className="px-5 py-2 text-gray-500 border rounded-3xl"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="name">Sort by Name (A-Z)</option>
          <option value="priceAsc">Sort by Price low</option>
          <option value="priceDesc">Sort by Price high</option>
        </select>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full max-w-md rounded-3xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-700"
        />
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {paginatedItems.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No items found.</p>
        ) : (
          paginatedItems.map((item) => (
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
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={goPrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-pink-300 disabled:bg-pink-100 text-white"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-pink-300 disabled:bg-pink-100 text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopItems;
