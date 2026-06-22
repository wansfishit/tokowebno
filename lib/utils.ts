import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function getWhatsAppUrl(productName?: string): string {
  const defaultPhone = "6281378821654";
  let phone = defaultPhone;

  if (typeof window !== "undefined") {
    try {
      const storedPhone = localStorage.getItem("tokowebno_phone");
      if (storedPhone) {
        phone = storedPhone;
      }
    } catch {
      // ignore
    }
  }

  if (!productName) {
    return `https://wa.me/${phone}?text=${encodeURIComponent("Halo, saya ingin bertanya tentang jasa pembuatan website custom di TokoWebNo.")}`;
  }
  const text = `Halo, saya tertarik dengan website ${productName}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
