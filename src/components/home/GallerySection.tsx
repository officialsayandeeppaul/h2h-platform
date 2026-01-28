'use client';

import dynamic from "next/dynamic";
import { DotPattern } from "@/components/ui/backgrounds";
import { galleryItems } from './data';

const Masonry = dynamic(() => import("@/components/ui/masonry"), { ssr: false });

export function GallerySection() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <DotPattern className="opacity-15" color="#94a3b8" cr={1} />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-4 leading-tight tracking-tight">
            Our{' '}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Facilities</span>
          </h2>
          <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">
            State-of-the-art equipment and comfortable spaces designed for your recovery
          </p>
        </div>

        <Masonry
          items={galleryItems}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.98}
          blurToFocus={false}
          colorShiftOnHover={false}
          gap={16}
        />
      </div>
    </section>
  );
}
