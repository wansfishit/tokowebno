"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  LogOut, 
  Lock, 
  Edit2, 
  Check, 
  RefreshCw, 
  Settings, 
  LayoutGrid, 
  Trash2, 
  Plus, 
  Eye, 
  MessageSquare,
  Search,
  X,
  UploadCloud,
  FileText
} from "lucide-react";
import { useSettingsStore, useProductsStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const categories = [
  "Landing Page",
  "Company Profile",
  "Toko Online",
  "Sekolah",
  "Blog",
  "Portofolio",
  "Custom Website",
];

// Admin Product Card for visual catalog management
function AdminProductCard({ 
  product, 
  onEdit, 
  onDelete 
}: { 
  product: Product; 
  onEdit: () => void; 
  onDelete: () => void; 
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 28 } }}
      className="bg-white/90 backdrop-blur-md rounded-[28px] border border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col group h-full justify-between transition-shadow duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-100">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
        />
        {/* Floating Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md text-[9px] text-blue-650 border border-slate-200/60 font-bold rounded-full uppercase tracking-wider shadow-sm">
          {product.category}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-650 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-[9px] text-slate-400 font-medium">Mulai</span>
            <span className="text-xs sm:text-sm font-extrabold text-blue-600">
              {formatCurrency(product.price)}
            </span>
          </div>
          <p className="mt-2 text-[10px] text-slate-555 font-light line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-1 py-2 text-xs font-bold text-blue-650 bg-blue-50/80 hover:bg-blue-100/90 rounded-xl transition-all cursor-pointer border border-blue-100/30"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center justify-center gap-1 py-2 text-xs font-bold text-red-650 bg-red-50/85 hover:bg-red-100/90 rounded-xl transition-all cursor-pointer border border-red-100/30"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Tab management
  const [activeTab, setActiveTab] = useState<"settings" | "products">("settings");

  // Stores
  const { settings, loaded: settingsLoaded, updateSettings, resetSettings } = useSettingsStore();
  const { products, updateProduct, addProduct, deleteProduct, resetProducts } = useProductsStore();

  // Search & filter states inside Admin Products tab
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [adminSelectedCategory, setAdminSelectedCategory] = useState("Semua");

  // Form settings state
  const [formSettings, setFormSettings] = useState({
    siteName: "",
    phone: "",
    heroTitle: "",
    heroTitleBlue: "",
    heroSubtitle: "",
    catalogTitle: "",
    catalogSubtitle: "",
    searchPlaceholder: "",
  });

  // Selected product to edit/create (reused for both add & edit)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Tag inputs for arrays in product editing
  const [featureInput, setFeatureInput] = useState("");
  const [techInput, setTechInput] = useState("");

  // Success toast state
  const [toastMessage, setToastMessage] = useState("");

  // custom delete confirmation state
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  // Gallery Modal states
  const [galleryImages, setGalleryImages] = useState<{ name: string; url: string }[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState<"thumbnail" | "screenshot" | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [activeBucket, setActiveBucket] = useState("gallery");

  // Sync settings stores with local form states once loaded
  useEffect(() => {
    if (settingsLoaded) {
      setFormSettings({
        siteName: settings.siteName,
        phone: settings.phone,
        heroTitle: settings.heroTitle,
        heroTitleBlue: settings.heroTitleBlue,
        heroSubtitle: settings.heroSubtitle,
        catalogTitle: settings.catalogTitle || "Katalog Layanan Website",
        catalogSubtitle: settings.catalogSubtitle || "Temukan template & jasa custom yang tepat untuk bisnis Anda. Dioptimalkan untuk kecepatan dan konversi.",
        searchPlaceholder: settings.searchPlaceholder || "Cari website impian Anda…",
      });
    }
  }, [settings, settingsLoaded]);

  // Check session on mount
  useEffect(() => {
    const session = sessionStorage.getItem("admin_session");
    if (session === "active") {
      setIsLoggedIn(true);
    }
  }, []);

  // Filter products for visual admin catalog grid
  const adminFilteredProducts = useMemo(() => {
    let result = [...products];
    if (adminSelectedCategory !== "Semua") {
      result = result.filter((p) => p.category === adminSelectedCategory);
    }
    if (adminSearchQuery.trim() !== "") {
      const q = adminSearchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name?.toLowerCase() || "").includes(q) ||
          (p.description?.toLowerCase() || "").includes(q) ||
          (p.technologies || []).some((t) => (t?.toLowerCase() || "").includes(q))
      );
    }
    return result;
  }, [products, adminSelectedCategory, adminSearchQuery]);

  // Fetch gallery list when modal opens
  const fetchGallery = useCallback(async () => {
    setGalleryError("");
    try {
      let bucket = activeBucket;
      let { data, error } = await supabase.storage.from(bucket).list("", {
        limit: 100,
        sortBy: { column: "name", order: "desc" },
      });

      if (error && bucket === "gallery") {
        console.warn("Gagal memuat bucket 'gallery', mencoba fallback ke 'galery'...");
        bucket = "galery";
        const fallbackResult = await supabase.storage.from(bucket).list("", {
          limit: 100,
          sortBy: { column: "name", order: "desc" },
        });

        if (!fallbackResult.error) {
          error = null;
          data = fallbackResult.data;
          setActiveBucket("galery");
        } else {
          error = fallbackResult.error;
        }
      } else if (error && bucket === "galery") {
        console.warn("Gagal memuat bucket 'galery', mencoba fallback ke 'gallery'...");
        bucket = "gallery";
        const fallbackResult = await supabase.storage.from(bucket).list("", {
          limit: 100,
          sortBy: { column: "name", order: "desc" },
        });

        if (!fallbackResult.error) {
          error = null;
          data = fallbackResult.data;
          setActiveBucket("gallery");
        } else {
          error = fallbackResult.error;
        }
      }

      if (error) {
        throw error;
      }

      if (data) {
        const urls = data.map((item) => {
          const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(item.name);
          return { name: item.name, url: publicUrl };
        });
        setGalleryImages(urls);
      }
    } catch (err) {
      console.error("Gagal memuat storage Supabase:", err);
      setGalleryError(
        "Gagal memuat galeri. Pastikan Anda telah membuat bucket publik bernama 'gallery' atau 'galery' di dashboard Supabase Anda."
      );
    }
  }, [activeBucket]);

  useEffect(() => {
    if (isGalleryOpen) {
      fetchGallery();
    }
  }, [isGalleryOpen, fetchGallery]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    showToast("Mengunggah foto ke Supabase...");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    try {
      const { error } = await supabase.storage.from(activeBucket).upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from(activeBucket).getPublicUrl(fileName);

      await fetchGallery();

      if (galleryTarget === "thumbnail" && editingProduct) {
        setEditingProduct({ ...editingProduct, thumbnail: publicUrl });
      } else if (galleryTarget === "screenshot" && editingProduct) {
        setEditingProduct({ ...editingProduct, screenshot: publicUrl });
      }

      showToast("Foto berhasil diunggah!");
      setIsGalleryOpen(false);
    } catch (err) {
      console.error("Gagal upload:", err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(
        `Gagal mengunggah foto. Pastikan bucket '${activeBucket}' sudah dibuat sebagai 'Public' di Supabase.\n\nDetail: ` + msg
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectGalleryImage = (url: string) => {
    if (galleryTarget === "thumbnail" && editingProduct) {
      setEditingProduct({ ...editingProduct, thumbnail: url });
    } else if (galleryTarget === "screenshot" && editingProduct) {
      setEditingProduct({ ...editingProduct, screenshot: url });
    }
    setIsGalleryOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "pereman0813@gmail.com" && password === "Tino2009") {
      setIsLoggedIn(true);
      setLoginError("");
      sessionStorage.setItem("admin_session", "active");
      showToast("Selamat datang, Admin!");
    } else {
      setLoginError("Email atau Password salah!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_session");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    showToast("Pengaturan website berhasil disimpan!");
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      if (editingProduct.name.trim() === "") {
        alert("Nama produk tidak boleh kosong!");
        return;
      }
      
      if (editingProduct.id === "new") {
        const newProductData = {
          name: editingProduct.name,
          category: editingProduct.category,
          price: editingProduct.price,
          description: editingProduct.description,
          thumbnail: editingProduct.thumbnail,
          screenshot: editingProduct.screenshot,
          demoUrl: editingProduct.demoUrl,
          features: editingProduct.features,
          technologies: editingProduct.technologies,
        };
        addProduct(newProductData);
        showToast("Produk baru berhasil ditambahkan!");
      } else {
        updateProduct(editingProduct);
        showToast("Produk berhasil diperbarui!");
      }
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: string, name: string) => {
    // Open Web-based delete confirmation instead of window.confirm
    setProductToDelete({ id, name });
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      showToast(`Produk "${productToDelete.name}" berhasil dihapus!`);
      setProductToDelete(null);
    }
  };

  const handleAddFeature = () => {
    if (!featureInput.trim() || !editingProduct) return;
    const updatedFeatures = [...editingProduct.features, featureInput.trim()];
    setEditingProduct({ ...editingProduct, features: updatedFeatures });
    setFeatureInput("");
  };

  const handleAddTech = () => {
    if (!techInput.trim() || !editingProduct) return;
    const updatedTech = [...editingProduct.technologies, techInput.trim()];
    setEditingProduct({ ...editingProduct, technologies: updatedTech });
    setTechInput("");
  };

  const handleResetAll = () => {
    // Keep window.confirm for system resets to prevent accidental system wipe, styled nicely
    if (window.confirm("Apakah Anda yakin ingin menyetel ulang semua pengaturan dan produk ke bawaan pabrik?")) {
      resetSettings();
      resetProducts();
      setEditingProduct(null);
      showToast("Sistem berhasil disetel ulang!");
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // ──── VIEW: LOGIN VIEW ────
  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden"
        style={{
          background: "radial-gradient(circle at top left, #eff6ff 0%, #f8fafc 40%, #eff6ff 100%)"
        }}
      >
        {/* Glow ambient design */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-650/5 rounded-full blur-[70px] pointer-events-none" />

        {/* Back Link */}
        <Link href="/" className="mb-6 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors relative z-10 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Premium iOS-style Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="w-full max-w-md border border-white/60 rounded-3xl p-6 sm:p-8 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.06)] relative z-10"
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3 border border-blue-100/30">
              <Lock className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 text-center">TokoWebNo Admin</h1>
            <p className="text-xs text-slate-500 text-center mt-1 font-light">Masuk ke panel pengaturan website</p>
          </div>

          {loginError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3.5 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-650 font-bold"
            >
              ⚠️ {loginError}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Email / Username</label>
              <input
                type="email"
                required
                placeholder="admin@tokowebno.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border border-slate-200/60 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border border-slate-200/60 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-750 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/10 active:scale-98 cursor-pointer mt-2"
            >
              Masuk Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ──── VIEW: MAIN DASHBOARD VIEW ────
  return (
    <div 
      className="min-h-screen text-slate-900 font-sans relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f8fafc 0%, #eff6ff 40%, #f8fafc 100%)"
      }}
    >
      {/* Glow backgrounds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Dynamic Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 bg-slate-950 text-white text-xs font-bold rounded-full shadow-2xl flex items-center gap-2 border border-slate-800"
          >
            <Check className="w-4 h-4 text-emerald-450" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS-Style Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductToDelete(null)}
              className="absolute inset-0 bg-slate-955/35 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-sm bg-white/90 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 shadow-2xl z-10 flex flex-col text-center"
            >
              <div className="mx-auto w-12 h-12 bg-red-50 text-red-500 rounded-full border border-red-100/40 flex items-center justify-center mb-4">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-950">Hapus Produk</h3>
              <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">
                Apakah Anda yakin ingin menghapus produk <strong className="font-bold text-slate-800">&ldquo;{productToDelete.name}&rdquo;</strong>?<br />
                Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
                  className="py-2.5 bg-red-605 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/10 active:scale-98 cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Navbar */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/60 sticky top-0 z-30 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200/60">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-950 leading-none">Dashboard Admin</h1>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-extrabold uppercase tracking-widest rounded-md border border-blue-100">PRO</span>
              </div>
              <span className="text-[9px] text-slate-400 mt-1 block">TokoWebNo Customizer & Catalog Manager</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleResetAll}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200 shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Setel Ulang Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-655 hover:text-red-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-red-100 shadow-sm cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Metric Cards Banner (High Fidelity Glass Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white/70 border border-white/60 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between hover:shadow-md transition-all group backdrop-blur-md">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Produk Aktif</span>
              <span className="text-3xl font-black text-slate-955 mt-1.5 block leading-none">{products.length}</span>
              <span className="text-[9px] text-slate-400 mt-1 block">Telah tayang di katalog utama</span>
            </div>
            <div className="p-3.5 bg-blue-50 text-blue-605 rounded-2xl border border-blue-100/40 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <LayoutGrid className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white/70 border border-white/60 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between hover:shadow-md transition-all group backdrop-blur-md">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rata-rata Harga</span>
              <span className="text-3xl font-black text-slate-955 mt-1.5 block leading-none">
                {formatCurrency(
                  products.length > 0 ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / products.length) : 0
                )}
              </span>
              <span className="text-[9px] text-slate-400 mt-1 block">Rata-rata harga per template</span>
            </div>
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100/40 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <Check className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="bg-white/70 border border-white/60 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between hover:shadow-md transition-all group backdrop-blur-md">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">WhatsApp Tujuan</span>
              <span className="text-base font-black text-slate-800 mt-2 block tracking-wider truncate max-w-[190px]">
                +{settings.phone || "Belum diatur"}
              </span>
              <span className="text-[9px] text-slate-400 mt-1 block">Redireksi tombol pemesanan</span>
            </div>
            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100/40 transition-colors group-hover:bg-indigo-650 group-hover:text-white">
              <Settings className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 border border-white/60 rounded-3xl p-4.5 space-y-2 shadow-sm sticky top-24 backdrop-blur-md">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 block">Menu Navigasi</span>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setEditingProduct(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                    : "text-slate-655 hover:bg-slate-900/5 hover:text-slate-950"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Pengaturan Website</span>
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "products"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                    : "text-slate-655 hover:bg-slate-900/5 hover:text-slate-950"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <div className="flex justify-between items-center w-full">
                  <span>Katalog Produk</span>
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                    activeTab === "products" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {products.length}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9">
            {/* TAB 1: SITE SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-white/70 border border-white/60 rounded-3xl p-6 sm:p-8 shadow-sm backdrop-blur-md">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-lg font-extrabold text-slate-950">
                    Pengaturan Tampilan Website
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Ubah judul, nomor kontak WhatsApp, dan teks beranda secara instan</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-0.5">Nama Website</label>
                      <input
                        type="text"
                        required
                        value={formSettings.siteName}
                        onChange={(e) => setFormSettings({ ...formSettings, siteName: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-2xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-550/20 outline-none transition-all shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-0.5">No WhatsApp (Gunakan 628...)</label>
                      <input
                        type="text"
                        required
                        value={formSettings.phone}
                        onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-2xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-550/20 outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-0.5">Judul Utama Hero (Teks Hitam)</label>
                    <input
                      type="text"
                      required
                      value={formSettings.heroTitle}
                      onChange={(e) => setFormSettings({ ...formSettings, heroTitle: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-2xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-550/20 outline-none transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-0.5">Judul Utama Hero (Teks Sorotan Biru)</label>
                    <input
                      type="text"
                      required
                      value={formSettings.heroTitleBlue}
                      onChange={(e) => setFormSettings({ ...formSettings, heroTitleBlue: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-2xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-550/20 outline-none transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-0.5">Deskripsi Hero & Subtitle</label>
                    <textarea
                      rows={4}
                      required
                      value={formSettings.heroSubtitle}
                      onChange={(e) => setFormSettings({ ...formSettings, heroSubtitle: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-2xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-550/20 outline-none transition-all resize-y shadow-inner"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100/60 space-y-4">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block pl-0.5">Pengaturan Katalog Produk</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-0.5">Judul Katalog</label>
                        <input
                          type="text"
                          required
                          value={formSettings.catalogTitle}
                          onChange={(e) => setFormSettings({ ...formSettings, catalogTitle: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-2xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-550/20 outline-none transition-all shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-0.5">Placeholder Pencarian Katalog</label>
                        <input
                          type="text"
                          required
                          value={formSettings.searchPlaceholder}
                          onChange={(e) => setFormSettings({ ...formSettings, searchPlaceholder: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-2xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-550/20 outline-none transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 pl-0.5">Deskripsi Katalog</label>
                      <textarea
                        rows={3}
                        required
                        value={formSettings.catalogSubtitle}
                        onChange={(e) => setFormSettings({ ...formSettings, catalogSubtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-2xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-550/20 outline-none transition-all resize-y shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-755 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/10 active:scale-98 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Pengaturan Utama</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: PRODUCTS CATALOG MANAGER */}
            {activeTab === "products" && (
              <div className="space-y-6">
                
                {/* Visual Editable Catalog Grid */}
                <div className="bg-white/70 border border-white/60 rounded-3xl p-5 shadow-sm backdrop-blur-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-5 gap-3">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-950">
                        Katalog Editor & Management
                      </h2>
                      <span className="text-[9px] text-slate-400 mt-1 block">Ubah detail, hapus, atau tambahkan produk baru secara visual</span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProduct({
                          id: "new",
                          name: "",
                          category: "Landing Page",
                          price: 150000,
                          description: "",
                          thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60",
                          screenshot: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80",
                          demoUrl: "https://demo.example.com",
                          features: ["Desain Responsif & Mobile Friendly", "Integrasi WhatsApp Chat", "SEO Tag Dasar"],
                          technologies: ["React", "Next.js", "Tailwind CSS"],
                        });
                      }}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-755 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/10 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Produk Baru</span>
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="space-y-4 mb-6">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Cari katalog produk admin..."
                        value={adminSearchQuery}
                        onChange={(e) => setAdminSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 bg-white/50 border border-slate-200/60 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                      />
                      {adminSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setAdminSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {["Semua", ...categories].map((cat) => {
                        const isSel = adminSelectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setAdminSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 text-[10px] font-bold rounded-full transition-all cursor-pointer whitespace-nowrap border ${
                              isSel 
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-white/60 text-slate-600 border-slate-200/60 hover:bg-white hover:border-slate-350"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Visual Grid list */}
                  <div className="relative min-h-[300px]">
                    <LayoutGroup id="admin-product-grid">
                      {adminFilteredProducts.length === 0 ? (
                        <div className="text-center py-16 text-slate-400 text-xs font-bold border border-dashed border-slate-250 rounded-3xl bg-slate-50/20">
                          Tidak ada produk katalog ditemukan.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {adminFilteredProducts.map((product) => (
                            <AdminProductCard
                              key={product.id}
                              product={product}
                              onEdit={() => setEditingProduct(product)}
                              onDelete={() => handleDeleteProduct(product.id, product.name)}
                            />
                          ))}
                        </div>
                      )}
                    </LayoutGroup>
                  </div>
                </div>

                {/* Sliding iOS-Style Right Drawer for Form Editor */}
                <AnimatePresence>
                  {editingProduct && (
                    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
                      {/* Dimming backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditingProduct(null)}
                        className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs cursor-pointer z-40"
                      />
                      
                      {/* Form panel drawer */}
                      <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="relative w-full max-w-xl bg-white border-l border-slate-200/60 shadow-[[-16px_0_40px_rgba(0,0,0,0.06)]] z-50 flex flex-col h-full"
                      >
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                          <div>
                            <h2 className="text-base font-extrabold text-slate-900 leading-none">
                              {editingProduct.id === "new" ? "Tambah Produk Baru" : "Edit Detail Produk"}
                            </h2>
                            <span className="text-[9px] text-slate-400 mt-1 block">Lengkapi detail layanan website di bawah ini</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Scrollable inputs wrapper */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
                          
                          {/* Live Preview Box */}
                          <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl space-y-3">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block pl-0.5">Live Card Preview</span>
                            <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between overflow-hidden shadow-sm max-w-[280px] mx-auto scale-95 origin-top">
                              <div>
                                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50 mb-3">
                                  {editingProduct.thumbnail ? (
                                    <img src={editingProduct.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-semibold">
                                      Foto utama kosong
                                    </div>
                                  )}
                                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-md text-[8px] text-blue-650 border border-slate-200/40 font-bold rounded-full uppercase shadow-sm">
                                    {editingProduct.category || "Kategori"}
                                  </span>
                                </div>
                                <h3 className="text-xs font-bold text-slate-900 line-clamp-1 leading-tight mb-1">{editingProduct.name || "Nama Website Baru"}</h3>
                                <div className="flex items-baseline gap-0.5">
                                  <span className="text-[8px] text-slate-400">Mulai</span>
                                  <span className="text-xs font-extrabold text-blue-600">{formatCurrency(editingProduct.price || 0)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <form onSubmit={handleSaveProduct} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-655 uppercase tracking-widest mb-1.5 pl-0.5">Nama Layanan</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Nama template..."
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-550 outline-none transition-all shadow-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-655 uppercase tracking-widest mb-1.5 pl-0.5">Harga Dasar (IDR)</label>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  value={editingProduct.price}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-550 outline-none transition-all shadow-sm"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-655 uppercase tracking-widest mb-1.5 pl-0.5">Kategori</label>
                                <select
                                  value={editingProduct.category}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-550 outline-none transition-all shadow-sm cursor-pointer"
                                >
                                  {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-655 uppercase tracking-widest mb-1.5 pl-0.5">URL Demo Live</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="https://demo.com"
                                  value={editingProduct.demoUrl}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, demoUrl: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-550 outline-none transition-all shadow-sm"
                                />
                              </div>
                            </div>

                            {/* Image Selectors */}
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block">Aset Media (Supabase Storage)</span>
                              
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1 pl-0.5">Foto Utama (Thumbnail Card)</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    required
                                    placeholder="https://..."
                                    value={editingProduct.thumbnail}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-900 focus:border-blue-500 outline-none transition-all shadow-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGalleryTarget("thumbnail");
                                      setIsGalleryOpen(true);
                                    }}
                                    className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition-colors cursor-pointer"
                                  >
                                    Cari Aset
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1 pl-0.5">Screenshot Detil (Ketika di-klik)</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    required
                                    placeholder="https://..."
                                    value={editingProduct.screenshot}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, screenshot: e.target.value })}
                                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-900 focus:border-blue-500 outline-none transition-all shadow-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGalleryTarget("screenshot");
                                      setIsGalleryOpen(true);
                                    }}
                                    className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition-colors cursor-pointer"
                                  >
                                    Cari Aset
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Features list management */}
                            <div className="space-y-2">
                              <label className="block text-[10px] font-bold text-slate-655 uppercase tracking-widest mb-1 pl-0.5">Daftar Fitur Produk</label>
                              <div className="flex flex-wrap gap-1.5">
                                {editingProduct.features.length === 0 ? (
                                  <span className="text-[10px] text-slate-400 italic">Belum ada fitur.</span>
                                ) : (
                                  editingProduct.features.map((feat, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100 shadow-sm">
                                      <span>{feat}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedFeatures = editingProduct.features.filter((_, fIdx) => fIdx !== idx);
                                          setEditingProduct({ ...editingProduct, features: updatedFeatures });
                                        }}
                                        className="text-blue-400 hover:text-blue-800 font-bold ml-1 outline-none cursor-pointer"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))
                                )}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Tambah fitur baru..."
                                  value={featureInput}
                                  onChange={(e) => setFeatureInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddFeature();
                                    }
                                  }}
                                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 shadow-sm"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddFeature}
                                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
                                >
                                  Tambah
                                </button>
                              </div>
                            </div>

                            {/* Tech Tags array management */}
                            <div className="space-y-2">
                              <label className="block text-[10px] font-bold text-slate-655 uppercase tracking-widest mb-1 pl-0.5">Teknologi Web</label>
                              <div className="flex flex-wrap gap-1.5">
                                {editingProduct.technologies.length === 0 ? (
                                  <span className="text-[10px] text-slate-400 italic">Belum ada stack teknologi.</span>
                                ) : (
                                  editingProduct.technologies.map((tech, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-750 text-[10px] font-bold rounded-lg border border-slate-200 shadow-sm">
                                      <span>{tech}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedTech = editingProduct.technologies.filter((_, tIdx) => tIdx !== idx);
                                          setEditingProduct({ ...editingProduct, technologies: updatedTech });
                                        }}
                                        className="text-slate-400 hover:text-slate-700 font-bold ml-1 outline-none cursor-pointer"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))
                                )}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Tambah teknologi..."
                                  value={techInput}
                                  onChange={(e) => setTechInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddTech();
                                    }
                                  }}
                                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 shadow-sm"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddTech}
                                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
                                >
                                  Tambah
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-655 uppercase tracking-widest mb-1.5 pl-0.5">Deskripsi Singkat Katalog</label>
                              <textarea
                                rows={3}
                                required
                                placeholder="Deskripsi template website..."
                                value={editingProduct.description}
                                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 outline-none transition-all resize-y shadow-inner"
                              />
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                              >
                                Batal
                              </button>
                              <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-755 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/10 active:scale-98 flex items-center gap-1.5 cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Produk</span>
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Gallery Manager Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-40" 
              onClick={() => setIsGalleryOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl z-50 flex flex-col max-h-[80vh] overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-950 text-base leading-none">Galeri Media Supabase</h3>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Pilih gambar yang sudah ada atau unggah gambar baru ke database Anda
                  </span>
                </div>
                <button 
                  onClick={() => setIsGalleryOpen(false)} 
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>

              {/* Gallery Content */}
              <div className="p-5 overflow-y-auto flex-1 space-y-5 scrollbar-thin">
                {/* File Uploader */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    id="gallery-uploader"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <label htmlFor="gallery-uploader" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-full mb-2 border border-blue-100">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {isUploading ? "Sedang Mengunggah..." : "Pilih & Unggah File Baru"}
                    </span>
                    <span className="text-[10px] text-slate-400">Mendukung format PNG, JPG, JPEG, WEBP</span>
                  </label>
                </div>

                {galleryError && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 space-y-2 leading-relaxed">
                    <p className="font-bold">⚠️ Panduan Integrasi Storage Supabase:</p>
                    <p>Galeri ini memerlukan bucket bernama <strong>gallery</strong> atau <strong>galery</strong> di Supabase Anda.</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Masuk ke dashboard Supabase Anda.</li>
                      <li>Buka menu <strong>Storage</strong> di sebelah kiri.</li>
                      <li>Klik <strong>New Bucket</strong>, masukkan nama <strong>gallery</strong> atau <strong>galery</strong>, lalu aktifkan centang <strong>Public bucket</strong>.</li>
                      <li>Klik bucket tersebut, lalu buka tab <strong>Policies</strong> di sebelah kiri bawah Storage.</li>
                      <li>Tambahkan RLS policy baru untuk mengizinkan operasi *SELECT* dan *INSERT* secara publik/anonim agar unggahan langsung dari admin berfungsi.</li>
                    </ol>
                  </div>
                )}

                {/* Images list */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Foto Tersedia</h4>
                  {galleryImages.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 border border-slate-100 rounded-xl bg-slate-50/20">
                      Tidak ada foto dalam galeri. Silakan unggah foto pertama Anda di atas!
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {galleryImages.map((img) => (
                        <div
                          key={img.name}
                          onClick={() => handleSelectGalleryImage(img.url)}
                          className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer hover:border-blue-500 transition-colors shadow-sm"
                        >
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold bg-blue-600 px-2 py-1 rounded">Pilih</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
