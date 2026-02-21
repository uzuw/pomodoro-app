"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-10">No user data</p>;

  return (
    <div className="min-h-screen bg-[#fbedcf] py-12 px-6 md:px-32 font-minecraft text-[#6b3e26]">
      <div className="bg-white/70 rounded-3xl shadow-xl p-8 max-w-3xl mx-auto text-center">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={user.profilePic}
            alt={user.name}
            width={100}
            height={100}
            className="rounded-full border-4 border-[#f9c6c9] shadow-lg"
          />
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-md text-[#a0522d]">{user.email}</p>
          <p className="mt-2 bg-pink-100 text-pink-600 px-4 py-1 rounded-full shadow">
            💰 {user.coins} coins
          </p>
        </div>

        {user.purchasedItems?.length > 0 && (
          <>
            <h2 className="text-xl font-bold mt-10 mb-4">🎁 Purchased Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.purchasedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-3 rounded-xl shadow-md text-center"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="mx-auto mb-2"
                  />
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-[#a0522d]">{item.category}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
