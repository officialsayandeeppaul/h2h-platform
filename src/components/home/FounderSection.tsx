'use client';

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
              Your Health,{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Not Just A Service</span>
            </h2>

            <div className="space-y-5">
              <p className="text-[15px] leading-relaxed text-gray-300">
                &ldquo;I started H2H Healthcare with a simple belief: everyone deserves access to world-class physiotherapy and rehabilitation, regardless of where they live.&rdquo;
              </p>
              <p className="text-[14px] leading-relaxed text-gray-400">
                After seeing countless athletes and patients struggle to find quality care, I knew there had to be a better way. Today, we&apos;ve helped over 10,000 patients recover faster and live better.
              </p>
              <p className="text-[14px] leading-relaxed italic text-gray-500 border-l-2 border-cyan-500/50 pl-4">
                &ldquo;You don&apos;t need a perfect background to build a great future. You just need direction, discipline, and the courage to start.&rdquo;
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

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=700&fit=crop&crop=face"
                  alt="Dr. Founder - H2H Healthcare"
                  className="w-full h-[500px] object-cover object-top"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                {/* Name overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-[18px] font-medium text-white mb-1">Dr. Rajesh Kumar</h3>
                  <p className="text-[14px] text-cyan-400">Founder & CEO, H2H Healthcare</p>
                </div>
              </div>

              {/* Floating Badge - Top Right */}
              <div className="absolute -top-2 -right-2 flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[13px] font-medium text-white">Verified Expert</span>
              </div>

              {/* Floating Badge - Left Side */}
              <div className="absolute top-1/4 -left-4 bg-gray-900/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Award className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white">15+ Years</p>
                    <p className="text-[11px] text-gray-500">Experience</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge - Right Side */}
              <div className="absolute top-1/2 -right-4 bg-gray-900/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white">IPL Team</p>
                    <p className="text-[11px] text-gray-500">Official Physio</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge - Bottom Left */}
              <div className="absolute bottom-20 -left-4 bg-gray-900/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white">10,000+</p>
                    <p className="text-[11px] text-gray-500">Patients Treated</p>
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
