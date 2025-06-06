"use client";

import Image from "next/image";

const mockUser = {
  name: "Uzuw",
  email: "uzuw@example.com",
  profilePic: "/profile/uzuw.png", // replace with actual image
  coins: 1200,
  purchasedItems: [
    {
      title: "Wizard Costume",
      image: "/shop/costumes/wizard.png",
      category: "costumes",
    },
    {
      title: "Sunset Background",
      image: "/shop/backgrounds/sunset.png",
      category: "backgrounds",
    },
  ],
};

const ProfilePage: React.FC = () => {
  const user = mockUser; // Replace with real user state or fetch

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
              {user.purchasedItems.map((item, index) => (
                <div
                  key={index}
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
