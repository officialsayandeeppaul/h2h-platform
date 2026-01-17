'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, ReactNode, forwardRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';

// ============================================
// SHIMMER BUTTON - Animated shimmer effect
// ============================================
export const ShimmerButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    shimmerColor?: string;
    shimmerSize?: string;
    borderRadius?: string;
    shimmerDuration?: string;
    background?: string;
    className?: string;
    children?: ReactNode;
  }
>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '100px',
      background = 'rgba(0, 0, 0, 1)',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
          className
        )}
        style={
          {
            '--bg': background,
            '--radius': borderRadius,
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          className={cn(
            '-z-30 blur-[2px]',
            'absolute inset-0 overflow-visible [container-type:size]'
          )}
        >
          <div
            className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]"
            style={{
              background: `linear-gradient(to right, transparent, ${shimmerColor}, transparent)`,
              animationDuration: shimmerDuration,
            }}
          />
        </div>
        {children}
        <div
          className={cn(
            'insert-0 absolute h-full w-full',
            'rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]',
            'transform-gpu transition-all duration-300 ease-in-out',
            'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
            'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]'
          )}
        />
      </button>
    );
  }
);
ShimmerButton.displayName = 'ShimmerButton';

// ============================================
// RAINBOW BUTTON - Animated rainbow gradient
// ============================================
export function RainbowButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={cn(
        'group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-white transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        'before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]',
        'bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================
// PULSATING BUTTON - Breathing glow effect
// ============================================
export function PulsatingButton({
  children,
  className,
  pulseColor = '#3b82f6',
  duration = '1.5s',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  pulseColor?: string;
  duration?: string;
}) {
  return (
    <button
      className={cn(
        'relative flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold',
        className
      )}
      style={{
        '--pulse-color': pulseColor,
        '--duration': duration,
      } as React.CSSProperties}
      {...props}
    >
      <div className="absolute inset-0 rounded-lg bg-inherit animate-pulse-ring" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

// ============================================
// BORDER BEAM - Animated border light
// ============================================
export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  anchor = 90,
  colorFrom = '#ffaa40',
  colorTo = '#9c40ff',
  delay = 0,
}: {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}) {
  return (
    <div
      style={{
        '--size': size,
        '--duration': `${duration}s`,
        '--anchor': `${anchor}%`,
        '--border-width': borderWidth,
        '--color-from': colorFrom,
        '--color-to': colorTo,
        '--delay': `-${delay}s`,
      } as React.CSSProperties}
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]',
        '![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
        'after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]',
        className
      )}
    />
  );
}

// ============================================
// METEORS - Falling meteor animation
// ============================================
export function Meteors({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) {
  const [meteors, setMeteors] = useState<Array<{ left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    setMeteors(
      Array.from({ length: number }, () => ({
        left: Math.floor(Math.random() * 100),
        delay: Math.random() * 1,
        duration: Math.floor(Math.random() * 8 + 2),
      }))
    );
  }, [number]);

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {meteors.map((meteor, idx) => (
        <span
          key={idx}
          className="animate-meteor-effect absolute h-0.5 w-0.5 rotate-[215deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: 0,
            left: `${meteor.left}%`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.duration}s`,
          }}
        >
          <div className="absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </div>
  );
}

// ============================================
// PARTICLES - Floating particles
// ============================================
export function Particles({
  className,
  quantity = 50,
  color = '#ffffff',
}: {
  className?: string;
  quantity?: number;
  color?: string;
}) {
  const [particles, setParticles] = useState<Array<{ width: number; height: number; left: number; top: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: quantity }, () => ({
        width: Math.random() * 4 + 2,
        height: Math.random() * 4 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
      }))
    );
  }, [quantity]);

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float opacity-60"
          style={{
            width: particle.width,
            height: particle.height,
            backgroundColor: color,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// SPARKLES TEXT - Text with sparkle effects
// ============================================
export function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = { first: '#9E7AFF', second: '#FE8BBB' },
}: {
  children: ReactNode;
  className?: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
}) {
  const [sparkles, setSparkles] = useState<Array<{ top: number; left: number; delay: number }>>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: sparklesCount }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 2,
      }))
    );
  }, [sparklesCount]);

  return (
    <span className={cn('relative inline-block', className)}>
      {children}
      {sparkles.map((sparkle, i) => (
        <span
          key={i}
          className="pointer-events-none absolute animate-sparkle"
          style={{
            top: `${sparkle.top}%`,
            left: `${sparkle.left}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 160 160"
            fill="none"
          >
            <path
              d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
              fill={i % 2 === 0 ? colors.first : colors.second}
            />
          </svg>
        </span>
      ))}
    </span>
  );
}

