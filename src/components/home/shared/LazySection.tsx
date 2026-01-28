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
  rootMargin = '500px',
  threshold = 0.1,
  minHeight = '200px'
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

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
        style={{ minHeight }}
      />
    );
  }

  return (
    <Suspense fallback={<div style={{ minHeight }} />}>
      <div ref={ref} className={`${className} animate-fade-in`}>
        {children}
      </div>
    </Suspense>
  );
}
