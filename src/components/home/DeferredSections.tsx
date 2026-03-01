'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import dynamic from "next/dynamic";

// DEFERRED: Load after scroll - .catch() prevents ChunkLoadError crash, fallback renders null
const loadSection = <T,>(fn: () => Promise<{ default: T }>) =>
  fn().catch(() => ({ default: (() => null) as T }));

// Placeholder while section loads - keeps layout stable
const SectionPlaceholder = ({ minH = 80 }: { minH?: number }) => (
  <div style={{ minHeight: minH }} className="animate-pulse bg-gray-100/50 rounded-lg" aria-hidden />
);

// Each section loads only when it's about to enter viewport (progressive, no 15-chunk burst)
function LazySection({
  children,
  minHeight = 100,
}: {
  children: ReactNode;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setShow(true); },
      { rootMargin: '400px', threshold: 0 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: show ? undefined : minHeight }}>
      {show ? children : <SectionPlaceholder minH={minHeight} />}
    </div>
  );
}

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

export function DeferredSections() {
  return (
    <>
      <LazySection minHeight={120}>
        <CaseStudiesSection />
      </LazySection>
      <LazySection minHeight={120}>
        <HowItWorksSection />
      </LazySection>
      <LazySection minHeight={100}>
        <TrustedByThousandsSection />
      </LazySection>
      <LazySection minHeight={100}>
        <AnimatedTestimonials />
      </LazySection>
      <LazySection minHeight={200}>
        <FounderSection />
      </LazySection>
      <LazySection minHeight={150}>
        <TreatmentProcessSection />
      </LazySection>
      <LazySection minHeight={120}>
        <LocationsSection />
      </LazySection>
      <LazySection minHeight={100}>
        <TextPressureSection />
      </LazySection>
      <LazySection minHeight={150}>
        <BlogSection />
      </LazySection>
      <LazySection minHeight={120}>
        <GallerySection />
      </LazySection>
      <LazySection minHeight={100}>
        <GlobalReachSection />
      </LazySection>
      <LazySection minHeight={120}>
        <ContactSection />
      </LazySection>
      <LazySection minHeight={300}>
        <GridMotionSection />
      </LazySection>
      <LazySection minHeight={100}>
        <FinalCTASection />
      </LazySection>
      <LazySection minHeight={100}>
        <DownloadAppSection />
      </LazySection>
      <LazySection minHeight={120}>
        <HealToHealthSection />
      </LazySection>
    </>
  );
}
