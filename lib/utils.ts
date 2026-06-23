import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  const num = typeof value === "number" ? value : Number(value) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function getWhatsAppUrl(productName?: string, phone: string = "6281378821654"): string {
  if (!productName) {
    return `https://wa.me/${phone}?text=${encodeURIComponent("Halo, saya ingin bertanya tentang jasa pembuatan website custom di TokoWebNo.")}`;
  }
  const text = `Halo, saya tertarik dengan website ${productName}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
