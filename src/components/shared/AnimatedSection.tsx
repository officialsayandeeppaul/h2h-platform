'use client';

import { useEffect, useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'stagger';
  delay?: number;
  duration?: number;
}

export function AnimatedSection({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.45,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let gsapInstance: typeof import('gsap').gsap;
    let ScrollTriggerPlugin: typeof import('gsap/ScrollTrigger').ScrollTrigger;

    const initAnimation = async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      
      gsapInstance = gsapModule.gsap;
      ScrollTriggerPlugin = scrollTriggerModule.ScrollTrigger;
      
      gsapInstance.registerPlugin(ScrollTriggerPlugin);

      const animations: Record<string, gsap.TweenVars> = {
        fadeUp: { y: 28, opacity: 0 },
        fadeIn: { opacity: 0 },
        slideLeft: { x: -40, opacity: 0 },
        slideRight: { x: 40, opacity: 0 },
        scale: { scale: 0.94, opacity: 0 },
        stagger: { y: 20, opacity: 0 },
      };

      gsapInstance.set(element, animations[animation]);

      gsapInstance.to(element, {
        y: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        duration,
        delay,
        ease: 'power2.out',
        force3D: true,
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    };

    initAnimation();

    return () => {
      if (ScrollTriggerPlugin) {
        ScrollTriggerPlugin.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, [animation, delay, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function AnimatedText({
  children,
  className = '',
  as: Component = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const initAnimation = async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      
      const gsapInstance = gsapModule.gsap;
      gsapInstance.registerPlugin(scrollTriggerModule.ScrollTrigger);

      gsapInstance.fromTo(
        element,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
          },
        }
      );
    };

    initAnimation();
  }, []);

  return (
    <Component ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </Component>
  );
}

export function StaggerChildren({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const childElements = element.children;

    const initAnimation = async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      
      const gsapInstance = gsapModule.gsap;
      gsapInstance.registerPlugin(scrollTriggerModule.ScrollTrigger);

      gsapInstance.fromTo(
        childElements,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          stagger: Math.min(staggerDelay, 0.06),
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
          },
        }
      );
    };

    initAnimation();
  }, [staggerDelay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
