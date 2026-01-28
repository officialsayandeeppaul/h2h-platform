'use client';

import { Activity, Heart, MapPin } from "lucide-react";
import { Highlighter } from "@/components/ui/highlighter";
import { AnimatedList } from "@/components/ui/animated-list";
import { features } from './data';
import CardSwap, { Card } from "@/components/ui/card-swap";

export function FeaturesSection() {
  const borderColors = ['border-l-cyan-500', 'border-l-teal-500', 'border-l-blue-500', 'border-l-emerald-500'];

  return (
    <section
      className="features-section relative py-24 overflow-hidden"
      style={{
        background: `linear-gradient(to right, rgba(15, 23, 42, 0.97) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(15, 23, 42, 0.7) 100%), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
      }}
    >
      {/* Subtle gradient blobs */}
      <div className="absolute top-20 left-10 md:left-20 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-gradient-to-br from-cyan-500/10 to-teal-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 md:right-20 w-[175px] md:w-[350px] h-[175px] md:h-[350px] bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-full blur-[100px]" />

      {/* CardSwap Container - positioned at bottom right - hidden on mobile/tablet */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden xl:block">
        <div className="relative w-full h-full pointer-events-auto">
          <CardSwap
            width={600}
            height={400}
            cardDistance={65}
            verticalDistance={75}
            delay={5000}
            pauseOnHover
            skewAmount={6}
            easing="elastic"
          >
            {/* Card 1 - Sports Rehabilitation */}
            <Card className="p-8 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-gray-700/50 shadow-2xl shadow-blue-500/20 rounded-2xl">
              <div className="h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <h3 className="text-[20px] font-semibold text-white">Sports Rehabilitation</h3>
                    <p className="text-[14px] text-gray-400">Peak performance recovery</p>
                  </div>
                </div>
                <p className="text-[15px] text-gray-300 mb-6 leading-relaxed">Get back to peak performance with specialized care from our expert sports physiotherapists.</p>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[28px] font-bold text-cyan-400">40%</p>
                    <p className="text-[12px] text-gray-500">Faster Recovery</p>
                  </div>
                  <div className="h-12 w-px bg-gray-700" />
                  <div>
                    <p className="text-[28px] font-bold text-cyan-400">500+</p>
                    <p className="text-[12px] text-gray-500">Athletes Treated</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card 2 - Pain Management */}
            <Card className="p-8 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-gray-700/50 shadow-2xl shadow-teal-500/20 rounded-2xl">
              <div className="h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <h3 className="text-[20px] font-semibold text-white">Pain Management</h3>
                    <p className="text-[14px] text-gray-400">Chronic pain relief</p>
                  </div>
                </div>
                <p className="text-[15px] text-gray-300 mb-6 leading-relaxed">Long-term relief from chronic back & joint pain with evidence-based treatment protocols.</p>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[28px] font-bold text-teal-400">98%</p>
                    <p className="text-[12px] text-gray-500">Pain Reduction</p>
                  </div>
                  <div className="h-12 w-px bg-gray-700" />
                  <div>
                    <p className="text-[28px] font-bold text-teal-400">10K+</p>
                    <p className="text-[12px] text-gray-500">Happy Patients</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card 3 - Home Physiotherapy */}
            <Card className="p-8 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-gray-700/50 shadow-2xl shadow-emerald-500/20 rounded-2xl">
              <div className="h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <h3 className="text-[20px] font-semibold text-white">Home Physiotherapy</h3>
                    <p className="text-[14px] text-gray-400">Care at your doorstep</p>
                  </div>
                </div>
                <p className="text-[15px] text-gray-300 mb-6 leading-relaxed">Expert care at your doorstep with no travel hassle. We come to you for your convenience.</p>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[28px] font-bold text-blue-400">8+</p>
                    <p className="text-[12px] text-gray-500">Cities Covered</p>
                  </div>
                  <div className="h-12 w-px bg-gray-700" />
                  <div>
                    <p className="text-[28px] font-bold text-blue-400">Free</p>
                    <p className="text-[12px] text-gray-500">First Consult</p>
                  </div>
                </div>
              </div>
            </Card>
          </CardSwap>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-md">
          <h2 className="text-[32px] md:text-[40px] font-medium text-cyan-400 mb-6 leading-tight tracking-tight">
            Your Recovery,{' '}
            <Highlighter action="highlight" color="#06b6d4" strokeWidth={2} animationDuration={800} isView>
              <span className="text-white">Our Priority</span>
            </Highlighter>
          </h2>

          <p className="text-[15px] text-gray-400 mb-8 leading-relaxed">
            We combine cutting-edge technology with compassionate care to deliver exceptional physiotherapy services tailored to your unique needs.
          </p>

          <AnimatedList delay={800} className="gap-4">
            {features.map((feature, index) => (
              <div key={feature.title} className={`pl-4 border-l-2 ${borderColors[index]}`}>
                <h3 className="text-[15px] font-medium text-white mb-1">{feature.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </AnimatedList>
        </div>
      </div>
    </section>
  );
}
