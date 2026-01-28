'use client';

import dynamic from "next/dynamic";
import { mapMarkers } from './data';

const DottedMap = dynamic(() => import("@/components/ui/dotted-map").then(mod => ({ default: mod.DottedMap })), { ssr: false });

export function GlobalReachSection() {
  return (
    <section className="relative py-28 bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
          <p className="text-[13px] text-cyan-400 mb-3">Proudly Indian, Globally Expanding</p>
          <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-4 leading-tight tracking-tight">
            From India to the{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">World</span>
          </h2>
          <p className="text-[15px] text-gray-400 max-w-2xl mx-auto">
            Born in India, built for the world. Our healthcare solutions are expanding globally while staying rooted in Indian innovation.
          </p>
        </div>

        <div className="relative h-[500px] rounded-3xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/80" />
          <DottedMap
            dotRadius={0.22}
            markerColor="#22d3ee"
            className="text-gray-500"
            markers={mapMarkers}
          />

          {/* Floating stats */}
          <div className="absolute top-6 left-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
            <p className="text-[24px] font-semibold text-cyan-400">🇮🇳</p>
            <p className="text-[11px] text-gray-400 mt-1">Indian Origin</p>
          </div>
          <div className="absolute top-6 right-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
            <p className="text-[20px] font-medium text-teal-400">10+</p>
            <p className="text-[11px] text-gray-400">Countries Soon</p>
          </div>
          <div className="absolute bottom-6 left-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
            <p className="text-[20px] font-medium text-cyan-400">50+</p>
            <p className="text-[11px] text-gray-400">Service Centers</p>
          </div>
          <div className="absolute bottom-6 right-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
            <p className="text-[20px] font-medium text-emerald-400">1M+</p>
            <p className="text-[11px] text-gray-400">Lives Impacted</p>
          </div>
        </div>
      </div>
    </section>
  );
}
