"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MARKETING_IMAGES } from "@/constants/marketing-images";
import { avatarUrls } from "./data";

const animatedWords = ["Health", "Wellness", "Strength", "Vitality"];

/** Fixed beta banner (30px) + nav (64px) */
const HEADER_OFFSET = "calc(30px + 4rem)";

const AvatarStack = memo(function AvatarStack() {
  return (
    <div className="flex -space-x-2 shrink-0">
      {avatarUrls.slice(0, 4).map((avatar, i) => (
        <Image
          key={i}
          src={avatar.imageUrl}
          alt={`Patient review ${i + 1}`}
          width={32}
          height={32}
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-white object-cover"
          loading="lazy"
        />
      ))}
      <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 px-0.5 text-center text-[9px] sm:text-[10px] font-medium leading-tight text-white">
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
    <section className="relative flex h-svh max-h-svh min-h-svh w-full max-w-full flex-col overflow-hidden supports-[height:100dvh]:h-dvh supports-[height:100dvh]:max-h-dvh supports-[height:100dvh]:min-h-dvh">
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
        <div
          className="absolute inset-0 bg-gradient-to-r from-white via-white/93 to-white/45 md:from-white md:via-white/88 md:to-cyan-50/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/30 md:to-transparent"
          aria-hidden
        />
      </div>

      <div
        className="relative z-10 mx-auto flex h-full w-full max-w-[1200px] flex-col justify-center px-4 sm:px-6 lg:px-12"
        style={{
          paddingTop: HEADER_OFFSET,
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="flex max-w-xl flex-col gap-3 sm:gap-5 lg:max-w-2xl lg:gap-7 [@media(max-height:700px)]:gap-2.5 [@media(max-height:600px)]:gap-2">
          {/* Service line — width fits content only */}
          <div className="w-fit max-w-full">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100/95 px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
              <span className="whitespace-nowrap text-[11px] font-medium leading-none text-blue-700 sm:text-sm">
                <span className="sm:hidden">Sports rehab · Physio · Pain · Yoga</span>
                <span className="hidden sm:inline">
                  Sports rehab · Physiotherapy · Pain care · Yoga
                </span>
              </span>
            </div>
          </div>

          <div className="min-w-0 space-y-0">
            <h1 className="text-[clamp(1.5rem,5.5vw,3.75rem)] font-bold leading-[1.1] tracking-tight text-gray-900 drop-">
              Elevate Your
            </h1>
            <p
              className="min-h-[1.15em] text-[clamp(1.5rem,5.5vw,3.75rem)] font-bold leading-[1.1] tracking-tight"
              aria-label={`Elevate Your ${animatedWords[currentWordIndex]}`}
            >
              <span
                className="inline-block bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent drop-"
                suppressHydrationWarning
              >
                {displayText}
                <span className="animate-pulse font-light text-blue-500" aria-hidden="true">
                  |
                </span>
              </span>
            </p>
            <p className="text-[clamp(1.25rem,4.2vw,3rem)] font-semibold leading-[1.15] text-gray-800 drop-">
              &{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Recovery</span>
                <span className="absolute bottom-0.5 left-0 -z-0 h-1.5 w-full rounded-sm bg-gradient-to-r from-blue-200 to-cyan-200 sm:h-2 md:h-3" />
              </span>
            </p>
          </div>

          <p className="max-w-lg text-sm leading-relaxed text-gray-700 sm:text-base md:text-lg [@media(max-height:650px)]:line-clamp-2 [@media(max-height:650px)]:text-sm">
            Book{" "}
            <span className="rounded bg-blue-50/90 px-1 font-medium text-blue-600">
              sports rehabilitation
            </span>
            , physiotherapy, pain management, and yoga—online or in person, with home visits
            where we serve your area.
          </p>

          <div className="flex flex-col gap-2.5 pt-0.5 sm:flex-row sm:gap-4 sm:pt-1">
            <Button
              size="lg"
              className="h-11 border-0 bg-blue-600 px-6 text-sm font-semibold shadow-blue-600/25 hover:bg-blue-700 sm:h-12 md:h-14 md:px-8"
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
              className="h-11 border-2 border-gray-200/90 bg-white/80 px-6 text-sm font-semibold text-gray-700 backdrop-blur-sm hover:bg-white sm:h-12 md:h-14 md:px-8"
              asChild
            >
              <Link href="/services">View Services</Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-1 sm:gap-4 sm:pt-2 [@media(max-height:560px)]:hidden">
            <AvatarStack />
            <p className="max-w-[200px] text-xs text-gray-700 sm:max-w-[220px] sm:text-sm">
              Clinicians with real depth in sport, academies, and everyday rehab.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export const HeroSection = memo(HeroSectionComponent);
