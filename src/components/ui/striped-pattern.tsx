'use client';

import { cn } from '@/lib/utils';

interface StripedPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  direction?: 'left' | 'right';
  className?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export function StripedPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  direction = 'left',
  className,
  strokeWidth = 1,
  strokeDasharray,
}: StripedPatternProps) {
  const patternId = `striped-pattern-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <line
            x1={direction === 'left' ? 0 : width}
            y1="0"
            x2={direction === 'left' ? width : 0}
            y2={height}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export default StripedPattern;
