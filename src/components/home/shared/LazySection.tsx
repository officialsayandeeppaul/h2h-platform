'use client';

import { useEffect, useRef, useState, ReactNode, Suspense } from 'react';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  minHeight?: string;
}

export function LazySection({
  children,
  className = '',
  rootMargin = '800px 0px',
  threshold = 0,
  minHeight = '200px',
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Instant if already near viewport (no wait for observer tick)
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight + 1200) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  if (!isVisible) {
    return (
      <div
        ref={ref}
        className={className}
        style={{ minHeight, contentVisibility: 'auto', containIntrinsicSize: `auto ${minHeight}` }}
      />
    );
  }

  return (
    <div ref={ref} className={`${className} animate-fade-in-fast`}>
      <Suspense fallback={<div style={{ minHeight }} />}>
        {children}
      </Suspense>
    </div>
  );
}
