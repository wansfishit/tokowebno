"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, ArrowUpDown, Eye, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Product } from "@/types";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";
import { useProductsStore, useSettingsStore } from "@/lib/store";
import ProductDetailModal from "./product-detail-modal";
import TextReveal from "./text-reveal";

const categories = [
  "Semua",
  "Landing Page",
  "Company Profile",
  "Toko Online",
  "Sekolah",
  "Blog",
  "Portofolio",
  "Custom Website",
];

// Stagger variants for reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 130,
    },
  },
};

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

function ProductCard({ product, onClick }: ProductCardProps) {
  const { settings } = useSettingsStore();

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden cursor-pointer"
      style={{ borderRadius: 32 }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 28 } }}
    >
      {/* Glass card container */}
      <div
        className="flex flex-col flex-1 bg-white border border-slate-100 overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.1),0_8px_24px_rgba(37,99,235,0.06)]"
        style={{
          borderRadius: 32,
          boxShadow: "0 4px 24px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.02)",
        }}
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={product.thumbnail}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* Category badge — floating glass pill */}
          <div className="absolute top-3.5 left-3.5">
            <span
              className="px-3 py-1 text-[8px] sm:text-[10px] font-bold text-blue-700 uppercase tracking-wider"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 999,
                border: "1px solid rgba(37,99,235,0.18)",
              }}
            >
              {product.category}
            </span>
          </div>

          {/* Hover eye icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div
              className="w-12 h-12 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300"
              style={{
                background: "rgba(37,99,235,0.88)",
                backdropFilter: "blur(8px)",
                borderRadius: 999,
                boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
              }}
            >
              <Eye className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="flex flex-col flex-1 p-4 sm:p-6">
          <h3 className="text-xs sm:text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-1.5 sm:mt-2.5 flex items-baseline gap-1">
            <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium">Mulai</span>
            <span className="text-xs sm:text-base font-extrabold text-blue-600 tracking-tight">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Description — desktop only */}
          <p className="hidden sm:block mt-2.5 text-[11px] text-slate-500 font-light line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* CTA buttons */}
          <div className="mt-3.5 sm:mt-5 pt-3.5 sm:pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
            <a
              href={product.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1 py-2 sm:py-2.5 text-[8px] sm:text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all duration-200"
              style={{
                background: "rgba(248,250,252,1)",
                border: "1px solid rgba(226,232,240,1)",
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Demo</span>
            </a>
            <a
              href={getWhatsAppUrl(product.name, settings.phone)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1 py-2 sm:py-2.5 text-[8px] sm:text-xs font-bold text-white rounded-xl transition-all duration-200 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                boxShadow: "0 4px 14px rgba(37,99,235,0.28)",
              }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Pesan</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Catalog() {
  const { settings } = useSettingsStore();
  const { products: storeProducts, loaded: productsLoaded } = useProductsStore();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close custom sort dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter and Sort logic computed directly in render
  const filteredProducts = useMemo(() => {
    if (!productsLoaded) return [];

    let result = [...storeProducts];

    if (selectedCategory !== "Semua") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name?.toLowerCase() || "").includes(query) ||
          (p.description?.toLowerCase() || "").includes(query) ||
          (p.technologies || []).some((t) => (t?.toLowerCase() || "").includes(query))
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, storeProducts, productsLoaded]);

  return (
    <section
      id="produk"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f8fafc 0%, #eff6ff 40%, #f8fafc 100%)" }}
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hidden sm:block absolute -top-20 right-0 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="hidden sm:block absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative z-10">

        {/* ── Section Header ── */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          {/* Logo icon (Pure transparent image without background frame) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="mb-6"
          >
            <img
              src="/logo.png?v=3"
              alt="TokoWebNo Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {settings.catalogTitle ? (
              <TextReveal text={settings.catalogTitle} />
            ) : (
              <TextReveal text="Katalog Layanan Website" />
            )}
          </h2>

          {/* Accent line */}
          <div className="flex items-center gap-2 mt-4 mb-5">
            <div className="w-6 h-px bg-blue-300" />
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
            <div className="w-6 h-px bg-blue-300" />
          </div>

          <p className="text-slate-500 text-sm sm:text-[15px] font-light max-w-lg leading-relaxed">
            {settings.catalogSubtitle || "Temukan template & jasa custom yang tepat untuk bisnis Anda. Dioptimalkan untuk kecepatan dan konversi."}
          </p>
        </div>

        {/* ── Search + Sort ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-3xl mx-auto">
          {/* iOS-style Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              suppressHydrationWarning
              placeholder={settings.searchPlaceholder || "Cari website impian Anda…"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: 18,
                boxShadow: "0 4px 24px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200/60 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-3 h-3 text-slate-500" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Custom iOS-Style Sort Dropdown */}
          <div className="relative sm:w-60 z-30" ref={sortDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="w-full flex items-center justify-between pl-11 pr-4 py-3.5 text-sm text-slate-750 outline-none cursor-pointer transition-all duration-300 text-left font-semibold"
              style={{
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: 18,
                boxShadow: "0 4px 24px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <span className="truncate pr-2">
                {sortBy === "default" && "Rekomendasi"}
                {sortBy === "price-asc" && "Harga: Rendah → Tinggi"}
                {sortBy === "price-desc" && "Harga: Tinggi → Rendah"}
              </span>
              <span 
                className="text-[8px] text-slate-400 transition-transform duration-300 ml-auto select-none" 
                style={{ transform: isSortDropdownOpen ? "rotate(180deg)" : "rotate(0)" }}
              >
                ▼
              </span>
            </button>

            <AnimatePresence>
              {isSortDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 4, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 w-full overflow-hidden z-50 origin-top shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-slate-200/50"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    borderRadius: 18,
                  }}
                >
                  <div className="p-1 space-y-0.5">
                    {[
                      { value: "default", label: "Rekomendasi" },
                      { value: "price-asc", label: "Harga: Rendah → Tinggi" },
                      { value: "price-desc", label: "Harga: Tinggi → Rendah" }
                    ].map((opt) => {
                      const isSelected = sortBy === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.value);
                            setIsSortDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl text-left transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? "bg-blue-600 text-white shadow-sm font-bold" 
                              : "text-slate-700 hover:bg-slate-900/5"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <span className="text-[10px] font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Floating Category Chips (iOS style) ── */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-14 max-w-4xl mx-auto px-4 relative z-20">
          <LayoutGroup id="category-chips">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className="relative px-5 py-2.5 sm:px-6 sm:py-3 focus:outline-none transition-transform duration-200 active:scale-95 cursor-pointer"
                  style={{ borderRadius: 999 }}
                >
                {/* Active Liquid Glass Pill Background */}
                {isActive ? (
                  <motion.div
                    layoutId="active-chip-glass"
                    className="absolute inset-0 z-0 shadow-[0_8px_24px_rgba(37,99,235,0.14)]"
                    style={{ borderRadius: 999 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  >
                    {/* The 3D convex glass effect with white gradient, top highlight, bottom sheen, and subtle glow */}
                    <div className="absolute inset-0 rounded-[999px] bg-gradient-to-br from-white/95 to-white/70 border border-white/60 shadow-[inset_0_1.5px_2px_rgba(255,255,255,1),0_4px_12px_rgba(0,0,0,0.05)]" />
                    {/* Chromatic prism ring reflection & lens highlights */}
                    <div className="ios-chromatic-ring !rounded-[999px]" />
                    <div className="ios-lens-reflection !rounded-[999px]" />
                  </motion.div>
                ) : (
                  // Inactive Chip Background (Subtle glass border outline)
                  <div
                    className="absolute inset-0 bg-white/45 border border-slate-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-colors duration-200 hover:bg-white/75 hover:border-slate-300"
                    style={{ borderRadius: 999 }}
                  />
                )}
                
                <motion.span
                  className="relative z-10 text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap block"
                  animate={{
                    color: isActive ? "#2563eb" : "#475569",
                    scale: isActive ? 1.1 : 1, // Larger by 10%
                    fontWeight: isActive ? "800" : "600",
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {cat}
                </motion.span>
              </button>
            );
          })}
          </LayoutGroup>
        </div>

        {/* ── Product Grid ── */}
        <motion.div
          layout="size"
          className="relative min-h-[400px]"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {!productsLoaded ? (
            // Skeleton
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key="skeleton"
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-3 animate-pulse bg-white border border-slate-100"
                  style={{ borderRadius: 28, padding: "10px", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
                >
                  <div className="w-full aspect-[4/3] bg-slate-100 rounded-2xl" />
                  <div className="px-1 space-y-2 pb-2">
                    <div className="h-3 w-1/3 bg-slate-100 rounded-full" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
                    <div className="h-3 w-full bg-slate-100 rounded-full hidden sm:block" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-8 flex-1 bg-slate-100 rounded-xl" />
                      <div className="h-8 flex-1 bg-blue-100 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key="catalog-grid"
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </motion.div>
          ) : (
            // Empty state
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key="empty"
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div
                className="w-20 h-20 flex items-center justify-center mb-5 text-3xl"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: 24,
                  border: "1px solid rgba(226,232,240,1)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                🔍
              </div>
              <h4 className="text-lg font-bold text-slate-800">Tidak ada website ditemukan</h4>
              <p className="text-slate-500 text-xs mt-2 max-w-xs leading-relaxed">
                Coba ubah kata kunci atau pilih kategori yang berbeda.
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSearchQuery(""); setSelectedCategory("Semua"); }}
                className="mt-6 px-6 py-2.5 text-white text-xs font-bold rounded-full transition-all"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                }}
              >
                Reset Filter
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
