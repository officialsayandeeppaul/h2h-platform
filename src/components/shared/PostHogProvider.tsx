'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect, useState } from 'react';

function initPostHog() {
  if (
    typeof window === 'undefined' ||
    !process.env.NEXT_PUBLIC_POSTHOG_KEY ||
    posthog.__loaded
  ) {
    return;
  }
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: false,
    capture_pageleave: true,
    loaded: () => {
      /* keep quiet on load */
    },
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      initPostHog();
      setReady(true);
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('scroll', onInteract);
    };

    const onInteract = () => run();

    window.addEventListener('pointerdown', onInteract, { once: true, passive: true });
    window.addEventListener('scroll', onInteract, { once: true, passive: true });

    const idle =
      window.requestIdleCallback?.(() => run(), { timeout: 10000 }) ??
      window.setTimeout(run, 8000);

    return () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('scroll', onInteract);
      if (typeof idle === 'number') {
        window.cancelIdleCallback?.(idle);
        clearTimeout(idle);
      }
    };
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  // Don't wrap until init — avoids pulling analytics into critical path
  if (!ready) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.capture(eventName, properties);
    }
  };

  const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.identify(userId, properties);
    }
  };

  const resetUser = () => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.reset();
    }
  };

  return { trackEvent, identifyUser, resetUser };
}
