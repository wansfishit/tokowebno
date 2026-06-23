import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TokoWebNo - Jasa Pembuatan Website Kustom Modern",
  description: "Mulai dari Rp150.000. Website cepat, modern, responsif, dan siap digunakan untuk bisnis, sekolah, toko online, komunitas, maupun kebutuhan pribadi.",
  keywords: [
    "jasa pembuatan website",
    "jasa website custom",
    "buat website murah",
    "website toko online",
    "company profile murah",
    "landing page premium",
    "website sekolah",
    "TokoWebNo",
    "website modern next.js"
  ],
  authors: [{ name: "TokoWebNo Team" }],
  creator: "TokoWebNo",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://tokowebno.com",
    title: "TokoWebNo - Jasa Pembuatan Website Kustom Modern",
    description: "Mulai dari Rp150.000. Website cepat, modern, responsif, dan siap digunakan untuk bisnis, sekolah, toko online, komunitas, maupun kebutuhan pribadi.",
    siteName: "TokoWebNo",
    images: [
      {
        url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "TokoWebNo Premium Custom Websites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TokoWebNo - Jasa Pembuatan Website Kustom Modern",
    description: "Mulai dari Rp150.000. Jasa pembuatan website custom modern & responsif.",
    images: ["https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&h=630&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${geistMono.variable} font-sans antialiased bg-dark-bg text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
