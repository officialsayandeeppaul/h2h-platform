import { Header, Footer } from "@/components/layout";
import { HeroSection } from "@/components/home";
import { VideoSection } from "@/components/home/VideoSection";
import { MagnetLinesSection } from "@/components/home/MagnetLinesSection";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import { StatsSection } from "@/components/home/StatsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { WhyH2HSection } from "@/components/home/WhyH2HSection";
import { DeferredSections } from "@/components/home/DeferredSections";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm">
        Skip to main content
      </a>
      <Header />

      <main id="main-content">
        <HeroSection />
        <VideoSection />
        <MagnetLinesSection />
        <TrustedBySection />
        <StatsSection />
        <ServicesSection />
        <FeaturesSection />
        <WhyH2HSection />

        <DeferredSections />
      </main>

      <Footer />
    </div>
  );
}
