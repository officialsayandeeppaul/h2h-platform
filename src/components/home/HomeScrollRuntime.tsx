'use client';

import { useEffect } from 'react';

/**
 * Production scroll runtime: pause decorative animations offscreen
 * so the main thread stays free while scrolling.
 * Observes new sections as they hydrate (below-fold code splits).
 */
export function HomeScrollRuntime() {
  useEffect(() => {
    const root = document.getElementById('main-content');
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('home-offscreen', !entry.isIntersecting);
        }
      },
      { rootMargin: '280px 0px', threshold: 0 }
    );

    const watched = new WeakSet<Element>();

    const attach = () => {
      root.querySelectorAll<HTMLElement>('[data-home-section]').forEach((node) => {
        if (watched.has(node)) return;
        watched.add(node);
        node.classList.add('home-offscreen');
        observer.observe(node);
      });
    };

    attach();

    const mo = new MutationObserver(() => attach());
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
