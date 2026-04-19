'use client';

import Link from "next/link";
import dynamic from "next/dynamic";
import { APP_CONFIG } from "@/constants/config";

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
            <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-cyan-400 mb-3">
              Physical fitness → Active sports
            </p>
            <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-5 leading-tight tracking-tight">
              H2H{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Absolute Performance
              </span>
            </h2>
            <p className="text-[15px] text-gray-400 mb-4 leading-relaxed">
              <strong className="text-gray-300">H2H Absolute Performance</strong> is our sports-science lab: screening, injury rehab,
              performance support, nutrition guidance, and coaching—built for serious athletes and serious organisations.
            </p>
            <p className="text-[14px] text-gray-500 mb-8 leading-relaxed">
              We help academies and teams run structured programmes—so training loads, medical cover, and return-to-play decisions stay aligned instead of improvised.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/60 backdrop-blur rounded-xl p-5 border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
                <p className="text-[20px] font-medium text-cyan-400 mb-1">Screening</p>
                <p className="text-[13px] text-gray-500 leading-snug">MSK, psychological & nutritional profiling and programme management</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur rounded-xl p-5 border border-gray-700/50 hover:border-teal-500/30 transition-colors">
                <p className="text-[20px] font-medium text-teal-400 mb-1">On-field</p>
                <p className="text-[13px] text-gray-500 leading-snug">Medical support, posture, emergency care & quarterly fitness profiling</p>
              </div>
            </div>
            <p className="mt-6 text-[13px] text-gray-500">
              Sports academies &amp; performance programmes:{' '}
              <Link
                href={`mailto:${APP_CONFIG.performanceEmail}`}
                className="text-cyan-400 hover:text-cyan-300 underline-offset-2 hover:underline"
              >
                {APP_CONFIG.performanceEmail}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
