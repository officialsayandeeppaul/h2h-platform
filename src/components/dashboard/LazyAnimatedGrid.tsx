'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Lazy load AnimatedGridPattern to avoid blocking initial paint
// Design unchanged - same animation, loads after main content
const AnimatedGridPattern = dynamic(
  () => import('@/components/ui/animated-grid-pattern').then((m) => ({ default: m.AnimatedGridPattern })),
  { ssr: false, loading: () => null }
);

interface LazyAnimatedGridProps {
  className?: string;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export function LazyAnimatedGrid({
  className,
  numSquares = 20,
  maxOpacity = 0.1,
  duration = 3,
  repeatDelay = 1,
}: LazyAnimatedGridProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Instant static fallback - same grid look, no motion/JS cost */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(6 182 212 / 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(6 182 212 / 0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Animated layer - loads async after paint */}
      <div className="absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)] fill-cyan-500/30 stroke-cyan-500/30">
        <AnimatedGridPattern
          numSquares={numSquares}
          maxOpacity={maxOpacity}
          duration={duration}
          repeatDelay={repeatDelay}
          className={className}
        />
      </div>
    </div>
  );
}
