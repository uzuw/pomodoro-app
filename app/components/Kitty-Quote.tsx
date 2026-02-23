"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Adding motion for smoothness
import { FaPaw } from "react-icons/fa"; // Cat paw icon

type QuoteData = {
  description: string;
  name: string;
};

const KittyQuote = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      // Update this URL to your specific kitty endpoint
      const res = await fetch("/api/kitty-quotes"); 
      const data = await res.json();
      setQuote(data);
    } catch (error) {
      console.error("Failed to fetch kitty wisdom:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    const interval = setInterval(fetchQuote, 60000); // 1 minute refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <AnimatePresence mode="wait">
        {quote ? (
          <motion.div
            key={quote.description}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shadow-lg"
          >
            <div className="flex justify-center mb-2">
              <FaPaw className="text-pink-300 animate-bounce text-sm" />
            </div>
            
            <p className="text-white text-md font-minecraft italic leading-relaxed">
              "{quote.description}"
            </p>
            
            <p className="text-pink-200 text-xs mt-2 font-minecraft uppercase tracking-widest">
              — {quote.name}
            </p>
          </motion.div>
        ) : (
          <div className="text-white/50 text-xs font-minecraft text-center animate-pulse">
            Chasing laser pointer...
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KittyQuote;