'use client';

import dynamic from "next/dynamic";
import { CheckCircle2 } from "lucide-react";
import { loreleiAvatars } from './data';

// Lazy load heavy components
const DotPattern = dynamic(() => import("@/components/ui/backgrounds").then(m => ({ default: m.DotPattern })), { ssr: false });
const AvatarCircles = dynamic(() => import("@/components/ui/avatar-circles").then(m => ({ default: m.AvatarCircles })), { ssr: false });
const HeroVideoDialog = dynamic(() => import("@/components/ui/hero-video-dialog").then(mod => ({ default: mod.HeroVideoDialog })), { ssr: false });

export function VideoSection() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <DotPattern className="opacity-10" color="#94a3b8" cr={1} />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-6 leading-tight tracking-tight">
              Discover how H2H Healthcare is{' '}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">transforming lives</span>
            </h2>
            <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
              Discover how H2H Healthcare is transforming lives through personalized physiotherapy and rehabilitation services.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <AvatarCircles
                numPeople={1000}
                avatarUrls={loreleiAvatars}
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 font-[family-name:var(--font-poppins)]">Happy Patients</p>
                <p className="text-xs text-gray-500 font-[family-name:var(--font-poppins)]">Join our growing family</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 font-[family-name:var(--font-poppins)]">Expert Care</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-medium text-cyan-700 font-[family-name:var(--font-poppins)]">Home Visits</span>
              </div>
            </div>
          </div>

          {/* Right - Video */}
          <div>
            <HeroVideoDialog
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ"
              thumbnailSrc="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop"
              thumbnailAlt="H2H Healthcare Video"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
