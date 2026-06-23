"use client";

import { testimonials } from "@/data/testimonials";
import { Star, MessageSquareQuote } from "lucide-react";

export default function Testimonials() {
  // Duplicate testimonials to ensure seamless looping marquee
  const doubleTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimoni" className="relative py-24 bg-dark-bg border-t border-slate-100 overflow-hidden">
      {/* Background Glow */}
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 text-[10px] font-bold text-blue-400 border border-blue-500/10 rounded-full uppercase tracking-wider mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Klien Puas</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Ulasan Dari Klien Kami
          </h2>
          <div className="w-16 h-1 bg-blue-600 rounded-full mt-4 mb-4" />
          <p className="text-slate-600 font-light text-sm max-w-xl">
            Kepuasan pelanggan adalah prioritas utama kami. Berikut adalah pendapat mereka setelah mempercayakan pembuatan website kepada kami.
          </p>
        </div>
      </div>

      {/* Marquee Carousel Container */}
      <div className="relative w-full overflow-hidden py-4 mask-gradient-x select-none">
        {/* Shadow Overlays to fade edges */}
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-dark-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-dark-bg to-transparent z-10 pointer-events-none" />

        {/* Carousel Rail */}
        <div className="animate-carousel flex gap-6">
          {doubleTestimonials.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[320px] sm:w-[380px] shrink-0 glass-card rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, sIdx) => (
                    <Star key={sIdx} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Content Quote */}
                <p className="text-xs sm:text-sm text-slate-700 font-light leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-slate-100">
                <img
                  src={item.avatar}
                  alt={item.name}
                  loading="lazy"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-none">{item.name}</h4>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {item.role}, <span className="text-blue-600 font-semibold">{item.company}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
