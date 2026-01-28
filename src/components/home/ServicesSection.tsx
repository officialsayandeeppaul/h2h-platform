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
          {/* Sports Rehabilitation */}
          <div className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid md:grid-cols-2">
              <div className="relative h-[200px] md:h-full">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop"
                  alt="Sports Rehabilitation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-transparent" />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full" />
                  <h3 className="text-[18px] font-medium text-gray-900">Sports Rehabilitation</h3>
                </div>
                <p className="text-[14px] text-gray-500 mb-4 leading-relaxed">
                  Get back to peak performance with specialized sports injury treatment and prevention programs.
                </p>
                <Link href="/services/sports-rehabilitation" className="text-[14px] font-medium text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Pain Management */}
          <div className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid md:grid-cols-2">
              <div className="relative h-[200px] md:h-full">
                <img
                  src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=400&fit=crop"
                  alt="Pain Management"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-transparent" />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-teal-500 rounded-full" />
                  <h3 className="text-[18px] font-medium text-gray-900">Pain Management</h3>
                </div>
                <p className="text-[14px] text-gray-500 mb-4 leading-relaxed">
                  Comprehensive pain relief and mobilization therapy for chronic and acute conditions.
                </p>
                <Link href="/services/pain-management" className="text-[14px] font-medium text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Physiotherapy */}
          <div className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid md:grid-cols-2">
              <div className="relative h-[200px] md:h-full">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=400&fit=crop"
                  alt="Physiotherapy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-transparent" />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full" />
                  <h3 className="text-[18px] font-medium text-gray-900">Physiotherapy</h3>
                </div>
                <p className="text-[14px] text-gray-500 mb-4 leading-relaxed">
                  Physical therapy for improved mobility, strength, and overall functional wellness.
                </p>
                <Link href="/services/physiotherapy" className="text-[14px] font-medium text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Home Visits */}
          <div className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="grid md:grid-cols-2">
              <div className="relative h-[200px] md:h-full">
                <img
                  src="https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=500&h=400&fit=crop"
                  alt="Home Visits"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-transparent" />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-teal-500 rounded-full" />
                  <h3 className="text-[18px] font-medium text-gray-900">Home Visits</h3>
                </div>
                <p className="text-[14px] text-gray-500 mb-4 leading-relaxed">
                  Professional physiotherapy services delivered to your doorstep for maximum comfort.
                </p>
                <Link href="/services/home-visits" className="text-[14px] font-medium text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
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
