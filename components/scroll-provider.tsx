"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run on desktop/larger viewports to preserve performance on mobile
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential easing
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });

      let rafId: number;
      const update = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(update);
      };

      rafId = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    }
  }, []);

  return <>{children}</>;
}
