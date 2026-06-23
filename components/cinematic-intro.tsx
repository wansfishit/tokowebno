"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicIntro() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"blur-in" | "shatter" | "reform" | "progress" | "fade-out">("blur-in");

  useEffect(() => {
    // Stage 1: Blur-in (0s to 0.8s)
    const t1 = setTimeout(() => setPhase("shatter"), 900);

    // Stage 2: Shatter (0.8s to 1.7s)
    const t2 = setTimeout(() => setPhase("reform"), 1800);

    // Stage 3: Reform & Start Progress (1.8s to 2.8s)
    const t3 = setTimeout(() => {
      setPhase("progress");
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 4;
        });
      }, 25);
    }, 2400);

    // Stage 4: Zoom & Fade Out (after progress finishes)
    const t4 = setTimeout(() => {
      setPhase("fade-out");
      const t5 = setTimeout(() => {
        setLoading(false);
        if (typeof window !== "undefined") {
          document.body.style.overflow = "";
        }
      }, 750);
      return () => clearTimeout(t5);
    }, 3400);

    // Lock scroll during intro
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (typeof window !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  if (!loading) return null;

  return (
    <AnimatePresence>
      {phase !== "fade-out" && (
        <motion.div
          exit={{ opacity: 0, scale: 1.15, filter: "blur(15px)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] bg-[#f8fafc] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated Background Gradients & Ambient Lights */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
          <motion.div
            animate={{
              x: [0, 40, -40, 0],
              y: [0, -40, 40, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"
          />

          {/* Logo container */}
          <div className="relative flex flex-col items-center gap-6">
            <AnimatePresence mode="wait">
              {phase === "blur-in" && (
                <motion.h1
                  key="blur-in"
                  initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-4xl sm:text-5xl font-black tracking-widest text-slate-900 uppercase text-center"
                >
                  TokoWebNo
                </motion.h1>
              )}

              {phase === "shatter" && (
                <motion.div
                  key="shatter"
                  className="flex gap-1.5 items-center justify-center"
                >
                  {"TokoWebNo".split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 1, y: 0, x: 0 }}
                      animate={{
                        opacity: [1, 0.35, 0.95],
                        y: Math.sin(i * 1.5) * 35 - 15,
                        x: Math.cos(i * 1.5) * 45 - 20,
                        rotate: Math.sin(i) * 50,
                        scale: 0.75,
                      }}
                      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                      className="text-4xl sm:text-5xl font-black text-blue-600 select-none cursor-default"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              )}

              {(phase === "reform" || phase === "progress") && (
                <motion.div
                  key="reform"
                  initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: ["blur(0px)", "drop-shadow(0 0 10px rgba(37,99,235,0.2))", "drop-shadow(0 0 3px rgba(37,99,235,0.1))"],
                  }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-2"
                >
                  <h1 className="text-4xl sm:text-5xl font-black tracking-widest text-slate-900 uppercase">
                    TokoWebNo
                  </h1>
                  <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Premium Loading Progress Bar */}
            {phase === "progress" && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "180px" }}
                transition={{ duration: 0.4 }}
                className="h-1 bg-slate-200/80 rounded-full overflow-hidden mt-6"
              >
                <motion.div
                  className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]"
                  style={{ width: `${progress}%` }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
