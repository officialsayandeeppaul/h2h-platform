'use client';

import { DottedMap } from '@/components/ui/dotted-map';
import { mapMarkers } from './data';

/** India clinic network only — avoids implying overseas offices before they exist. */
const INDIA_MARKERS = mapMarkers.filter((m) => m.lng >= 68 && m.lng <= 98 && m.lat >= 8 && m.lat <= 37);

export function GlobalReachSection() {
  return (
    <section className="relative py-28 bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
          <p className="text-[13px] text-cyan-400 mb-3">Proudly Indian, growing nationwide</p>
          <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-4 leading-tight tracking-tight">
            A care network{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">across India</span>
          </h2>
          <p className="text-[15px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            India-first: physio, sports rehab, and pain programmes with consistent clinical standards and booking you can actually finish online.
          </p>
        </div>

        <div className="relative h-[420px] md:h-[500px] rounded-3xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 via-cyan-950/15 to-gray-950 shadow-xl shadow-black/40">
          {/* Always-visible base so the panel never reads as an empty box while the SVG paints */}
          <div
            className="absolute inset-0 opacity-90"
            aria-hidden
          >
            <DottedMap
              dotRadius={0.28}
              markerColor="#22d3ee"
              className="text-gray-600/90"
              markers={INDIA_MARKERS}
              mapSamples={2000}
              width={160}
              height={80}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/85" />

          <div className="absolute top-6 left-6 z-[1] max-w-[140px] rounded-2xl border border-gray-700/50 bg-gray-900/90 p-4 backdrop-blur-xl">
            <p className="text-[22px] font-semibold leading-none text-cyan-400">🇮🇳</p>
            <p className="mt-2 text-[12px] font-medium text-white">Rooted in India</p>
            {/* <p className="text-[11px] text-gray-400">National operations &amp; care standards</p> */}
          </div>
          <div className="absolute top-6 right-6 z-[1] max-w-[140px] rounded-2xl border border-gray-700/50 bg-gray-900/90 p-4 backdrop-blur-xl text-right">
            <p className="text-[14px] font-semibold text-teal-400 leading-tight">Metro &amp; tier-1</p>
            <p className="text-[12px] font-medium text-white">Coverage</p>
          </div>
          <div className="absolute bottom-6 left-6 z-[1] max-w-[140px] rounded-2xl border border-gray-700/50 bg-gray-900/90 p-4 backdrop-blur-xl">
            <p className="text-[14px] font-semibold text-cyan-400 leading-tight">Specialists</p>
            <p className="text-[12px] font-medium text-white">On platform</p>
          </div>
          <div className="absolute bottom-6 right-6 z-[1] max-w-[140px] rounded-2xl border border-gray-700/50 bg-gray-900/90 p-4 backdrop-blur-xl text-right">
            <p className="text-[14px] font-semibold text-emerald-400 leading-tight">Growing</p>
            <p className="text-[12px] font-medium text-white">Patient base</p>
          </div>
        </div>
      </div>
    </section>
  );
}
