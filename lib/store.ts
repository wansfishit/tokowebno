import { useState, useEffect } from "react";
import { Product } from "@/types";
import { products as initialProducts } from "@/data/products";
import { supabase } from "./supabase";

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
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: true });
        
        if (error) throw error;
        
        if (data) {
          setProducts(data);
          localStorage.setItem("tokowebno_products", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Error loading products from Supabase, falling back:", err);
        // Fallback to local storage or initialProducts
        const stored = localStorage.getItem("tokowebno_products");
        if (stored) {
          try {
            setProducts(JSON.parse(stored));
          } catch {
            setProducts(initialProducts);
          }
        } else {
          setProducts(initialProducts);
        }
      } finally {
        setLoaded(true);
      }
    }

    loadProducts();

    // Set up Realtime listener to sync changes instantly across all devices
    const channel = supabase
      .channel("products-changes-" + Math.random().toString(36).substring(2, 9))
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          console.log("Realtime product change received:", payload);
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateProduct = async (updated: Product) => {
    // 1. Update local state immediately for fast response
    const next = products.map((p) => (p.id === updated.id ? updated : p));
    setProducts(next);
    localStorage.setItem("tokowebno_products", JSON.stringify(next));

    // 2. Persist to Supabase
    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: updated.name,
          category: updated.category,
          price: updated.price,
          description: updated.description,
          thumbnail: updated.thumbnail,
          screenshot: updated.screenshot,
          demoUrl: updated.demoUrl,
          features: updated.features,
          technologies: updated.technologies,
        })
        .eq("id", updated.id);
      
      if (error) throw error;
    } catch (err) {
      console.error("Failed to update product in Supabase:", err);
    }
  };

  const addProduct = async (newProduct: Omit<Product, "id">) => {
    const newId = `product-${Date.now()}`;
    const productWithId: Product = { ...newProduct, id: newId };
    
    // 1. Update local state immediately for fast response
    const next = [...products, productWithId];
    setProducts(next);
    localStorage.setItem("tokowebno_products", JSON.stringify(next));

    // 2. Persist to Supabase
    try {
      const { error } = await supabase
        .from("products")
        .insert([productWithId]);
      
      if (error) throw error;
    } catch (err) {
      console.error("Failed to add product to Supabase:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    // 1. Update local state immediately for fast response
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    localStorage.setItem("tokowebno_products", JSON.stringify(next));

    // 2. Persist to Supabase
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    } catch (err) {
      console.error("Failed to delete product from Supabase:", err);
    }
  };

  const resetProducts = async () => {
    // 1. Update local state immediately
    setProducts(initialProducts);
    localStorage.setItem("tokowebno_products", JSON.stringify(initialProducts));

    // 2. Persist to Supabase
    try {
      // In Supabase, delete all and re-insert the default ones
      const { error: delError } = await supabase.from("products").delete().neq("id", "none");
      if (delError) throw delError;
      
      const { error: insError } = await supabase.from("products").insert(initialProducts);
      if (insError) throw insError;
    } catch (err) {
      console.error("Failed to reset products in Supabase:", err);
    }
  };

  return { products, loaded, updateProduct, addProduct, deleteProduct, resetProducts };
}

// Hook for settings
export function useSettingsStore() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("id", "main_settings")
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          const cleanedSettings: SiteSettings = {
            siteName: data.siteName,
            phone: data.phone,
            heroTitle: data.heroTitle,
            heroTitleBlue: data.heroTitleBlue,
            heroSubtitle: data.heroSubtitle,
            catalogTitle: data.catalogTitle,
            catalogSubtitle: data.catalogSubtitle,
            searchPlaceholder: data.searchPlaceholder,
          };
          setSettings(cleanedSettings);
          localStorage.setItem("tokowebno_settings", JSON.stringify(cleanedSettings));
          localStorage.setItem("tokowebno_phone", cleanedSettings.phone);
        } else {
          // If no settings exist yet, create default settings
          const { error: insertError } = await supabase
            .from("settings")
            .insert([{ id: "main_settings", ...defaultSettings }]);
          if (insertError) console.error("Error creating default settings:", insertError);
        }
      } catch (err) {
        console.error("Error loading settings from Supabase, falling back:", err);
        const stored = localStorage.getItem("tokowebno_settings");
        if (stored) {
          try {
            setSettings({ ...defaultSettings, ...JSON.parse(stored) });
          } catch {
            setSettings(defaultSettings);
          }
        } else {
          setSettings(defaultSettings);
        }
      } finally {
        setLoaded(true);
      }
    }

    loadSettings();

    // Set up Realtime listener for settings changes
    const channel = supabase
      .channel("settings-changes-" + Math.random().toString(36).substring(2, 9))
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings", filter: "id=eq.main_settings" },
        (payload) => {
          console.log("Realtime settings change received:", payload);
          if (payload.new) {
            const data = payload.new as unknown as SiteSettings;
            const cleanedSettings: SiteSettings = {
              siteName: data.siteName,
              phone: data.phone,
              heroTitle: data.heroTitle,
              heroTitleBlue: data.heroTitleBlue,
              heroSubtitle: data.heroSubtitle,
              catalogTitle: data.catalogTitle,
              catalogSubtitle: data.catalogSubtitle,
              searchPlaceholder: data.searchPlaceholder,
            };
            setSettings(cleanedSettings);
            localStorage.setItem("tokowebno_settings", JSON.stringify(cleanedSettings));
            localStorage.setItem("tokowebno_phone", cleanedSettings.phone);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateSettings = async (updated: SiteSettings) => {
    // 1. Update local state immediately for fast response
    setSettings(updated);
    localStorage.setItem("tokowebno_settings", JSON.stringify(updated));
    localStorage.setItem("tokowebno_phone", updated.phone);

    // 2. Persist to Supabase
    try {
      const { error } = await supabase
        .from("settings")
        .upsert([{ id: "main_settings", ...updated }]);
      
      if (error) throw error;
    } catch (err) {
      console.error("Failed to update settings in Supabase:", err);
    }
  };

  const resetSettings = async () => {
    // 1. Update local state immediately
    setSettings(defaultSettings);
    localStorage.setItem("tokowebno_settings", JSON.stringify(defaultSettings));
    localStorage.setItem("tokowebno_phone", defaultSettings.phone);

    // 2. Persist to Supabase
    try {
      const { error } = await supabase
        .from("settings")
        .upsert([{ id: "main_settings", ...defaultSettings }]);
      
      if (error) throw error;
    } catch (err) {
      console.error("Failed to reset settings in Supabase:", err);
    }
  };

  return { settings, loaded, updateSettings, resetSettings };
}
