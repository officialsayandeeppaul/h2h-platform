'use client';

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { cities, globePositions } from './data';

const ShimmerButton = dynamic(() => import("@/components/ui/magic-components").then(mod => ({ default: mod.ShimmerButton })), { ssr: false });
const Meteors = dynamic(() => import("@/components/ui/magic-components").then(mod => ({ default: mod.Meteors })), { ssr: false });
const Particles = dynamic(() => import("@/components/ui/magic-components").then(mod => ({ default: mod.Particles })), { ssr: false });

export function LocationsSection() {
  return (
    <section className="relative py-28 bg-gray-950 overflow-hidden">
      {/* Meteors Effect */}
      <Meteors number={15} />

      {/* Particles */}
      <Particles quantity={30} color="#3b82f6" />

      {/* Gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-6 leading-tight tracking-tight">
              Available Across{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                8+ Cities
              </span>
            </h2>
            <p className="text-[15px] text-gray-400 mb-10">
              From metros to tier-2 cities, we&apos;re bringing world-class healthcare closer to you.
            </p>

            {/* City tags - Dark theme */}
            <div className="flex flex-wrap gap-3 mb-10">
              {cities.map((city) => (
                <span
                  key={city}
                  className="px-4 py-2 bg-gray-800/50 backdrop-blur rounded-full border border-gray-700 text-[13px] font-medium text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 cursor-pointer"
                >
                  {city}
                </span>
              ))}
            </div>

            <ShimmerButton
              className="h-14 px-10 text-base font-semibold"
              background="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
              shimmerColor="#ffffff"
            >
              <Link href="/locations" className="flex items-center">
                Find Nearest Center
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </ShimmerButton>
          </div>

          {/* Enhanced Globe - Dark Theme */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* Outer glow ring */}
            <div className="absolute w-[400px] h-[400px] rounded-full border border-blue-500/20 animate-pulse" />
            <div className="absolute w-[350px] h-[350px] rounded-full border border-cyan-500/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute w-[300px] h-[300px] rounded-full border border-teal-500/20 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Globe sphere */}
            <div className="relative w-[280px] h-[280px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/40 via-cyan-500/30 to-teal-500/40 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-500/30 via-transparent to-cyan-500/30" />
              <div className="absolute inset-8 rounded-full bg-gray-900/80 backdrop-blur-xl border border-blue-500/20" />

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[48px] font-light text-white">8+</p>
                  <p className="text-[13px] text-cyan-400">Cities</p>
                </div>
              </div>

              {/* Orbiting dots - pre-calculated positions to avoid hydration mismatch */}
              {globePositions.map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse"
                  style={{
                    top: `${pos.top}%`,
                    left: `${pos.left}%`,
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>

            {/* Floating stat cards - Dark theme */}
            <div className="absolute top-8 right-8 bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700">
              <p className="text-[20px] font-medium text-white">10K+</p>
              <p className="text-[11px] text-gray-500">Patients Served</p>
            </div>
            <div className="absolute bottom-8 left-8 bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700">
              <p className="text-[20px] font-medium text-white">50+</p>
              <p className="text-[11px] text-gray-500">Expert Doctors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
