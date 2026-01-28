'use client';

export function WhyH2HSection() {
  return (
    <section className="relative py-24 bg-gray-950 overflow-hidden">
      {/* H2H Theme Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.05),transparent_50%)]" />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
        {/* Header - Exact Radix style */}
        <div className="mb-12">
          <p className="text-[13px] text-cyan-400 mb-3">Why H2H Healthcare</p>
          <h2 className="text-[32px] md:text-[40px] font-medium text-white leading-tight tracking-tight">
            Spend less time on<br />
            undifferentiated work
          </h2>
        </div>

        {/* Two Column Content - Exact Radix layout */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-[15px] font-medium text-white mb-3">Save time. Ship faster.</h3>
            <p className="text-[15px] text-gray-400 leading-relaxed">
              It takes a <span className="text-gray-300 underline decoration-dotted">lot</span> of time to develop and maintain a robust set of healthcare services, and it&apos;s mostly undifferentiated work. Building on top of H2H Healthcare will save you time and money, so you can ship a better product faster.
            </p>
          </div>

          <div>
            <h3 className="text-[15px] font-medium text-white mb-3">Focus on your recovery</h3>
            <p className="text-[15px] text-gray-400 leading-relaxed">
              It&apos;s no secret that robust healthcare services are tricky to find. Nailing accessibility details and complex logistics sucks time away from your recovery. With H2H, you can focus on your unique health challenges instead.
            </p>
          </div>
        </div>

        {/* Large Stats Row - Exact Radix style */}
        <div className="flex flex-wrap gap-12 md:gap-20 items-end pt-8 border-t border-gray-800/50">
          <div>
            <p className="text-[72px] md:text-[96px] font-light text-white leading-none tracking-tight">10K+</p>
            <p className="text-[13px] text-gray-500 mt-2">Patients treated</p>
          </div>
          <div>
            <p className="text-[72px] md:text-[96px] font-light text-white leading-none tracking-tight">98%</p>
            <p className="text-[13px] text-gray-500 mt-2">Success rate</p>
          </div>
          <div>
            <p className="text-[72px] md:text-[96px] font-light text-white leading-none tracking-tight">50+</p>
            <p className="text-[13px] text-gray-500 mt-2">Expert doctors</p>
          </div>
        </div>
      </div>
    </section>
  );
}