// ============================================
// WORD ROTATE - Rotating words animation
// ============================================
export function WordRotate({
  words,
  className,
  duration = 2500,
}: {
  words: string[];
  className?: string;
  duration?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <span className={cn('inline-block overflow-hidden', className)}>
      <span
        key={index}
        className="inline-block animate-word-rotate"
      >
        {words[index]}
      </span>
    </span>
  );
}

// ============================================
// TYPING ANIMATION - Typewriter effect
// ============================================
export function TypingAnimation({
  text,
  className,
  duration = 100,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [i, setI] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [i, text, duration]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-blink">|</span>
    </span>
  );
}

// ============================================
// NEON GRADIENT CARD - Glowing card
// ============================================
export function NeonGradientCard({
  children,
  className,
  borderSize = 2,
  borderRadius = 20,
  neonColors = { firstColor: '#ff00aa', secondColor: '#00FFF1' },
}: {
  children: ReactNode;
  className?: string;
  borderSize?: number;
  borderRadius?: number;
  neonColors?: { firstColor: string; secondColor: string };
}) {
  return (
    <div
      className={cn(
        'relative z-10 rounded-[var(--border-radius)] bg-gray-900',
        className
      )}
      style={{
        '--border-size': `${borderSize}px`,
        '--border-radius': `${borderRadius}px`,
        '--neon-first-color': neonColors.firstColor,
        '--neon-second-color': neonColors.secondColor,
      } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 -z-10 rounded-[var(--border-radius)] blur-lg opacity-50"
        style={{
          background: `linear-gradient(90deg, ${neonColors.firstColor}, ${neonColors.secondColor})`,
        }}
      />
      <div
        className="absolute inset-0 -z-10 rounded-[var(--border-radius)]"
        style={{
          background: `linear-gradient(90deg, ${neonColors.firstColor}, ${neonColors.secondColor})`,
          padding: borderSize,
        }}
      >
        <div className="h-full w-full rounded-[calc(var(--border-radius)-var(--border-size))] bg-gray-900" />
      </div>
      {children}
    </div>
  );
}

// ============================================
// MAGIC CARD - Interactive hover card
// ============================================
export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = '#262626',
}: {
  children: ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900',
        className
      )}
      style={{
        '--gradient-size': `${gradientSize}px`,
        '--gradient-color': gradientColor,
      } as React.CSSProperties}
    >
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" 
        style={{
          background: `radial-gradient(var(--gradient-size) circle at var(--mouse-x) var(--mouse-y), var(--gradient-color), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

// ============================================
// MARQUEE - Infinite scrolling content
// ============================================
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
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

// ============================================
// ORBITING CIRCLES - Animated orbiting icons
// ============================================
export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 0,
  radius = 50,
  path = true,
}: {
  className?: string;
  children?: ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
}) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <circle
            className="stroke-gray-200 stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      <div
        style={{
          '--duration': `${duration}s`,
          '--radius': `${radius}px`,
          '--delay': `-${delay}s`,
        } as React.CSSProperties}
        className={cn(
          'absolute flex h-full w-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-white/10 backdrop-blur-sm [animation-delay:var(--delay)]',
          reverse && 'direction-reverse',
          className
        )}
      >
        {children}
      </div>
    </>
  );
}

// ============================================
// ANIMATED LIST - Items appearing with animation
// ============================================
export function AnimatedList({
  className,
  children,
  delay = 1000,
}: {
  className?: string;
  children: ReactNode[];
  delay?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % children.length);
    }, delay);
    return () => clearInterval(interval);
  }, [children.length, delay]);

  const itemsToShow = children.slice(0, index + 1).reverse();

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {itemsToShow.map((child, i) => (
        <div
          key={i}
          className="animate-fade-up"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// ============================================
// ANIMATED LIST ITEM - Single notification item
// ============================================
export function AnimatedListItem({
  name,
  description,
  icon,
  color,
  time,
}: {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}) {
  return (
    <div className="relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-200 ease-in-out hover:scale-[103%] bg-white shadow-lg border border-gray-100">
      <div className="flex flex-row items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-2xl text-lg',
            color
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col overflow-hidden">
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <p className="absolute right-4 top-4 text-xs text-gray-400">{time}</p>
    </div>
  );
}

// ============================================
// BENTO GRID - Modern grid layout
// ============================================
export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-3 gap-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ComponentType<{ className?: string }>;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div
      className={cn(
        'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl',
        'bg-white border border-gray-100 shadow-lg',
        'transform-gpu transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
        className
      )}
    >
      <div>{background}</div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
        {Icon && (
          <Icon className="h-12 w-12 origin-left transform-gpu text-gray-500 transition-all duration-300 ease-in-out group-hover:scale-75" />
        )}
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="max-w-lg text-gray-500">{description}</p>
      </div>
      <div
        className={cn(
          'pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'
        )}
      >
        {href && (
          <a
            href={href}
            className="pointer-events-auto inline-flex items-center text-sm font-semibold text-blue-600"
          >
            {cta || 'Learn more'} →
          </a>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-gray-50/50" />
    </div>
  );
}

// ============================================
// ICON CLOUD - Floating icon sphere
// ============================================
export function IconCloud({
  icons,
  className,
}: {
  icons: { icon: ReactNode; name: string }[];
  className?: string;
}) {
  const [iconPositions, setIconPositions] = useState<Array<{ radius: number }>>([]);

  useEffect(() => {
    setIconPositions(
      icons.map(() => ({
        radius: 120 + Math.random() * 60,
      }))
    );
  }, [icons.length]);

  return (
    <div className={cn('relative h-[400px] w-full overflow-hidden', className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        {icons.map((item, index) => {
          const angle = (index / icons.length) * Math.PI * 2;
          const radius = iconPositions[index]?.radius ?? 150;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.6;
          const z = Math.sin(angle + Math.PI / 2) * 50;
          const delay = index * 0.2;
          
          return (
            <div
              key={index}
              className="absolute flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-lg border border-gray-100 transition-transform duration-500 hover:scale-110"
              style={{
                transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                animation: `float 3s ease-in-out ${delay}s infinite`,
              }}
              title={item.name}
            >
              {item.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// GLOBE - 3D rotating globe (simplified CSS version)
// ============================================
export function Globe({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-[400px] w-full', className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[300px] w-[300px]">
          {/* Globe sphere */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-500 opacity-20" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-300 via-cyan-300 to-teal-400 opacity-30" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-200 via-cyan-200 to-teal-300 opacity-40" />
          
          {/* Animated rings */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-300/30 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute inset-6 rounded-full border border-cyan-300/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          <div className="absolute inset-12 rounded-full border border-teal-300/30 animate-spin" style={{ animationDuration: '25s' }} />
          
          {/* Location dots */}
          {[
            { top: '20%', left: '30%' },
            { top: '40%', left: '60%' },
            { top: '60%', left: '25%' },
            { top: '30%', left: '70%' },
            { top: '70%', left: '50%' },
            { top: '50%', left: '40%' },
            { top: '25%', left: '50%' },
            { top: '55%', left: '65%' },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-blue-500 shadow-lg animate-pulse"
              style={{ top: pos.top, left: pos.left, animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-3xl" />
      </div>
    </div>
  );
}

// ============================================
// NUMBER TICKER - Animated counting number
// ============================================
export function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  className,
}: {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(direction === 'up' ? 0 : value);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000;
    const startValue = direction === 'up' ? 0 : value;
    const endValue = direction === 'up' ? value : 0;

    const timer = setTimeout(() => {
      const animate = () => {
        const elapsed = Date.now() - startTime - delay;
        if (elapsed < 0) {
          requestAnimationFrame(animate);
          return;
        }
        
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (endValue - startValue) * eased);
        
        setDisplayValue(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [value, direction, delay]);

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString()}
    </span>
  );
}

// ============================================
// SHINE BORDER - Animated border glow
// ============================================
export function ShineBorder({
  className,
  children,
  color = '#3b82f6',
  borderWidth = 2,
}: {
  className?: string;
  children: ReactNode;
  color?: string;
  borderWidth?: number;
}) {
  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden',
        className
      )}
      style={{
        padding: borderWidth,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        backgroundSize: '200% 100%',
        animation: 'shine 3s linear infinite',
      }}
    >
      <div className="relative rounded-xl bg-white h-full w-full">
        {children}
      </div>
    </div>
  );
}

// ============================================
// DOCK - macOS style dock
// ============================================
export function Dock({
  className,
  items,
}: {
  className?: string;
  items: { icon: ReactNode; label: string; href?: string }[];
}) {
  return (
    <div
      className={cn(
        'flex items-end gap-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 p-2 shadow-xl',
        className
      )}
    >
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href || '#'}
          className="group relative flex flex-col items-center"
        >
          <span className="absolute -top-8 scale-0 rounded-lg bg-gray-900 px-2 py-1 text-xs text-white transition-transform group-hover:scale-100">
            {item.label}
          </span>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg transition-all duration-200 hover:scale-125 hover:-translate-y-2">
            {item.icon}
          </div>
        </a>
      ))}
    </div>
  );
}

// ============================================
// PROGRESSIVE BLUR - Fading blur effect
// ============================================
export function ProgressiveBlur({
  className,
  direction = 'bottom',
}: {
  className?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const gradients = {
    top: 'bg-gradient-to-t',
    bottom: 'bg-gradient-to-b',
    left: 'bg-gradient-to-l',
    right: 'bg-gradient-to-r',
  };

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0',
        gradients[direction],
        'from-transparent via-white/50 to-white backdrop-blur-sm',
        className
      )}
    />
  );
}
