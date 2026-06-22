"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolios } from "@/data/portfolio";
import { ExternalLink, Layers, X } from "lucide-react";
import TextReveal from "./text-reveal";

// Staggered wavy entrance reveal from bottom
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 18,
      stiffness: 90,
    },
  },
};

export default function Portfolio() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxName, setLightboxName] = useState<string>("");

  return (
    <section id="portfolio" className="relative py-24 bg-dark-bg border-t border-white/5 overflow-hidden">
      {/* Abstract blur backdrop */}
      <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 text-[10px] font-bold text-blue-400 border border-blue-500/10 rounded-full uppercase tracking-wider mb-3 animate-pulse">
            <Layers className="w-3.5 h-3.5" />
            <span>Karya Terpilih</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            <TextReveal text="Portfolio Pekerjaan Kami" />
          </h2>
          <div className="w-16 h-1 bg-blue-600 rounded-full mt-4 mb-4" />
          <p className="text-gray-400 font-light text-sm max-w-xl">
            Lihat beberapa hasil website yang telah kami rancang dan kembangkan untuk klien-klien kami dari berbagai sektor bisnis.
          </p>
        </div>

        {/* Masonry Grid with Framer Motion Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance]"
        >
          {portfolios.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              onClick={() => {
                setLightboxImage(item.previewImage);
                setLightboxName(item.name);
              }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="break-inside-avoid bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden group relative cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300"
            >
              {/* Preview Image */}
              <div className="relative overflow-hidden w-full h-auto min-h-[220px]">
                <img
                  src={item.previewImage}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Light Sweep overlay effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />
                
                {/* Overlay with glassmorphism */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                  {/* Category Badge */}
                  <span className="self-start px-2.5 py-0.5 bg-blue-600/90 text-white text-[9px] font-bold uppercase rounded-md mb-2">
                    {item.category}
                  </span>

                  {/* Project Name */}
                  <h3 className="text-base font-extrabold text-white leading-tight mb-4">
                    {item.name}
                  </h3>

                  {/* Demo CTA */}
                  <a
                    href={item.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Prevent lightbox trigger
                    className="inline-flex items-center gap-1.5 self-start px-4 py-2 bg-white text-dark-bg text-xs font-bold rounded-lg hover:bg-white/90 active:scale-95 transition-all"
                  >
                    <span>Kunjungi Demo</span>
                    <ExternalLink className="w-3.5 h-3.5 text-dark-bg" />
                  </a>
                </div>
              </div>

              {/* Static details visible on mobile/no-hover */}
              <div className="p-4 flex items-center justify-between md:hidden border-t border-white/5 bg-neutral-950/40">
                <div>
                  <span className="text-[10px] text-blue-400 font-semibold">{item.category}</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{item.name}</h4>
                </div>
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Premium Viewer */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md cursor-pointer"
            />

            {/* Lightbox Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative max-w-4xl w-full z-10 flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-black/60 hover:bg-neutral-800 text-gray-400 hover:text-white rounded-full border border-white/5 transition-colors"
                aria-label="Tutup pratinjau"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo */}
              <div className="w-full bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden p-2 flex flex-col">
                <img
                  src={lightboxImage}
                  alt={lightboxName}
                  className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
                />
                <div className="py-4 px-2 text-center">
                  <p className="text-white text-sm sm:text-base font-bold">{lightboxName}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
