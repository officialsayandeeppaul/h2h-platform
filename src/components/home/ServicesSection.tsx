'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";

export function ServicesSection() {
  return (
    <section className="relative py-16 md:py-28 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-4 leading-tight tracking-tight">
            Comprehensive{' '}
            <Highlighter action="box" color="#06b6d4" strokeWidth={2} animationDuration={1000} isView>
              <span className="text-cyan-600">Services</span>
            </Highlighter>
          </h2>
          <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">
            Quality healthcare services designed around your needs
          </p>
        </div>

        {/* Services Grid - Clean Professional Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Pain Relief & Physiotherapy Care */}
          <div className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid md:grid-cols-2">
              <div className="relative h-[200px] md:h-full">
                <img
                  src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=400&fit=crop"
                  alt="Pain Relief & Physiotherapy Care"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-transparent" />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full" />
                  <h3 className="text-[18px] font-medium text-gray-900">Pain Relief & Physiotherapy</h3>
                </div>
                <p className="text-[14px] text-gray-500 mb-4 leading-relaxed">
                  Comprehensive pain relief and mobilization therapy for chronic and acute conditions.
                </p>
                <Link href="/services/pain_relief_physiotherapy" className="text-[14px] font-medium text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Advanced Rehabilitation & Recovery */}
          <div className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid md:grid-cols-2">
              <div className="relative h-[200px] md:h-full">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=400&fit=crop"
                  alt="Advanced Rehabilitation & Recovery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-transparent" />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-teal-500 rounded-full" />
                  <h3 className="text-[18px] font-medium text-gray-900">Advanced Rehabilitation</h3>
                </div>
                <p className="text-[14px] text-gray-500 mb-4 leading-relaxed">
                  Ortho, Neuro & Post-surgical rehabilitation for complete recovery.
                </p>
                <Link href="/services/advanced_rehabilitation" className="text-[14px] font-medium text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sports Performance & Athlete Development */}
          <div className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid md:grid-cols-2">
              <div className="relative h-[200px] md:h-full">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop"
                  alt="Sports Performance & Athlete Development"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-transparent" />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full" />
                  <h3 className="text-[18px] font-medium text-gray-900">Sports Performance</h3>
                </div>
                <p className="text-[14px] text-gray-500 mb-4 leading-relaxed">
                  Integrated sports performance analysis, injury prevention, and athletic training.
                </p>
                <Link href="/services/sports_performance" className="text-[14px] font-medium text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Therapeutic Yoga & Wellness */}
          <div className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid md:grid-cols-2">
              <div className="relative h-[200px] md:h-full">
                <img
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=400&fit=crop"
                  alt="Therapeutic Yoga & Wellness"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-transparent" />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-teal-500 rounded-full" />
                  <h3 className="text-[18px] font-medium text-gray-900">Therapeutic Yoga</h3>
                </div>
                <p className="text-[14px] text-gray-500 mb-4 leading-relaxed">
                  Yoga sessions designed for healing, rehabilitation, and mind-body wellness.
                </p>
                <Link href="/services/therapeutic_yoga" className="text-[14px] font-medium text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* View All Services Button */}
        <div className="text-center mt-12">
          <Button
            className="h-12 px-8 text-[14px] font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-full"
            asChild
          >
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
