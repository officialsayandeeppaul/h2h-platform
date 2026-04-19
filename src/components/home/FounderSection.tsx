'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FounderSection() {
  return (
    <section className="relative py-28 bg-gray-950 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.06),transparent_50%)]" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Quote */}
          <div>
            <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-6 leading-tight tracking-tight">
              Stadium-grade rehab,{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">at your doorstep</span>
            </h2>

            <div className="space-y-4">
              <p className="text-[15px] leading-relaxed text-gray-300">
                H2H is built on one idea: the same rigour we bring to elite athletes should guide every recovery plan — clear, disciplined, and honest.
              </p>
              <p className="text-[14px] leading-relaxed italic text-gray-400 border-l-2 border-cyan-500/50 pl-4">
                &ldquo;You don&apos;t need a perfect start — you need direction, discipline, and the courage to begin.&rdquo;
              </p>
            </div>

            <div className="mt-10">
              <Button size="lg" className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 font-[family-name:var(--font-poppins)]" asChild>
                <Link href="/about">
                  Learn Our Story
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Founder Image with Floating Badges */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative">
              {/* Decorative gradient glow behind */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl" />

              {/* Image — mobile: show full portrait (contain); sm+: cover + focal shift */}
              <div className="relative w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 aspect-[4/5] min-h-[280px] max-sm:min-h-[300px] max-sm:max-h-[min(72vh,520px)] sm:aspect-[3/4] sm:min-h-[420px] sm:max-h-[560px]">
                <Image
                  src="/founders-image--4k.png"
                  alt="Dr. Sukdeb Mahanta — Founder, H2H Healthcare"
                  fill
                  className="object-contain object-top sm:object-cover sm:object-[center_22%]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 480px"
                  priority={false}
                />
                {/* Gradient overlay — lighter mid-tone on mobile so the face stays visible */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/25 to-transparent max-sm:via-gray-950/15 sm:via-gray-950/40" />

                {/* Name overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950/95 to-transparent p-4 pt-10 sm:p-6 sm:pt-12">
                  <h3 className="text-[18px] font-medium text-white mb-1">Dr. Sukdeb Mahanta</h3>
                  <p className="text-[14px] text-cyan-400">Founder · High-Performance Director, H2H Healthcare</p>
                </div>
              </div>

              {/* Floating Badge - Top Right */}
              <div className="absolute right-2 top-2 flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900/90 px-3 py-1.5 backdrop-blur-sm sm:-right-2 sm:-top-2 sm:px-4 sm:py-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[12px] font-medium text-white sm:text-[13px]">Verified Expert</span>
              </div>

              {/* Floating Badge - Left Side */}
              <div className="absolute left-2 top-[22%] max-w-[calc(100%-1rem)] rounded-xl border border-gray-700 bg-gray-900/90 px-3 py-2 backdrop-blur-sm sm:-left-4 sm:top-1/4 sm:max-w-none sm:px-4 sm:py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Award className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-white sm:text-[13px]">17+ Years</p>
                    <p className="text-[10px] text-gray-500 sm:text-[11px]">Elite sport medicine</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge - Right Side */}
              <div className="absolute right-2 top-[42%] max-w-[calc(100%-1rem)] rounded-xl border border-gray-700 bg-gray-900/90 px-3 py-2 backdrop-blur-sm sm:-right-4 sm:top-1/2 sm:max-w-none sm:px-4 sm:py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-white sm:text-[13px]">Pro & national</p>
                    <p className="text-[10px] text-gray-500 sm:text-[11px]">Squads & franchises</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge - Bottom Left */}
              <div className="absolute bottom-24 left-2 max-w-[calc(100%-1rem)] rounded-xl border border-gray-700 bg-gray-900/90 px-3 py-2 backdrop-blur-sm sm:bottom-20 sm:-left-4 sm:max-w-none sm:px-4 sm:py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white">50+ experts</p>
                    <p className="text-[11px] text-gray-500">Programs led</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
