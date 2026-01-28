'use client';

import { RetroGrid } from "@/components/ui/backgrounds";

export function DownloadAppSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* RetroGrid Background */}
      <RetroGrid className="opacity-30" angle={65} cellSize={60} />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-[28px] md:text-[36px] font-medium text-gray-900 mb-4 leading-tight tracking-tight">
              Download our mobile app{' '}
              <span className="inline-flex items-center gap-1.5 bg-cyan-100 text-cyan-700 text-[12px] font-medium px-2.5 py-1 rounded-full align-middle ml-2">
                Coming Soon
              </span>
            </h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">
              With a variety of unique features, you can effortlessly book appointments, track your recovery progress, and <span className="text-cyan-600 font-medium">connect</span> with our experts. Build your health journey with ease.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-3 bg-gray-900 text-white px-6 py-3.5 rounded-xl transition-colors">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] text-gray-400">Download on the</p>
                <p className="text-[15px] font-semibold">App Store</p>
              </div>
            </button>
            <button className="flex items-center gap-3 bg-gray-900 text-white px-6 py-3.5 rounded-xl transition-colors">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] text-gray-400">Download on the</p>
                <p className="text-[15px] font-semibold">Google Play</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
