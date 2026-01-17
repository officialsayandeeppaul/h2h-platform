"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const [value, setValue] = useState<number>(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const get = () => values[queries.findIndex(q => window.matchMedia(q).matches)] ?? defaultValue;
    setValue(get());
    
    const handler = () => setValue(get());
    const mediaQueryLists = queries.map(q => window.matchMedia(q));
    mediaQueryLists.forEach(mql => mql.addEventListener('change', handler));
    
    return () => mediaQueryLists.forEach(mql => mql.removeEventListener('change', handler));
  }, [queries, values, defaultValue]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

interface MasonryItem {
  id: string;
  img: string;
  url?: string;
  height: number;
  title?: string;
  description?: string;
}

interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'top' | 'bottom' | 'left' | 'right';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  gap?: number;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  gap = 16
}) => {
  const columns = useMedia(
    ['(min-width: 1280px)', '(min-width: 1024px)', '(min-width: 768px)', '(min-width: 640px)'],
    [4, 3, 2, 2],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [heights, positions] = useMemo(() => {
    if (!width) return [[], []];

    const colWidth = (width - gap * (columns - 1)) / columns;
    const colHeights = new Array(columns).fill(0);
    const pos: { x: number; y: number; width: number; height: number }[] = [];

    items.forEach((item, i) => {
      const shortestCol = colHeights.indexOf(Math.min(...colHeights));
      const x = shortestCol * (colWidth + gap);
      const y = colHeights[shortestCol];
      const height = item.height;

      pos.push({ x, y, width: colWidth, height });
      colHeights[shortestCol] += height + gap;
    });

    return [colHeights, pos];
  }, [items, columns, width, gap]);

  const containerHeight = Math.max(...(heights.length ? heights : [0]));

  useLayoutEffect(() => {
    if (!positions.length) return;

    const getInitialProps = () => {
      switch (animateFrom) {
        case 'top':
          return { y: -50, opacity: 0 };
        case 'bottom':
          return { y: 50, opacity: 0 };
        case 'left':
          return { x: -50, opacity: 0 };
        case 'right':
          return { x: 50, opacity: 0 };
        default:
          return { y: 50, opacity: 0 };
      }
    };

    gsap.fromTo(
      itemRefs.current.filter(Boolean),
      getInitialProps(),
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration,
        ease,
        stagger
      }
    );
  }, [positions, animateFrom, duration, ease, stagger]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: containerHeight }}
    >
      {items.map((item, i) => {
        const pos = positions[i];
        if (!pos) return null;

        return (
          <div
            key={item.id}
            ref={el => {
              itemRefs.current[i] = el;
            }}
            className={`absolute overflow-hidden rounded-2xl group cursor-pointer transition-all duration-300 ${
              blurToFocus ? 'blur-[2px] hover:blur-0' : ''
            } ${colorShiftOnHover ? 'grayscale hover:grayscale-0' : ''}`}
            style={{
              left: pos.x,
              top: pos.y,
              width: pos.width,
              height: pos.height,
              transform: scaleOnHover ? `scale(1)` : undefined,
            }}
            onMouseEnter={(e) => {
              if (scaleOnHover) {
                gsap.to(e.currentTarget, { scale: hoverScale, duration: 0.3 });
              }
            }}
            onMouseLeave={(e) => {
              if (scaleOnHover) {
                gsap.to(e.currentTarget, { scale: 1, duration: 0.3 });
              }
            }}
          >
            <img
              src={item.img}
              alt={item.title || `Image ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {(item.title || item.description) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                {item.title && (
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                )}
                {item.description && (
                  <p className="text-white/80 text-sm">{item.description}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;
