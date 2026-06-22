"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "hover" | "card">("default");
  
  // Outer circle values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring config for smooth trailing lag effect
  const springConfig = { damping: 30, stiffness: 220, mass: 0.8 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Inner dot values (much stiffer for direct tracking)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const dotXSpring = useSpring(dotX, { damping: 45, stiffness: 450 });
  const dotYSpring = useSpring(dotY, { damping: 45, stiffness: 450 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Offset position to center elements
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
    };

    window.addEventListener("mousemove", moveCursor);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isHoverable = target.closest("a, button, [role='button'], input, select, textarea");
      const isCard = target.closest(".glass-card");

      if (isHoverable) {
        setCursorType("hover");
      } else if (isCard) {
        setCursorType("card");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  // Hide cursor on touch screens to prevent bugs
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Outer Trails Glow Ring */}
      <motion.div
        className={`fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] border transition-all duration-300 ${
          cursorType === "hover"
            ? "bg-blue-600/25 border-blue-400 scale-[2.0] shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            : cursorType === "card"
            ? "bg-blue-600/5 border-blue-500/20 scale-[1.6] rounded-xl"
            : "bg-transparent border-blue-500/60 scale-100 shadow-[0_0_10px_rgba(37,99,235,0.15)]"
        }`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />
      {/* Inner Precision Dot */}
      <motion.div
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] bg-blue-600 transition-transform duration-300 ${
          cursorType === "hover" ? "scale-0" : "scale-100"
        }`}
        style={{
          x: dotXSpring,
          y: dotYSpring,
        }}
      />
    </>
  );
}
