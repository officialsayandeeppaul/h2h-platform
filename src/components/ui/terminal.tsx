'use client';

import React, { useEffect, useState, useRef, Children, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
  sequence?: boolean;
  startOnView?: boolean;
  theme?: 'dark' | 'light';
}

interface AnimatedSpanProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  startOnView?: boolean;
  onComplete?: () => void;
  shouldStart?: boolean;
}

interface TypingAnimationProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  startOnView?: boolean;
  onComplete?: () => void;
  shouldStart?: boolean;
}

export function Terminal({
  children,
  className,
  sequence = true,
  startOnView = true,
  theme = 'dark',
}: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!startOnView);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!startOnView || !containerRef.current) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnView]);

  const handleComplete = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const childArray = Children.toArray(children);

  const enhancedChildren = sequence
    ? childArray.map((child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child as React.ReactElement<any>, {
            key: index,
            shouldStart: isVisible && index <= currentIndex,
            onComplete: index === currentIndex ? handleComplete : undefined,
          });
        }
        return child;
      })
    : children;

  const isDark = theme === 'dark';

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full rounded-xl overflow-hidden shadow-2xl border',
        isDark 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200',
        className
      )}
    >
      {/* Terminal Header */}
      <div className={cn(
        'flex items-center gap-2 px-4 py-3 border-b',
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      )}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className={cn(
          'text-xs font-medium ml-2',
          isDark ? 'text-gray-400' : 'text-gray-500'
        )}>
          Terminal
        </span>
      </div>

      {/* Terminal Content */}
      <div className={cn(
        'p-4 font-mono text-sm space-y-2 min-h-[200px]',
        isDark ? 'text-gray-100' : 'text-gray-800'
      )}>
        {enhancedChildren}
      </div>
    </div>
  );
}

export function AnimatedSpan({
  children,
  className,
  delay = 0,
  startOnView = false,
  onComplete,
  shouldStart = true,
}: AnimatedSpanProps) {
  const [isVisible, setIsVisible] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!shouldStart) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      onComplete?.();
    }, delay + 300);

    return () => clearTimeout(timer);
  }, [shouldStart, delay, onComplete]);

  return (
    <span
      ref={spanRef}
      className={cn(
        'block transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1',
        className
      )}
    >
      {children}
    </span>
  );
}

export function TypingAnimation({
  children,
  className,
  duration = 60,
  delay = 0,
  as: Component = 'span',
  startOnView = true,
  onComplete,
  shouldStart = true,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!shouldStart) return;

    const startTimer = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [shouldStart, delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const text = children;
    
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        onComplete?.();
      }
    }, duration);

    return () => clearInterval(typingInterval);
  }, [started, children, duration, onComplete]);

  return React.createElement(
    Component,
    { className: cn('block', className) },
    <>
      <span className="text-emerald-400">{'>'}</span>{' '}
      {displayedText}
      {started && displayedText.length < children.length && (
        <span className="inline-block w-2 h-4 bg-current ml-0.5 animate-blink" />
      )}
    </>
  );
}

// Pre-styled command output components
export function CommandOutput({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('pl-4 text-gray-400', className)}>
      {children}
    </div>
  );
}

export function SuccessMessage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('text-emerald-400', className)}>
      ✔ {children}
    </span>
  );
}

export function ErrorMessage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('text-red-400', className)}>
      ✖ {children}
    </span>
  );
}

export function InfoMessage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('text-blue-400', className)}>
      ℹ {children}
    </span>
  );
}
