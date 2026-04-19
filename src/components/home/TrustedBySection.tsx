"use client";

import Image from "next/image";
import { DotPattern } from "@/components/ui/backgrounds";
import { trustedPartnerLogos } from "./data";

function LogoStrip({ idSuffix = "" }: { idSuffix?: string }) {
  return (
    <>
      {trustedPartnerLogos.map(({ src, alt }, i) => (
        <div
          key={`${src}-${i}${idSuffix}`}
          className="flex h-20 w-[140px] shrink-0 items-center justify-center px-2 md:h-24 md:w-[168px]"
        >
          <Image
            src={src}
            alt={idSuffix ? "" : alt}
            width={200}
            height={80}
            className="max-h-full max-w-full object-contain object-center"
            sizes="(max-width: 768px) 140px, 168px"
          />
        </div>
      ))}
    </>
  );
}

export function TrustedBySection() {
  return (
    <section className="group relative overflow-hidden bg-slate-50 py-12">
      <DotPattern
        className="opacity-30 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        color="#94a3b8"
        cr={1.5}
      />
      <div className="relative z-10 mx-auto mb-10 max-w-2xl px-6 text-center">
        <p className="text-[15px] leading-relaxed text-gray-600 md:text-[16px]">
          Logos represent leagues, clubs, and programmes we collaborate with for physiotherapy, rehab, and performance support.
        </p>
      </div>
      <div className="relative z-10 mx-auto max-w-[100vw]">
        <div className="overflow-hidden py-3">
          <div className="flex w-max animate-marquee-seamless [--marquee-duration:48s] motion-reduce:animate-none group-hover:[animation-play-state:paused]">
            <div className="flex items-center gap-10 md:gap-16 lg:gap-20 pr-10 md:pr-16">
              <LogoStrip />
            </div>
            <div
              className="flex items-center gap-10 md:gap-16 lg:gap-20 pr-10 md:pr-16"
              aria-hidden
            >
              <LogoStrip idSuffix="-b" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
