"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { useSettingsStore } from "@/lib/store";

export default function WhatsAppButton() {
  const { settings } = useSettingsStore();

  return (
    <div className="group fixed bottom-6 right-6 z-40 flex items-center justify-end">
      <div 
        className="absolute right-16 px-3.5 py-2 rounded-xl text-white text-xs font-semibold shadow-xl opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap hidden sm:block border border-white/10"
        style={{
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        Tanya Detail Website
      </div>

      {/* WhatsApp Button Link */}
      <a
        href={getWhatsAppUrl(undefined, settings.phone)}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95 text-white"
        aria-label="Chat WhatsApp"
      >
        {/* Pulsing ring animations */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/35 animate-ping opacity-75" />
        <span className="absolute -inset-2.5 rounded-full bg-emerald-500/10 animate-pulse pointer-events-none" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 relative z-10 fill-white stroke-none" />
      </a>
    </div>
  );
}
