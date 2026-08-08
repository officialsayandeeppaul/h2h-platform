'use client';

import { useEffect } from 'react';

/**
 * Lightweight homepage runtime — native scroll (no Lenis lag),
 * fast once-reveals, pause offscreen loops.
 */
export function HomeMotionRuntime() {
  useEffect(() => {
    const root = document.getElementById('main-content');
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const watched = new WeakSet<Element>();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const onScreen = entry.isIntersecting;

          el.classList.toggle('home-offscreen', !onScreen);

          if (onScreen && !el.classList.contains('home-in')) {
            el.classList.add('home-in');
          }
        }
      },
      // Reveal slightly before section hits center so it doesn't feel late
      { rootMargin: '20% 0px 0px 0px', threshold: 0.01 }
    );

    const attach = () => {
      root.querySelectorAll<HTMLElement>('[data-home-section]').forEach((node) => {
        if (watched.has(node)) return;
        watched.add(node);

        if (node.dataset.homeReveal === 'instant' || prefersReduced) {
          node.classList.add('home-in');
          node.classList.remove('home-offscreen');
        } else {
          node.classList.add('home-reveal');
          const rect = node.getBoundingClientRect();
          if (rect.top < window.innerHeight + 80 && rect.bottom > -40) {
            node.classList.add('home-in');
          } else {
            node.classList.add('home-offscreen');
          }
        }

        revealObserver.observe(node);
      });
    };

    attach();
    const mo = new MutationObserver(() => attach());
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  return null;
}
