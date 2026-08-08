import { Header, Footer } from "@/components/layout";
import { HeroSection } from "@/components/home/HeroSection";
import { VideoSection } from "@/components/home/VideoSection";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BelowFoldSections } from "@/components/home/BelowFoldSections";
import { HomeMotionRuntime } from "@/components/home/HomeMotionRuntime";

/**
 * Homepage: keep critical path thin (Hero → Services).
 * MagnetLines + everything else is code-split below the fold.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-white home-page">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm"
      >
        Skip to main content
      </a>
      <Header />
      <HomeMotionRuntime />

      <main id="main-content">
        <div data-home-section data-home-reveal="instant">
          <HeroSection />
        </div>
        <div data-home-section>
          <VideoSection />
        </div>
        <div data-home-section>
          <TrustedBySection />
        </div>
        <div data-home-section>
          <ServicesSection />
        </div>

        <BelowFoldSections />
      </main>

      <Footer />
    </div>
  );
}
