'use client';

import { useEffect, useRef, useState } from 'react';

// Preload GSAP on idle so counter animation starts immediately when in view
if (typeof window !== 'undefined') {
  const preload = () => import('gsap');
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(preload, { timeout: 2000 });
  } else {
    setTimeout(preload, 500);
  }
}

interface CounterProps {
  value: number;
  suffix?: string;
}

export function Counter({ value, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0]?.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        const { gsap } = await import('gsap');
        gsap.to({ val: 0 }, {
            val: value,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: function () {
              setCount(Math.floor(this.targets()[0].val));
            }
          });
        observer.disconnect();
      },
      { threshold: 0.1, rootMargin: '150px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}
