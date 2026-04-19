'use client';

export function CaseStudiesSection() {
  return (
    <section className="relative py-20 bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06),transparent_60%)]" />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-10">
          <p className="text-[13px] text-cyan-400 mb-3">Partners &amp; programmes</p>
          <h2 className="text-[28px] md:text-[32px] font-medium text-white leading-tight">
            Trusted for sport and everyday rehab<br />
            <span className="text-gray-500">without the fluff</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <div className="bg-gray-900/60 backdrop-blur rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
            <p className="text-[12px] font-medium uppercase tracking-wide text-cyan-400/90 mb-3">Performance environment</p>
            <p className="text-[14px] text-gray-400 leading-relaxed mb-5">
              &ldquo;We needed physio coverage that understood match-week load—not generic clinic handouts. H2H aligned
              treatment with how our athletes actually train.&rdquo;
            </p>
            <div className="text-[13px] text-white">Head of performance</div>
            <div className="text-[12px] text-gray-500">Multi-sport training centre (India)</div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur rounded-xl p-6 border border-gray-700/50 hover:border-teal-500/30 transition-colors">
            <p className="text-[12px] font-medium uppercase tracking-wide text-teal-400/90 mb-3">Academy pathway</p>
            <p className="text-[14px] text-gray-400 leading-relaxed mb-5">
              &ldquo;Home visits and clear communication meant parents and coaches stayed on the same page. Fewer
              no-shows, faster return-to-play after niggles.&rdquo;
            </p>
            <div className="text-[13px] text-white">Programme director</div>
            <div className="text-[12px] text-gray-500">Regional sports academy</div>
          </div>
        </div>

        <p className="text-[13px] text-gray-500 max-w-2xl">
          We work across cricket, football, hockey, and Olympic disciplines—wherever teams need structured medical and
          rehab support. Quotes are representative; we&apos;ll share relevant references when you enquire for B2B programmes.
        </p>
      </div>
    </section>
  );
}
