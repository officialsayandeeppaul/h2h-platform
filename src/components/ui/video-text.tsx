'use client';

import React, { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VideoTextProps {
  src: string;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  fontSize?: string | number;
  fontWeight?: string | number;
  textAnchor?: 'start' | 'middle' | 'end';
  dominantBaseline?: 'auto' | 'middle' | 'hanging' | 'alphabetic' | 'ideographic' | 'mathematical' | 'central';
  fontFamily?: string;
}

export function VideoText({
  src,
  as: Component = 'div',
  children,
  className,
  autoPlay = true,
  muted = true,
  loop = true,
  preload = 'auto',
  fontSize = '120',
  fontWeight = 'bold',
  textAnchor = 'middle',
  dominantBaseline = 'middle',
  fontFamily = 'sans-serif',
}: VideoTextProps) {
  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="text-mask">
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              textAnchor={textAnchor}
              dominantBaseline={dominantBaseline}
              fontSize={fontSize}
              fontWeight={fontWeight}
              fontFamily={fontFamily}
              fill="white"
              className="select-none"
            >
              {children}
            </text>
          </mask>
        </defs>
        <foreignObject width="100%" height="100%" mask="url(#text-mask)">
          <video
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            preload={preload}
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={src} type="video/webm" />
            <source src={src.replace('.webm', '.mp4')} type="video/mp4" />
          </video>
        </foreignObject>
      </svg>
    </div>
  );
}
