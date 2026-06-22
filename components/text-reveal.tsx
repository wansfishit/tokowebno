"use client";

import { motion } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  // Split text into letters, preserving whitespace using non-breaking space
  const letters = text.split("").map((char) => (char === " " ? "\u00A0" : char));

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
    <motion.span
      className={`inline-block ${className || ""}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-50px" }}
    >
      {letters.map((letter, index) => (
        <motion.span
          className="inline-block"
          variants={child}
          key={index}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
