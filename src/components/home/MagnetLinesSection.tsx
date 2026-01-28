'use client';

import dynamic from "next/dynamic";

const MagnetLines = dynamic(() => import("@/components/ui/magnet-lines"), { ssr: false });

export function MagnetLinesSection() {
  return (
    <section className="relative py-28 bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_60%)]" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <MagnetLines
              rows={7}
              columns={7}
              containerSize="min(350px, 70vmin)"
              lineColor="#06b6d4"
              lineWidth="0.6vmin"
              lineHeight="4vmin"
              baseAngle={0}
            />
          </div>

          <div>
            <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-6 leading-tight tracking-tight">
              Treatment plans that{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">adapt to you</span>
            </h2>
            <p className="text-[15px] text-gray-400 mb-8 leading-relaxed">
              Just like these magnetic lines respond to your movement, our treatment plans adapt to your unique needs.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/60 backdrop-blur rounded-xl p-5 border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
                <p className="text-[24px] font-medium text-cyan-400 mb-1">AI</p>
                <p className="text-[13px] text-gray-500">Powered Diagnostics</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur rounded-xl p-5 border border-gray-700/50 hover:border-teal-500/30 transition-colors">
                <p className="text-[24px] font-medium text-teal-400 mb-1">Real-time</p>
                <p className="text-[13px] text-gray-500">Progress Tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
