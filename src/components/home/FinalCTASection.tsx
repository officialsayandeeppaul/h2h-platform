'use client';

import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RetroGrid } from "@/components/ui/backgrounds";
import { APP_CONFIG } from "@/constants/config";

export function FinalCTASection() {
  return (
    <section className="relative py-32 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 overflow-hidden">
      {/* RetroGrid Background */}
      <RetroGrid className="opacity-30" />

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />

      <div className="final-cta max-w-[1200px] mx-auto px-6 lg:px-12 text-center relative z-10">
        <h2 className="text-[36px] md:text-[48px] font-medium text-white mb-6 leading-tight tracking-tight">
          Ready to Transform<br />Your Health?
        </h2>
        <p className="text-[16px] text-white/80 mb-12 max-w-2xl mx-auto">
          Join 10,000+ patients who achieved their health goals with H2H Healthcare. Book your appointment today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="h-14 px-10 text-base font-bold bg-white text-blue-600 hover:bg-gray-100 shadow-xl shadow-black/10 font-[family-name:var(--font-poppins)]" asChild>
            <Link href="/booking">
              Book Appointment
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-10 text-base font-bold bg-transparent text-white border-2 border-white/50 hover:bg-white/10 hover:border-white font-[family-name:var(--font-poppins)]" asChild>
            <Link href={`tel:${APP_CONFIG.phone}`}>
              <Phone className="mr-2 h-5 w-5" />
              {APP_CONFIG.phone}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
