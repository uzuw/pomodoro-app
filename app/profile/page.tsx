"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
// Icons
import { HiOutlineMail, HiOutlinePencilAlt, HiBadgeCheck, HiOutlineTrash } from "react-icons/hi";
import { MdOutlineAccountBalanceWallet, MdOutlineCategory } from "react-icons/md";
import { RiUserLine, RiSettings4Line } from "react-icons/ri";

interface PurchasedItem {
  _id: string;
  title: string;
  image: string;
  category: string;
  money: number; // Added to match your controller logic
}

interface UserData {
  name: string;
  email: string;
  profilePic: string;
  coins: number;
  purchasedItems: PurchasedItem[];
}

const ProfilePage: React.FC = () => {
  const { token } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Handle Remove Item with 50% Refund Logic
  const handleDeleteItem = async (item: PurchasedItem) => {
    const refundEstimate = Math.floor(item.money * 0.5);
    
    if (!window.confirm(`Discard "${item.title}"? \nYou will receive a 50% refund of ${refundEstimate} coins.`)) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/rinventory`, {
        method: "POST", // Matching your controller req.body logic
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: item._id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to remove item");

      // Sync with your controller's returned atomic values
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          coins: data.coins,
          purchasedItems: data.inventory, // Updated array from populate("inventory")
        };
      });

    } catch (err: any) {
      alert(err.message);
    }
  };

if (loading)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbedcf] gap-4">
      <Image
        src="/images/loading_chibi.png"
        alt="picture"
        width={120}
        height={120}
        priority
        className="animate-pulse"
      />
      <div className="animate-bounce text-[#a0522d] font-minecraft font-bold py-10">
        Loading Profile...
      </div>
    </div>
  );

  if (error) return <div className="min-h-screen flex items-center justify-center bg-[#fbedcf] font-minecraft text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#fbedcf] py-12 px-4 md:px-20 lg:px-32 font-minecraft text-[#6b3e26]">
      
      {/* --- WALLET WIDGET (Top Right) --- */}
      <div className="fixed top-6 right-6 z-[50]">
        
        <motion.div 
          key={user?.coins}
          initial={{ scale: 1.2, color: "#16a34a" }}
          animate={{ scale: 1, color: "#6b3e26" }}
          className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border-4 border-white shadow-2xl flex items-center gap-3"
        >
          <MdOutlineAccountBalanceWallet className="text-orange-500 text-2xl" />
          <span className="text-xl font-black">{user?.coins.toLocaleString()}</span>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- MAIN PROFILE CARD --- */}
        <div className="bg-white/80 backdrop-blur-md rounded-[3.5rem] shadow-2xl overflow-hidden border-4 border-white">
          <div className="h-32 bg-gradient-to-r from-[#f9c6c9] to-[#fbedcf]" />
          
          <div className="px-8 pb-10 -mt-16 flex flex-col items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-36 h-36 rounded-full border-8 border-white shadow-xl overflow-hidden bg-white">
                <Image
                  src={user?.profilePic || "/default-avatar.png"}
                  alt="Profile"
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                />
              </div>
              <button className="absolute bottom-1 right-1 bg-[#a0522d] text-white p-2 rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform">
                <HiOutlinePencilAlt className="text-xl" />
              </button>
            </div>

            {/* User Meta */}
            <div className="mt-4 text-center">
              <h1 className="text-4xl font-black flex items-center justify-center gap-2">
                {user?.name} <HiBadgeCheck className="text-blue-400 text-2xl" />
              </h1>
              <div className="flex items-center justify-center gap-2 text-[#a0522d] opacity-70 mt-1">
                <HiOutlineMail /> <span>{user?.email}</span>
              </div>
            </div>

            {/* Settings Button */}
            <button className="mt-6 bg-white hover:bg-orange-50 px-8 py-3 rounded-2xl flex items-center gap-3 border-2 border-orange-100 transition-all font-bold shadow-sm">
              <RiSettings4Line className="text-xl" /> <span>Account Settings</span>
            </button>
          </div>
        </div>

        {/* --- INVENTORY SECTION --- */}
        <div className="bg-white/60 backdrop-blur-sm rounded-[3.5rem] p-8 md:p-12 border-4 border-white shadow-xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <RiUserLine className="text-[#a0522d]" /> My Collection
            </h2>
            <div className="bg-[#a0522d]/10 text-[#a0522d] px-5 py-2 rounded-full text-sm font-black">
              {user?.purchasedItems?.length || 0} ITEMS
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <AnimatePresence mode="popLayout">
              {user?.purchasedItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: -10, filter: "blur(8px)" }}
                  className="group relative bg-white rounded-[2.5rem] p-5 shadow-lg border-2 border-transparent hover:border-red-100 transition-all text-center"
                >
                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => handleDeleteItem(item)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-125 active:scale-90"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>

                  {/* Item Image */}
                  <div className="aspect-square bg-gray-50/50 rounded-[2rem] mb-4 flex items-center justify-center overflow-hidden group-hover:bg-red-50/30 transition-colors">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Item Details */}
                  <p className="text-sm font-black truncate px-1">{item.title}</p>
                  <div className="flex items-center justify-center gap-1 text-[9px] text-[#a0522d] mt-2 font-black uppercase opacity-50">
                    <MdOutlineCategory /> {item.category}
                  </div>

                  {/* Refund Badge (Shown on Hover) */}
                  <div className="absolute inset-x-0 bottom-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <span className="bg-green-100 text-green-700 text-[9px] px-3 py-1 rounded-full font-black shadow-sm">
                      REFUND: {Math.floor(item.money * 0.5)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {user?.purchasedItems.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20 bg-white/30 rounded-[2.5rem] border-4 border-dashed border-white/50"
            >
              <p className="text-xl opacity-40 font-bold italic">Your backpack is empty!</p>
              <p className="text-sm opacity-30 mt-1">Visit the shop to find something cute.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;