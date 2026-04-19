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

const TAWK_DEFER_MS = 5000;

function isTawkEmbedUrl(url: string | undefined): boolean {
  return !!url && url.includes('embed.tawk.to');
}

/** Official pattern: `var Tawk_API=Tawk_API||{}` — merge into existing, never replace mid-flight. */
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
  widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID 
}: TawkToChatProps) {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!propertyId || !widgetId) {
      console.warn('Tawk.to: Missing propertyId or widgetId');
      return;
    }

    const embedSrc = `https://embed.tawk.to/${propertyId}/${widgetId}`;

    // Avoid Next dev overlay on rare third-party runtime errors inside Tawk's bundle.
    const onError = (event: ErrorEvent) => {
      const msg = event.message ?? '';
      const fromTawk =
        isTawkEmbedUrl(event.filename) ||
        /\$_Tawk|embed\.tawk\.to/i.test(msg);
      if (fromTawk) {
        event.stopImmediatePropagation();
        if (process.env.NODE_ENV === 'development') {
          console.warn('Tawk.to: suppressed script error (non-fatal)', msg);
        }
      }
    };
    window.addEventListener('error', onError, true);

    const timer = window.setTimeout(() => {
      if (typeof window === 'undefined') return;

      if (injectedRef.current || document.querySelector(`script[src="${embedSrc}"]`)) {
        injectedRef.current = true;
        return;
      }

      try {
        ensureTawkApiPreload();

        const script = document.createElement('script');
        script.async = true;
        script.src = embedSrc;
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');

        script.onerror = () => {
          console.warn('Tawk.to: Failed to load script');
        };

        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode?.insertBefore(script, firstScript);
        injectedRef.current = true;
      } catch (e) {
        console.warn('Tawk.to: Failed to inject script', e);
      }
    }, TAWK_DEFER_MS);

    return () => {
      window.removeEventListener('error', onError, true);
      window.clearTimeout(timer);
      // Do not remove the embed script on unmount: tearing it down mid-init corrupts Tawk's
      // internal state and can throw (e.g. i18next / $_Tawk). The widget is session-scoped.
    };
  }, [propertyId, widgetId]);

  return null;
}

export function useTawkTo() {
  const showWidget = () => {
    if (window.Tawk_API?.showWidget) {
      window.Tawk_API.showWidget();
    }
  };

  const hideWidget = () => {
    if (window.Tawk_API?.hideWidget) {
      window.Tawk_API.hideWidget();
    }
  };

  const toggleWidget = () => {
    if (window.Tawk_API?.toggle) {
      window.Tawk_API.toggle();
    }
  };

  const openChat = () => {
    if (window.Tawk_API?.maximize) {
      window.Tawk_API.maximize();
    }
  };

  const setUserAttributes = (attributes: Record<string, string>) => {
    if (window.Tawk_API?.setAttributes) {
      window.Tawk_API.setAttributes(attributes);
    }
  };

  const trackEvent = (event: string, metadata: Record<string, string>) => {
    if (window.Tawk_API?.addEvent) {
      window.Tawk_API.addEvent(event, metadata);
    }
  };

  return {
    showWidget,
    hideWidget,
    toggleWidget,
    openChat,
    setUserAttributes,
    trackEvent,
  };
}
