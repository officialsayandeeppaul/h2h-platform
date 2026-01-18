'use client';

import { useEffect, useRef, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Ultra-smooth 120fps scrolling configuration
    const lenis = new Lenis({
      duration: 1.0,  // Slightly faster for snappier feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,  // Natural wheel speed
      touchMultiplier: 2.0,  // Better touch response
      infinite: false,
    });

    lenisRef.current = lenis;

    // High-performance RAF loop
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    // Expose lenis globally for GSAP ScrollTrigger integration
    (window as any).lenis = lenis;

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
}
