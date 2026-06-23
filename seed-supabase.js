const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually to get Supabase credentials
const envPath = path.join(__dirname, '.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error('Error: .env.local file not found!');
  process.exit(1);
}

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase URL or Anon Key is missing in .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const defaultSettings = {
  id: 'main_settings',
  siteName: 'TokoWebNo',
  phone: '6281378821654',
  heroTitle: 'Website Profesional',
  heroTitleBlue: 'Untuk Semua Kebutuhan',
  heroSubtitle: 'Mulai dari Rp150.000. Website cepat, modern, responsif, dan siap digunakan untuk bisnis, sekolah, toko online, komunitas, maupun kebutuhan pribadi Anda.',
  catalogTitle: 'Katalog Layanan Website',
  catalogSubtitle: 'Jelajahi berbagai pilihan template dan jasa kustom website kami. Semua produk dioptimalkan untuk kecepatan dan konversi maksimal.',
  searchPlaceholder: 'Cari website impian Anda (contoh: Toko Hijab, SaaS)...'
};

const initialProducts = [
  {
    id: "landing-page-launchx",
    name: "Landing Page Premium - LaunchX",
    category: "Landing Page",
    price: 150000,
    description: "Landing page modern berkinerja tinggi, dioptimalkan untuk konversi penjualan dan kampanye pemasaran bisnis Anda.",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://launchx-demo.example.com",
    features: [
      "Desain Responsif & Mobile Friendly",
      "Satu Halaman Utama (Up to 5 Section)",
      "Formulir Kontak Terintegrasi Email",
      "Integrasi Social Media & WhatsApp Chat",
      "SEO Tag Dasar",
      "Waktu Pengerjaan 2-3 Hari"
    ],
    technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion"]
  },
  {
    id: "company-profile-sinergi",
    name: "Company Profile - Solusi Sinergi",
    category: "Company Profile",
    price: 300000,
    description: "Website profil perusahaan profesional untuk membangun kredibilitas instan bagi klien, mitra, dan investor.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://solusi-sinergi.example.com",
    features: [
      "Hingga 5 Halaman Utama (Home, About, Services, Team, Contact)",
      "Galeri Foto Proyek & Layanan",
      "Integrasi Google Maps",
      "Kecepatan Akses Tinggi (PageSpeed 90+)",
      "Formulir Hubungi Kami",
      "Panduan Edit Konten Mandiri"
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Nodemailer"]
  },
  {
    id: "toko-online-eshopify",
    name: "Toko Online Modern - E-Shopify",
    category: "Toko Online",
    price: 450000,
    description: "Platform e-commerce lengkap dengan katalog interaktif, manajemen stok, dan checkout mudah ke WhatsApp atau payment gateway.",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://eshopify-demo.example.com",
    features: [
      "Katalog Produk Tidak Terbatas",
      "Sistem Keranjang Belanja Terintegrasi",
      "Checkout Langsung Ke WhatsApp dengan Detail Pesanan",
      "Filter Kategori & Pencarian Instan",
      "Manajemen Stok & Diskon Produk",
      "Halaman Admin Sederhana"
    ],
    technologies: ["Next.js", "Tailwind CSS", "Zustand State Management", "Lucide Icons"]
  },
  {
    id: "portal-sekolah-edusmart",
    name: "Portal Sekolah Pintar - EduSmart",
    category: "Sekolah",
    price: 500000,
    description: "Situs web resmi sekolah modern sebagai pusat informasi, pendaftaran siswa baru, dan direktori guru serta siswa.",
    thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://edusmart-demo.example.com",
    features: [
      "Halaman Profil Sekolah & Sejarah",
      "Sistem Pengumuman & Berita Terkini",
      "Direktori Data Guru & Siswa",
      "Form Pendaftaran Siswa Baru (PPDB Online)",
      "Galeri Kegiatan Ekstrakurikuler",
      "Unduh Dokumen & Kalender Akademik"
    ],
    technologies: ["Next.js", "Tailwind CSS", "Supabase", "TypeScript"]
  },
  {
    id: "blog-minimalis-mindshare",
    name: "Personal Blog Minimalis - MindShare",
    category: "Blog",
    price: 180000,
    description: "Platform blogging bersih dan estetik, dioptimalkan untuk kenyamanan membaca bagi audiens Anda di desktop maupun mobile.",
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://mindshare-demo.example.com",
    features: [
      "Desain Tipografi Premium & Mudah Dibaca",
      "Kategori & Tag Artikel",
      "Integrasi Sistem Komentar (Disqus/Giscus)",
      "Fitur Newsletter Berlangganan",
      "Optimasi SEO Skor Tinggi di Lighthouse",
      "Mendukung Format Markdown / MDX"
    ],
    technologies: ["Next.js", "MDX", "Tailwind CSS", "Lucide Icons"]
  },
  {
    id: "portfolio-framework",
    name: "Portfolio Fotografer - FrameWork",
    category: "Portofolio",
    price: 200000,
    description: "Galeri portofolio visual interaktif untuk menampilkan karya terbaik fotografer, videografer, maupun seniman digital.",
    thumbnail: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://framework-demo.example.com",
    features: [
      "Layout Masonry Grid Interaktif",
      "Lightbox Preview Foto Resolusi Tinggi",
      "Kategori Karya (Landscape, Portrait, Wedding, dll)",
      "Halaman Tentang Saya & Kontak Hubung",
      "Load Gambar Super Cepat dengan Next/Image",
      "Integrasi Sosial Media Instagram & Pinterest"
    ],
    technologies: ["React", "Framer Motion", "Tailwind CSS", "Next.js"]
  },
  {
    id: "custom-saas-cloudflow",
    name: "Custom SaaS Platform - CloudFlow",
    category: "Custom Website",
    price: 1500000,
    description: "Pengembangan sistem web aplikasi kustom (SaaS) yang disesuaikan sepenuhnya dengan proses bisnis internal Anda.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://cloudflow-demo.example.com",
    features: [
      "Sistem Autentikasi Pengguna & Keamanan Multi-level",
      "Dashboard Statistik Interaktif dengan Grafik",
      "Arsitektur Database Terstruktur",
      "Integrasi API Pihak Ketiga (Payment, Logistik, dll)",
      "Ekspor Data ke PDF & Excel",
      "Dukungan Skalabilitas dan Maintenance Bulanan"
    ],
    technologies: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS", "ChartJS"]
  },
  {
    id: "landing-page-mobilefly",
    name: "Landing Page App - MobileFly",
    category: "Landing Page",
    price: 160000,
    description: "Landing page modern untuk peluncuran aplikasi mobile Android & iOS Anda, lengkap dengan link download store.",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://mobilefly-demo.example.com",
    features: [
      "Mockup Smartphone Interaktif",
      "Tabel Fitur & Komparasi Aplikasi",
      "Link CTA Mengarah Ke Play Store & App Store",
      "Section Testimoni Pengguna & FAQ",
      "SEO Dioptimalkan untuk Keyword Aplikasi",
      "Ringan & Loading Cepat (<1 Detik)"
    ],
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"]
  },
  {
    id: "company-profile-devspace",
    name: "Company Profile Developer - DevSpace",
    category: "Company Profile",
    price: 350000,
    description: "Situs profil eksklusif untuk agensi software, developer, atau startup teknologi yang menampilkan keahlian tim.",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://devspace-demo.example.com",
    features: [
      "Desain Futuristik Dark-themed Default",
      "Animasi Interaktif pada Keahlian & Teknologi",
      "Daftar Portfolio Proyek Agensi",
      "Form Estimasi Biaya Proyek Klien",
      "Integrasi Blog Internal",
      "Kode Bersih & Mudah Disesuaikan"
    ],
    technologies: ["TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"]
  },
  {
    id: "toko-hijab-modestco",
    name: "Toko Hijab & Fashion - ModestCo",
    category: "Toko Online",
    price: 480000,
    description: "Toko online bertema feminin dan elegan untuk butik, pakaian wanita, hijab, maupun produk kecantikan.",
    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://modestco-demo.example.com",
    features: [
      "Palet Warna Pastel & Desain Grid Estetik",
      "Halaman Detail Produk dengan Zoom Gambar",
      "Kombinasi Ukuran & Warna Produk (Variasi)",
      "Pemesanan Cepat via WhatsApp checkout",
      "Integrasi Testimoni & Review Pelanggan",
      "Banner Promo Dinamis"
    ],
    technologies: ["Next.js", "Tailwind CSS", "Lucide Icons", "Framer Motion"]
  },
  {
    id: "sekolah-siakad",
    name: "Sistem Informasi Akademik - SiAkad Lite",
    category: "Sekolah",
    price: 750000,
    description: "Portal sekolah menengah dengan fitur pengecekan nilai online sederhana, jadwal kelas, dan kehadiran.",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://siakad-demo.example.com",
    features: [
      "Halaman Login Siswa & Guru",
      "Input Nilai oleh Guru Mata Pelajaran",
      "Cetak Rapor Digital Sederhana",
      "Dashboard Ringkasan Kehadiran & Kalender",
      "Pengumuman Ujian & Tugas",
      "Manajemen Data Siswa Berbasis Kelas"
    ],
    technologies: ["Next.js", "Tailwind CSS", "Supabase Database", "TypeScript"]
  },
  {
    id: "blog-devnotes",
    name: "Developer Blog - DevNotes",
    category: "Blog",
    price: 190000,
    description: "Situs blog personal dengan sintaks highlighting bawaan, cocok untuk software engineer membagi tutorial koding.",
    thumbnail: "https://images.unsplash.com/photo-1484417894907-623942c8ea29?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://devnotes-demo.example.com",
    features: [
      "Code Syntax Highlighting Keren (Shiki/Prism)",
      "Pencarian Artikel Cepat (Client-side)",
      "Mode Gelap/Terang Nyaman di Mata",
      "Kategori Bahasa Pemrograman",
      "Tombol Salin Kode Otomatis",
      "Social Sharing Terintegrasi"
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"]
  },
  {
    id: "portfolio-designer-creativeart",
    name: "Portfolio Designer - CreativeArt",
    category: "Portofolio",
    price: 220000,
    description: "Showcase portofolio penuh warna dengan transisi halaman super mulus untuk memukau agensi desain kelas dunia.",
    thumbnail: "https://images.unsplash.com/photo-1541462608141-ad4979e408c9?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1561070791-26c113006238?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://creativeart-demo.example.com",
    features: [
      "Eksplorasi Portfolio 3D / Slider Unik",
      "Animasi Hover Kartu Interaktif",
      "Halaman Resume / CV Digital Terstruktur",
      "Link Sosial Media Khusus (Dribbble, Behance)",
      "Form Kontak Menggunakan Web3Forms",
      "Desain Tipografi Modern & Bersih"
    ],
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS"]
  },
  {
    id: "booking-system-hotel-innrest",
    name: "Booking System Hotel - InnRest",
    category: "Custom Website",
    price: 1200000,
    description: "Situs web pemesanan kamar hotel mandiri dengan kalender ketersediaan kamar, galeri jenis kamar, dan sistem formulir order.",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://innrest-demo.example.com",
    features: [
      "Pencarian Ketersediaan Kamar Real-time",
      "Katalog Tipe Kamar, Fasilitas & Harga",
      "Formulir Reservasi Dengan Konfirmasi Email",
      "Dashboard Admin Kelola Status Pemesanan",
      "Integrasi WhatsApp Notifikasi",
      "Tabel Ulasan Tamu"
    ],
    technologies: ["Next.js", "Prisma ORM", "Tailwind CSS", "TypeScript"]
  },
  {
    id: "landing-page-event-festivall",
    name: "Landing Page Event - FestivAll",
    category: "Landing Page",
    price: 170000,
    description: "Landing page modern untuk mempromosikan konser, seminar, kompetisi, webinar, atau acara komunitas.",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://festivall-demo.example.com",
    features: [
      "Animasi Countdown / Penghitung Mundur Acara",
      "Jadwal Sesi & Pembicara / Pengisi Acara",
      "Link Pembelian Tiket (Loket, Goers, dll)",
      "Peta Lokasi Acara Terintegrasi",
      "FAQ Seputar Tiket & Syarat Acara",
      "Galeri Dokumentasi Event Tahun Lalu"
    ],
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Lucide Icons"]
  },
  {
    id: "corporate-profile-globalcorp",
    name: "Corporate Profile - GlobalCorp",
    category: "Company Profile",
    price: 400000,
    description: "Situs web profil korporat kelas industri tinggi dengan multibahasa, laporan keuangan, dan tata kelola perusahaan.",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://globalcorp-demo.example.com",
    features: [
      "Struktur Multibahasa (Dual Language EN/ID)",
      "Halaman Investor Relations & Download PDF Laporan",
      "Arsip Press Release & Berita Perusahaan",
      "Lokasi Kantor Cabang & Hubungi Hub",
      "Desain Super Formal & Clean Professional",
      "Aksesibilitas Konten Tinggi (WCAG Compliant)"
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"]
  },
  {
    id: "ecommerce-gadget-techmart",
    name: "E-Commerce Gadget - TechMart",
    category: "Toko Online",
    price: 520000,
    description: "Toko online berpenampilan tekno-futuristik untuk menjual produk gadget, laptop, smartphone, dan aksesoris.",
    thumbnail: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://techmart-demo.example.com",
    features: [
      "Desain High-Tech Dark Cyber",
      "Fitur Bandingkan Spesifikasi Produk (Compare)",
      "Pencarian Auto-complete Secepat Kilat",
      "Keranjang Belanja Menggunakan LocalStorage",
      "Integrasi Ekspedisi Ongkos Kirim (RajaOngkir)",
      "WhatsApp Direct Order Lengkap Alamat Kirim"
    ],
    technologies: ["Next.js", "Zustand", "Tailwind CSS", "TypeScript"]
  },
  {
    id: "web-elearning-courseku",
    name: "Web Elearning - CourseKu",
    category: "Sekolah",
    price: 600000,
    description: "Platform kursus online mandiri untuk guru, mentor, atau bimbingan belajar yang ingin menjual kelas video.",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://courseku-demo.example.com",
    features: [
      "Daftar Kurikulum & Silabus Kelas",
      "Pemutar Video Pelajaran Terintegrasi",
      "Halaman Detail Instruktur Kursus",
      "Kuis Pilihan Ganda & Penilaian Hasil Ujian",
      "Unduh Sertifikat Kelulusan Format PDF",
      "Halaman Checkout Kelas Premium"
    ],
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Canvas-confetti"]
  },
  {
    id: "travel-blog-wanderlust",
    name: "Travel Blog - Wanderlust",
    category: "Blog",
    price: 195000,
    description: "Blog perjalanan dengan fokus visual yang kaya, peta rute interaktif, dan panduan perjalanan perkotaan.",
    thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://wanderlust-demo.example.com",
    features: [
      "Grid Gambar & Galeri Perjalanan yang Indah",
      "Peta Google Maps Kustom untuk Rute Perjalanan",
      "Rekomendasi Perlengkapan & Tips Traveling",
      "Integrasi Akun Instagram Real-time Widget",
      "Fitur Filter Berdasarkan Negara / Destinasi",
      "Skor SEO 100 di Mobile Pagespeed"
    ],
    technologies: ["Next.js", "Tailwind CSS", "React", "Lucide Icons"]
  },
  {
    id: "portfolio-model-runway",
    name: "Portfolio Model/Agency - Runway",
    category: "Portofolio",
    price: 250000,
    description: "Situs web portofolio bergaya majalah fashion kelas atas untuk model, agensi model, atau perancang busana.",
    thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://runway-demo.example.com",
    features: [
      "Layout Majalah Vertikal Modern",
      "Kartu Biodata & Ukuran Model (Composite Card)",
      "Galeri Foto Resolusi Tinggi (Portfolio Shoot)",
      "Video Reel / Catwalk YouTube Embed",
      "Formulir Booking / Manajemen Kontak Agent",
      "Desain Minimalis Monokrom Eksklusif"
    ],
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"]
  },
  {
    id: "custom-inventory-system",
    name: "Sistem Manajemen Inventaris - StockFlow",
    category: "Custom Website",
    price: 1800000,
    description: "Sistem internal pergudangan kustom untuk memantau stok barang masuk, barang keluar, dan mencatat vendor secara digital.",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
    screenshot: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1200&auto=format&fit=crop&q=80",
    demoUrl: "https://stockflow-demo.example.com",
    features: [
      "Input Stok Barang & Kategori Pergudangan",
      "Pindai Barcode Sederhana Menggunakan Kamera HP",
      "Notifikasi Alert Jika Stok Hampir Habis",
      "Grafik Tren Keluar Masuk Barang Bulanan",
      "Cetak Nota Pembelian & Surat Jalan",
      "Multi-user dengan Riwayat Aktivitas Log Karyawan"
    ],
    technologies: ["Next.js", "Supabase DB", "Tailwind CSS", "Recharts"]
  }
];

async function seed() {
  try {
    console.log('Seeding Supabase Database...');

    // Test tables existence first
    const { error: pTestError } = await supabase.from('products').select('id').limit(1);
    if (pTestError) {
      console.error('\nERROR: Cannot access "products" table.');
      console.error('Message:', pTestError.message);
      console.error('\n>>> Please make sure you copy and run the SQL schema in your Supabase SQL Editor first! <<<\n');
      process.exit(1);
    }

    const { error: sTestError } = await supabase.from('settings').select('id').limit(1);
    if (sTestError) {
      console.error('\nERROR: Cannot access "settings" table.');
      console.error('Message:', sTestError.message);
      console.error('\n>>> Please make sure you copy and run the SQL schema in your Supabase SQL Editor first! <<<\n');
      process.exit(1);
    }

    // 1. Seed settings
    console.log('Seeding settings...');
    const { data: existingSettings } = await supabase.from('settings').select('id').eq('id', 'main_settings');
    if (!existingSettings || existingSettings.length === 0) {
      const { error: sError } = await supabase.from('settings').insert([defaultSettings]);
      if (sError) throw sError;
      console.log('Settings successfully seeded!');
    } else {
      console.log('Settings already exist, skipping.');
    }

    // 2. Seed products
    console.log('Seeding products...');
    const { data: existingProducts } = await supabase.from('products').select('id');
    if (!existingProducts || existingProducts.length === 0) {
      const { error: pError } = await supabase.from('products').insert(initialProducts);
      if (pError) throw pError;
      console.log(`Successfully seeded ${initialProducts.length} products!`);
    } else {
      console.log(`Products already exist in DB (${existingProducts.length} items). Skipping seeding to prevent overwrite.`);
    }

    console.log('\nSeeding completed successfully!');
  } catch (err) {
    console.error('An error occurred during seeding:', err);
    process.exit(1);
  }
}

seed();
