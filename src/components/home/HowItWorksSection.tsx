'use client';

import dynamic from "next/dynamic";
import { ClipboardList, CalendarClock, Stethoscope } from "lucide-react";
import { Highlighter } from "@/components/ui/highlighter";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

const Terminal = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.Terminal })), { ssr: false });
const AnimatedSpan = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.AnimatedSpan })), { ssr: false });
const SuccessMessage = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.SuccessMessage })), { ssr: false });
const InfoMessage = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.InfoMessage })), { ssr: false });
const TerminalTyping = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.TypingAnimation })), { ssr: false });

const CARE_STEPS = [
  {
    n: 1,
    title: "Choose what you need",
    desc: "Service + location—so we match the right clinician.",
    Icon: ClipboardList,
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/25",
  },
  {
    n: 2,
    title: "Pick a time that works",
    desc: "Real-time slots; same-day when capacity allows.",
    Icon: CalendarClock,
    gradient: "from-teal-500 to-emerald-500",
    shadow: "shadow-teal-500/25",
  },
  {
    n: 3,
    title: "Start your plan",
    desc: "Session notes, exercises, and follow-up in one place.",
    Icon: Stethoscope,
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/25",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <InteractiveGridPattern
        className="opacity-30 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        width={50}
        height={50}
        squares={[30, 20]}
        squaresClassName="fill-cyan-400/20 hover:fill-cyan-500/40"
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-6 leading-tight tracking-tight">
              Book Your Session in{' '}
              <Highlighter action="underline" color="#06b6d4" strokeWidth={2.5} animationDuration={700} isView>
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">3 Simple Steps</span>
              </Highlighter>
            </h2>

            <p className="text-[15px] text-gray-500 mb-10 leading-relaxed">
              Pick a service, choose a slot, get confirmation—no phone tag unless you want it.
            </p>

            <div className="space-y-6">
              {CARE_STEPS.map(({ n, title, desc, Icon, gradient, shadow }) => (
                <div key={n} className="flex items-start gap-4 group">
                  <div
                    className={`relative w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg ${shadow} group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} aria-hidden />
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/95 px-1 text-[10px] font-bold text-gray-800 shadow-sm">
                      {n}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-gray-900 mb-1">{title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
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
              <AnimatedSpan className="text-gray-400 pl-4">👨‍⚕️ Clinician: Assigned physiotherapist</AnimatedSpan>
              <AnimatedSpan className="text-gray-400 pl-4">📍 Location: Your selected centre / online</AnimatedSpan>
              <AnimatedSpan><SuccessMessage>Confirmation sent to your email & phone!</SuccessMessage></AnimatedSpan>
            </Terminal>
          </div>
        </div>
      </div>
    </section>
  );
}
