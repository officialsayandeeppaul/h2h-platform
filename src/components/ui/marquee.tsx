'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/** Lightweight infinite marquee — keep out of magic-components barrel. */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 2,
}: {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: ReactNode;
  vertical?: boolean;
  repeat?: number;
}) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex shrink-0 justify-around [gap:var(--gap)]',
              vertical ? 'flex-col animate-marquee-vertical' : 'flex-row animate-marquee',
              reverse && 'direction-reverse',
              pauseOnHover && 'group-hover:[animation-play-state:paused]'
            )}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
