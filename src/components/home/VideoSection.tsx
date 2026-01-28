'use client';

import dynamic from "next/dynamic";
import { CheckCircle2, Play, Sparkles, Users, Award } from "lucide-react";
import { loreleiAvatars } from './data';

// These components use browser APIs - must be client-only
const DotPattern = dynamic(() => import("@/components/ui/backgrounds").then(m => ({ default: m.DotPattern })), { ssr: false });
const AvatarCircles = dynamic(() => import("@/components/ui/avatar-circles").then(m => ({ default: m.AvatarCircles })), { ssr: false });
const HeroVideoDialog = dynamic(() => import("@/components/ui/hero-video-dialog").then(mod => ({ default: mod.HeroVideoDialog })), { ssr: false });

export function VideoSection() {
  return (
    <section className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
      <DotPattern className="opacity-[0.07]" color="#3b82f6" cr={1} />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header - Mobile First */}
        <div className="text-center mb-10 sm:mb-16 lg:hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <Play className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Watch Our Story</span>
          </div>
          <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-3 leading-tight">
            Transforming Lives Through{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Expert Care</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left - Content (Hidden on mobile, shown on lg) */}
          <div className="hidden lg:block order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Watch Our Story</span>
            </div>
            
            <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-6 leading-[1.15] tracking-tight">
              Discover how H2H Healthcare is{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">transforming lives</span>
            </h2>
            <p className="text-base text-[15px] text-gray-600 mb-8 leading-relaxed max-w-md">
              Experience world-class physiotherapy and rehabilitation services designed to help you achieve your health goals faster.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <AvatarCircles
                numPeople={1000}
                avatarUrls={loreleiAvatars}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">10,000+ Happy Patients</p>
                <p className="text-xs text-gray-500">Join our growing family</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Expert Care</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-cyan-50">
                <Users className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-medium text-cyan-700">Home Visits</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Certified</span>
              </div>
            </div>
          </div>

          {/* Right - Video */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Clean video container - no box styling */}
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ"
                thumbnailSrc="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop"
                thumbnailAlt="H2H Healthcare Video"
                className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg"
              />
              
              {/* Floating stats - visible on all screens */}
              <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-4 bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-100 z-10">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">98%</p>
                <p className="text-[10px] sm:text-xs text-emerald-600 font-semibold">Success Rate</p>
              </div>
              <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-4 bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-100 z-10">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">50+</p>
                <p className="text-[10px] sm:text-xs text-blue-600 font-semibold">Expert Doctors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-8 lg:hidden">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Expert Care</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100">
            <Users className="w-3.5 h-3.5 text-cyan-600" />
            <span className="text-xs font-medium text-cyan-700">Home Visits</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">Certified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
