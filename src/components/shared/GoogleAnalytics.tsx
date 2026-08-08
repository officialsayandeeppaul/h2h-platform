'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

/** Gate GA behind first interaction so it never blocks Lighthouse/TBT on cold load. */
export function GoogleAnalytics() {
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    if (!GA_ID || GA_ID.length < 10) return;

    const enable = () => setAllow(true);
    window.addEventListener('pointerdown', enable, { once: true, passive: true });
    window.addEventListener('scroll', enable, { once: true, passive: true });
    window.addEventListener('keydown', enable, { once: true });

    return () => {
      window.removeEventListener('pointerdown', enable);
      window.removeEventListener('scroll', enable);
      window.removeEventListener('keydown', enable);
    };
  }, []);

  if (!GA_ID || GA_ID.length < 10 || !allow) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
