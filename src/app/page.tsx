'use client';

import { useEffect, useRef, memo } from 'react';
import dynamic from "next/dynamic";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header, Footer } from "@/components/layout";

// Critical sections - load immediately (first 6 sections for good initial view)
import {
  HeroSection,
  TrustedBySection,
  StatsSection,
  ServicesSection,
  LazySection,
} from "@/components/home";

// Lazy load remaining sections
const VideoSection = dynamic(() => import("@/components/home/VideoSection").then(m => ({ default: m.VideoSection })), { ssr: false, loading: () => <SectionSkeleton /> });
const MagnetLinesSection = dynamic(() => import("@/components/home/MagnetLinesSection").then(m => ({ default: m.MagnetLinesSection })), { ssr: false, loading: () => <SectionSkeleton dark /> });
const FeaturesSection = dynamic(() => import("@/components/home/FeaturesSection").then(m => ({ default: m.FeaturesSection })), { ssr: false, loading: () => <SectionSkeleton dark /> });
const WhyH2HSection = dynamic(() => import("@/components/home/WhyH2HSection").then(m => ({ default: m.WhyH2HSection })), { ssr: false, loading: () => <SectionSkeleton dark /> });
const CaseStudiesSection = dynamic(() => import("@/components/home/CaseStudiesSection").then(m => ({ default: m.CaseStudiesSection })), { ssr: false, loading: () => <SectionSkeleton dark /> });
const BottomFeaturesSection = dynamic(() => import("@/components/home/BottomFeaturesSection").then(m => ({ default: m.BottomFeaturesSection })), { ssr: false, loading: () => <SectionSkeleton dark /> });
const HowItWorksSection = dynamic(() => import("@/components/home/HowItWorksSection").then(m => ({ default: m.HowItWorksSection })), { ssr: false, loading: () => <SectionSkeleton /> });
const FounderSection = dynamic(() => import("@/components/home/FounderSection").then(m => ({ default: m.FounderSection })), { ssr: false, loading: () => <SectionSkeleton dark /> });
const TreatmentProcessSection = dynamic(() => import("@/components/home/TreatmentProcessSection").then(m => ({ default: m.TreatmentProcessSection })), { ssr: false, loading: () => <SectionSkeleton /> });
const LocationsSection = dynamic(() => import("@/components/home/LocationsSection").then(m => ({ default: m.LocationsSection })), { ssr: false, loading: () => <SectionSkeleton dark /> });
const TextPressureSection = dynamic(() => import("@/components/home/TextPressureSection").then(m => ({ default: m.TextPressureSection })), { ssr: false, loading: () => <SectionSkeleton dark /> });
const BlogSection = dynamic(() => import("@/components/home/BlogSection").then(m => ({ default: m.BlogSection })), { ssr: false, loading: () => <SectionSkeleton /> });
const GallerySection = dynamic(() => import("@/components/home/GallerySection").then(m => ({ default: m.GallerySection })), { ssr: false, loading: () => <SectionSkeleton /> });
const GlobalReachSection = dynamic(() => import("@/components/home/GlobalReachSection").then(m => ({ default: m.GlobalReachSection })), { ssr: false, loading: () => <SectionSkeleton dark /> });
const ContactSection = dynamic(() => import("@/components/home/ContactSection").then(m => ({ default: m.ContactSection })), { ssr: false, loading: () => <SectionSkeleton /> });
const GridMotionSection = dynamic(() => import("@/components/home/GridMotionSection").then(m => ({ default: m.GridMotionSection })), { ssr: false, loading: () => <SectionSkeleton dark /> });
const FinalCTASection = dynamic(() => import("@/components/home/FinalCTASection").then(m => ({ default: m.FinalCTASection })), { ssr: false, loading: () => <SectionSkeleton /> });
const DownloadAppSection = dynamic(() => import("@/components/home/DownloadAppSection").then(m => ({ default: m.DownloadAppSection })), { ssr: false, loading: () => <SectionSkeleton /> });
const HealToHealthSection = dynamic(() => import("@/components/home/HealToHealthSection").then(m => ({ default: m.HealToHealthSection })), { ssr: false, loading: () => <SectionSkeleton /> });

// Simple skeleton for loading states
function SectionSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`py-24 ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className={`h-8 w-48 rounded ${dark ? 'bg-gray-800' : 'bg-gray-200'} mb-4 animate-pulse`} />
        <div className={`h-4 w-96 rounded ${dark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
      </div>
    </div>
  );
}

// Heavy chart/testimonial components
const TrustedByThousandsSection = dynamic(() => import("@/components/ui/trusted-charts").then(mod => ({ default: mod.TrustedByThousandsSection })), { ssr: false });
const AnimatedTestimonials = dynamic(() => import("@/components/ui/animated-testimonials").then(mod => ({ default: mod.AnimatedTestimonials })), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use requestIdleCallback for non-critical animations
    const initAnimations = () => {
      const ctx = gsap.context(() => {
        // Ultra-fast settings - minimal duration
        gsap.defaults({ 
          ease: "power1.out", 
          duration: 0.2,
          force3D: true,
          overwrite: 'auto',
        });

        // Hero entrance - INSTANT feel
        gsap.set(['.hero-tag', '.hero-title-line', '.hero-desc', '.hero-cta', '.hero-proof', '.hero-visual'], { opacity: 1, y: 0, scale: 1 });
        
        // Subtle orb float - use CSS animation instead for better perf
        // gsap.to('.orb-1', { y: -15, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
        // gsap.to('.orb-2', { y: 10, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });

      }, mainRef);

      return ctx;
    };

    // Run immediately
    const ctx = initAnimations();

    return () => ctx?.revert();
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

        {/* Remaining sections - lazy loaded on scroll */}

        <LazySection>
          <CaseStudiesSection />
        </LazySection>

        <LazySection>
          <BottomFeaturesSection />
        </LazySection>

        <LazySection>
          <HowItWorksSection />
        </LazySection>

        <LazySection>
          <TrustedByThousandsSection />
        </LazySection>

        <LazySection>
          <AnimatedTestimonials />
        </LazySection>

        <LazySection>
          <FounderSection />
        </LazySection>

        <LazySection>
          <TreatmentProcessSection />
        </LazySection>

        <LazySection>
          <LocationsSection />
        </LazySection>

        <LazySection>
          <TextPressureSection />
        </LazySection>

        <LazySection>
          <BlogSection />
        </LazySection>

        <LazySection>
          <GallerySection />
        </LazySection>

        <LazySection>
          <GlobalReachSection />
        </LazySection>

        <LazySection>
          <ContactSection />
        </LazySection>

        <LazySection>
          <GridMotionSection />
        </LazySection>

        <LazySection>
          <FinalCTASection />
        </LazySection>

        <LazySection>
          <DownloadAppSection />
        </LazySection>

        <LazySection>
          <HealToHealthSection />
        </LazySection>
      </main>

      <Footer />
    </div>
  );
}
