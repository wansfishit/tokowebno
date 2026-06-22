import { useState, useEffect } from "react";
import { Product } from "@/types";
import { products as initialProducts } from "@/data/products";

export interface SiteSettings {
  siteName: string;
  phone: string;
  heroTitle: string;
  heroTitleBlue: string;
  heroSubtitle: string;
  catalogTitle: string;
  catalogSubtitle: string;
  searchPlaceholder: string;
}

export const defaultSettings: SiteSettings = {
  siteName: "TokoWebNo",
  phone: "6281378821654",
  heroTitle: "Website Profesional",
  heroTitleBlue: "Untuk Semua Kebutuhan",
  heroSubtitle: "Mulai dari Rp150.000. Website cepat, modern, responsif, dan siap digunakan untuk bisnis, sekolah, toko online, komunitas, maupun kebutuhan pribadi Anda.",
  catalogTitle: "Katalog Layanan Website",
  catalogSubtitle: "Jelajahi berbagai pilihan template dan jasa kustom website kami. Semua produk dioptimalkan untuk kecepatan dan konversi maksimal.",
  searchPlaceholder: "Cari website impian Anda (contoh: Toko Hijab, SaaS)..."
};

// Hook for products
export function useProductsStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tokowebno_products");
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch {
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
      localStorage.setItem("tokowebno_products", JSON.stringify(initialProducts));
    }
    setLoaded(true);
  }, []);

  const updateProduct = (updated: Product) => {
    const next = products.map((p) => (p.id === updated.id ? updated : p));
    setProducts(next);
    localStorage.setItem("tokowebno_products", JSON.stringify(next));
  };

  const addProduct = (newProduct: Omit<Product, "id">) => {
    const newId = `product-${Date.now()}`;
    const productWithId: Product = { ...newProduct, id: newId };
    const next = [...products, productWithId];
    setProducts(next);
    localStorage.setItem("tokowebno_products", JSON.stringify(next));
  };

  const deleteProduct = (id: string) => {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    localStorage.setItem("tokowebno_products", JSON.stringify(next));
  };

  const resetProducts = () => {
    setProducts(initialProducts);
    localStorage.setItem("tokowebno_products", JSON.stringify(initialProducts));
  };

  return { products, loaded, updateProduct, addProduct, deleteProduct, resetProducts };
}

// Hook for settings
export function useSettingsStore() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tokowebno_settings");
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        setSettings(defaultSettings);
      }
    } else {
      setSettings(defaultSettings);
      localStorage.setItem("tokowebno_settings", JSON.stringify(defaultSettings));
    }
    
    // Sync phone number directly as a separate key for utils access
    const storedPhone = localStorage.getItem("tokowebno_phone");
    if (!storedPhone) {
      localStorage.setItem("tokowebno_phone", defaultSettings.phone);
    }
    
    setLoaded(true);
  }, []);

  const updateSettings = (updated: SiteSettings) => {
    setSettings(updated);
    localStorage.setItem("tokowebno_settings", JSON.stringify(updated));
    localStorage.setItem("tokowebno_phone", updated.phone); // Sync separately for getWhatsAppUrl access
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem("tokowebno_settings", JSON.stringify(defaultSettings));
    localStorage.setItem("tokowebno_phone", defaultSettings.phone);
  };

  return { settings, loaded, updateSettings, resetSettings };
}
