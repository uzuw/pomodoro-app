import React from "react";
import MuiSlider from "@mui/material/Slider";

interface SliderProps {
  min: number;
  max: number;
  step: number;
  checkpoints: number[]; // main checkpoints (e.g. 10,25,40,60)
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step,
  checkpoints,
  value,
  onChange,
}) => {
  // We'll create marks every `step` mins
  const marks = [];
  for (let i = min; i <= max; i += step) {
    marks.push({ value: i, label: i % 10 === 0 ? `${i}m` : "" }); // Label only every 10 mins to reduce clutter
  }

  // Snap to nearest step (e.g. every 5 mins)
  const snapToStep = (val: number) => {
    return Math.round(val / step) * step;
  };

  // Or snap only to main checkpoints if you want:
  // const snapToCheckpoint = (val: number) => {
  //   let closest = checkpoints[0];
  //   let minDiff = Math.abs(val - closest);
  //   for (const cp of checkpoints) {
  //     const diff = Math.abs(val - cp);
  //     if (diff < minDiff) {
  //       minDiff = diff;
  //       closest = cp;
  //     }
  //   }
  //   return closest;
  // };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      const snapped = snapToStep(newValue); // snap to every 5 mins
      onChange(snapped);
    }
  };

  return (
    <MuiSlider
  value={value}
  min={min}
  max={max}
  step={step}
  marks={marks}
  onChange={handleChange}
  aria-label="Timer length slider"
  valueLabelDisplay="auto"
  sx={{
    color: "#ffd17d",
    height: 8,

    "& .MuiSlider-thumb": {
      height: 20,
      width: 20,
      backgroundImage: `url('/navbar/sliderpaw.png')`, // Path to your image
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      border: "2px solid white",
      "&:hover": {
        boxShadow: "0 0 0 8px rgba(255, 209, 125, 0.16)",
      },
    },

    "& .MuiSlider-track": {
      border: "none",
      backgroundColor: "#ffd17d",
    },

    "& .MuiSlider-rail": {
      backgroundColor: "#ffffff33",
    },

    "& .MuiSlider-mark": {
      backgroundColor: "#ffffff80",
      height: 6,
      width: 2,
      marginTop: -2,
    },

    "& .MuiSlider-markLabel": {
      color: "#ffffffaa",
      fontSize: "0.75rem",
    },
  }}
/>

  );
};

export default Slider;
