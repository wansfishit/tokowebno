"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Save, LogOut, Lock, Edit2, Check, RefreshCw, Settings, LayoutGrid, Trash2, Plus, Eye, MessageSquare } from "lucide-react";
import { useSettingsStore, useProductsStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase";

const categories = [
  "Landing Page",
  "Company Profile",
  "Toko Online",
  "Sekolah",
  "Blog",
  "Portofolio",
  "Custom Website",
];

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
        catalogSubtitle: settings.catalogSubtitle || "Jelajahi berbagai pilihan template dan jasa kustom website kami. Semua produk dioptimalkan untuk kecepatan dan konversi maksimal.",
        searchPlaceholder: settings.searchPlaceholder || "Cari website impian Anda (contoh: Toko Hijab, SaaS)...",
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

  // Fetch gallery list when modal opens
  const fetchGallery = useCallback(async () => {
    setGalleryError("");
    try {
      // First try activeBucket
      let bucket = activeBucket;
      let { data, error } = await supabase.storage.from(bucket).list("", {
        limit: 100,
        sortBy: { column: "name", order: "desc" },
      });

      // If "gallery" fails, automatically try the user's "galery" bucket as fallback
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
        // Conversely, try "gallery" if "galery" was selected but failed
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

      // Refresh list
      await fetchGallery();

      // Auto select newly uploaded image
      if (galleryTarget === "thumbnail" && editingProduct) {
        setEditingProduct({ ...editingProduct, thumbnail: publicUrl });
      } else if (galleryTarget === "screenshot" && editingProduct) {
        setEditingProduct({ ...editingProduct, screenshot: publicUrl });
      }

      showToast("Foto berhasil diunggah dan dipilih!");
      setIsGalleryOpen(false);
    } catch (err) {
      console.error("Gagal upload:", err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(
        `Gagal mengunggah foto. Pastikan bucket '${activeBucket}' sudah dibuat sebagai bucket 'Public' di dashboard Supabase Anda.\n\nDetail: ` +
          msg
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
        // Construct product data without ID to allow store to assign one
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
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
      deleteProduct(id);
      showToast(`Produk "${name}" berhasil dihapus!`);
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        {/* Back Link */}
        <Link href="/" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-blue-50 rounded-full text-blue-600 mb-3 border border-blue-100 animate-pulse">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 text-center">TokoWebNo Admin</h1>
            <p className="text-xs text-slate-500 text-center mt-1">Masuk ke panel pengaturan website</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold animate-pulse">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email / Username</label>
              <input
                type="email"
                required
                placeholder="Masukkan email admin..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                required
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-98 cursor-pointer"
            >
              Masuk Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Dynamic Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 bg-slate-950 text-white text-xs font-bold rounded-full shadow-2xl flex items-center gap-2 border border-slate-800 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200/60">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-950 leading-none">Dashboard Admin</h1>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-extrabold uppercase tracking-widest rounded-md border border-blue-100">PRO</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">TokoWebNo Customizer & Catalog Manager</span>
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
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-red-100 shadow-sm cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Metric Cards Banner (High Fidelity Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5.5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Total Produk Aktif</span>
              <span className="text-3.5xl font-black text-slate-950 mt-1.5 block leading-none">{products.length}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Siap dipesan di halaman utama</span>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <LayoutGrid className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5.5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Rata-rata Harga</span>
              <span className="text-3.5xl font-black text-slate-950 mt-1.5 block leading-none">
                {formatCurrency(
                  products.length > 0 ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / products.length) : 0
                )}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Cocok untuk target segmen jualan</span>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <Check className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5.5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">WhatsApp Tujuan</span>
              <span className="text-base font-black text-slate-800 mt-2 block tracking-wider truncate max-w-[190px]">
                +{settings.phone || "Belum diatur"}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Nomor redirect untuk tombol order</span>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Settings className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-2 shadow-sm sticky top-24">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 mb-2 block">Menu Navigasi</span>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setEditingProduct(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "settings"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Pengaturan Website</span>
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "products"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Pengaturan Tampilan Website
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Ubah judul, nomor kontak WhatsApp, dan teks beranda secara instan</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Website</label>
                      <input
                        type="text"
                        required
                        value={formSettings.siteName}
                        onChange={(e) => setFormSettings({ ...formSettings, siteName: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">No WhatsApp (Gunakan 628...)</label>
                      <input
                        type="text"
                        required
                        value={formSettings.phone}
                        onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Utama Hero (Teks Hitam)</label>
                    <input
                      type="text"
                      required
                      value={formSettings.heroTitle}
                      onChange={(e) => setFormSettings({ ...formSettings, heroTitle: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Utama Hero (Teks Sorotan Biru)</label>
                    <input
                      type="text"
                      required
                      value={formSettings.heroTitleBlue}
                      onChange={(e) => setFormSettings({ ...formSettings, heroTitleBlue: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deskripsi Hero & Subtitle</label>
                    <textarea
                      rows={4}
                      required
                      value={formSettings.heroSubtitle}
                      onChange={(e) => setFormSettings({ ...formSettings, heroSubtitle: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-y shadow-sm"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100/60 space-y-4">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Pengaturan Katalog Produk</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Katalog</label>
                        <input
                          type="text"
                          required
                          value={formSettings.catalogTitle}
                          onChange={(e) => setFormSettings({ ...formSettings, catalogTitle: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Placeholder Pencarian Katalog</label>
                        <input
                          type="text"
                          required
                          value={formSettings.searchPlaceholder}
                          onChange={(e) => setFormSettings({ ...formSettings, searchPlaceholder: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deskripsi Katalog</label>
                      <textarea
                        rows={3}
                        required
                        value={formSettings.catalogSubtitle}
                        onChange={(e) => setFormSettings({ ...formSettings, catalogSubtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-y shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-98 flex items-center gap-2 cursor-pointer"
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
                {editingProduct ? (
                  /* Editing/Creating Mode with split layout for Live Preview */
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    {/* Form Input Column */}
                    <div className="xl:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                        <div>
                          <h2 className="text-lg font-black text-slate-900">
                            {editingProduct.id === "new" ? "Tambah Produk Baru" : "Edit Detail Produk"}
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">Lengkapi form berikut untuk memodifikasi produk katalog</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200/80 shadow-sm cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>

                      <form onSubmit={handleSaveProduct} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Layanan</label>
                            <input
                              type="text"
                              required
                              placeholder="Nama website baru..."
                              value={editingProduct.name}
                              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Harga Dasar (IDR)</label>
                            <input
                              type="number"
                              required
                              min="0"
                              value={editingProduct.price}
                              onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kategori</label>
                            <select
                              value={editingProduct.category}
                              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm cursor-pointer"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">URL Demo Live</label>
                            <input
                              type="text"
                              required
                              placeholder="https://contoh-demo.com"
                              value={editingProduct.demoUrl}
                              onChange={(e) => setEditingProduct({ ...editingProduct, demoUrl: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                            />
                          </div>
                        </div>

                        {/* Image Selectors (Using Supabase dialog) */}
                        <div className="p-4.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4 shadow-inner">
                          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Foto Media & Screenshot (Supabase Storage)</span>
                          
                          <div>
                            <label className="block text-[11px] font-bold text-slate-650 mb-1">URL Foto Sampul Utama (Thumbnail)</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                required
                                placeholder="Pilih dari galeri storage..."
                                value={editingProduct.thumbnail}
                                onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                                className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-550 outline-none transition-all shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setGalleryTarget("thumbnail");
                                  setIsGalleryOpen(true);
                                }}
                                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 text-xs font-bold rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <span>Pilih Galeri</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-650 mb-1">URL Screenshot Detail (Ketika di-klik)</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                required
                                placeholder="Pilih dari galeri storage..."
                                value={editingProduct.screenshot}
                                onChange={(e) => setEditingProduct({ ...editingProduct, screenshot: e.target.value })}
                                className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-550 outline-none transition-all shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setGalleryTarget("screenshot");
                                  setIsGalleryOpen(true);
                                }}
                                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 text-xs font-bold rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <span>Pilih Galeri</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Features List */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Daftar Fitur Produk</label>
                          <div className="flex flex-wrap gap-1.5">
                            {editingProduct.features.length === 0 ? (
                              <span className="text-[11px] text-slate-400 italic">Belum ada fitur ditambahkan.</span>
                            ) : (
                              editingProduct.features.map((feat, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 shadow-sm">
                                  <span>{feat}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedFeatures = editingProduct.features.filter((_, fIdx) => fIdx !== idx);
                                      setEditingProduct({ ...editingProduct, features: updatedFeatures });
                                    }}
                                    className="text-blue-400 hover:text-blue-800 font-bold ml-1 text-xs outline-none"
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
                              className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={handleAddFeature}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-750 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition-all"
                            >
                              Tambah
                            </button>
                          </div>
                        </div>

                        {/* Interactive Tech Tags */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Teknologi Web</label>
                          <div className="flex flex-wrap gap-1.5">
                            {editingProduct.technologies.length === 0 ? (
                              <span className="text-[11px] text-slate-400 italic">Belum ada teknologi ditambahkan.</span>
                            ) : (
                              editingProduct.technologies.map((tech, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-sm">
                                  <span>{tech}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedTech = editingProduct.technologies.filter((_, tIdx) => tIdx !== idx);
                                      setEditingProduct({ ...editingProduct, technologies: updatedTech });
                                    }}
                                    className="text-slate-400 hover:text-slate-750 font-bold ml-1 text-xs outline-none"
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
                              placeholder="Tambah teknologi baru..."
                              value={techInput}
                              onChange={(e) => setTechInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTech();
                                }
                              }}
                              className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={handleAddTech}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-750 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition-all"
                            >
                              Tambah
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Deskripsi Singkat Katalog</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Deskripsi template website..."
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-y shadow-sm"
                          />
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-98 flex items-center gap-2 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            <span>{editingProduct.id === "new" ? "Tambahkan Produk Baru" : "Simpan Perubahan Produk"}</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Live Card Preview Column */}
                    <div className="xl:col-span-5 space-y-4 xl:sticky xl:top-24">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-2">Live Card Preview Halaman Utama</span>
                      
                      {/* The Mock Product Card */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-md max-w-sm mx-auto hover:border-blue-500/35 transition-all">
                        <div>
                          {/* Thumbnail Container */}
                          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50 mb-4">
                            {editingProduct.thumbnail ? (
                              <img
                                src={editingProduct.thumbnail}
                                alt={editingProduct.name || "Preview"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-semibold">
                                Belum ada foto utama
                              </div>
                            )}
                            <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md text-[10px] text-blue-650 border border-slate-200/60 font-bold rounded-full uppercase tracking-wide shadow-sm">
                              {editingProduct.category || "Kategori"}
                            </span>
                          </div>

                          {/* Info */}
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-tight mb-2">
                            {editingProduct.name || "Nama Website Baru Anda"}
                          </h3>
                          
                          {/* Price */}
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-[10px] text-slate-500 leading-none">Mulai dari</span>
                            <span className="text-sm sm:text-base font-extrabold text-blue-600 leading-none">
                              {formatCurrency(editingProduct.price || 0)}
                            </span>
                          </div>

                          <p className="mt-3 text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">
                            {editingProduct.description || "Tulis deskripsi singkat produk di form untuk melihat pratinjau kartu di sini..."}
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="mt-5 grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                          <div className="flex items-center justify-center gap-1 py-2 bg-slate-50 border border-slate-200 text-[10px] sm:text-xs text-slate-650 rounded-xl font-medium">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>Demo Live</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 py-2 bg-blue-600 text-white text-[10px] sm:text-xs font-bold rounded-xl shadow-md shadow-blue-600/10">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Pesan Sekarang</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Features Detail Preview box */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm max-w-sm mx-auto space-y-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pratinjau List Fitur & Tech</span>
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-slate-800 block">Fitur:</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-500">
                            {editingProduct.features.map((feat, idx) => (
                              <li key={idx} className="truncate">{feat}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                          {editingProduct.technologies.map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">{tech}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List Mode with stats and grid search */
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-3">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900">
                          Daftar Katalog Layanan
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Mengelola template & jasa website yang tayang di halaman depan</p>
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
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Produk Baru</span>
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {products.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                          Belum ada katalog website ditambahkan. Klik tombol &apos;Tambah Produk Baru&apos; di atas!
                        </div>
                      ) : (
                        products.map((product) => (
                          <div key={product.id} className="py-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                            <div className="flex items-center gap-4">
                              {/* Product Thumbnail Preview */}
                              <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shadow-sm transition-transform duration-300 group-hover:scale-105"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h3>
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-extrabold rounded-full border border-slate-200/40 uppercase tracking-widest">
                                    {product.category}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500 font-medium">
                                  <span className="font-extrabold text-blue-600">{formatCurrency(product.price)}</span>
                                  <span className="text-slate-300">•</span>
                                  <span>{product.features.length} Fitur Unggulan</span>
                                  <span className="text-slate-300">•</span>
                                  <span>{product.technologies.length} Tech Stack</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 text-xs font-bold rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 text-xs font-bold rounded-lg border border-red-100 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Gallery Manager Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsGalleryOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[80vh] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-950 text-base leading-none">Galeri Media Supabase</h3>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Pilih gambar yang sudah ada atau unggah gambar baru ke database Anda
                </span>
              </div>
              <button 
                onClick={() => setIsGalleryOpen(false)} 
                className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md transition-colors"
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
                    <Save className="w-5 h-5" />
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
          </div>
        </div>
      )}
    </div>
  );
}
