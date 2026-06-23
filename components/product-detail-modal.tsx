"use client";

import { useEffect } from "react";
import { X, CheckCircle, ExternalLink, MessageSquare, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";
import { useSettingsStore } from "@/lib/store";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { settings } = useSettingsStore();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Content Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl overflow-y-auto z-10 flex flex-col shadow-2xl scrollbar-thin"
        data-lenis-prevent
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-colors border border-slate-200"
          aria-label="Tutup detail"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Screenshot Preview */}
          <div className="md:col-span-6 relative aspect-video md:aspect-auto md:min-h-[450px] bg-slate-50 overflow-hidden border-b md:border-b-0 md:border-r border-slate-200">
            <img
              src={product.screenshot}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-blue-600/90 text-white text-[10px] font-bold tracking-wider uppercase rounded-full">
                {product.category}
              </span>
            </div>
          </div>

          {/* Details Content */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Product Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h2>
              
              {/* Price */}
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-xs text-slate-500">Mulai dari</span>
                <span className="text-2xl font-black text-blue-600">
                  {formatCurrency(product.price)}
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-slate-600 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Features List */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                  <span>Fitur Unggulan</span>
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-750">
                      <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  <span>Teknologi</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-650 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 grid grid-cols-2 gap-3.5 pt-6 border-t border-slate-100">
              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-all border border-slate-200 hover:border-slate-300"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={getWhatsAppUrl(product.name, settings.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Pesan Sekarang</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
