'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header, Footer } from '@/components/layout';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 pt-24">
        {/* Left Section: Content */}
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-[13px] text-cyan-500 mb-3">Coming Soon</p>
            <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-4 leading-tight tracking-tight">
              Something Amazing is Coming
            </h2>
            <p className="text-[15px] text-gray-500 mb-8 max-w-md mx-auto">
              We&apos;re working hard to bring you this feature. Stay tuned for updates and be the first to experience it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg" 
                className="h-12 px-8 text-[14px] font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 rounded-xl" 
                asChild
              >
                <Link href="/">Back to Home</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 text-[14px] font-medium border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl" 
                asChild
              >
                <Link href="/booking">Book Appointment</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative max-h-screen w-full p-4 hidden lg:block">
          <div className="h-full w-full rounded-3xl bg-black relative overflow-hidden">
            <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-[100px] md:text-[140px] font-bold text-white/10">Soon</p>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
