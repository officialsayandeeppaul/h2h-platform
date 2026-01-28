'use client';

export function CaseStudiesSection() {
  return (
    <section className="relative py-20 bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06),transparent_60%)]" />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
        {/* Header - Exact Radix style */}
        <div className="mb-10">
          <p className="text-[13px] text-cyan-400 mb-3">Case studies</p>
          <h2 className="text-[28px] md:text-[32px] font-medium text-white leading-tight">
            World-class teams use H2H Healthcare<br />
            <span className="text-gray-500">to power their recovery</span>
          </h2>
        </div>

        {/* Testimonial Cards - Exact Radix style */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {/* Card 1 */}
          <div className="bg-gray-900/60 backdrop-blur rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[18px] font-semibold text-white tracking-tight">Mumbai Indians</span>
            </div>
            <p className="text-[14px] text-gray-400 leading-relaxed mb-5">
              &ldquo;H2H Healthcare has been instrumental in keeping our players at peak performance. Their physiotherapy team understands the demands of professional cricket and delivers exceptional care that helps our athletes recover faster.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                <span className="text-[11px] text-white font-medium">RK</span>
              </div>
              <div>
                <p className="text-[13px] text-white">Dr. Rajesh Kumar</p>
                <p className="text-[12px] text-gray-500">Team Physiotherapist</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-900/60 backdrop-blur rounded-xl p-6 border border-gray-700/50 hover:border-teal-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[18px] font-semibold text-white tracking-tight">Sports Academy</span>
            </div>
            <p className="text-[14px] text-gray-400 leading-relaxed mb-5">
              &ldquo;We&apos;ve been able to focus on training our athletes while H2H handles all rehabilitation needs. Their home visit service is a game-changer for busy training schedules.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <span className="text-[11px] text-white font-medium">PS</span>
              </div>
              <div>
                <p className="text-[13px] text-white">Priya Sharma</p>
                <p className="text-[12px] text-gray-500">Head Coach</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Logos Row - Exact Radix style */}
        <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-8">
          <span>And dozens more companies</span>
          <span>→</span>
        </div>

        {/* Company Logos - Exact Radix style */}
        <div className="flex flex-wrap items-center gap-8 text-gray-500">
          <span className="text-[14px] font-medium">Chennai Super Kings</span>
          <span className="text-[14px] font-medium">Royal Challengers</span>
          <span className="text-[14px] font-medium">Delhi Capitals</span>
          <span className="text-[14px] font-medium">Kolkata Knight Riders</span>
          <span className="text-[14px] font-medium">Punjab Kings</span>
        </div>
      </div>
    </section>
  );
}
