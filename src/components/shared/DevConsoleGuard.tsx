'use client';

import { useEffect } from 'react';

/**
 * Next.js dev overlay treats console.error as a blocking "runtime error".
 * GPU/WebGL failures on some Windows setups are non-fatal for the app UI —
 * suppress only those known benign messages in development.
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
        /THREE\.WebGLRenderer|Error creating WebGL context|WebGL context could not be created|BindToCurrentSequence failed/i.test(
          text
        )
      ) {
        return;
      }
      forward(...args);
    };

    return () => {
      console.error = forward;
    };
  }, []);

  return null;
}
