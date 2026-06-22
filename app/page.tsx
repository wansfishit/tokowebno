import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Catalog from "@/components/catalog";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp-button";
import BackToTop from "@/components/back-to-top";

// Advanced animation elements
import ScrollProvider from "@/components/scroll-provider";
import CinematicIntro from "@/components/cinematic-intro";
import ScrollProgress from "@/components/scroll-progress";

export default function Home() {
  return (
    <ScrollProvider>
      <div className="relative min-h-screen bg-dark-bg text-slate-900 overflow-hidden selection:bg-blue-600/30 selection:text-white">
        {/* Decorative ambient background lights */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="absolute top-[20%] left-0 w-[500px] h-[500px] bg-blue-500/3 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Scroll Progress Indicator */}
        <ScrollProgress />

        {/* Cinematic Opening Intro */}
        <CinematicIntro />

        {/* Navigation */}
        <Navbar />

        <main className="relative z-10">
          {/* Hero Section */}
          <Hero />

          {/* Katalog Website (Catalog) */}
          <Catalog />

          {/* FAQ Accordion */}
          <FAQ />
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating Helpers */}
        <WhatsAppButton />
        <BackToTop />
      </div>
    </ScrollProvider>
  );
}
