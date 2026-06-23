"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, ArrowUpRight } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { useSettingsStore } from "@/lib/store";

const footerLinks = [
  { name: "Beranda", href: "#" },
  { name: "Produk Website", href: "#produk" },
  { name: "FAQ", href: "#faq" },
];

// Rotate & Slide-up reveal variants for Footer
const footerVariants = {
  hidden: { opacity: 0, y: 70, rotateX: 6, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 22,
      stiffness: 80,
      duration: 0.9,
    },
  },
};

export default function Footer() {
  const { settings } = useSettingsStore();
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      id="kontak"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-20px" }}
      style={{ perspective: 1000 }}
      className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 overflow-hidden relative"
    >
      {/* Background glow */}
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 mb-12 relative z-10">
        {/* Brand Column */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-slate-900">TokoWebNo</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed max-w-sm">
            TokoWebNo adalah penyedia jasa pembuatan website custom modern kelas dunia, mulai dari Landing Page, Company Profile, Toko Online, hingga Web App kustom berkinerja tinggi.
          </p>
          <span className="text-xs text-slate-400 font-light mt-2 hidden md:block">
            &copy; {currentYear} TokoWebNo. All rights reserved.
          </span>
        </div>

        {/* Links Column */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
            Navigasi Cepat
          </h3>
          <ul className="flex flex-col gap-2">
            {footerLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-xs sm:text-sm text-slate-500 hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
            Hubungi Kami
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            Punya ide proyek website baru? Konsultasikan ide Anda bersama tim developer kami sekarang juga secara gratis.
          </p>
          <a
            href={getWhatsAppUrl(undefined, settings.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 self-start px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/10 active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Hubungi via WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Footer Bottom copyright for mobile */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <span className="text-[11px] text-slate-400 font-light md:hidden">
          &copy; {currentYear} TokoWebNo. All rights reserved.
        </span>
        <div className="flex gap-4 items-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-0.5"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-0.5"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </a>
        </div>
        <span className="text-[11px] text-slate-400 font-light">
          Built with Next.js 15 & Framer Motion
        </span>
      </div>
    </motion.footer>
  );
}
