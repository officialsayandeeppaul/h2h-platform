'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Activity,
  Heart,
  Dumbbell,
  Leaf,
  Star,
  ArrowUpRight,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { avatarUrls } from './data';

// Animated words for cycling
const animatedWords = ['Performance', 'Wellness', 'Strength', 'Health', 'Vitality'];

// Lazy load heavy visual components
const AnimatedGridPattern = dynamic(() => import("@/components/ui/backgrounds").then(m => ({ default: m.AnimatedGridPattern })), { ssr: false });
const OrbitingCircles = dynamic(() => import("@/components/ui/magic-components").then(m => ({ default: m.OrbitingCircles })), { ssr: false });
const AvatarCircles = dynamic(() => import("@/components/ui/avatar-circles").then(m => ({ default: m.AvatarCircles })), { ssr: false });

export function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const currentWord = animatedWords[currentWordIndex];
    let charIndex = 0;
    
    if (isTyping) {
      // Typing effect
      const typeInterval = setInterval(() => {
        if (charIndex <= currentWord.length) {
          setDisplayText(currentWord.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Wait before erasing
          setTimeout(() => setIsTyping(false), 1500);
        }
      }, 80);
      return () => clearInterval(typeInterval);
    } else {
      // Erasing effect
      let eraseIndex = currentWord.length;
      const eraseInterval = setInterval(() => {
        if (eraseIndex >= 0) {
          setDisplayText(currentWord.slice(0, eraseIndex));
          eraseIndex--;
        } else {
          clearInterval(eraseInterval);
          setCurrentWordIndex((prev) => (prev + 1) % animatedWords.length);
          setIsTyping(true);
        }
      }, 50);
      return () => clearInterval(eraseInterval);
    }
  }, [currentWordIndex, isTyping, isMounted]);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden max-w-full pt-16 lg:pt-12">
      {/* Light gradient background - CSS only, no JS */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50/50" />

      {/* Animated Grid Pattern - lazy loaded */}
      <AnimatedGridPattern
        className="opacity-30 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        numSquares={20}
        maxOpacity={0.2}
        color="#3b82f6"
      />

      {/* CSS-only decorative orbs - no JS animation */}
      <div className="absolute top-20 right-[10%] w-[300px] h-[300px] bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-[80px]" />
      <div className="absolute bottom-20 left-[10%] w-[250px] h-[250px] bg-gradient-to-r from-teal-200/20 to-emerald-200/20 rounded-full blur-[60px]" />

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 py-16 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm text-blue-700 font-medium">#1 Healthcare Platform in India</span>
            </div>

            <div className="space-y-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Elevate Your
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight min-h-[1.3em]">
                <span className="inline-block bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                  {isMounted ? displayText : animatedWords[0]}
                  <span className="text-blue-500 animate-pulse font-light">|</span>
                </span>
              </h1>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-600 leading-tight">
                & <span className="relative inline-block">
                  <span className="relative z-10">Recovery</span>
                  <span className="absolute bottom-0.5 left-0 w-full h-2 sm:h-3 bg-gradient-to-r from-blue-200 to-cyan-200 -z-0 rounded-sm" />
                </span>
              </h1>
            </div>

            <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed">
              World-class <span className="text-blue-600 font-medium bg-blue-50 px-1">Sports Rehabilitation</span>, Pain Management, Physiotherapy & Yoga.
              Trusted by <span className="text-gray-900 font-medium">10,000+ athletes</span> across India.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Button size="lg" className="h-14 px-8 text-sm font-semibold bg-blue-600 hover:bg-blue-700 border-0 shadow-lg shadow-blue-600/25" asChild>
                <Link href="/booking">
                  Book Appointment
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-sm font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50" asChild>
                <Link href="/services">
                  View Services
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <AvatarCircles
                numPeople={1000}
                avatarUrls={avatarUrls}
              />
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-cyan-400 text-cyan-400" />)}
                  <span className="text-gray-900 font-semibold ml-1.5 text-sm">4.9</span>
                </div>
                <p className="text-gray-500 text-xs">from 2,500+ reviews</p>
              </div>
            </div>
          </div>

          {/* Right Visual - Simplified for performance */}
          <div className="hidden lg:block relative">
            <div className="relative w-full max-w-lg mx-auto h-[500px] flex items-center justify-center">
              {/* Center Content */}
              <div className="relative z-10 bg-white rounded-3xl p-6 shadow-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl">
                  <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-4">H2H Healthcare</h3>
                <p className="text-sm text-gray-500">Complete Care</p>
              </div>

              {/* Orbiting Circles - lazy loaded */}
              <OrbitingCircles radius={140} duration={30} delay={0} className="h-12 w-12 border-none bg-gradient-to-br from-blue-500 to-cyan-500 shadow-xl">
                <Heart className="w-6 h-6 text-white" />
              </OrbitingCircles>
              <OrbitingCircles radius={140} duration={30} delay={15} className="h-12 w-12 border-none bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl">
                <Leaf className="w-6 h-6 text-white" />
              </OrbitingCircles>

              <OrbitingCircles radius={200} duration={40} delay={0} reverse className="h-14 w-14 border-none bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl">
                <Dumbbell className="w-7 h-7 text-white" />
              </OrbitingCircles>
              <OrbitingCircles radius={200} duration={40} delay={20} reverse className="h-14 w-14 border-none bg-gradient-to-br from-teal-500 to-emerald-500 shadow-xl">
                <Trophy className="w-7 h-7 text-white" />
              </OrbitingCircles>

              {/* Static Stats Cards - no animation */}
              <div className="absolute top-4 right-0 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-xs text-emerald-600 font-semibold">Success</p>
              </div>
              <div className="absolute bottom-4 left-0 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                <p className="text-2xl font-bold text-gray-900">50+</p>
                <p className="text-xs text-blue-600 font-semibold">Doctors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
