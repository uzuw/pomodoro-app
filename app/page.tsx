"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Timer from "./components/Timer";
import PetBuddy from "./components/PetBuddyProps";
import { MdPets, MdWallpaper } from "react-icons/md";
import { HiX } from "react-icons/hi";

interface Item {
  _id: string;
  title: string;
  image: string;
  category: string;
}

export default function Home() {
  const [ownedItems, setOwnedItems] = useState<Item[]>([]);
  const [activePetIds, setActivePetIds] = useState<string[]>([]);
  const [activeBg, setActiveBg] = useState<string | null>("images/cobbleroom.jpg");
  
  // Panels states
  const [panelMode, setPanelMode] = useState<"pets" | "backgrounds" | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOwnedItems(data.purchasedItems || []);
      } catch (err) {
        console.error("Failed to load items", err);
      }
    };
    fetchData();
  }, []);

  const pets = ownedItems.filter((i) => i.category === "pets"||"costumes");
  const backgrounds = ownedItems.filter((i) => i.category === "backgrounds");

  const togglePet = (id: string) => {
    setActivePetIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden transition-all duration-700">
      
      {/* 1. DYNAMIC BACKGROUND LAYER */}
      <div className="fixed inset-0 -z-10 transition-all duration-1000">
        {activeBg ? (
          <img 
            src={activeBg} 
            alt="background" 
            className="w-full h-full object-cover animate-fade-in"
          />
        ) : (
          <div className="w-full h-full bg-[#fbedcf]" /> // Default Fallback
        )}
      </div>

      {/* 2. TOP-LEFT TOGGLE BUTTONS */}
      <div className="fixed top-6 left-6 z-[1000] flex flex-col gap-4">
        {/* Pet Panel Button */}
        <button
          onClick={() => setPanelMode("pets")}
          className="bg-white p-4 rounded-2xl shadow-lg border-2 border-[#a0522d] hover:bg-orange-50 transition-colors"
        >
          <MdPets className="text-2xl text-[#a0522d]" />
        </button>

        {/* Background Panel Button */}
        <button
          onClick={() => setPanelMode("backgrounds")}
          className="bg-white p-4 rounded-2xl shadow-lg border-2 border-[#4a6d8c] hover:bg-blue-50 transition-colors"
        >
          <MdWallpaper className="text-2xl text-[#4a6d8c]" />
        </button>
      </div>

      <Timer />

      {/* 3. UNIFIED SLIDE-IN PANEL */}
      <AnimatePresence mode="wait">
        {panelMode && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPanelMode(null)}
              className="fixed inset-0 bg-black/20 z-[1001]"
            />

            <motion.div
              key={panelMode} // Re-animate when switching between pets/bg
              initial={{ x: -400 }} animate={{ x: 0 }} exit={{ x: -400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-[1002] p-6 font-minecraft"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-[#6b3e26] capitalize">
                  {panelMode === "pets" ? "My Pets" : "Backgrounds"}
                </h2>
                <button onClick={() => setPanelMode(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <HiX className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* RENDER PETS LIST */}
                {panelMode === "pets" && pets.map((pet) => (
                  <button
                    key={pet._id}
                    onClick={() => togglePet(pet._id)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      activePetIds.includes(pet._id) ? "border-[#a0522d] bg-orange-50" : "border-gray-100"
                    }`}
                  >
                    <img src={pet.image} alt={pet.title} className="w-16 h-16 object-contain" />
                    <span className="text-[10px] uppercase font-bold text-center">{pet.title}</span>
                  </button>
                ))}

                {/* RENDER BACKGROUNDS LIST */}
                {panelMode === "backgrounds" && backgrounds.map((bg) => (
                  <button
                    key={bg._id}
                    onClick={() => setActiveBg(bg.image)}
                    className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      activeBg === bg.image ? "border-[#4a6d8c] bg-blue-50 scale-105" : "border-gray-100"
                    }`}
                  >
                    <img src={bg.image} alt={bg.title} className="w-full aspect-video object-cover rounded-lg shadow-sm" />
                    <span className="text-[10px] uppercase font-bold text-center">{bg.title}</span>
                  </button>
                ))}
              </div>

              {((panelMode === "pets" && pets.length === 0) || 
                (panelMode === "backgrounds" && backgrounds.length === 0)) && (
                <p className="text-center text-gray-400 mt-10">Inventory is empty</p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. RENDERED PETS */}
      {pets
        .filter((pet) => activePetIds.includes(pet._id))
        .map((pet, index) => (
          <PetBuddy
            key={pet._id}
            name={pet.title}
            image={pet.image}
            initialX={200 + index * 40}
            initialY={200 + index * 40}
            animationType="float"
          />
        ))}
    </main>
  );
}