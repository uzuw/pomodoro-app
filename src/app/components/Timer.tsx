"use client";

import { useState, useEffect } from "react";
import Slider from "./Slider";
import Quote from "./Quote";

const CHECKPOINTS = [10, 25, 40, 60];

const Timer: React.FC = () => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(selectedMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

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
    <div className="max-w-md mx-auto p-6 text-center font-vt323 text-white">
      <Quote/>
      <h1 className="text-6xl font-bold mb-8">{formatTime(secondsLeft)}</h1>

      {/* Hidden slider controlling the time */}
      {/* <Slider
        min={10}
        max={60}
        step={5}
        checkpoints={CHECKPOINTS}
        value={selectedMinutes}
        onChange={(val) => setSelectedMinutes(val)}
      /> */}

      {/* Custom UI to show current selected time and controls */}
<div className="flex gap-5">

  <button
        onClick={() => setIsRunning(!isRunning)}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-lg"
      >
        {isRunning ? "Pause" : "Start"}
      </button>
      <button
        onClick={() => {
          setIsRunning(false);
          setSecondsLeft(selectedMinutes*60);

        }}
        className="w-full px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition text-lg"
      >
        Reset
      </button>
</div>
      
    </div>
  );
};

export default Timer;
