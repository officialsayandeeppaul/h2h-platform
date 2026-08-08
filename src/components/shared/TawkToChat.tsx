'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Tawk_API?: {
      customStyle?: unknown;
      onLoad?: () => void;
      hideWidget?: () => void;
      showWidget?: () => void;
      toggle?: () => void;
      popup?: () => void;
      maximize?: () => void;
      minimize?: () => void;
      setAttributes?: (attributes: Record<string, string>, callback?: () => void) => void;
      addEvent?: (event: string, metadata: Record<string, string>, callback?: () => void) => void;
    };
    Tawk_LoadStart?: Date;
  }
}

/** Load only after engagement — never on idle (keeps Lighthouse clean). */
const TAWK_AFTER_INTERACT_MS = 2000;

function isTawkNoise(text: string): boolean {
  return /embed\.tawk\.to|twk-chunk|twk-vendor|\$_Tawk|i18next is not a function/i.test(text);
}

function isBenignWebGlNoise(text: string): boolean {
  return /THREE\.WebGLRenderer|Error creating WebGL context|WebGL context could not be created/i.test(
    text
  );
}

/** Swallow Tawk/WebGL noise before Next.js turns it into a full-screen overlay. */
function installGlobalNoiseFilters(): () => void {
  const onError = (event: ErrorEvent) => {
    const msg = `${event.message ?? ''} ${event.filename ?? ''}`;
    if (isTawkNoise(msg) || isBenignWebGlNoise(msg)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  const onRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const msg =
      typeof reason === 'string'
        ? reason
        : reason instanceof Error
          ? `${reason.message} ${reason.stack ?? ''}`
          : String(reason ?? '');
    if (isTawkNoise(msg) || isBenignWebGlNoise(msg)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  window.addEventListener('error', onError, true);
  window.addEventListener('unhandledrejection', onRejection, true);

  return () => {
    window.removeEventListener('error', onError, true);
    window.removeEventListener('unhandledrejection', onRejection, true);
  };
}

function ensureTawkApiPreload(): void {
  window.Tawk_API = window.Tawk_API ?? {};
  window.Tawk_API.customStyle = {
    visibility: {
      desktop: { position: 'br' as const, xOffset: 15, yOffset: 15 },
      mobile: { position: 'br' as const, xOffset: 10, yOffset: 10 },
    },
  };
  window.Tawk_LoadStart = new Date();
}

interface TawkToChatProps {
  propertyId?: string;
  widgetId?: string;
}

export function TawkToChat({
  propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID,
  widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID,
}: TawkToChatProps) {
  const injectedRef = useRef(false);

  useEffect(() => {
    const removeFilters = installGlobalNoiseFilters();

    // Tawk's bundle throws $_Tawk.i18next in some Next/React/dev setups — skip embed locally.
    if (process.env.NODE_ENV === 'development') {
      return () => removeFilters();
    }

    if (!propertyId || !widgetId) return () => removeFilters();

    const embedSrc = `https://embed.tawk.to/${propertyId}/${widgetId}`;

    const inject = () => {
      if (injectedRef.current || document.querySelector(`script[src="${embedSrc}"]`)) {
        injectedRef.current = true;
        return;
      }
      try {
        ensureTawkApiPreload();
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = embedSrc;
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');
        script.onerror = () => {
          /* network failure — non-fatal */
        };
        document.body.appendChild(script);
        injectedRef.current = true;
      } catch {
        /* ignore */
      }
    };

    const onInteract = () => {
      cleanupTriggers();
      window.setTimeout(inject, TAWK_AFTER_INTERACT_MS);
    };

    const cleanupTriggers = () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('scroll', onInteract);
    };

    window.addEventListener('pointerdown', onInteract, { once: true, passive: true });
    window.addEventListener('keydown', onInteract, { once: true });
    window.addEventListener('scroll', onInteract, { once: true, passive: true });

    return () => {
      removeFilters();
      cleanupTriggers();
    };
  }, [propertyId, widgetId]);

  return null;
}

export function useTawkTo() {
  const showWidget = () => window.Tawk_API?.showWidget?.();
  const hideWidget = () => window.Tawk_API?.hideWidget?.();
  const toggleWidget = () => window.Tawk_API?.toggle?.();
  const openChat = () => window.Tawk_API?.maximize?.();
  const setUserAttributes = (attributes: Record<string, string>) => {
    window.Tawk_API?.setAttributes?.(attributes);
  };
  const trackEvent = (event: string, metadata: Record<string, string>) => {
    window.Tawk_API?.addEvent?.(event, metadata);
  };

  return { showWidget, hideWidget, toggleWidget, openChat, setUserAttributes, trackEvent };
}
