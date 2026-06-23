"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { useSettingsStore } from "@/lib/store";
import TextReveal from "./text-reveal";

export default function Hero() {
  const { settings, loaded } = useSettingsStore();

  // Use dynamic settings text (or fall back to static text while loading)
  const heroTitle = settings.heroTitle;
  const heroTitleBlue = settings.heroTitleBlue;
  const heroSubtitle = settings.heroSubtitle;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-dark-bg">
      {/* Background Glows (Static) */}
      <div className="hidden sm:block absolute top-[20%] left-[25%] w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="hidden sm:block absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[90px] pointer-events-none z-0" />


      {/* Grid Pattern mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_65%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0" />

      <div className="relative max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center z-10 w-full">
        {/* Headline character reveal */}
        {loaded ? (
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
            <TextReveal text={heroTitle} delay={0.1} /> <br />
            <span className="text-blue-600">
              <TextReveal text={heroTitleBlue} delay={0.4} />
            </span>
          </h1>
        ) : (
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
            {heroTitle} <br />
            <span className="text-blue-600">{heroTitleBlue}</span>
          </h1>
        )}

        {/* Subtitle reveal */}
        <motion.p
          key={heroSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl font-light leading-relaxed"
        >
          {heroSubtitle}
        </motion.p>

        {/* Buttons reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#produk"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-full transition-all duration-300 hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10"
          >
            <span>Lihat Website</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={getWhatsAppUrl(undefined, settings.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/30"
          >
            <span>Pesan Sekarang</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
