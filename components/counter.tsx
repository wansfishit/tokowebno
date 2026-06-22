"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export default function Counter({
  from = 0,
  to,
  duration = 2,
  suffix = "",
  className,
}: CounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: false, margin: "-50px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    // Smooth count interpolation using framer-motion animate
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo shape
      onUpdate(value) {
        setCount(Math.floor(value));
      },
    });

    return () => controls.stop();
  }, [isInView, from, to, duration]);

  return (
    <span ref={nodeRef} className={className}>
      {count.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}
