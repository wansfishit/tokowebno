"use client";

import { motion } from "framer-motion";
import { Tag, Sparkles, Smartphone, Search, Zap, HeartHandshake, ShieldCheck } from "lucide-react";
import TextReveal from "./text-reveal";

const advantages = [
  {
    icon: Tag,
    title: "Harga Terjangkau",
    description: "Layanan pembuatan website premium dengan harga ekonomis mulai dari Rp150.000 saja tanpa biaya tersembunyi.",
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Sparkles,
    title: "Desain Modern",
    description: "Kami mendesain dengan kiblat tren tahun 2026. Tampilan premium, bersih, elegan, dan menawan di mata pengunjung.",
    color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Website dijamin 100% responsif. Tampil sempurna dan fungsional di perangkat smartphone, tablet, laptop, hingga desktop.",
    color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Search,
    title: "SEO Friendly",
    description: "Struktur HTML semantik standar industri tinggi untuk mempermudah Google mengindeks website Anda di halaman teratas.",
    color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Zap,
    title: "Loading Cepat",
    description: "Ditenagai oleh framework modern Next.js 15. Server-side rendering (SSR) menghasilkan pemuatan halaman secepat kedipan mata.",
    color: "text-cyan-600 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: HeartHandshake,
    title: "Support Setelah Pembelian",
    description: "Konsultasi gratis dan bantuan teknis pasca-pembelian untuk memastikan website Anda berjalan mulus tanpa kendala.",
    color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
  },
];

// Staggered slide from left animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -60, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 18,
      stiffness: 110,
    },
  },
};

export default function Advantages() {
  return (
    <section className="relative py-24 bg-dark-bg border-t border-slate-100 overflow-hidden">
      {/* Background glow */}
      <div className="hidden sm:block absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 text-[10px] font-bold text-blue-600 border border-blue-500/20 rounded-full uppercase tracking-wider mb-3 animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kualitas Utama</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            <TextReveal text="Mengapa Memilih Kami?" />
          </h2>
          <div className="w-16 h-1 bg-blue-600 rounded-full mt-4 mb-4" />
          <p className="text-slate-600 font-light text-sm max-w-xl">
            Kami menghadirkan solusi digital terbaik dengan menggabungkan kecepatan, keindahan desain, dan harga yang bersahabat.
          </p>
        </div>

        {/* Advantages Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {advantages.map((item) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                className="group glass-card rounded-2xl p-6 flex flex-col items-start hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Icon Container */}
                <div className={`p-3 rounded-xl border mb-5 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
