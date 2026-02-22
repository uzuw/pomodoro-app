"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
// Icons
import { HiOutlineLogout, HiOutlineLogin, HiOutlineHeart, HiOutlineSparkles } from "react-icons/hi";
import { RiInformationLine } from "react-icons/ri";

const SettingsPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-[#fbedcf] font-minecraft flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- CUSTOM BACKGROUND CONTAINER --- */}
      {/* You can add your PNG or background image here */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        {/* <Image src="/your-bg.png" fill className="object-cover" /> */}
        <div className="w-full h-full bg-[radial-gradient(#f9c6c9_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl border-4 border-white overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#f9c6c9] to-[#fbedcf] p-10 text-center border-b-4 border-white">
            <motion.h1 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl font-black text-[#6b3e26] tracking-tight mb-2"
            >
              Account Settings
            </motion.h1>
            <p className="text-[#a0522d] opacity-80 italic">Manage your session & preferences</p>
          </div>

          <div className="p-8 md:p-12 space-y-8">
            
            {/* Action Section (Logout/Login) */}
            <section className="bg-white/50 p-6 rounded-[2rem] border-2 border-dashed border-[#f9c6c9] flex flex-col items-center gap-4">
              <AnimatePresence mode="wait">
                {isAuthenticated ? (
                  <motion.div
                    key="logout-btn"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full text-center"
                  >
                    <p className="mb-4 text-[#6b3e26] font-bold text-lg">Ready to take a break?</p>
                    <button
                      onClick={handleLogout}
                      className="group flex items-center justify-center gap-2 bg-red-400 hover:bg-red-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-[0_5px_0_rgb(185,28,28)] active:shadow-none active:translate-y-[5px] w-full"
                    >
                      <HiOutlineLogout className="text-2xl group-hover:-translate-x-1 transition-transform" />
                      LOGOUT SESSION
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="login-btn"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full text-center"
                  >
                    <p className="mb-4 text-[#6b3e26] font-bold text-lg">You are currently a guest</p>
                    <Link
                      href="/login"
                      className="group flex items-center justify-center gap-2 bg-[#a0522d] hover:bg-[#6b3e26] text-white px-10 py-4 rounded-2xl font-black transition-all shadow-[0_5px_0_rgb(74,42,26)] active:shadow-none active:translate-y-[5px] w-full"
                    >
                      <HiOutlineLogin className="text-2xl group-hover:translate-x-1 transition-transform" />
                      SIGN INTO BOUTIQUE
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* About & Thank You Section (Bento Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-pink-50/50 p-6 rounded-[2rem] border-2 border-white"
              >
                <h3 className="flex items-center gap-2 font-black text-[#6b3e26] mb-2">
                  <HiOutlineHeart className="text-pink-500 text-xl" /> Thank You!
                </h3>
                <p className="text-sm text-[#a0522d] leading-relaxed">
                  Thanks for using our boutique! Every purchase supports our world development. We hope you love your new items.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-orange-50/50 p-6 rounded-[2rem] border-2 border-white"
              >
                <h3 className="flex items-center gap-2 font-black text-[#6b3e26] mb-2">
                  <RiInformationLine className="text-orange-500 text-xl" /> About Us
                </h3>
                <p className="text-sm text-[#a0522d] leading-relaxed">
                  We are a small team of creators building immersive Minecraft-inspired experiences. Stay tuned for more updates!
                </p>
              </motion.div>
            </div>

            {/* Bottom Sparkle Note */}
            <div className="flex items-center justify-center gap-2 text-[#a0522d] opacity-60 text-xs font-bold uppercase tracking-widest">
              <HiOutlineSparkles /> 
              <span>KittyDoro V 1.0</span>
              <HiOutlineSparkles />
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;