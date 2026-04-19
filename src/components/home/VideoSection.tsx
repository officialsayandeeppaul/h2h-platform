'use client';

import { CheckCircle2, Play, Sparkles, Users, Award } from "lucide-react";
import { DotPattern } from "@/components/ui/backgrounds";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { MARKETING_IMAGES } from "@/constants/marketing-images";
import { loreleiAvatars } from './data';

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
            Recovery,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">explained clearly</span>
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
              See how H2H Healthcare{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">supports recovery</span>
            </h2>
            <p className="text-base text-[15px] text-gray-600 mb-8 leading-relaxed max-w-md">
              Physiotherapy, sports rehab, and pain care—with straightforward booking and clinicians who explain your plan in plain language.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <AvatarCircles
                numPeople={100}
                avatarUrls={loreleiAvatars}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Patients &amp; athletes</p>
                <p className="text-xs text-gray-500">From everyday pain to return-to-sport</p>
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
                mp4Src="https://videos.pexels.com/video-files/5319980/5319980-sd_540_960_25fps.mp4"
                thumbnailSrc={MARKETING_IMAGES.physio}
                thumbnailAlt="Physiotherapy and rehabilitation care at H2H Healthcare"
                className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg"
              />
              
              {/* Floating stats - visible on all screens */}
              <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-4 bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-100 z-10 max-w-[130px]">
                <p className="text-[11px] sm:text-xs font-semibold text-gray-900 leading-snug">Your plan, your pace</p>
                <p className="text-[10px] text-emerald-600 mt-1">No confusing jargon</p>
              </div>
              <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-4 bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-100 z-10 max-w-[130px]">
                <p className="text-[11px] sm:text-xs font-semibold text-gray-900 leading-snug">Specialist network</p>
                <p className="text-[10px] text-blue-600 mt-1">Physios &amp; doctors</p>
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
