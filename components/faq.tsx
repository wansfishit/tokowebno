"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/data/faqs";
import TextReveal from "./text-reveal";

// Zoom-in reveal variants
const faqZoomVariants = {
  hidden: { opacity: 0, scale: 0.88, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 90,
      duration: 0.8,
      delay: 0.2,
    },
  },
};

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section id="faq" className="relative py-24 bg-dark-bg border-t border-slate-100 overflow-hidden">
      {/* Background glow */}
      <div className="hidden sm:block absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 text-[10px] font-bold text-blue-600 border border-blue-500/20 rounded-full uppercase tracking-wider mb-3 animate-pulse">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tanya Jawab</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            <TextReveal text="Pertanyaan Yang Sering Diajukan" />
          </h2>
          <div className="w-16 h-1 bg-blue-600 rounded-full mt-4 mb-4" />
          <p className="text-slate-600 font-light text-sm max-w-xl">
            Berikut adalah jawaban dari beberapa pertanyaan umum mengenai layanan, durasi pengerjaan, revisi, dan keamanan website di TokoWebNo.
          </p>
        </div>

        {/* Zoom reveal Accordions wrapper */}
        <motion.div
          variants={faqZoomVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-20px" }}
          className="space-y-4"
        >
          {faqs.map((item, idx) => {
            const isOpen = activeIndex === idx;

            return (
              <div
                key={item.id}
                className="glass rounded-2xl overflow-hidden transition-all duration-300 border border-slate-200/60"
              >
                {/* Header Trigger */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold pr-4">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {/* Answer Content Wrapper */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="p-5 pt-0 text-xs sm:text-sm text-slate-650 leading-relaxed font-light border-t border-slate-100 bg-slate-50/50">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
