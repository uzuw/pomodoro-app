"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
// React Icons
import { HiOutlineMail, HiOutlinePencilAlt, HiBadgeCheck } from "react-icons/hi";
import { MdOutlineAccountBalanceWallet, MdOutlineCategory } from "react-icons/md";
import { RiUserLine, RiSettings4Line } from "react-icons/ri";

interface PurchasedItem {
  _id: string;
  title: string;
  image: string;
  category: string;
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

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch user");
        }

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbedcf]">
      <div className="animate-bounce text-[#a0522d] font-bold">Loading Profile...</div>
    </div>
  );

  if (error) return <p className="text-center mt-10 text-red-500 font-minecraft">{error}</p>;
  if (!user) return <p className="text-center mt-10 font-minecraft">No user data found.</p>;

  return (
    <div className="min-h-screen bg-[#fbedcf] py-12 px-4 md:px-20 lg:px-32 font-minecraft text-[#6b3e26]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- MAIN PROFILE CARD --- */}
        <div className="bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white">
          <div className="h-32 bg-gradient-to-r from-[#f9c6c9] to-[#fbedcf]" />
          
          <div className="px-8 pb-10 -mt-16 flex flex-col items-center">
            {/* Profile Image with Edit Button Overlay */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-8 border-white shadow-xl overflow-hidden bg-white">
                <Image
                  src={user.profilePic}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <button className="absolute bottom-1 right-1 bg-[#a0522d] text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform border-4 border-white">
                <HiOutlinePencilAlt className="text-xl" />
              </button>
            </div>

            {/* User Info */}
            <div className="mt-4 text-center">
              <h1 className="text-4xl font-black flex items-center justify-center gap-2">
                {user.name} <HiBadgeCheck className="text-blue-400 text-2xl" />
              </h1>
              <div className="flex items-center justify-center gap-2 text-[#a0522d] mt-1 opacity-80">
                <HiOutlineMail /> <span>{user.email}</span>
              </div>
            </div>

            {/* Quick Actions / Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 w-full">
              <div className="bg-orange-100/50 px-6 py-3 rounded-2xl flex items-center gap-3 border border-orange-200">
                <MdOutlineAccountBalanceWallet className="text-orange-600 text-2xl" />
                <span className="font-bold text-orange-800 text-xl">{user.coins.toLocaleString()} <span className="text-sm">Coins</span></span>
              </div>
              
              <button className="bg-white hover:bg-gray-50 px-6 py-3 rounded-2xl flex items-center gap-3 border-2 border-gray-100 transition-all font-bold">
                <RiSettings4Line className="text-xl" /> <span>Edit Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- INVENTORY SECTION --- */}
        <div className="bg-white/60 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 border-4 border-white shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <RiUserLine className="text-[#a0522d]" /> My Collection
            </h2>
            <span className="bg-[#a0522d] text-white px-4 py-1 rounded-full text-sm font-bold">
              {user.purchasedItems?.length || 0} Items
            </span>
          </div>

          {user.purchasedItems?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {user.purchasedItems.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-[2rem] p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-pink-200 text-center"
                >
                  <div className="aspect-square bg-gray-50 rounded-[1.5rem] mb-3 flex items-center justify-center overflow-hidden group-hover:bg-pink-50 transition-colors">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm font-bold truncate">{item.title}</p>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#a0522d] mt-1 font-bold uppercase tracking-widest opacity-60">
                    <MdOutlineCategory /> {item.category}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/40 rounded-[2rem] border-4 border-dashed border-white">
              <p className="text-xl opacity-50 italic">Your inventory is empty...</p>
              <button className="mt-4 text-[#a0522d] font-bold hover:underline">Go to Boutique 🧁</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;