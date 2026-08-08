'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { SectionShell } from '@/components/home/shared/SectionShell';

/**
 * Only mount the real section when near the viewport.
 * Prevents all below-fold chunks from evaluating on first paint (huge TBT win).
 */
function NearMount({
  shell,
  children,
  rootMargin = '600px 0px',
}: {
  shell: ReactNode;
  children: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 700) {
      setReady(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} data-home-section className="home-section-frame">
      {ready ? children : shell}
    </div>
  );
}

const MagnetLinesSection = dynamic(
  () => import('@/components/home/MagnetLinesSection').then((m) => ({ default: m.MagnetLinesSection })),
  { ssr: false }
);
const FeaturesSection = dynamic(
  () => import('@/components/home/FeaturesSection').then((m) => ({ default: m.FeaturesSection }))
);
const WhyH2HSection = dynamic(
  () => import('@/components/home/WhyH2HSection').then((m) => ({ default: m.WhyH2HSection }))
);
const CaseStudiesSection = dynamic(
  () => import('@/components/home/CaseStudiesSection').then((m) => ({ default: m.CaseStudiesSection }))
);
const HowItWorksSection = dynamic(
  () => import('@/components/home/HowItWorksSection').then((m) => ({ default: m.HowItWorksSection }))
);
const AnimatedTestimonials = dynamic(
  () => import('@/components/ui/animated-testimonials').then((m) => ({ default: m.AnimatedTestimonials }))
);
const FounderSection = dynamic(
  () => import('@/components/home/FounderSection').then((m) => ({ default: m.FounderSection }))
);
const TreatmentProcessSection = dynamic(
  () => import('@/components/home/TreatmentProcessSection').then((m) => ({ default: m.TreatmentProcessSection }))
);
const LocationsSection = dynamic(
  () => import('@/components/home/LocationsSection').then((m) => ({ default: m.LocationsSection }))
);
const BlogSection = dynamic(
  () => import('@/components/home/BlogSection').then((m) => ({ default: m.BlogSection }))
);
const GlobalReachSection = dynamic(
  () => import('@/components/home/GlobalReachSection').then((m) => ({ default: m.GlobalReachSection }))
);
const ContactSection = dynamic(
  () => import('@/components/home/ContactSection').then((m) => ({ default: m.ContactSection }))
);
const GridMotionSection = dynamic(
  () => import('@/components/home/GridMotionSection').then((m) => ({ default: m.GridMotionSection })),
  { ssr: false }
);
const FinalCTASection = dynamic(
  () => import('@/components/home/FinalCTASection').then((m) => ({ default: m.FinalCTASection }))
);
const DownloadAppSection = dynamic(
  () => import('@/components/home/DownloadAppSection').then((m) => ({ default: m.DownloadAppSection }))
);
const HealToHealthSection = dynamic(
  () => import('@/components/home/HealToHealthSection').then((m) => ({ default: m.HealToHealthSection }))
);

export function BelowFoldSections() {
  return (
    <>
      <NearMount shell={<SectionShell tone="dark" minHeight="28rem" />}>
        <MagnetLinesSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="dark" minHeight="36rem" />}>
        <FeaturesSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="dark" minHeight="32rem" />}>
        <WhyH2HSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="dark" minHeight="22rem" />}>
        <CaseStudiesSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="light" minHeight="36rem" />}>
        <HowItWorksSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="dark" minHeight="40rem" />}>
        <AnimatedTestimonials />
      </NearMount>
      <NearMount shell={<SectionShell tone="light" minHeight="28rem" />}>
        <FounderSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="light" minHeight="32rem" />}>
        <TreatmentProcessSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="dark" minHeight="28rem" />}>
        <LocationsSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="light" minHeight="36rem" />}>
        <BlogSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="light" minHeight="22rem" />}>
        <GlobalReachSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="slate" minHeight="28rem" />}>
        <ContactSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="dark" minHeight="60vh" />} rootMargin="400px 0px">
        <GridMotionSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="light" minHeight="22rem" />}>
        <FinalCTASection />
      </NearMount>
      <NearMount shell={<SectionShell tone="slate" minHeight="22rem" />}>
        <DownloadAppSection />
      </NearMount>
      <NearMount shell={<SectionShell tone="light" minHeight="18rem" />}>
        <HealToHealthSection />
      </NearMount>
    </>
  );
}
