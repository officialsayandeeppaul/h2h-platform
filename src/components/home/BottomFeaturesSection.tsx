'use client';

export function BottomFeaturesSection() {
  return (
    <section className="relative py-16 bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(20,184,166,0.05),transparent_50%)]" />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-[14px] font-medium text-white mb-2">WAI-ARIA compliant</h4>
            <p className="text-[13px] text-gray-400 leading-relaxed">H2H Healthcare follows the WAI-ARIA guidelines, implementing correct semantics and behaviors for our services.</p>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-[14px] font-medium text-white mb-2">Mobile booking</h4>
            <p className="text-[13px] text-gray-400 leading-relaxed">Book appointments from anywhere with our mobile-first platform where users can schedule using any device.</p>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h4 className="text-[14px] font-medium text-white mb-2">Focus management</h4>
            <p className="text-[13px] text-gray-400 leading-relaxed">Out of the box, H2H provides sensible focus management defaults, which can be further customized.</p>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-[14px] font-medium text-white mb-2">Screen reader tested</h4>
            <p className="text-[13px] text-gray-400 leading-relaxed">We test H2H with common assistive technologies, looking out for practical issues that people may experience.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
