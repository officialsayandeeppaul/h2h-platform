'use client';

import { useEffect } from 'react';

/**
 * Next.js dev overlay treats console.error / some window errors as blocking.
 * Suppress known non-fatal third-party noise (Tawk i18next, WebGL).
 */
export function DevConsoleGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const forward = console.error.bind(console);
    console.error = (...args: unknown[]) => {
      const text = args
        .map((a) => (typeof a === 'string' ? a : a instanceof Error ? a.message : String(a ?? '')))
        .join(' ');
      if (
        /THREE\.WebGLRenderer|Error creating WebGL context|WebGL context could not be created|BindToCurrentSequence failed|\$_Tawk|i18next is not a function|embed\.tawk\.to|twk-chunk/i.test(
          text
        )
      ) {
        return;
      }
      forward(...args);
    };

    const onError = (event: ErrorEvent) => {
      const msg = `${event.message ?? ''} ${event.filename ?? ''}`;
      if (/\$_Tawk|i18next is not a function|embed\.tawk\.to|twk-chunk/i.test(msg)) {
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
            ? reason.message
            : String(reason ?? '');
      if (/\$_Tawk|i18next is not a function|embed\.tawk\.to/i.test(msg)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener('error', onError, true);
    window.addEventListener('unhandledrejection', onRejection, true);

    return () => {
      console.error = forward;
      window.removeEventListener('error', onError, true);
      window.removeEventListener('unhandledrejection', onRejection, true);
    };
  }, []);

  return null;
}
