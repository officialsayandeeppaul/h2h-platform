'use client';

import dynamic from "next/dynamic";
import { LazySection } from "@/components/home/shared/LazySection";

const loadSection = <T,>(fn: () => Promise<{ default: T }>) =>
  fn().catch(() => ({ default: (() => null) as T }));

const WhyH2HSection = dynamic(
  () => loadSection(() => import("@/components/home/WhyH2HSection").then((m) => ({ default: m.WhyH2HSection }))),
  { ssr: false }
);
const CaseStudiesSection = dynamic(() => loadSection(() => import("@/components/home/CaseStudiesSection").then(m => ({ default: m.CaseStudiesSection }))), { ssr: false });
const HowItWorksSection = dynamic(() => loadSection(() => import("@/components/home/HowItWorksSection").then(m => ({ default: m.HowItWorksSection }))), { ssr: false });
const FounderSection = dynamic(() => import("@/components/home/FounderSection").then(m => ({ default: m.FounderSection })), { ssr: false });
const TreatmentProcessSection = dynamic(() => import("@/components/home/TreatmentProcessSection").then(m => ({ default: m.TreatmentProcessSection })), { ssr: false });
const LocationsSection = dynamic(() => import("@/components/home/LocationsSection").then(m => ({ default: m.LocationsSection })), { ssr: false });
const TextPressureSection = dynamic(() => import("@/components/home/TextPressureSection").then(m => ({ default: m.TextPressureSection })), { ssr: false });
const BlogSection = dynamic(() => import("@/components/home/BlogSection").then(m => ({ default: m.BlogSection })), { ssr: false });
const GallerySection = dynamic(() => import("@/components/home/GallerySection").then(m => ({ default: m.GallerySection })), { ssr: false });
const GlobalReachSection = dynamic(() => import("@/components/home/GlobalReachSection").then(m => ({ default: m.GlobalReachSection })), { ssr: false });
const ContactSection = dynamic(() => import("@/components/home/ContactSection").then(m => ({ default: m.ContactSection })), { ssr: false });
const GridMotionSection = dynamic(
  () => loadSection(() => import("@/components/home/GridMotionSection").then(m => ({ default: m.GridMotionSection }))),
  { ssr: false }
);
const FinalCTASection = dynamic(() => import("@/components/home/FinalCTASection").then(m => ({ default: m.FinalCTASection })), { ssr: false });
const DownloadAppSection = dynamic(() => import("@/components/home/DownloadAppSection").then(m => ({ default: m.DownloadAppSection })), { ssr: false });
const HealToHealthSection = dynamic(() => import("@/components/home/HealToHealthSection").then(m => ({ default: m.HealToHealthSection })), { ssr: false });
const TrustedByThousandsSection = dynamic(() => loadSection(() => import("@/components/ui/trusted-charts").then(mod => ({ default: mod.TrustedByThousandsSection }))), { ssr: false });
const AnimatedTestimonials = dynamic(() => loadSection(() => import("@/components/ui/animated-testimonials").then(mod => ({ default: mod.AnimatedTestimonials }))), { ssr: false });

/** Wider prefetch + threshold 0 so fast scroll skips the “empty pulse then pop” effect. */
const LAZY = { rootMargin: "1400px 0px", threshold: 0 } as const;

export function DeferredSections() {
  return (
    <>
      <LazySection minHeight="min(520px,85vh)" className="bg-gray-950" {...LAZY}>
        <WhyH2HSection />
      </LazySection>
      <LazySection minHeight="120px" {...LAZY}>
        <CaseStudiesSection />
      </LazySection>
      <LazySection minHeight="120px" {...LAZY}>
        <HowItWorksSection />
      </LazySection>
      <LazySection minHeight="100px" {...LAZY}>
        <TrustedByThousandsSection />
      </LazySection>
      <LazySection minHeight="100px" {...LAZY}>
        <AnimatedTestimonials />
      </LazySection>
      <LazySection minHeight="200px" {...LAZY}>
        <FounderSection />
      </LazySection>
      <LazySection minHeight="150px" {...LAZY}>
        <TreatmentProcessSection />
      </LazySection>
      <LazySection minHeight="120px" {...LAZY}>
        <LocationsSection />
      </LazySection>
      <LazySection minHeight="100px" {...LAZY}>
        <TextPressureSection />
      </LazySection>
      <LazySection minHeight="150px" {...LAZY}>
        <BlogSection />
      </LazySection>
      <LazySection minHeight="120px" {...LAZY}>
        <GallerySection />
      </LazySection>
      <LazySection minHeight="100px" {...LAZY}>
        <GlobalReachSection />
      </LazySection>
      <LazySection minHeight="120px" {...LAZY}>
        <ContactSection />
      </LazySection>
      <LazySection minHeight="300px" {...LAZY}>
        <GridMotionSection />
      </LazySection>
      <LazySection minHeight="100px" {...LAZY}>
        <FinalCTASection />
      </LazySection>
      <LazySection minHeight="100px" {...LAZY}>
        <DownloadAppSection />
      </LazySection>
      <LazySection minHeight="120px" {...LAZY}>
        <HealToHealthSection />
      </LazySection>
    </>
  );
}
