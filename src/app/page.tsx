import { Header, Footer } from "@/components/layout";
import { HeroSection } from "@/components/home/HeroSection";
import { VideoSection } from "@/components/home/VideoSection";
import { MagnetLinesSection } from "@/components/home/MagnetLinesSection";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { WhyH2HSection } from "@/components/home/WhyH2HSection";
import { CaseStudiesSection } from "@/components/home/CaseStudiesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FounderSection } from "@/components/home/FounderSection";
import { TreatmentProcessSection } from "@/components/home/TreatmentProcessSection";
import { LocationsSection } from "@/components/home/LocationsSection";
import { BlogSection } from "@/components/home/BlogSection";
import { GlobalReachSection } from "@/components/home/GlobalReachSection";
import { ContactSection } from "@/components/home/ContactSection";
import { GridMotionSection } from "@/components/home/GridMotionSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";
import { DownloadAppSection } from "@/components/home/DownloadAppSection";
import { HealToHealthSection } from "@/components/home/HealToHealthSection";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

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
        <ServicesSection />
        <FeaturesSection />
        <WhyH2HSection />
        <CaseStudiesSection />
        <HowItWorksSection />
        <AnimatedTestimonials />
        <FounderSection />
        <TreatmentProcessSection />
        <LocationsSection />
        <BlogSection />
        <GlobalReachSection />
        <ContactSection />
        <GridMotionSection />
        <FinalCTASection />
        <DownloadAppSection />
        <HealToHealthSection />
      </main>

      <Footer />
    </div>
  );
}
