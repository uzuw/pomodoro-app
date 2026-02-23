"use client";

import { motion, useMotionValue, useTransform, TargetAndTransition } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";

type AnimationType = "float" | "bounce" | "wiggle" | "none";

interface PetBuddyProps {
  image: string;
  name: string;
  size?: number;
  initialX?: number;
  initialY?: number;
  animationType?: AnimationType;
  onPetClick?: () => void;
}

const PetBuddy: React.FC<PetBuddyProps> = ({
  image,
  name,
  size = 100,
  initialX = 100,
  initialY = 100,
  animationType = "float",
  onPetClick
}) => {
  const constraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Track X to handle the flipping logic
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, (latest) => (latest > 0 ? 0 : 180));

  const idleAnimations: Record<AnimationType, TargetAndTransition> = {
    float: {
      y: [0, -15, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
    bounce: {
      y: [0, -25, 0],
      scaleY: [1, 0.8, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeOut" },
    },
    wiggle: {
      rotate: [-8, 8, -8],
      transition: { duration: 0.5, repeat: Infinity, ease: "linear" },
    },
    none: {}
  };

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[9999]">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={true}
        style={{ 
          x: dragX, // Link motion value for flipping
          left: initialX,
          top: initialY,
          width: size,
          rotateY: rotateY,
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        className="absolute pointer-events-auto flex flex-col items-center cursor-grab active:cursor-grabbing"
      >
        {/* INNER MOTION DIV: This handles the idle floating/bouncing separately from the drag */}
        <motion.div
          animate={isDragging ? { y: 0, rotate: 0, scale: 1.1 } : idleAnimations[animationType]}
          onClick={onPetClick}
          className="flex flex-col items-center"
        >
          {/* Label */}
          <div className="relative mb-2">
            <div className="bg-black/80 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-lg font-minecraft border-2 border-white/20 shadow-xl whitespace-nowrap">
              {name}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45 border-r-2 border-b-2 border-white/20" />
          </div>

          {/* Sprite */}
          <div className="relative">
            <Image
              src={image}
              alt={name}
              width={size}
              height={size}
              className="object-contain pointer-events-none drop-shadow-2xl"
              draggable={false}
            />
            
            {/* Reactive Aura */}
            <motion.div
              animate={{ 
                scale: isDragging ? 1.4 : 1,
                opacity: isDragging ? 0.6 : 0.2,
                backgroundColor: isDragging ? "#f472b6" : "#fbbf24" 
              }}
              className="absolute inset-0 blur-3xl rounded-full -z-10"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PetBuddy;