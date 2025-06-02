"use client";

import { useState, useEffect } from "react";
import Slider from "./Slider";
import Quote from "./Quote";

const CHECKPOINTS = [10, 25, 40, 60];

const Timer: React.FC = () => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(selectedMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showQuote, setShowQuote] = useState(true);

  useEffect(() => {
    setSecondsLeft(selectedMinutes * 60);
    setIsRunning(false);
  }, [selectedMinutes]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center font-minecraft text-white relative">
      {/* Timer */}
      <h1 className="text-6xl font-bold mb-8">{formatTime(secondsLeft)}</h1>

      {/* Slider with proper props */}
      <Slider
        min={5}
        max={60}
        step={5}
        checkpoints={CHECKPOINTS}
        value={selectedMinutes}
        onChange={(val) => setSelectedMinutes(val)}
      />

      {/* Control Buttons */}
      <div className="flex gap-5 mt-6">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="w-full px-6 py-3 rounded hover:opacity-90 hover:scale-105 transition text-lg shadow-inner bg-[#ffd17d] text-amber-950 font-extrabold"
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            setSecondsLeft(selectedMinutes * 60);
          }}
          className="w-full px-6 py-3 rounded hover:opacity-90 hover:scale-105 transition text-lg shadow-inner bg-amber-950 text-[#ffd17d] font-extrabold"
        >
          Reset
        </button>
      </div>

      {/* Quote toggle switch */}
      <div className="fixed bottom-4 right-4 flex items-center gap-3">
        <span className="text-sm">Quotes</span>
        <button
          onClick={() => setShowQuote(!showQuote)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
            showQuote ? "bg-green-500" : "bg-gray-600"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
              showQuote ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {showQuote && <Quote />}
    </div>
  );
};

export default Timer;
