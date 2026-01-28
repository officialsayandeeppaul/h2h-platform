'use client';

import { DotPattern } from "@/components/ui/backgrounds";
import { Counter } from './shared/Counter';
import { stats } from './data';

export function StatsSection() {
  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-teal-500 to-emerald-400',
    'from-emerald-500 to-teal-400',
    'from-cyan-500 to-blue-400'
  ];
  const shadows = [
    'shadow-blue-500/30',
    'shadow-teal-500/30',
    'shadow-emerald-500/30',
    'shadow-cyan-500/30'
  ];

  return (
    <section className="stats-section relative py-24 bg-gradient-to-b from-white to-blue-50/30 overflow-hidden">
      {/* Magic UI - Dot Pattern */}
      <DotPattern
        className="opacity-30 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        color="#94a3b8"
        cr={1.5}
      />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={stat.label} className="stat-card text-center group">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center shadow-xl ${shadows[index]} group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500`}>
                <stat.icon className="h-9 w-9 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-[48px] lg:text-[56px] font-light text-gray-900 mb-2 leading-none tracking-tight">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-[13px] text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
