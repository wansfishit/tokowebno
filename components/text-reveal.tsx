"use client";

import { motion } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  if (!text || typeof text !== "string") return null;

  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.025,
        delayChildren: delay,
      },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 120,
      },
    },
    hidden: {
      opacity: 0,
      y: 15,
      filter: "blur(5px)",
    },
  };

  return (
    <>
      {/* Static text for mobile (hidden on tablet/desktop) */}
      <span className={`inline-block md:hidden ${className || ""}`}>
        {text}
      </span>

      {/* Animated text for desktop (hidden on mobile) */}
      <motion.span
        className={`hidden md:inline-block ${className || ""}`}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10px" }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIndex) => (
              <motion.span
                className="inline-block"
                variants={child}
                key={charIndex}
              >
                {char}
              </motion.span>
            ))}
            {/* Add a spacing between words that allows wrapping */}
            {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </>
  );
}

