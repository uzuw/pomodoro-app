"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  HiOutlineShoppingBag, 
  HiOutlineSearch, 
  HiChevronLeft, 
  HiChevronRight,
  HiBadgeCheck,
  HiOutlineLogin 
} from "react-icons/hi";
import { MdOutlineSell, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { BiSortAlt2 } from "react-icons/bi";

// --- Types ---
type ShopCategory = "pets" | "clocks" | "backgrounds" | "costumes";

interface ShopItem {
  _id: string;
  title: string;
  image: string;
  money: number;
  category: ShopCategory;
}

// Updated to match your /api/user/me response
interface UserMeResponse {
  name: string;
  email: string;
  coins: number;
  purchasedItems: ShopItem[]; 
}

const ITEMS_PER_PAGE = 8;
const BASE_URL = "http://localhost:5000/api";

const ShopPage = () => {
  const router = useRouter();
  
  const [items, setItems] = useState<ShopItem[]>([]);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [ownedItemIds, setOwnedItemIds] = useState<string[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "priceAsc" | "priceDesc">("name");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Fetch all available shop items
        // 2. Fetch current user data from /api/user/me
        const [itemsRes, userMeRes] = await Promise.all([
          fetch(`${BASE_URL}/shop`),
          token ? fetch(`${BASE_URL}/user/me`, { headers }) : Promise.resolve(null)
        ]);

        if (!itemsRes.ok) throw new Error("Failed to load shop items");
        const itemsData = await itemsRes.json();
        setItems(itemsData);

        if (userMeRes && userMeRes.ok) {
          const userData: UserMeResponse = await userMeRes.json();
          // ✅ Sync coins and owned items from your specific response structure
          setUserCoins(userData.coins);
          setOwnedItemIds(userData.purchasedItems.map(item => item._id));
        }
      } catch (err) {
        console.error("Shop Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    return items
      .filter(i => selectedCategory === "all" || i.category === selectedCategory)
      .filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "name") return a.title.localeCompare(b.title);
        return sortBy === "priceAsc" ? a.money - b.money : b.money - a.money;
      });
  }, [items, selectedCategory, searchTerm, sortBy]);

  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const handleBuy = async (itemId: string) => {
    try {
      setProcessingId(itemId);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/shop/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Update state based on your buyItem controller response
      setUserCoins(data.coins);
      setOwnedItemIds(prev => [...prev, itemId]);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSell = async (itemId: string) => {
    if (!confirm("Sell this item for a 50% refund?")) return;
    try {
      setProcessingId(itemId);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/user/rinventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Update state based on your removeInventoryItem controller response
      setUserCoins(data.coins);
      setOwnedItemIds(prev => prev.filter(id => id !== itemId));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-[#a0522d] font-bold">Loading Boutique...</div>;

  return (
    <div className="max-w-full px-30 py-10 min-h-screen bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-5xl font-black text-[#a0522d]">🧁 Boutique</h1>
          <p className="text-gray-400 py-10 font-medium">Welcome back! Manage your collection below.</p>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-4 bg-orange-50 border-2 border-orange-100 px-6 py-3 rounded-3xl shadow-sm">
            <MdOutlineAccountBalanceWallet className="text-orange-500 text-3xl" />
            <div>
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Your Balance</p>
              <p className="text-2xl font-black text-orange-900">{userCoins.toLocaleString()} <span className="text-sm">Coins</span></p>
            </div>
          </div>
        ) : (
          <button onClick={() => router.push("/login")} className="flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-2xl font-bold text-gray-600 hover:bg-gray-200 transition-all">
            <HiOutlineLogin /> Login to Shop
          </button>
        )}
      </div>

      {/* Toolbar (Filters/Search) */}
      <div className="bg-gray-50 p-4 rounded-[2rem] flex flex-col lg:flex-row gap-4 mb-10 shadow-inner">
        <div className="flex gap-2 flex-wrap">
          {["all", "pets", "clocks", "backgrounds", "costumes"].map(cat => (
            <button key={cat} onClick={() => { setSelectedCategory(cat as any); setCurrentPage(1); }}
              className={`px-6 py-2 rounded-2xl font-bold transition-all ${selectedCategory === cat ? "bg-[#a0522d] text-white shadow-lg" : "bg-white text-gray-400 hover:bg-gray-100"}`}>
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search boutique..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#a0522d]" />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border-none rounded-2xl px-4 py-3 shadow-sm font-bold text-gray-600 outline-none">
            <option value="name">Sort: A-Z</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {paginatedItems.map(item => {
          const isOwned = ownedItemIds.includes(item._id);
          const isProcessing = processingId === item._id;

          return (
            <div key={item._id} className="group bg-white border-2 border-gray-100 p-6 rounded-[2.5rem] hover:shadow-2xl hover:border-pink-100 transition-all relative flex flex-col">
              {isOwned && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg z-10 animate-pulse">
                  <HiBadgeCheck className="text-xl" />
                </div>
              )}
              
              <div className="aspect-square bg-gray-50 rounded-[2rem] mb-6 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                <Image src={item.image} alt={item.title} width={120} height={120} className="object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">{item.category}</p>
                <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                <p className="text-2xl font-black text-[#a0522d] mt-1">{item.money} <span className="text-sm font-normal">coins</span></p>
              </div>

              {!isLoggedIn ? (
                <button onClick={() => router.push("/login")} className="mt-6 w-full py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors hover:bg-gray-200">
                  <HiOutlineLogin /> Login to Buy
                </button>
              ) : isOwned ? (
                <button onClick={() => handleSell(item._id)} disabled={isProcessing}
                  className="mt-6 w-full py-4 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  {isProcessing ? "..." : <><MdOutlineSell /> Sell (50%)</>}
                </button>
              ) : (
                <button onClick={() => handleBuy(item._id)} disabled={isProcessing || userCoins < item.money}
                  className="mt-6 w-full py-4 bg-[#a0522d] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none">
                  {isProcessing ? "..." : <><HiOutlineShoppingBag /> Buy Now</>}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-8 mt-16">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-4 bg-gray-100 rounded-full disabled:opacity-20 hover:bg-gray-200 transition-all">
            <HiChevronLeft className="text-2xl" />
          </button>
          <span className="font-black text-gray-400 italic text-sm">PAGE {currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-4 bg-gray-100 rounded-full disabled:opacity-20 hover:bg-gray-200 transition-all">
            <HiChevronRight className="text-2xl" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopPage;