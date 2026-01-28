'use client';

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { treatmentSteps, timeSlots } from './data';

const ClientCalendar = dynamic(() => import("@/components/ui/client-calendar").then(mod => ({ default: mod.ClientCalendar })), { ssr: false });

export function TreatmentProcessSection() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Interactive Grid Pattern Background */}
      <InteractiveGridPattern
        className="text-cyan-400/20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        width={60}
        height={60}
        squares={[25, 15]}
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Steps */}
          <div>
            <h2 className="text-[32px] font-semibold text-gray-900 leading-tight mb-3">
              Your Path to{' '}
              <Highlighter action="circle" color="#06b6d4" strokeWidth={2} animationDuration={800} isView>
                <span className="text-cyan-600">Recovery</span>
              </Highlighter>
            </h2>
            <p className="text-[15px] text-gray-500 mb-10">
              A proven{' '}
              <Highlighter action="highlight" color="#dbeafe" animationDuration={600} isView>
                <span className="text-blue-600 font-medium">4-step approach</span>
              </Highlighter>
              {' '}designed for lasting results
            </p>

            <div className="grid grid-cols-2 gap-4">
              {treatmentSteps.map((item) => (
                <div key={item.step} className="group p-5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all duration-300">
                  <div className={`w-8 h-8 rounded-lg bg-${item.color}-100 flex items-center justify-center mb-3`}>
                    <span className={`text-[12px] font-bold text-${item.color}-600`}>{item.step}</span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button size="lg" className="h-12 px-8 text-[14px] font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600" asChild>
                <Link href="/booking">
                  Start Your Recovery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Calendar with Date & Time Selection */}
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[16px] font-semibold text-gray-900">Book Appointment</h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">Select your preferred date & time</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc1&backgroundColor=b6e3f4" alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                    <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc2&backgroundColor=c0aede" alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                    <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc3&backgroundColor=ffd5dc" alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                  </div>
                  <span className="text-[11px] font-medium text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">1K+ Docs</span>
                </div>
              </div>

              <ClientCalendar
                className="rounded-xl border border-gray-100 p-3"
              />

              {/* Time Slots */}
              <div className="mt-5">
                <p className="text-[12px] font-medium text-gray-700 mb-3">Available Time Slots</p>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time, i) => (
                    <button key={time} className={`py-2 px-3 rounded-lg text-[11px] font-medium transition-all ${i === 1 ? 'bg-cyan-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 border border-gray-100'}`}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[12px] text-gray-500">50+ slots available today</span>
                  </div>
                  <Button size="sm" className="h-9 px-4 text-[12px] bg-gray-900 hover:bg-gray-800">
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
