'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: {
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

interface TawkToChatProps {
  propertyId?: string;
  widgetId?: string;
}

export function TawkToChat({ 
  propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID,
  widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID 
}: TawkToChatProps) {
  useEffect(() => {
    if (!propertyId || !widgetId) {
      console.warn('Tawk.to: Missing propertyId or widgetId');
      return;
    }

    if (typeof window !== 'undefined' && !window.Tawk_API) {
      window.Tawk_API = {};
      window.Tawk_LoadStart = new Date();

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      script.onerror = () => {
        console.warn('Tawk.to: Failed to load script');
      };

      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);

      return () => {
        const tawkScript = document.querySelector(`script[src*="embed.tawk.to"]`);
        if (tawkScript) {
          tawkScript.remove();
        }
      };
    }
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
