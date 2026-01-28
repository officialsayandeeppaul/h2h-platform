'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from "next/dynamic";
import { Header, Footer } from "@/components/layout";

// CRITICAL: First 8 sections - load immediately for instant render
import {
  HeroSection,
  TrustedBySection,
  StatsSection,
  ServicesSection,
  VideoSection,
  MagnetLinesSection,
  FeaturesSection,
  WhyH2HSection,
} from "@/components/home";

// DEFERRED: These load after first paint, preloaded in background
const CaseStudiesSection = dynamic(() => import("@/components/home/CaseStudiesSection").then(m => ({ default: m.CaseStudiesSection })), { ssr: false });
const BottomFeaturesSection = dynamic(() => import("@/components/home/BottomFeaturesSection").then(m => ({ default: m.BottomFeaturesSection })), { ssr: false });
const HowItWorksSection = dynamic(() => import("@/components/home/HowItWorksSection").then(m => ({ default: m.HowItWorksSection })), { ssr: false });
const FounderSection = dynamic(() => import("@/components/home/FounderSection").then(m => ({ default: m.FounderSection })), { ssr: false });
const TreatmentProcessSection = dynamic(() => import("@/components/home/TreatmentProcessSection").then(m => ({ default: m.TreatmentProcessSection })), { ssr: false });
const LocationsSection = dynamic(() => import("@/components/home/LocationsSection").then(m => ({ default: m.LocationsSection })), { ssr: false });
const TextPressureSection = dynamic(() => import("@/components/home/TextPressureSection").then(m => ({ default: m.TextPressureSection })), { ssr: false });
const BlogSection = dynamic(() => import("@/components/home/BlogSection").then(m => ({ default: m.BlogSection })), { ssr: false });
const GallerySection = dynamic(() => import("@/components/home/GallerySection").then(m => ({ default: m.GallerySection })), { ssr: false });
const GlobalReachSection = dynamic(() => import("@/components/home/GlobalReachSection").then(m => ({ default: m.GlobalReachSection })), { ssr: false });
const ContactSection = dynamic(() => import("@/components/home/ContactSection").then(m => ({ default: m.ContactSection })), { ssr: false });
const GridMotionSection = dynamic(() => import("@/components/home/GridMotionSection").then(m => ({ default: m.GridMotionSection })), { ssr: false });
const FinalCTASection = dynamic(() => import("@/components/home/FinalCTASection").then(m => ({ default: m.FinalCTASection })), { ssr: false });
const DownloadAppSection = dynamic(() => import("@/components/home/DownloadAppSection").then(m => ({ default: m.DownloadAppSection })), { ssr: false });
const HealToHealthSection = dynamic(() => import("@/components/home/HealToHealthSection").then(m => ({ default: m.HealToHealthSection })), { ssr: false });
const TrustedByThousandsSection = dynamic(() => import("@/components/ui/trusted-charts").then(mod => ({ default: mod.TrustedByThousandsSection })), { ssr: false });
const AnimatedTestimonials = dynamic(() => import("@/components/ui/animated-testimonials").then(mod => ({ default: mod.AnimatedTestimonials })), { ssr: false });

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showDeferred, setShowDeferred] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // LIGHTNING FAST: Show deferred sections after 100ms (after first paint)
    const timer = setTimeout(() => {
      setShowDeferred(true);
    }, 100);

    // Preload all deferred sections in background - use setTimeout as fallback for Safari/iOS
    const preloadSections = () => {
      import("@/components/home/CaseStudiesSection");
      import("@/components/home/BottomFeaturesSection");
      import("@/components/home/HowItWorksSection");
      import("@/components/home/FounderSection");
      import("@/components/home/TreatmentProcessSection");
      import("@/components/home/LocationsSection");
      import("@/components/home/TextPressureSection");
      import("@/components/home/BlogSection");
      import("@/components/home/GallerySection");
      import("@/components/home/GlobalReachSection");
      import("@/components/home/ContactSection");
      import("@/components/home/GridMotionSection");
      import("@/components/home/FinalCTASection");
      import("@/components/home/DownloadAppSection");
      import("@/components/home/HealToHealthSection");
      import("@/components/ui/trusted-charts");
      import("@/components/ui/animated-testimonials");
    };

    // Use requestIdleCallback if available (Chrome/Firefox), setTimeout for Safari/iOS
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadSections);
    } else {
      setTimeout(preloadSections, 50);
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-white">
      <Header />

      <main>
        {/* CRITICAL: First 8 sections load immediately */}
        <HeroSection />
        <VideoSection />
        <MagnetLinesSection />
        <TrustedBySection />
        <StatsSection />
        <ServicesSection />
        <FeaturesSection />
        <WhyH2HSection />

        {/* DEFERRED: Load after first paint for lightning fast initial render */}
        {showDeferred && (
          <>
            <CaseStudiesSection />
            {/* <BottomFeaturesSection /> */}
            <HowItWorksSection />
            <TrustedByThousandsSection />
            <AnimatedTestimonials />
            <FounderSection />
            <TreatmentProcessSection />
            <LocationsSection />
            <TextPressureSection />
            <BlogSection />
            <GallerySection />
            <GlobalReachSection />
            <ContactSection />
            <GridMotionSection />
            <FinalCTASection />
            <DownloadAppSection />
            <HealToHealthSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
