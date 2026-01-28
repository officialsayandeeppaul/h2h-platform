'use client';

import { Marquee } from "@/components/ui/magic-components";
import { trustedTeams } from './data';

export function TrustedBySection() {
  return (
    <section className="py-16 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <p className="text-center text-[13px] text-gray-500 mb-8">Trusted by leading teams</p>
      </div>
      <Marquee pauseOnHover className="[--duration:40s] [--gap:4rem]">
        {trustedTeams.map((name, i) => (
          <span
            key={i}
            className="text-[18px] font-medium text-gray-400 hover:text-gray-600 transition-colors duration-300 whitespace-nowrap"
          >
            {name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
