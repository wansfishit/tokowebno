"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // Spring effect to remove harsh snapping
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-blue-600 origin-[0%] z-[9999] shadow-[0_0_8px_rgba(37,99,235,0.4)]"
      style={{ scaleX }}
    />
  );
}
