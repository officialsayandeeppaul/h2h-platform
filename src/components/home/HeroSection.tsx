"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MARKETING_IMAGES } from "@/constants/marketing-images";
import { avatarUrls } from "./data";

const animatedWords = [
  "Performance",
  "Wellness",
  "Strength",
  "Health",
  "Vitality",
];

const AvatarStack = memo(function AvatarStack() {
  return (
    <div className="flex -space-x-2">
      {avatarUrls.slice(0, 4).map((avatar, i) => (
        <Image
          key={i}
          src={avatar.imageUrl}
          alt={`Patient review ${i + 1}`}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full border-2 border-white object-cover"
          loading="lazy"
        />
      ))}
      <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-medium px-0.5 text-center leading-tight">
        H2H
      </div>
    </div>
  );
});

function HeroSectionComponent() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(animatedWords[0]);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentWord = animatedWords[currentWordIndex];
    let charIndex = 0;

    if (isTyping) {
      const typeInterval = setInterval(() => {
        if (charIndex <= currentWord.length) {
          setDisplayText(currentWord.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => setIsTyping(false), 1200);
        }
      }, 60);
      return () => clearInterval(typeInterval);
    }
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
    }, 40);
    return () => clearInterval(eraseInterval);
  }, [currentWordIndex, isTyping]);

  return (
    <section className="relative min-h-[min(92vh,920px)] flex items-center overflow-hidden max-w-full">
      {/* Full-bleed patient–clinician background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={MARKETING_IMAGES.heroSectionBanner}
          alt=""
          fill
          priority
          className="object-cover object-[center_30%] md:object-center"
          sizes="100vw"
        />
        {/* Readability: strong wash on the left where copy lives */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white via-white/93 to-white/45 md:from-white md:via-white/88 md:to-cyan-50/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/30 md:to-transparent"
          aria-hidden
        />
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 py-20 md:py-28 lg:py-32">
        <div className="max-w-xl lg:max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/95 border border-blue-200 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm text-blue-700 font-medium">
                Sports rehab · Physiotherapy · Pain care · Yoga
              </span>
            </div>

            <div className="space-y-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight drop-shadow-sm">
                Elevate Your
              </h1>
              <p
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight min-h-[1.3em]"
                aria-label={`Elevate Your ${animatedWords[currentWordIndex]}`}
              >
                <span className="inline-block bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent drop-shadow-sm">
                  {displayText}
                  <span className="text-blue-500 animate-pulse font-light" aria-hidden="true">
                    |
                  </span>
                </span>
              </p>
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800 leading-tight drop-shadow-sm">
                &{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Recovery</span>
                  <span className="absolute bottom-0.5 left-0 w-full h-2 sm:h-3 bg-gradient-to-r from-blue-200 to-cyan-200 -z-0 rounded-sm" />
                </span>
              </p>
            </div>

            <p className="text-base md:text-lg text-gray-700 max-w-lg leading-relaxed">
              Book{" "}
              <span className="text-blue-600 font-medium bg-blue-50/90 px-1 rounded">
                sports rehabilitation
              </span>
              , physiotherapy, pain management, and yoga—online or in person, with home visits where we serve your area.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Button
                size="lg"
                className="h-14 px-8 text-sm font-semibold bg-blue-600 hover:bg-blue-700 border-0 shadow-lg shadow-blue-600/25"
                asChild
              >
                <Link href="/booking">
                  Book Appointment
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-sm font-semibold border-2 border-gray-200/90 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white"
                asChild
              >
                <Link href="/services">View Services</Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <AvatarStack />
              <p className="text-gray-700 text-sm max-w-[220px]">
                Clinicians with real depth in sport, academies, and everyday rehab.
              </p>
            </div>
        </div>
      </div>
    </section>
  );
}

export const HeroSection = memo(HeroSectionComponent);
