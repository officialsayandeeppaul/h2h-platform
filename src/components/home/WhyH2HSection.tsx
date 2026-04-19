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
            Less hassle.<br />
            More time for healing.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-[15px] font-medium text-white mb-3">Booking that actually works</h3>
            <p className="text-[15px] text-gray-400 leading-relaxed">
              Finding the right specialist, slot, and location shouldn&apos;t feel like a project. H2H brings{' '}
              <span className="text-gray-300 underline decoration-dotted">physio, rehab, and pain care</span>{' '}
              into one clear path—so you spend less time coordinating and more time getting better.
            </p>
          </div>

          <div>
            <h3 className="text-[15px] font-medium text-white mb-3">Absolute Performance for academies</h3>
            <p className="text-[15px] text-gray-400 leading-relaxed">
              For federations and academies we embed screening, on-field cover, profiling, and injury-prevention workflows—so
              medical, coaching, and S&amp;C share one playbook instead of three different stories.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 pt-8 border-t border-gray-800/50">
          <div>
            <p className="text-[15px] font-medium text-white mb-1">Nationwide booking</p>
            <p className="text-[13px] text-gray-500">Serve patients and teams across major Indian cities—expand as we grow.</p>
          </div>
          <div>
            <p className="text-[15px] font-medium text-white mb-1">Clinical depth</p>
            <p className="text-[13px] text-gray-500">Physios and doctors with elite sport and everyday rehab experience.</p>
          </div>
          <div>
            <p className="text-[15px] font-medium text-white mb-1">Transparent care</p>
            <p className="text-[13px] text-gray-500">Plans you can follow; pricing and next steps without surprises.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
