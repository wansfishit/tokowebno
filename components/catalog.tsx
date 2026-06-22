"use client";

import { useState, useEffect } from "react";
import { Search, ArrowUpDown, Eye, MessageSquare, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 18,
      stiffness: 110,
    },
  },
};

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick}
      className="group relative glass-card rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between overflow-hidden cursor-pointer border border-slate-200/60 hover:border-blue-500/35 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative z-10">
        {/* Thumbnail Container */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50 mb-2 sm:mb-4">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="p-2 sm:p-3 bg-blue-600/90 text-white rounded-full scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
          </div>
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-3 py-0.5 sm:py-1 bg-white/95 backdrop-blur-md text-[8px] sm:text-[10px] text-blue-600 border border-slate-200/60 font-bold rounded-full uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Info */}
        <h3 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-1 sm:mb-2">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="mt-0.5 sm:mt-1 flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1">
          <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Mulai dari</span>
          <span className="text-xs sm:text-base font-extrabold text-blue-600 leading-none">
            {formatCurrency(product.price)}
          </span>
        </div>

        <p className="mt-2.5 text-xs text-slate-500 font-light line-clamp-2 leading-relaxed hidden sm:block">
          {product.description}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-3 sm:mt-5 grid grid-cols-2 gap-1.5 pt-2.5 sm:pt-4 border-t border-slate-100 relative z-10">
        <a
          href={product.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} // Prevent modal trigger
          className="flex items-center justify-center gap-1 py-1.5 sm:py-2.5 bg-slate-50 border border-slate-200 text-[9px] sm:text-xs text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
        >
          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Demo</span>
        </a>
        <a
          href={getWhatsAppUrl(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} // Prevent modal trigger
          className="flex items-center justify-center gap-1 py-1.5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[9px] sm:text-xs font-bold rounded-xl transition-all active:scale-95"
        >
          <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Pesan</span>
        </a>
      </div>
    </motion.div>
  );
}

export default function Catalog() {
  const { settings } = useSettingsStore();
  const { products: storeProducts, loaded: productsLoaded } = useProductsStore();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default"); // default, price-asc, price-desc
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter and Sort logic
  useEffect(() => {
    if (!productsLoaded) return;

    setIsLoading(true);
    const timer = setTimeout(() => {
      let result = [...storeProducts];

      // Filter by category
      if (selectedCategory !== "Semua") {
        result = result.filter((p) => p.category === selectedCategory);
      }

      // Filter by search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.technologies.some((t) => t.toLowerCase().includes(query))
        );
      }

      // Sort
      if (sortBy === "price-asc") {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-desc") {
        result.sort((a, b) => b.price - a.price);
      }

      setFilteredProducts(result);
      setIsLoading(false);
    }, 400); // 400ms loading effect

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy, storeProducts, productsLoaded]);

  return (
    <section id="produk" className="relative py-24 bg-dark-bg border-t border-slate-100 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {settings.catalogTitle ? (
              <TextReveal text={settings.catalogTitle} />
            ) : (
              <TextReveal text="Katalog Layanan Website" />
            )}
          </h2>
          <div className="w-16 h-1 bg-blue-600 rounded-full mt-4 mb-4" />
          <p className="text-slate-600 font-light text-sm max-w-xl">
            {settings.catalogSubtitle || "Jelajahi berbagai pilihan template dan jasa kustom website kami. Semua produk dioptimalkan untuk kecepatan dan konversi maksimal."}
          </p>
        </div>

        {/* Filters Controls Panel */}
        <div className="flex flex-col gap-6 mb-12">
          {/* Search and Sort bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder={settings.searchPlaceholder || "Cari website impian Anda (contoh: Toko Hijab, SaaS)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 focus:border-blue-600/50 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-300 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="md:col-span-4 relative">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 focus:border-blue-600/50 rounded-xl text-sm text-slate-900 outline-none appearance-none cursor-pointer transition-all duration-300 shadow-sm"
              >
                <option value="default">Urutkan: Rekomendasi</option>
                <option value="price-asc">Harga: Terendah ke Tertinggi</option>
                <option value="price-desc">Harga: Tertinggi ke Terendah</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-slate-200 pl-2">
                <span className="text-[10px] text-slate-400">▼</span>
              </div>
            </div>
          </div>

          {/* Category Tabs Grid */}
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 pb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-2 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold text-center transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid (Responsive grid: 2 columns on mobile, 3 columns on lg screens) */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {isLoading || !productsLoaded ? (
              // Skeleton Loading State
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="skeleton"
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
              >
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="glass-card rounded-2xl p-2.5 sm:p-4 flex flex-col gap-3 sm:gap-4 animate-pulse">
                    <div className="w-full aspect-[4/3] bg-slate-200 rounded-xl" />
                    <div className="h-4 w-1/3 bg-slate-200 rounded-full" />
                    <div className="h-5 w-3/4 bg-slate-200 rounded-full" />
                    <div className="h-8 w-full bg-slate-200 rounded-xl hidden sm:block" />
                    <div className="flex gap-1.5 mt-1">
                      <div className="h-7 flex-1 bg-slate-200 rounded-xl" />
                      <div className="h-7 flex-1 bg-slate-200 rounded-xl" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : filteredProducts.length > 0 ? (
              // Active Product Grid
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-100px" }}
                key="products"
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
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
              // Empty State
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="empty"
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400 border border-slate-200">
                  🔍
                </div>
                <h4 className="text-lg font-bold text-slate-900">Tidak ada website ditemukan</h4>
                <p className="text-gray-500 text-xs mt-1 max-w-xs">
                  Coba sesuaikan kata kunci pencarian Anda atau pilih kategori filter yang lain.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Semua");
                  }}
                  className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white text-xs font-semibold rounded-lg transition-all"
                >
                  Reset Filter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Integration */}
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
