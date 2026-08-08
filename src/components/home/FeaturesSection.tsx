'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { features } from './data';
import { MARKETING_IMAGES } from '@/constants/marketing-images';

const CardSwap = dynamic(
  () => import('@/components/ui/card-swap').then((mod) => ({ default: mod.default })),
  { ssr: false }
);
const Card = dynamic(
  () => import('@/components/ui/card-swap').then((mod) => ({ default: mod.Card })),
  { ssr: false }
);

/** Doctor/telehealth backdrop + XL card swap when in view. */
export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mountSwap, setMountSwap] = useState(false);
  const borderColors = ['border-l-cyan-500', 'border-l-teal-500', 'border-l-blue-500', 'border-l-emerald-500'];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (!window.matchMedia('(min-width: 1280px)').matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMountSwap(true);
          io.disconnect();
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="features-section relative overflow-hidden bg-slate-950 py-24 min-h-[520px]"
    >
      {/* Doctor backdrop — visible on the right; text stays readable on the left */}
      <div className="absolute inset-0 z-0">
        <Image
          src={MARKETING_IMAGES.telehealth}
          alt="Clinician providing care"
          fill
          sizes="(max-width: 1024px) 100vw, 70vw"
          quality={75}
          className="object-cover object-[72%_center] sm:object-[80%_center]"
          priority={false}
        />
        {/* Soft left veil — keep doctor visible on the right */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950 from-0% via-slate-950/80 via-35% to-slate-950/15 to-100%"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/15"
          aria-hidden
        />
      </div>

      {mountSwap && (
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none hidden xl:block">
          <div className="relative w-full h-full pointer-events-auto">
            <CardSwap
              width={600}
              height={400}
              cardDistance={55}
              verticalDistance={65}
              delay={2800}
              pauseOnHover
              skewAmount={4}
              easing="linear"
            >
              <Card className="p-8 bg-gradient-to-br from-gray-900/95 to-gray-950/95 border-gray-700/50 rounded-2xl">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-[20px] font-semibold text-white">Sports Rehabilitation</h3>
                  <p className="text-[14px] text-gray-400 mb-4">Peak performance recovery</p>
                  <p className="text-[15px] text-gray-300 mb-6 leading-relaxed">
                    Return-to-sport planning with physios who understand training loads and match schedules.
                  </p>
                  <div className="flex flex-wrap gap-3 text-[13px]">
                    <span className="rounded-lg border border-cyan-500/30 px-3 py-2 text-cyan-200">Load management</span>
                    <span className="rounded-lg border border-cyan-500/30 px-3 py-2 text-cyan-200">On-field readiness</span>
                  </div>
                </div>
              </Card>
              <Card className="p-8 bg-gradient-to-br from-gray-900/95 to-gray-950/95 border-gray-700/50 rounded-2xl">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-[20px] font-semibold text-white">Pain Management</h3>
                  <p className="text-[14px] text-gray-400 mb-4">Chronic pain relief</p>
                  <p className="text-[15px] text-gray-300 mb-6 leading-relaxed">
                    Back, neck, and joint programmes built on assessment—not one-size tape-and-exercise routines.
                  </p>
                  <div className="flex flex-wrap gap-3 text-[13px]">
                    <span className="rounded-lg border border-teal-500/30 px-3 py-2 text-teal-200">Hands-on therapy</span>
                    <span className="rounded-lg border border-teal-500/30 px-3 py-2 text-teal-200">Home exercise plan</span>
                  </div>
                </div>
              </Card>
              <Card className="p-8 bg-gradient-to-br from-gray-900/95 to-gray-950/95 border-gray-700/50 rounded-2xl">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-[20px] font-semibold text-white">Home Physiotherapy</h3>
                  <p className="text-[14px] text-gray-400 mb-4">Care at your doorstep</p>
                  <p className="text-[15px] text-gray-300 mb-6 leading-relaxed">
                    Physio at home when available in your city—fewer travel days, same clinical standards.
                  </p>
                  <div className="flex flex-wrap gap-3 text-[13px]">
                    <span className="rounded-lg border border-blue-500/30 px-3 py-2 text-blue-200">Check coverage</span>
                    <span className="rounded-lg border border-blue-500/30 px-3 py-2 text-blue-200">Same specialists</span>
                  </div>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-md">
          <h2 className="text-[32px] md:text-[40px] font-medium text-cyan-400 mb-6 leading-tight tracking-tight">
            Your Recovery,{' '}
            <span className="text-white underline decoration-cyan-500/50 decoration-2 underline-offset-4">
              Our Priority
            </span>
          </h2>

          <p className="text-[15px] text-gray-400 mb-8 leading-relaxed">
            Simple booking, clear plans, and clinicians who speak plain language—whether you&apos;re an athlete or managing everyday pain.
          </p>

          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <div key={feature.title} className={`pl-4 border-l-2 ${borderColors[index]}`}>
                <h3 className="text-[15px] font-medium text-white mb-1">{feature.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
