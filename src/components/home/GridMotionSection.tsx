'use client';

import GridMotion from "@/components/ui/grid-motion";

/** All assets under public/our-excellence — grid cycles through these for image cells. */
const EXCELLENCE_IMAGES = [
  '/our-excellence/sai-ncoe-yoga.png',
  '/our-excellence/ccl.jpg',
  '/our-excellence/ccl2.jpg',
  '/our-excellence/ccl3.jpg',
  '/our-excellence/cricket.jpg',
  '/our-excellence/football.jpg',
  '/our-excellence/football-img.jpg',
  '/our-excellence/mens-hockey.jpg',
  '/our-excellence/hockey-champion.jpg',
  '/our-excellence/bengal-u19.jpg',
  '/our-excellence/rcb-womens.jpg',
  '/our-excellence/president-with.jpg',
  '/our-excellence/image-gym-akshat.jpeg',
  '/our-excellence/gym-image-akshat.jpeg',
  '/our-excellence/phsio-image-akshat.jpeg',
] as const;

/** 4×7 grid = 28 cells: two full passes through every photo. */
const GRID_IMAGE_ITEMS: string[] = [...EXCELLENCE_IMAGES, ...EXCELLENCE_IMAGES];

export function GridMotionSection() {
  return (
    <section className="relative h-[60vh] md:h-screen bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 z-0 hidden md:block">
        <GridMotion
          items={GRID_IMAGE_ITEMS}
          gradientColor="rgba(6, 182, 212, 0.15)"
        />
      </div>

      <div className="absolute inset-0 z-0 md:hidden bg-gray-950">
        <div className="absolute inset-0 grid grid-cols-3 gap-1.5 p-2 opacity-90">
          {EXCELLENCE_IMAGES.slice(0, 9).map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="h-full min-h-[72px] w-full rounded-lg object-cover"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/40 to-gray-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12),transparent_65%)]" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none px-4">
        <div className="text-center">
          <h2 className="text-[32px] sm:text-[48px] md:text-[64px] font-medium text-white mb-4 md:mb-6 tracking-tight drop-shadow-2xl">
            Experience{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Excellence</span>
          </h2>
          <p className="text-[14px] sm:text-[16px] md:text-[18px] text-white/80 max-w-2xl mx-auto drop-shadow-lg">
            Physio, sport, and rehab—through the teams and moments we support
          </p>
        </div>
      </div>
    </section>
  );
}
