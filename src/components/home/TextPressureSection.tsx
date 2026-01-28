'use client';

import dynamic from "next/dynamic";

const TextPressure = dynamic(() => import("@/components/ui/text-pressure"), { ssr: false });
const Particles = dynamic(() => import("@/components/ui/magic-components").then(mod => ({ default: mod.Particles })), { ssr: false });

export function TextPressureSection() {
  return (
    <section className="relative py-28 bg-gray-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1),transparent_60%)]" />
      <Particles quantity={20} color="#06b6d4" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Pressure Interactive */}
          <div className="relative h-[300px] md:h-[400px]">
            <TextPressure
              text="HEAL"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#06b6d4"
              minFontSize={48}
            />
          </div>

          {/* Right - Content */}
          <div>
            <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-6 leading-tight tracking-tight">
              Your Health is{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Priceless</span>
            </h2>
            <p className="text-[15px] text-gray-400 mb-8 leading-relaxed">
              At H2H Healthcare, we believe that quality healthcare should be accessible to everyone. Our mission is to bring world-class physiotherapy and rehabilitation services right to your doorstep.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-5 border border-gray-800">
                <p className="text-[24px] font-medium text-cyan-400 mb-1">100%</p>
                <p className="text-[13px] text-gray-500">Patient Satisfaction</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-5 border border-gray-800">
                <p className="text-[24px] font-medium text-teal-400 mb-1">Zero</p>
                <p className="text-[13px] text-gray-500">Hidden Charges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
