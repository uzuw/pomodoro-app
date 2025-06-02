"use client";

import { useState, useEffect } from "react";

type QuoteData = {
  description: string;
  name: string;
};

const Quote = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);

  const fetchQuote = async () => {
    try {
      const res = await fetch("/api/minecraft-quotes");
      const data = await res.json();
      setQuote(data);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
    }
  };

  useEffect(() => {
    fetchQuote(); // initial fetch
    const interval = setInterval(fetchQuote, 60000); // every 1 min
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="text-white text-center p-4 fixed top-20 left-1/2 -translate-x-1/2 font-minecraft">
      {quote ? (
        <>
          <p className="text-lg italic">"{quote.description}"</p>
          <p className="text-sm mt-2 font-minecraft">— {quote.name}</p>
        </>
      ) : (
        <p>Loading quote...</p>
      )}
    </div>
  );
};

export default Quote;
