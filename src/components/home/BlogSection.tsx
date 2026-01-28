'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlogSection() {
  return (
    <section className="relative py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-4 leading-tight tracking-tight">
            Health{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">Insights</span>
          </h2>
          <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">
            Explore our gallery to learn more about health tips, recovery stories, and wellness advice.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Large Card - Left */}
          <Link href="/blog/physiotherapy-benefits" className="sm:col-span-2 group">
            <div className="relative h-[320px] rounded-2xl overflow-hidden bg-cyan-50 p-6 flex flex-col justify-between transition-all hover:shadow-lg">
              <div>
                <h3 className="text-[22px] font-medium text-gray-900 mb-3 leading-tight max-w-md">
                  How Physiotherapy Can Transform Your Daily Life
                </h3>
                <p className="text-[14px] text-gray-500 max-w-sm leading-relaxed">
                  A deep dive into how regular physiotherapy sessions can improve mobility, reduce pain, and enhance your quality of life.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-cyan-600 font-medium group-hover:gap-3 transition-all">
                Read More <ArrowRight className="h-4 w-4" />
              </div>
              {/* Decorative Image */}
              <div className="absolute bottom-0 right-0 w-48 h-48">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=300&fit=crop"
                  alt=""
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
            </div>
          </Link>

          {/* Small Card - Top Right */}
          <Link href="/blog/sports-injury-recovery" className="group">
            <div className="relative h-[320px] rounded-2xl overflow-hidden bg-teal-50 p-6 flex flex-col justify-between transition-all hover:shadow-lg">
              <div>
                <h3 className="text-[18px] font-medium text-gray-900 mb-2 leading-tight">
                  Sports Injury Recovery Guide
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  How we improved recovery time by 40% through specialized rehabilitation programs.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-teal-600 font-medium group-hover:gap-3 transition-all">
                Read More <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Small Card - Bottom Left */}
          <Link href="/blog/home-exercises" className="group">
            <div className="relative h-[280px] rounded-2xl overflow-hidden bg-orange-50 p-6 flex flex-col justify-between transition-all hover:shadow-lg">
              <div>
                <h3 className="text-[18px] font-medium text-gray-900 mb-2 leading-tight">
                  5 Home Exercises for Back Pain
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Simple exercises you can do at home to relieve back pain and improve posture.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-orange-600 font-medium group-hover:gap-3 transition-all">
                Read More <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Medium Card - Bottom Middle */}
          <Link href="/blog/cardiac-rehabilitation" className="group">
            <div className="relative h-[280px] rounded-2xl overflow-hidden bg-purple-50 p-6 flex flex-col justify-between transition-all hover:shadow-lg">
              <div>
                <h3 className="text-[18px] font-medium text-gray-900 mb-2 leading-tight">
                  Cardiac Rehabilitation: What to Expect
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  We reimagined cardiac care to make it faster to recover, easier to follow, and actually helpful.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-purple-600 font-medium group-hover:gap-3 transition-all">
                Read More <ArrowRight className="h-4 w-4" />
              </div>
              {/* Decorative */}
              <div className="absolute bottom-4 right-4">
                <img
                  src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=150&h=150&fit=crop"
                  alt=""
                  className="w-24 h-24 object-cover rounded-xl opacity-30"
                />
              </div>
            </div>
          </Link>

          {/* Small Card - Bottom Right */}
          <Link href="/blog/yoga-wellness" className="group">
            <div className="relative h-[280px] rounded-2xl overflow-hidden bg-green-50 p-6 flex flex-col justify-between transition-all hover:shadow-lg">
              <div>
                <h3 className="text-[18px] font-medium text-gray-900 mb-2 leading-tight">
                  Yoga & Wellness Tips
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Discover how yoga can complement your physiotherapy journey for holistic wellness.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-green-600 font-medium group-hover:gap-3 transition-all">
                Read More <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" className="h-11 px-8 rounded-full text-[14px] font-medium border-gray-300 hover:bg-gray-50" asChild>
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
