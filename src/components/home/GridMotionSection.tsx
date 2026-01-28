'use client';

import dynamic from "next/dynamic";
import {
  Activity,
  Heart,
  Users,
  Award,
  Shield,
  Zap,
  Home as HomeIcon,
  Calendar,
  Trophy,
  Star,
} from "lucide-react";

const GridMotion = dynamic(() => import("@/components/ui/grid-motion"), { ssr: false });

export function GridMotionSection() {
  return (
    <section className="relative h-screen bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <GridMotion
          items={[
            <div key="1" className="flex flex-col items-center justify-center h-full">
              <Activity className="w-10 h-10 text-cyan-400 mb-2" />
              <span className="text-sm font-medium">Physiotherapy</span>
            </div>,
            'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
            <div key="2" className="flex flex-col items-center justify-center h-full">
              <Heart className="w-10 h-10 text-red-400 mb-2" />
              <span className="text-sm font-medium">Cardiac Care</span>
            </div>,
            'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
            <div key="3" className="flex flex-col items-center justify-center h-full">
              <Users className="w-10 h-10 text-teal-400 mb-2" />
              <span className="text-sm font-medium">Expert Team</span>
            </div>,
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            <div key="4" className="flex flex-col items-center justify-center h-full">
              <Award className="w-10 h-10 text-yellow-400 mb-2" />
              <span className="text-sm font-medium">Certified</span>
            </div>,
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
            <div key="5" className="flex flex-col items-center justify-center h-full">
              <Shield className="w-10 h-10 text-blue-400 mb-2" />
              <span className="text-sm font-medium">Safe Care</span>
            </div>,
            'https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=400&h=300&fit=crop',
            <div key="6" className="flex flex-col items-center justify-center h-full">
              <Zap className="w-10 h-10 text-orange-400 mb-2" />
              <span className="text-sm font-medium">Fast Recovery</span>
            </div>,
            'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop',
            <div key="7" className="flex flex-col items-center justify-center h-full">
              <HomeIcon className="w-10 h-10 text-green-400 mb-2" />
              <span className="text-sm font-medium">Home Visits</span>
            </div>,
            'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop',
            <div key="8" className="flex flex-col items-center justify-center h-full">
              <Calendar className="w-10 h-10 text-purple-400 mb-2" />
              <span className="text-sm font-medium">Easy Booking</span>
            </div>,
            'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=300&fit=crop',
            <div key="9" className="flex flex-col items-center justify-center h-full">
              <Trophy className="w-10 h-10 text-amber-400 mb-2" />
              <span className="text-sm font-medium">Best Results</span>
            </div>,
            'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
            <div key="10" className="flex flex-col items-center justify-center h-full">
              <Star className="w-10 h-10 text-pink-400 mb-2" />
              <span className="text-sm font-medium">5-Star Rated</span>
            </div>,
            'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
          ]}
          gradientColor="rgba(6, 182, 212, 0.15)"
        />
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center">
          <h2 className="text-[48px] md:text-[64px] font-medium text-white mb-6 tracking-tight drop-shadow-2xl">
            Experience{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Excellence</span>
          </h2>
          <p className="text-[18px] text-white/80 max-w-2xl mx-auto drop-shadow-lg">
            World-class healthcare services delivered with care and precision
          </p>
        </div>
      </div>
    </section>
  );
}
