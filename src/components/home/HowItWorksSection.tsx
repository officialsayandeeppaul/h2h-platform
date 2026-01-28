'use client';

import dynamic from "next/dynamic";
import { Highlighter } from "@/components/ui/highlighter";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

const Terminal = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.Terminal })), { ssr: false });
const AnimatedSpan = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.AnimatedSpan })), { ssr: false });
const SuccessMessage = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.SuccessMessage })), { ssr: false });
const InfoMessage = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.InfoMessage })), { ssr: false });
const TerminalTyping = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.TypingAnimation })), { ssr: false });

export function HowItWorksSection() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Interactive Grid Pattern Background */}
      <InteractiveGridPattern
        className="opacity-30 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        width={50}
        height={50}
        squares={[30, 20]}
        squaresClassName="fill-cyan-400/20 hover:fill-cyan-500/40"
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-6 leading-tight tracking-tight">
              Book Your Session in{' '}
              <Highlighter action="underline" color="#06b6d4" strokeWidth={2.5} animationDuration={700} isView>
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">3 Simple Steps</span>
              </Highlighter>
            </h2>

            <p className="text-[15px] text-gray-500 mb-10 leading-relaxed">
              Our{' '}
              <Highlighter action="highlight" color="#dbeafe" animationDuration={600} isView>
                <span className="text-blue-600 font-medium">streamlined booking process</span>
              </Highlighter>
              {' '}gets you from pain to recovery faster than ever. No complicated forms, no waiting - just quick, easy access to{' '}
              <Highlighter action="highlight" color="#ccfbf1" animationDuration={600} isView>
                <span className="text-cyan-600 font-medium">world-class care</span>
              </Highlighter>.
            </p>

            {/* Steps */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">1</div>
                <div>
                  <h3 className="text-[15px] font-medium text-gray-900 mb-1">Choose Your Service</h3>
                  <p className="text-[13px] text-gray-500">Select from our range of specialized treatments</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform">2</div>
                <div>
                  <h3 className="text-[15px] font-medium text-gray-900 mb-1">Pick Your Slot</h3>
                  <p className="text-[13px] text-gray-500">Choose a convenient time that works for you</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">3</div>
                <div>
                  <h3 className="text-[15px] font-medium text-gray-900 mb-1">Start Recovery</h3>
                  <p className="text-[13px] text-gray-500">Meet your expert and begin your healing journey</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Terminal */}
          <div className="relative">
            {/* Glow effect behind terminal */}
            <div className="absolute -inset-4 bg-gradient-to-br from-cyan-200/50 to-blue-200/50 rounded-3xl blur-2xl" />

            <Terminal theme="dark" className="relative">
              <TerminalTyping duration={50}>h2h book --service &quot;Sports Rehab&quot;</TerminalTyping>
              <AnimatedSpan><SuccessMessage>Service selected: Sports Rehabilitation</SuccessMessage></AnimatedSpan>
              <AnimatedSpan><InfoMessage>Finding available slots...</InfoMessage></AnimatedSpan>
              <AnimatedSpan className="text-gray-400 pl-4">Available: Tomorrow 10:00 AM, 2:00 PM, 5:00 PM</AnimatedSpan>
              <TerminalTyping duration={50}>h2h confirm --slot &quot;10:00 AM&quot;</TerminalTyping>
              <AnimatedSpan><SuccessMessage>Appointment confirmed!</SuccessMessage></AnimatedSpan>
              <AnimatedSpan className="text-gray-400 pl-4">📅 Date: Tomorrow</AnimatedSpan>
              <AnimatedSpan className="text-gray-400 pl-4">⏰ Time: 10:00 AM</AnimatedSpan>
              <AnimatedSpan className="text-gray-400 pl-4">👨‍⚕️ Doctor: Dr. Rajesh Kumar</AnimatedSpan>
              <AnimatedSpan className="text-gray-400 pl-4">📍 Location: H2H Mumbai Center</AnimatedSpan>
              <AnimatedSpan><SuccessMessage>Confirmation sent to your email & phone!</SuccessMessage></AnimatedSpan>
            </Terminal>
          </div>
        </div>
      </div>
    </section>
  );
}
