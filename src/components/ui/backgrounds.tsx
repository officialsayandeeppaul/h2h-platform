'use client';

import { useEffect, useRef, useId, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

// Flickering Grid Background
export function FlickeringGrid({
  className,
  squareSize = 4,
  gridGap = 6,
  color = '#6366f1',
  maxOpacity = 0.5,
  flickerChance = 0.3,
}: {
  className?: string;
  squareSize?: number;
  gridGap?: number;
  color?: string;
  maxOpacity?: number;
  flickerChance?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const cols = Math.ceil(canvas.width / (squareSize + gridGap));
    const rows = Math.ceil(canvas.height / (squareSize + gridGap));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (Math.random() > flickerChance) {
            const opacity = Math.random() * maxOpacity;
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            ctx.fillRect(
              i * (squareSize + gridGap),
              j * (squareSize + gridGap),
              squareSize,
              squareSize
            );
          }
        }
      }
    };

    const interval = setInterval(draw, 100);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [squareSize, gridGap, color, maxOpacity, flickerChance]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full', className)}
    />
  );
}

// Retro Grid Background
export function RetroGrid({ className, angle = 65, cellSize = 60 }: { className?: string; angle?: number; cellSize?: number }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]',
        className
      )}
    >
      <div
        className="absolute inset-0 [transform:rotateX(var(--grid-angle))]"
        style={{ '--grid-angle': `${angle}deg` } as React.CSSProperties}
      >
        <div
          className={cn(
            'animate-grid',
            '[background-repeat:repeat] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]',
            '[background-image:linear-gradient(to_right,rgba(99,102,241,0.3)_1px,transparent_0),linear-gradient(to_bottom,rgba(99,102,241,0.3)_1px,transparent_0)]'
          )}
          style={{
            backgroundSize: `${cellSize}px ${cellSize}px`,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90%" />
    </div>
  );
}

// Dot Pattern Background
export function DotPattern({
  className,
  cx = 1,
  cy = 1,
  cr = 1,
  color = '#94a3b8',
}: {
  className?: string;
  cx?: number;
  cy?: number;
  cr?: number;
  color?: string;
}) {
  const id = useId();
  
  return (
    <svg className={cn('absolute inset-0 h-full w-full', className)}>
      <defs>
        <pattern
          id={id}
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle cx={cx} cy={cy} r={cr} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

// Ripple Effect Background
export function Ripple({
  className,
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  color = '#3b82f6',
}: {
  className?: string;
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  color?: string;
}) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)]',
        className
      )}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        
        return (
          <div
            key={i}
            className="absolute animate-ripple rounded-full border"
            style={{
              width: size,
              height: size,
              opacity: Math.max(opacity, 0.02),
              animationDelay,
              borderColor: color,
              borderWidth: 1,
            }}
          />
        );
      })}
    </div>
  );
}

// Grid Pattern Background
export function GridPattern({
  className,
  width = 40,
  height = 40,
  strokeColor = '#e5e7eb',
  strokeWidth = 1,
}: {
  className?: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
}) {
  const id = useId();
  
  return (
    <svg className={cn('absolute inset-0 h-full w-full', className)}>
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

// Animated Grid Pattern (Moving Lines)
export function AnimatedGridPattern({
  className,
  numSquares = 30,
  maxOpacity = 0.5,
  duration = 3,
  color = '#6366f1',
}: {
  className?: string;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  color?: string;
}) {
  const patternId = useId();
  const [squares, setSquares] = useState<Array<{ id: number; pos: [number, number]; opacity: number; delay: number }>>([]);

  useEffect(() => {
    setSquares(
      Array.from({ length: numSquares }, (_, i) => ({
        id: i,
        pos: [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)] as [number, number],
        opacity: Math.random() * maxOpacity,
        delay: Math.random() * duration,
      }))
    );
  }, [numSquares, maxOpacity, duration]);

  return (
    <svg className={cn('absolute inset-0 h-full w-full', className)}>
      <defs>
        <pattern
          id={patternId}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity={0.2}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      {squares.map(({ id, pos, opacity, delay }) => (
        <rect
          key={id}
          width="39"
          height="39"
          x={pos[0] * 40 + 1}
          y={pos[1] * 40 + 1}
          fill={color}
          strokeWidth="0"
          className="animate-pulse"
          style={{
            opacity,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      ))}
    </svg>
  );
}

// Light Rays Background
export function LightRays({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%]">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 h-full w-px origin-top animate-light-ray"
            style={{
              transform: `rotate(${i * 30}deg)`,
              background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.3), transparent 70%)',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Striped Pattern Background
export function StripedPattern({
  className,
  color = '#3b82f6',
  opacity = 0.1,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <div
      className={cn('absolute inset-0', className)}
      style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 10px,
          ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 20px
        )`,
      }}
    />
  );
}

// Interactive Beam/Glow that follows mouse (simplified version)
export function InteractiveGlow({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
      glow.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      glow.style.opacity = '0';
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn('absolute inset-0 overflow-hidden', className)}>
      <div
        ref={glowRef}
        className="pointer-events-none absolute w-[400px] h-[400px] rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
