"use client";

import React, { useRef, useEffect, useState, CSSProperties } from 'react';

interface MagnetLinesProps {
  rows?: number;
  columns?: number;
  containerSize?: string;
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  baseAngle?: number;
  className?: string;
  style?: CSSProperties;
}

const MagnetLines: React.FC<MagnetLinesProps> = ({
  rows = 9,
  columns = 9,
  containerSize = '80vmin',
  lineColor = '#06b6d4',
  lineWidth = '1vmin',
  lineHeight = '6vmin',
  baseAngle = -10,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const centersRef = useRef<{ x: number; y: number }[]>([]);
  const itemsRef = useRef<HTMLSpanElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const items = Array.from(container.querySelectorAll<HTMLSpanElement>('span'));
    itemsRef.current = items;

    const cacheCenters = () => {
      centersRef.current = items.map((item) => {
        const rect = item.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      });
    };

    cacheCenters();

    const applyRotations = () => {
      rafRef.current = null;
      if (!activeRef.current) return;

      const { x: px, y: py } = pointerRef.current;
      const centers = centersRef.current;

      for (let i = 0; i < items.length; i++) {
        const center = centers[i];
        if (!center) continue;
        const b = px - center.x;
        const a = py - center.y;
        const c = Math.sqrt(a * a + b * b) || 1;
        const r = ((Math.acos(b / c) * 180) / Math.PI) * (py > center.y ? 1 : -1);
        items[i].style.setProperty('--rotate', `${r}deg`);
      }
    };

    const schedule = () => {
      if (rafRef.current != null || !activeRef.current) return;
      rafRef.current = requestAnimationFrame(applyRotations);
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          cacheCenters();
          schedule();
        }
      },
      { rootMargin: '100px' }
    );
    visibilityObserver.observe(container);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', cacheCenters, { passive: true });
    window.addEventListener('resize', cacheCenters, { passive: true });

    // Seed toward center of grid
    if (items.length) {
      const mid = Math.floor(items.length / 2);
      const rect = items[mid].getBoundingClientRect();
      pointerRef.current = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      applyRotations();
    }

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', cacheCenters);
      window.removeEventListener('resize', cacheCenters);
      visibilityObserver.disconnect();
    };
  }, [reducedMotion, rows, columns]);

  const total = rows * columns;
  const spans = Array.from({ length: total }, (_, i) => (
    <span
      key={i}
      className="block origin-center"
      style={{
        backgroundColor: lineColor,
        width: lineWidth,
        height: lineHeight,
        // @ts-expect-error CSS custom prop
        '--rotate': `${baseAngle}deg`,
        transform: 'rotate(var(--rotate))',
        transition: reducedMotion ? undefined : 'transform 80ms linear',
        willChange: reducedMotion ? undefined : 'transform',
        borderRadius: '2px',
      }}
    />
  ));

  return (
    <div
      ref={containerRef}
      className={`grid place-items-center ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: containerSize,
        height: containerSize,
        ...style
      }}
    >
      {spans}
    </div>
  );
};

export default MagnetLines;
