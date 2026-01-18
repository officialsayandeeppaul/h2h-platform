'use client';

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, Suspense, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Heart,
  Dumbbell,
  Leaf,
  MapPin,
  Calendar,
  Video,
  Star,
  CheckCircle2,
  ArrowRight,
  Phone,
  Users,
  Award,
  Zap,
  Trophy,
  Play,
  ChevronRight,
  Shield,
  ArrowUpRight,
  Sparkles,
  Quote,
  Home as HomeIcon,
} from "lucide-react";
import { SERVICE_CATEGORIES } from "@/constants/services";
import { APP_CONFIG } from "@/constants/config";
import {
  RetroGrid,
  DotPattern,
  AnimatedGridPattern,
  InteractiveGlow,
} from "@/components/ui/backgrounds";
import {
  Marquee,
  OrbitingCircles,
  AnimatedListItem,
} from "@/components/ui/magic-components";
import { Highlighter } from "@/components/ui/highlighter";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { AnimatedList } from "@/components/ui/animated-list";
import { Typewriter } from "@/components/ui/typing-animation";
import { Dock, DockIcon } from "@/components/ui/dock";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

// Dynamic imports for heavy components - load only when needed
const CardSwap = dynamic(() => import("@/components/ui/card-swap").then(mod => ({ default: mod.default })), { ssr: false });
const Card = dynamic(() => import("@/components/ui/card-swap").then(mod => ({ default: mod.Card })), { ssr: false });
const Terminal = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.Terminal })), { ssr: false });
const AnimatedSpan = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.AnimatedSpan })), { ssr: false });
const SuccessMessage = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.SuccessMessage })), { ssr: false });
const InfoMessage = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.InfoMessage })), { ssr: false });
const TerminalTyping = dynamic(() => import("@/components/ui/terminal").then(mod => ({ default: mod.TypingAnimation })), { ssr: false });
const Masonry = dynamic(() => import("@/components/ui/masonry"), { ssr: false });
const MagnetLines = dynamic(() => import("@/components/ui/magnet-lines"), { ssr: false });
const GridMotion = dynamic(() => import("@/components/ui/grid-motion"), { ssr: false });
const TextPressure = dynamic(() => import("@/components/ui/text-pressure"), { ssr: false });
const HeroVideoDialog = dynamic(() => import("@/components/ui/hero-video-dialog").then(mod => ({ default: mod.HeroVideoDialog })), { ssr: false });
const DottedMap = dynamic(() => import("@/components/ui/dotted-map").then(mod => ({ default: mod.DottedMap })), { ssr: false });
const TrustedByThousandsSection = dynamic(() => import("@/components/ui/trusted-charts").then(mod => ({ default: mod.TrustedByThousandsSection })), { ssr: false });
const AnimatedTestimonials = dynamic(() => import("@/components/ui/animated-testimonials").then(mod => ({ default: mod.AnimatedTestimonials })), { ssr: false });
const ShimmerButton = dynamic(() => import("@/components/ui/magic-components").then(mod => ({ default: mod.ShimmerButton })), { ssr: false });
const Meteors = dynamic(() => import("@/components/ui/magic-components").then(mod => ({ default: mod.Meteors })), { ssr: false });
const Particles = dynamic(() => import("@/components/ui/magic-components").then(mod => ({ default: mod.Particles })), { ssr: false });
const Globe = dynamic(() => import("@/components/ui/magic-components").then(mod => ({ default: mod.Globe })), { ssr: false });
const ClientCalendar = dynamic(() => import("@/components/ui/client-calendar").then(mod => ({ default: mod.ClientCalendar })), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  Heart,
  Dumbbell,
  Leaf,
};

const stats = [
  { label: "Happy Patients", value: 1000, suffix: "+", icon: Users },
  { label: "Expert Doctors", value: 50, suffix: "+", icon: Award },
  { label: "Cities", value: 8, suffix: "+", icon: MapPin },
  { label: "Success Rate", value: 98, suffix: "%", icon: Trophy },
];

const features = [
  {
    title: "Expert Physiotherapists",
    description: "Certified professionals with 10+ years of clinical experience",
    icon: Video,
  },
  {
    title: "Home Visits Available",
    description: "Get treated in the comfort of your home, no travel needed",
    icon: Calendar,
  },
  {
    title: "Personalized Care Plans",
    description: "Treatment tailored to your specific condition and goals",
    icon: MapPin,
  },
  {
    title: "Quick Recovery Focus",
    description: "Evidence-based methods for faster, lasting results",
    icon: Phone,
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Professional Cricketer",
    content: "H2H helped me recover from my ACL injury in record time. The physiotherapists are world-class!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "IT Professional",
    content: "After years of back pain, I finally found relief with their pain management program.",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    role: "Fitness Enthusiast",
    content: "The sports rehab team understood my needs perfectly. Back to my routine in no time!",
    rating: 5,
  },
];

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          gsap.to({ val: 0 }, {
            val: value,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              setCount(Math.floor(this.targets()[0].val));
            }
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use requestIdleCallback for non-critical animations
    const initAnimations = () => {
      const ctx = gsap.context(() => {
        // 120fps optimized settings - use transform and opacity only (GPU accelerated)
        gsap.defaults({ 
          ease: "power3.out", 
          duration: 0.6,
          force3D: true,  // Force GPU acceleration
        });

        // Hero entrance - optimized with shorter durations
        const heroTl = gsap.timeline({ defaults: { force3D: true } });
        heroTl
          .fromTo('.hero-tag', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 })
          .fromTo('.hero-title-line', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 }, '-=0.2')
          .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.3')
          .fromTo('.hero-cta', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.3 }, '-=0.2')
          .fromTo('.hero-proof', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, '-=0.1')
          .fromTo('.hero-visual', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, '-=0.4');

        // Simplified orb animations - CSS will handle most of it
        gsap.to('.orb-1', { y: -20, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to('.orb-2', { y: 15, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });

        // Optimized scroll triggers with lazy: true for better performance
        ScrollTrigger.batch('.stat-card', {
          onEnter: (elements) => gsap.fromTo(elements, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.4 }),
          start: 'top 85%',
          once: true
        });

        ScrollTrigger.batch('.service-card', {
          onEnter: (elements) => gsap.fromTo(elements, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4 }),
          start: 'top 85%',
          once: true
        });

        // Final CTA - simple fade
        gsap.fromTo('.final-cta > *',
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.08, duration: 0.4,
            scrollTrigger: { trigger: '.final-cta', start: 'top 85%', once: true }
          }
        );

      }, mainRef);

      return ctx;
    };

    // Defer non-critical animations
    let ctx: gsap.Context | null = null;
    if ('requestIdleCallback' in window) {
      (window as Window).requestIdleCallback(() => { ctx = initAnimations(); }, { timeout: 100 });
    } else {
      ctx = initAnimations();
    }

    return () => ctx?.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-white">
      <Header />

      <main>
        {/* HERO - With Animated Grid Background */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden max-w-full">
          {/* Light gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50/50" />

          {/* Magic UI - Animated Grid Pattern */}
          <AnimatedGridPattern
            className="opacity-40 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
            numSquares={40}
            maxOpacity={0.3}
            color="#3b82f6"
          />

          {/* Interactive Glow Effect */}
          <InteractiveGlow />

          {/* Subtle decorative orbs - responsive sizes */}
          <div className="orb-1 absolute top-20 right-[5%] md:right-[10%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-gradient-to-r from-blue-200/40 to-cyan-200/40 rounded-full blur-[80px] animate-glow-pulse" />
          <div className="orb-2 absolute bottom-20 left-[5%] md:left-[10%] w-[150px] md:w-[300px] h-[150px] md:h-[300px] bg-gradient-to-r from-teal-200/30 to-emerald-200/30 rounded-full blur-[60px] animate-glow-pulse" style={{ animationDelay: '2s' }} />

          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 py-16 md:py-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="hero-tag inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm text-blue-700 font-medium font-[family-name:var(--font-poppins)]">#1 Healthcare Platform in India</span>
                </div>

                <div className="space-y-2">
                  <h1 className="hero-title-line text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight font-[family-name:var(--font-poppins)]">
                    Elevate Your
                  </h1>
                  <h1 className="hero-title-line text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight font-[family-name:var(--font-poppins)]">
                    <Typewriter
                      words={['Performance', 'Wellness', 'Health']}
                      className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent"
                      typingSpeed={120}
                      deletingSpeed={80}
                      delayBetweenWords={2500}
                    />
                  </h1>
                  <h1 className="hero-title-line text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-600 leading-[1.15] font-[family-name:var(--font-poppins)]">
                    & <Highlighter action="underline" color="#3b82f6" strokeWidth={3} animationDuration={800} isView>Recovery</Highlighter>
                  </h1>
                </div>

                <p className="hero-desc text-base md:text-lg text-gray-600 max-w-lg leading-relaxed font-[family-name:var(--font-poppins)]">
                  World-class{' '}
                  <Highlighter action="highlight" color="#dbeafe" animationDuration={600} isView>
                    <span className="text-blue-600 font-medium">Sports Rehabilitation</span>
                  </Highlighter>
                  , Pain Management, Physiotherapy & Yoga.
                  Trusted by <span className="text-gray-900 font-medium">10,000+ athletes</span> across India.
                </p>

                <div className="hero-cta flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <Button size="lg" className="h-14 px-8 text-sm font-semibold bg-blue-600 hover:bg-blue-700 border-0 shadow-lg shadow-blue-600/25 transition-all duration-300 font-[family-name:var(--font-poppins)]" asChild>
                    <Link href="/booking">
                      Book Appointment
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-sm font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-[family-name:var(--font-poppins)]" asChild>
                    <Link href="/services">
                      View Services
                    </Link>
                  </Button>
                </div>

                <div className="hero-proof flex items-center gap-6 pt-4">
                  <AvatarCircles
                    numPeople={1000}
                    avatarUrls={[
                      {
                        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=RS&backgroundColor=b6e3f4",
                        profileUrl: "#",
                      },
                      {
                        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PP&backgroundColor=c0aede",
                        profileUrl: "#",
                      },
                      {
                        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AK&backgroundColor=d1d4f9",
                        profileUrl: "#",
                      },
                      {
                        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MS&backgroundColor=ffd5dc",
                        profileUrl: "#",
                      },
                    ]}
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

              {/* Right Visual - Orbiting Circles */}
              <div className="hero-visual hidden lg:block relative">
                <div className="relative w-full max-w-lg mx-auto h-[500px] flex items-center justify-center">
                  {/* Center Content */}
                  <div className="relative z-10 bg-white rounded-3xl p-6 shadow-2xl border border-gray-100">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl">
                      <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mt-4 font-[family-name:var(--font-poppins)]">H2H Healthcare</h3>
                    <p className="text-sm text-gray-500 font-[family-name:var(--font-poppins)]">Complete Care</p>
                  </div>

                  {/* Orbiting Circles */}
                  <OrbitingCircles radius={140} duration={25} delay={0} className="h-12 w-12 border-none bg-gradient-to-br from-blue-500 to-cyan-500 shadow-xl">
                    <Heart className="w-6 h-6 text-white" />
                  </OrbitingCircles>
                  <OrbitingCircles radius={140} duration={25} delay={12.5} className="h-12 w-12 border-none bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl">
                    <Leaf className="w-6 h-6 text-white" />
                  </OrbitingCircles>

                  <OrbitingCircles radius={200} duration={35} delay={0} reverse className="h-14 w-14 border-none bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl">
                    <Dumbbell className="w-7 h-7 text-white" />
                  </OrbitingCircles>
                  <OrbitingCircles radius={200} duration={35} delay={17.5} reverse className="h-14 w-14 border-none bg-gradient-to-br from-teal-500 to-emerald-500 shadow-xl">
                    <Trophy className="w-7 h-7 text-white" />
                  </OrbitingCircles>

                  {/* Floating Stats Cards */}
                  <div className="absolute top-4 right-0 bg-white rounded-xl shadow-lg p-3 border border-gray-100 animate-float">
                    <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-poppins)]">98%</p>
                    <p className="text-xs text-emerald-600 font-semibold font-[family-name:var(--font-poppins)]">Success</p>
                  </div>
                  <div className="absolute bottom-4 left-0 bg-white rounded-xl shadow-lg p-3 border border-gray-100 animate-float" style={{ animationDelay: '1.5s' }}>
                    <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-poppins)]">50+</p>
                    <p className="text-xs text-blue-600 font-semibold font-[family-name:var(--font-poppins)]">Doctors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HERO VIDEO SECTION - Watch Our Story */}
        <section className="relative py-28 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
          <DotPattern className="opacity-10" color="#94a3b8" cr={1} />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Content */}
              <div>
                {/* <p className="text-[13px] text-cyan-500 mb-3">Watch Our Story</p> */}
                <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-6 leading-tight tracking-tight">
                  Discover how H2H Healthcare is{' '}
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">transforming lives</span>
                </h2>
                <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
                  Discover how H2H Healthcare is transforming lives through personalized physiotherapy and rehabilitation services.
                </p>

                <div className="flex items-center gap-4 mb-8">
                  <AvatarCircles
                    numPeople={1000}
                    avatarUrls={[
                      { imageUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Patient1&backgroundColor=b6e3f4', profileUrl: '#' },
                      { imageUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Patient2&backgroundColor=c0aede', profileUrl: '#' },
                      { imageUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Patient3&backgroundColor=d1d4f9', profileUrl: '#' },
                      { imageUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Patient4&backgroundColor=ffd5dc', profileUrl: '#' },
                    ]}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 font-[family-name:var(--font-poppins)]">Happy Patients</p>
                    <p className="text-xs text-gray-500 font-[family-name:var(--font-poppins)]">Join our growing family</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700 font-[family-name:var(--font-poppins)]">Expert Care</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                    <span className="text-sm font-medium text-cyan-700 font-[family-name:var(--font-poppins)]">Home Visits</span>
                  </div>
                </div>
              </div>

              {/* Right - Video */}
              <div>
                <HeroVideoDialog
                  animationStyle="from-center"
                  videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  thumbnailSrc="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop"
                  thumbnailAlt="H2H Healthcare Video"
                />
              </div>
            </div>
          </div>
        </section>

        {/* MAGNET LINES SECTION - Interactive Visual */}
        <section className="relative py-28 bg-gray-950 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_60%)]" />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="flex justify-center">
                <MagnetLines
                  rows={7}
                  columns={7}
                  containerSize="min(350px, 70vmin)"
                  lineColor="#06b6d4"
                  lineWidth="0.6vmin"
                  lineHeight="4vmin"
                  baseAngle={0}
                />
              </div>

              <div>
                {/* <p className="text-[13px] text-cyan-400 mb-3">Precision Treatment</p> */}
                <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-6 leading-tight tracking-tight">
                  Treatment plans that{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">adapt to you</span>
                </h2>
                <p className="text-[15px] text-gray-400 mb-8 leading-relaxed">
                  Just like these magnetic lines respond to your movement, our treatment plans adapt to your unique needs.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/60 backdrop-blur rounded-xl p-5 border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
                    <p className="text-[24px] font-medium text-cyan-400 mb-1">AI</p>
                    <p className="text-[13px] text-gray-500">Powered Diagnostics</p>
                  </div>
                  <div className="bg-gray-900/60 backdrop-blur rounded-xl p-5 border border-gray-700/50 hover:border-teal-500/30 transition-colors">
                    <p className="text-[24px] font-medium text-teal-400 mb-1">Real-time</p>
                    <p className="text-[13px] text-gray-500">Progress Tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE - Trusted By Leading Teams (Logo Style) */}
        <section className="py-16 bg-gray-50 border-y border-gray-100 overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <p className="text-center text-[13px] text-gray-500 mb-8">Trusted by leading teams</p>
          </div>
          <Marquee pauseOnHover className="[--duration:40s] [--gap:4rem]">
            {[
              'Mumbai Indians',
              'Chennai Super Kings',
              'Royal Challengers',
              'Delhi Capitals',
              'Kolkata Knight Riders',
              'Punjab Kings',
              'Rajasthan Royals',
              'Sunrisers Hyderabad',
              'Indian Cricket Team',
              'ISL Teams',
            ].map((name, i) => (
              <span
                key={i}
                className="text-[18px] font-medium text-gray-400 hover:text-gray-600 transition-colors duration-300 whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </Marquee>
        </section>

        {/* STATS - With Dot Pattern Background */}
        <section className="stats-section relative py-24 bg-gradient-to-b from-white to-blue-50/30 overflow-hidden">
          {/* Magic UI - Dot Pattern */}
          <DotPattern
            className="opacity-30 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
            color="#94a3b8"
            cr={1.5}
          />
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, index) => {
                const gradients = [
                  'from-blue-500 to-cyan-400',
                  'from-teal-500 to-emerald-400',
                  'from-emerald-500 to-teal-400',
                  'from-cyan-500 to-blue-400'
                ];
                const shadows = [
                  'shadow-blue-500/30',
                  'shadow-teal-500/30',
                  'shadow-emerald-500/30',
                  'shadow-cyan-500/30'
                ];
                return (
                  <div key={stat.label} className="stat-card text-center group">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center shadow-xl ${shadows[index]} group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500`}>
                      <stat.icon className="h-9 w-9 text-white" strokeWidth={2.5} />
                    </div>
                    <p className="text-[48px] lg:text-[56px] font-light text-gray-900 mb-2 leading-none tracking-tight">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-[13px] text-gray-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SERVICES SECTION - Professional Clean Design */}
        <section className="relative py-16 md:py-28 bg-white overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            <div className="text-center mb-16">
              {/* <p className="text-[13px] text-cyan-600 font-medium mb-3">Our Services</p> */}
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

        {/* FEATURES & BENEFITS - Dark Theme with CardSwap */}
        <section
          className="features-section relative py-24 overflow-hidden"
          style={{
            background: `linear-gradient(to right, rgba(15, 23, 42, 0.97) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(15, 23, 42, 0.7) 100%), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
          }}
        >
          {/* Subtle gradient blobs */}
          <div className="absolute top-20 left-10 md:left-20 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-gradient-to-br from-cyan-500/10 to-teal-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 md:right-20 w-[175px] md:w-[350px] h-[175px] md:h-[350px] bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-full blur-[100px]" />

          {/* CardSwap Container - positioned at bottom right - hidden on mobile/tablet */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none hidden xl:block">
            <div className="relative w-full h-full pointer-events-auto">
              <CardSwap
                width={600}
                height={400}
                cardDistance={65}
                verticalDistance={75}
                delay={5000}
                pauseOnHover
                skewAmount={6}
                easing="elastic"
              >
                {/* Card 1 - Sports Rehabilitation */}
                <Card className="p-8 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-gray-700/50 shadow-2xl shadow-blue-500/20 rounded-2xl">
                  <div className="h-full flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-5">
                      {/* <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
                          <Activity className="w-7 h-7 text-white" strokeWidth={2} />
                        </div> */}
                      <div>
                        <h3 className="text-[20px] font-semibold text-white">Sports Rehabilitation</h3>
                        <p className="text-[14px] text-gray-400">Peak performance recovery</p>
                      </div>
                    </div>
                    <p className="text-[15px] text-gray-300 mb-6 leading-relaxed">Get back to peak performance with specialized care from our expert sports physiotherapists.</p>
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-[28px] font-bold text-cyan-400">40%</p>
                        <p className="text-[12px] text-gray-500">Faster Recovery</p>
                      </div>
                      <div className="h-12 w-px bg-gray-700" />
                      <div>
                        <p className="text-[28px] font-bold text-cyan-400">500+</p>
                        <p className="text-[12px] text-gray-500">Athletes Treated</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Card 2 - Pain Management */}
                <Card className="p-8 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-gray-700/50 shadow-2xl shadow-teal-500/20 rounded-2xl">
                  <div className="h-full flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-5">
                      {/* <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/40">
                          <Heart className="w-7 h-7 text-white" strokeWidth={2} />
                        </div> */}
                      <div>
                        <h3 className="text-[20px] font-semibold text-white">Pain Management</h3>
                        <p className="text-[14px] text-gray-400">Chronic pain relief</p>
                      </div>
                    </div>
                    <p className="text-[15px] text-gray-300 mb-6 leading-relaxed">Long-term relief from chronic back & joint pain with evidence-based treatment protocols.</p>
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-[28px] font-bold text-teal-400">98%</p>
                        <p className="text-[12px] text-gray-500">Pain Reduction</p>
                      </div>
                      <div className="h-12 w-px bg-gray-700" />
                      <div>
                        <p className="text-[28px] font-bold text-teal-400">10K+</p>
                        <p className="text-[12px] text-gray-500">Happy Patients</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Card 3 - Home Physiotherapy */}
                <Card className="p-8 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-gray-700/50 shadow-2xl shadow-emerald-500/20 rounded-2xl">
                  <div className="h-full flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-5">
                      {/* <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                          <MapPin className="w-7 h-7 text-white" strokeWidth={2} />
                        </div> */}
                      <div>
                        <h3 className="text-[20px] font-semibold text-white">Home Physiotherapy</h3>
                        <p className="text-[14px] text-gray-400">Care at your doorstep</p>
                      </div>
                    </div>
                    <p className="text-[15px] text-gray-300 mb-6 leading-relaxed">Expert care at your doorstep with no travel hassle. We come to you for your convenience.</p>
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-[28px] font-bold text-blue-400">8+</p>
                        <p className="text-[12px] text-gray-500">Cities Covered</p>
                      </div>
                      <div className="h-12 w-px bg-gray-700" />
                      <div>
                        <p className="text-[28px] font-bold text-blue-400">Free</p>
                        <p className="text-[12px] text-gray-500">First Consult</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </CardSwap>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-md">
              {/* <p className="text-[13px] text-cyan-400 mb-3 font-medium tracking-wide">Features & Benefits</p> */}
              <h2 className="text-[32px] md:text-[40px] font-medium text-cyan-400 mb-6 leading-tight tracking-tight">
                Your Recovery,{' '}
                <Highlighter action="highlight" color="#06b6d4" strokeWidth={2} animationDuration={800} isView>
                  <span className="text-white">Our Priority</span>
                </Highlighter>
              </h2>

              <p className="text-[15px] text-gray-400 mb-8 leading-relaxed">
                We combine cutting-edge technology with compassionate care to deliver exceptional physiotherapy services tailored to your unique needs.
              </p>

              <AnimatedList delay={800} className="gap-4">
                {features.map((feature, index) => {
                  const borderColors = ['border-l-cyan-500', 'border-l-teal-500', 'border-l-blue-500', 'border-l-emerald-500'];
                  return (
                    <div key={feature.title} className={`pl-4 border-l-2 ${borderColors[index]}`}>
                      <h3 className="text-[15px] font-medium text-white mb-1">{feature.title}</h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{feature.description}</p>
                    </div>
                  );
                })}
              </AnimatedList>
            </div>
          </div>
        </section>

        {/* WHY H2H HEALTHCARE - Radix Design with H2H Theme */}
        <section className="relative py-24 bg-gray-950 overflow-hidden">
          {/* H2H Theme Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.05),transparent_50%)]" />
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
            {/* Header - Exact Radix style */}
            <div className="mb-12">
              <p className="text-[13px] text-cyan-400 mb-3">Why H2H Healthcare</p>
              <h2 className="text-[32px] md:text-[40px] font-medium text-white leading-tight tracking-tight">
                Spend less time on<br />
                undifferentiated work
              </h2>
            </div>

            {/* Two Column Content - Exact Radix layout */}
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-[15px] font-medium text-white mb-3">Save time. Ship faster.</h3>
                <p className="text-[15px] text-gray-400 leading-relaxed">
                  It takes a <span className="text-gray-300 underline decoration-dotted">lot</span> of time to develop and maintain a robust set of healthcare services, and it&apos;s mostly undifferentiated work. Building on top of H2H Healthcare will save you time and money, so you can ship a better product faster.
                </p>
              </div>

              <div>
                <h3 className="text-[15px] font-medium text-white mb-3">Focus on your recovery</h3>
                <p className="text-[15px] text-gray-400 leading-relaxed">
                  It&apos;s no secret that robust healthcare services are tricky to find. Nailing accessibility details and complex logistics sucks time away from your recovery. With H2H, you can focus on your unique health challenges instead.
                </p>
              </div>
            </div>

            {/* Large Stats Row - Exact Radix style */}
            <div className="flex flex-wrap gap-12 md:gap-20 items-end pt-8 border-t border-gray-800/50">
              <div>
                <p className="text-[72px] md:text-[96px] font-light text-white leading-none tracking-tight">10K+</p>
                <p className="text-[13px] text-gray-500 mt-2">Patients treated</p>
              </div>
              <div>
                <p className="text-[72px] md:text-[96px] font-light text-white leading-none tracking-tight">98%</p>
                <p className="text-[13px] text-gray-500 mt-2">Success rate</p>
              </div>
              <div>
                <p className="text-[72px] md:text-[96px] font-light text-white leading-none tracking-tight">50+</p>
                <p className="text-[13px] text-gray-500 mt-2">Expert doctors</p>
              </div>
            </div>
          </div>
        </section>

        {/* CASE STUDIES - Radix Design with H2H Theme */}
        <section className="relative py-20 bg-gray-950 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06),transparent_60%)]" />
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
            {/* Header - Exact Radix style */}
            <div className="mb-10">
              <p className="text-[13px] text-cyan-400 mb-3">Case studies</p>
              <h2 className="text-[28px] md:text-[32px] font-medium text-white leading-tight">
                World-class teams use H2H Healthcare<br />
                <span className="text-gray-500">to power their recovery</span>
              </h2>
            </div>

            {/* Testimonial Cards - Exact Radix style */}
            <div className="grid md:grid-cols-2 gap-5 mb-10">
              {/* Card 1 */}
              <div className="bg-gray-900/60 backdrop-blur rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-[18px] font-semibold text-white tracking-tight">Mumbai Indians</span>
                </div>
                <p className="text-[14px] text-gray-400 leading-relaxed mb-5">
                  &ldquo;H2H Healthcare has been instrumental in keeping our players at peak performance. Their physiotherapy team understands the demands of professional cricket and delivers exceptional care that helps our athletes recover faster.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                    <span className="text-[11px] text-white font-medium">RK</span>
                  </div>
                  <div>
                    <p className="text-[13px] text-white">Dr. Rajesh Kumar</p>
                    <p className="text-[12px] text-gray-500">Team Physiotherapist</p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-gray-900/60 backdrop-blur rounded-xl p-6 border border-gray-700/50 hover:border-teal-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-[18px] font-semibold text-white tracking-tight">Sports Academy</span>
                </div>
                <p className="text-[14px] text-gray-400 leading-relaxed mb-5">
                  &ldquo;We&apos;ve been able to focus on training our athletes while H2H handles all rehabilitation needs. Their home visit service is a game-changer for busy training schedules.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                    <span className="text-[11px] text-white font-medium">PS</span>
                  </div>
                  <div>
                    <p className="text-[13px] text-white">Priya Sharma</p>
                    <p className="text-[12px] text-gray-500">Head Coach</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Logos Row - Exact Radix style */}
            <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-8">
              <span>And dozens more companies</span>
              <span>→</span>
            </div>

            {/* Company Logos - Exact Radix style */}
            <div className="flex flex-wrap items-center gap-8 text-gray-500">
              <span className="text-[14px] font-medium">Chennai Super Kings</span>
              <span className="text-[14px] font-medium">Royal Challengers</span>
              <span className="text-[14px] font-medium">Delhi Capitals</span>
              <span className="text-[14px] font-medium">Kolkata Knight Riders</span>
              <span className="text-[14px] font-medium">Punjab Kings</span>
            </div>
          </div>
        </section>

        {/* BOTTOM FEATURE CARDS - Radix Design with H2H Theme */}
        <section className="relative py-16 bg-gray-950 overflow-hidden border-t border-gray-800/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(20,184,166,0.05),transparent_50%)]" />
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-[14px] font-medium text-white mb-2">WAI-ARIA compliant</h4>
                <p className="text-[13px] text-gray-400 leading-relaxed">H2H Healthcare follows the WAI-ARIA guidelines, implementing correct semantics and behaviors for our services.</p>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-[14px] font-medium text-white mb-2">Mobile booking</h4>
                <p className="text-[13px] text-gray-400 leading-relaxed">Book appointments from anywhere with our mobile-first platform where users can schedule using any device.</p>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h4 className="text-[14px] font-medium text-white mb-2">Focus management</h4>
                <p className="text-[13px] text-gray-400 leading-relaxed">Out of the box, H2H provides sensible focus management defaults, which can be further customized.</p>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-[14px] font-medium text-white mb-2">Screen reader tested</h4>
                <p className="text-[13px] text-gray-400 leading-relaxed">We test H2H with common assistive technologies, looking out for practical issues that people may experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - Terminal Section with Light Theme */}
        <section className="relative py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          {/* Interactive Grid Pattern Background */}
          <InteractiveGridPattern
            className="opacity-30 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
            width={50}
            height={50}
            squares={[30, 20]}
            squaresClassName="fill-cyan-400/20 hover:fill-cyan-500/40"
          />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Content */}
              <div>
                {/* <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-100 border border-blue-200 mb-8">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-blue-700 font-[family-name:var(--font-poppins)]">How It Works</span>
                </div>
                 */}
                {/* <p className="text-[13px] text-cyan-500 mb-3">How It Works</p> */}
                <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-6 leading-tight tracking-tight">
                  Book Your Session in{' '}
                  <Highlighter action="underline" color="#06b6d4" strokeWidth={2.5} animationDuration={700} isView>
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">3 Simple Steps</span>
                  </Highlighter>
                </h2>

                <p className="text-[15px] text-gray-500 mb-10 leading-relaxed">
                  Our{' '}
                  <Highlighter action="highlight" color="#dbeafe" animationDuration={600} isView>
                    <span className="text-blue-600 font-medium">streamlined booking process</span>
                  </Highlighter>
                  {' '}gets you from pain to recovery faster than ever. No complicated forms, no waiting - just quick, easy access to{' '}
                  <Highlighter action="highlight" color="#ccfbf1" animationDuration={600} isView>
                    <span className="text-cyan-600 font-medium">world-class care</span>
                  </Highlighter>.
                </p>

                {/* Steps */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">1</div>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900 mb-1">Choose Your Service</h3>
                      <p className="text-[13px] text-gray-500">Select from our range of specialized treatments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform">2</div>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900 mb-1">Pick Your Slot</h3>
                      <p className="text-[13px] text-gray-500">Choose a convenient time that works for you</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">3</div>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900 mb-1">Start Recovery</h3>
                      <p className="text-[13px] text-gray-500">Meet your expert and begin your healing journey</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Terminal */}
              <div className="relative">
                {/* Glow effect behind terminal */}
                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-200/50 to-blue-200/50 rounded-3xl blur-2xl" />

                <Terminal theme="dark" className="relative">
                  <TerminalTyping duration={50}>h2h book --service &quot;Sports Rehab&quot;</TerminalTyping>
                  <AnimatedSpan><SuccessMessage>Service selected: Sports Rehabilitation</SuccessMessage></AnimatedSpan>
                  <AnimatedSpan><InfoMessage>Finding available slots...</InfoMessage></AnimatedSpan>
                  <AnimatedSpan className="text-gray-400 pl-4">Available: Tomorrow 10:00 AM, 2:00 PM, 5:00 PM</AnimatedSpan>
                  <TerminalTyping duration={50}>h2h confirm --slot &quot;10:00 AM&quot;</TerminalTyping>
                  <AnimatedSpan><SuccessMessage>Appointment confirmed!</SuccessMessage></AnimatedSpan>
                  <AnimatedSpan className="text-gray-400 pl-4">📅 Date: Tomorrow</AnimatedSpan>
                  <AnimatedSpan className="text-gray-400 pl-4">⏰ Time: 10:00 AM</AnimatedSpan>
                  <AnimatedSpan className="text-gray-400 pl-4">👨‍⚕️ Doctor: Dr. Rajesh Kumar</AnimatedSpan>
                  <AnimatedSpan className="text-gray-400 pl-4">📍 Location: H2H Mumbai Center</AnimatedSpan>
                  <AnimatedSpan><SuccessMessage>Confirmation sent to your email & phone!</SuccessMessage></AnimatedSpan>
                </Terminal>
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED BY THOUSANDS - Stats & Charts Section */}
        <TrustedByThousandsSection />

        {/* TESTIMONIALS - Dark Theme with Vertical Marquee */}
        <AnimatedTestimonials />

        {/* FOUNDER SECTION - Dark Theme like takeUforward */}
        <section className="relative py-28 bg-gray-950 overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.06),transparent_50%)]" />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Quote */}
              <div>
                {/* <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Quote className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-blue-400 font-[family-name:var(--font-poppins)]">From Our Founder</span>
                </div>
                 */}
                {/* <p className="text-[13px] text-cyan-400 mb-3">From Our Founder</p> */}
                <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-6 leading-tight tracking-tight">
                  Your Health,{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Not Just A Service</span>
                </h2>

                <div className="space-y-5">
                  <p className="text-[15px] leading-relaxed text-gray-300">
                    &ldquo;I started H2H Healthcare with a simple belief: everyone deserves access to world-class physiotherapy and rehabilitation, regardless of where they live.&rdquo;
                  </p>
                  <p className="text-[14px] leading-relaxed text-gray-400">
                    After seeing countless athletes and patients struggle to find quality care, I knew there had to be a better way. Today, we&apos;ve helped over 10,000 patients recover faster and live better.
                  </p>
                  <p className="text-[14px] leading-relaxed italic text-gray-500 border-l-2 border-cyan-500/50 pl-4">
                    &ldquo;You don&apos;t need a perfect background to build a great future. You just need direction, discipline, and the courage to start.&rdquo;
                  </p>
                </div>

                <div className="mt-10">
                  <Button size="lg" className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 font-[family-name:var(--font-poppins)]" asChild>
                    <Link href="/about">
                      Learn Our Story
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right - Founder Image with Floating Badges */}
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative">
                  {/* Decorative gradient glow behind */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl" />

                  {/* Image */}
                  <div className="relative rounded-2xl overflow-hidden border border-gray-800">
                    <img
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=700&fit=crop&crop=face"
                      alt="Dr. Founder - H2H Healthcare"
                      className="w-full h-[500px] object-cover object-top"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                    {/* Name overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-[18px] font-medium text-white mb-1">Dr. Rajesh Kumar</h3>
                      <p className="text-[14px] text-cyan-400">Founder & CEO, H2H Healthcare</p>
                    </div>
                  </div>

                  {/* Floating Badge - Top Right */}
                  <div className="absolute -top-2 -right-2 flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[13px] font-medium text-white">Verified Expert</span>
                  </div>

                  {/* Floating Badge - Left Side */}
                  <div className="absolute top-1/4 -left-4 bg-gray-900/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Award className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white">15+ Years</p>
                        <p className="text-[11px] text-gray-500">Experience</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge - Right Side */}
                  <div className="absolute top-1/2 -right-4 bg-gray-900/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white">IPL Team</p>
                        <p className="text-[11px] text-gray-500">Official Physio</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge - Bottom Left */}
                  <div className="absolute bottom-20 -left-4 bg-gray-900/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white">10,000+</p>
                        <p className="text-[11px] text-gray-500">Patients Treated</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TREATMENT PROCESS - Light Theme with Interactive Grid Pattern */}
        <section className="relative py-24 bg-white overflow-hidden">
          {/* Interactive Grid Pattern Background */}
          <InteractiveGridPattern
            className="text-cyan-400/20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
            width={60}
            height={60}
            squares={[25, 15]}
          />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Steps */}
              <div>
                {/* <p className="text-[12px] text-cyan-600 uppercase tracking-wide mb-2 font-medium">How It Works</p> */}
                <h2 className="text-[32px] font-semibold text-gray-900 leading-tight mb-3">
                  Your Path to{' '}
                  <Highlighter action="circle" color="#06b6d4" strokeWidth={2} animationDuration={800} isView>
                    <span className="text-cyan-600">Recovery</span>
                  </Highlighter>
                </h2>
                <p className="text-[15px] text-gray-500 mb-10">
                  A proven{' '}
                  <Highlighter action="highlight" color="#dbeafe" animationDuration={600} isView>
                    <span className="text-blue-600 font-medium">4-step approach</span>
                  </Highlighter>
                  {' '}designed for lasting results
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { step: '01', title: 'Assessment', desc: 'Comprehensive evaluation of your condition', color: 'cyan' },
                    { step: '02', title: 'Custom Plan', desc: 'Personalized treatment plan for you', color: 'blue' },
                    { step: '03', title: 'Treatment', desc: 'Expert-guided therapy sessions', color: 'teal' },
                    { step: '04', title: 'Recovery', desc: 'Ongoing support for lasting results', color: 'emerald' },
                  ].map((item) => (
                    <div key={item.step} className="group p-5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all duration-300">
                      <div className={`w-8 h-8 rounded-lg bg-${item.color}-100 flex items-center justify-center mb-3`}>
                        <span className={`text-[12px] font-bold text-${item.color}-600`}>{item.step}</span>
                      </div>
                      <h3 className="text-[14px] font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button size="lg" className="h-12 px-8 text-[14px] font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600" asChild>
                    <Link href="/booking">
                      Start Your Recovery
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right - Calendar with Date & Time Selection */}
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-[16px] font-semibold text-gray-900">Book Appointment</h3>
                      <p className="text-[12px] text-gray-400 mt-0.5">Select your preferred date & time</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc1&backgroundColor=b6e3f4" alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                        <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc2&backgroundColor=c0aede" alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                        <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc3&backgroundColor=ffd5dc" alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                      </div>
                      <span className="text-[11px] font-medium text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">1K+ Docs</span>
                    </div>
                  </div>

                  <ClientCalendar
                    className="rounded-xl border border-gray-100 p-3"
                  />

                  {/* Time Slots */}
                  <div className="mt-5">
                    <p className="text-[12px] font-medium text-gray-700 mb-3">Available Time Slots</p>
                    <div className="grid grid-cols-4 gap-2">
                      {['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'].map((time, i) => (
                        <button key={time} className={`py-2 px-3 rounded-lg text-[11px] font-medium transition-all ${i === 1 ? 'bg-cyan-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 border border-gray-100'}`}>
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[12px] text-gray-500">50+ slots available today</span>
                      </div>
                      <Button size="sm" className="h-9 px-4 text-[12px] bg-gray-900 hover:bg-gray-800">
                        Confirm Booking
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* LOCATIONS - Globe Section - Dark Design */}
        <section className="relative py-28 bg-gray-950 overflow-hidden">
          {/* Meteors Effect */}
          <Meteors number={15} />

          {/* Particles */}
          <Particles quantity={30} color="#3b82f6" />

          {/* Gradient orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]" />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                {/* <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/30 mb-8">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-blue-400 font-[family-name:var(--font-poppins)]">Our Presence</span>
                </div> */}
                {/* <p className="text-[13px] text-cyan-400 mb-3">Our Presence</p> */}
                <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-6 leading-tight tracking-tight">
                  Available Across{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    8+ Cities
                  </span>
                </h2>
                <p className="text-[15px] text-gray-400 mb-10">
                  From metros to tier-2 cities, we&apos;re bringing world-class healthcare closer to you.
                </p>

                {/* City tags - Dark theme */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'].map((city, i) => (
                    <span
                      key={city}
                      className="px-4 py-2 bg-gray-800/50 backdrop-blur rounded-full border border-gray-700 text-[13px] font-medium text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 cursor-pointer"
                    >
                      {city}
                    </span>
                  ))}
                </div>

                <ShimmerButton
                  className="h-14 px-10 text-base font-semibold"
                  background="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                  shimmerColor="#ffffff"
                >
                  <Link href="/locations" className="flex items-center">
                    Find Nearest Center
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </ShimmerButton>
              </div>

              {/* Enhanced Globe - Dark Theme */}
              <div className="relative h-[500px] flex items-center justify-center">
                {/* Outer glow ring */}
                <div className="absolute w-[400px] h-[400px] rounded-full border border-blue-500/20 animate-pulse" />
                <div className="absolute w-[350px] h-[350px] rounded-full border border-cyan-500/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute w-[300px] h-[300px] rounded-full border border-teal-500/20 animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Globe sphere */}
                <div className="relative w-[280px] h-[280px]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/40 via-cyan-500/30 to-teal-500/40 animate-spin" style={{ animationDuration: '20s' }} />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-500/30 via-transparent to-cyan-500/30" />
                  <div className="absolute inset-8 rounded-full bg-gray-900/80 backdrop-blur-xl border border-blue-500/20" />

                  {/* Center content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[48px] font-light text-white">8+</p>
                      <p className="text-[13px] text-cyan-400">Cities</p>
                    </div>
                  </div>

                  {/* Orbiting dots - pre-calculated positions to avoid hydration mismatch */}
                  {[
                    { top: 50, left: 95 },      // 0°
                    { top: 89, left: 72.5 },    // 60°
                    { top: 89, left: 27.5 },    // 120°
                    { top: 50, left: 5 },       // 180°
                    { top: 11, left: 27.5 },    // 240°
                    { top: 11, left: 72.5 },    // 300°
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse"
                      style={{
                        top: `${pos.top}%`,
                        left: `${pos.left}%`,
                        transform: 'translate(-50%, -50%)',
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Floating stat cards - Dark theme */}
                <div className="absolute top-8 right-8 bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700">
                  <p className="text-[20px] font-medium text-white">10K+</p>
                  <p className="text-[11px] text-gray-500">Patients Served</p>
                </div>
                <div className="absolute bottom-8 left-8 bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700">
                  <p className="text-[20px] font-medium text-white">50+</p>
                  <p className="text-[11px] text-gray-500">Expert Doctors</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEXT PRESSURE SECTION - Interactive Typography */}
        <section className="relative py-28 bg-gray-950 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1),transparent_60%)]" />
          <Particles quantity={20} color="#06b6d4" />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Text Pressure Interactive */}
              <div className="relative h-[300px] md:h-[400px]">
                <TextPressure
                  text="HEAL"
                  flex={true}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={true}
                  textColor="#06b6d4"
                  minFontSize={48}
                />
              </div>

              {/* Right - Content */}
              <div>
                {/* <p className="text-[13px] text-cyan-400 mb-3">Interactive Experience</p> */}
                <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-6 leading-tight tracking-tight">
                  Your Health is{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Priceless</span>
                </h2>
                <p className="text-[15px] text-gray-400 mb-8 leading-relaxed">
                  At H2H Healthcare, we believe that quality healthcare should be accessible to everyone. Our mission is to bring world-class physiotherapy and rehabilitation services right to your doorstep.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-5 border border-gray-800">
                    <p className="text-[24px] font-medium text-cyan-400 mb-1">100%</p>
                    <p className="text-[13px] text-gray-500">Patient Satisfaction</p>
                  </div>
                  <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-5 border border-gray-800">
                    <p className="text-[24px] font-medium text-teal-400 mb-1">Zero</p>
                    <p className="text-[13px] text-gray-500">Hidden Charges</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLOG SECTION - Bento Grid Layout */}
        <section className="relative py-16 md:py-24 bg-white overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-16">
              {/* <p className="text-[13px] text-cyan-500 mb-3">Our Blogs</p> */}
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

        {/* GALLERY SECTION - Masonry Layout */}
        <section className="relative py-28 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
          <DotPattern className="opacity-15" color="#94a3b8" cr={1} />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-16">
              {/* <p className="text-[13px] text-cyan-500 mb-3">Gallery</p> */}
              <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-4 leading-tight tracking-tight">
                Our{' '}
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Facilities</span>
              </h2>
              <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">
                State-of-the-art equipment and comfortable spaces designed for your recovery
              </p>
            </div>

            <Masonry
              items={[
                { id: '1', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop', height: 280, title: 'Modern Equipment', description: 'Latest physiotherapy tools' },
                { id: '2', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=500&fit=crop', height: 350, title: 'Therapy Rooms', description: 'Private treatment spaces' },
                { id: '3', img: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&h=350&fit=crop', height: 240, title: 'Rehabilitation Center', description: 'Full recovery support' },
                { id: '4', img: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=450&fit=crop', height: 320, title: 'Exercise Area', description: 'Guided workout sessions' },
                { id: '5', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=380&fit=crop', height: 260, title: 'Gym Facilities', description: 'Strength training equipment' },
                { id: '6', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=420&fit=crop', height: 300, title: 'Consultation Room', description: 'Expert assessments' },
                { id: '7', img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=350&fit=crop', height: 250, title: 'Hydrotherapy', description: 'Water-based treatments' },
                { id: '8', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', height: 280, title: 'Recovery Zone', description: 'Rest and recuperation' },
              ]}
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


        {/* DOTTED MAP SECTION - Global Reach */}
        <section className="relative py-28 bg-gray-950 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]" />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-12">
              <p className="text-[13px] text-cyan-400 mb-3">Proudly Indian, Globally Expanding</p>
              <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-4 leading-tight tracking-tight">
                From India to the{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">World</span>
              </h2>
              <p className="text-[15px] text-gray-400 max-w-2xl mx-auto">
                Born in India, built for the world. Our healthcare solutions are expanding globally while staying rooted in Indian innovation.
              </p>
            </div>

            <div className="relative h-[500px] rounded-3xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/80" />
              <DottedMap
                dotRadius={0.22}
                markerColor="#22d3ee"
                className="text-gray-500"
                markers={[
                  { lat: 28.6139, lng: 77.209, size: 0.8 },   // New Delhi - HQ (larger)
                  { lat: 19.076, lng: 72.8777, size: 0.5 },   // Mumbai
                  { lat: 12.9716, lng: 77.5946, size: 0.5 },  // Bangalore
                  { lat: 13.0827, lng: 80.2707, size: 0.4 },  // Chennai
                  { lat: 22.5726, lng: 88.3639, size: 0.4 },  // Kolkata
                  { lat: 17.385, lng: 78.4867, size: 0.4 },   // Hyderabad
                  { lat: 25.2048, lng: 55.2708, size: 0.35 }, // Dubai
                  { lat: 1.3521, lng: 103.8198, size: 0.35 }, // Singapore
                  { lat: 51.5074, lng: -0.1278, size: 0.35 }, // London
                  { lat: 40.7128, lng: -74.006, size: 0.35 }, // New York
                ]}
              />

              {/* Floating stats */}
              <div className="absolute top-6 left-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
                <p className="text-[24px] font-semibold text-cyan-400">🇮🇳</p>
                <p className="text-[11px] text-gray-400 mt-1">Indian Origin</p>
              </div>
              <div className="absolute top-6 right-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
                <p className="text-[20px] font-medium text-teal-400">10+</p>
                <p className="text-[11px] text-gray-400">Countries Soon</p>
              </div>
              <div className="absolute bottom-6 left-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
                <p className="text-[20px] font-medium text-cyan-400">50+</p>
                <p className="text-[11px] text-gray-400">Service Centers</p>
              </div>
              <div className="absolute bottom-6 right-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
                <p className="text-[20px] font-medium text-emerald-400">1M+</p>
                <p className="text-[11px] text-gray-400">Lives Impacted</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT FORM SECTION - shadcn/studio style */}
        <section className="relative py-16 md:py-24 bg-white overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            <div className="text-center mb-12">
              {/* <p className="text-[13px] text-cyan-500 mb-3">Contact Us</p> */}
              <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-4 leading-tight tracking-tight">
                Stay{' '}
                <span className="bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">Connected</span>
                {' '}with Us
              </h2>
              <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">
                Reach out for inquiries, support, or collaboration—we&apos;d love to hear from you!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left - Contact Form */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="space-y-5">
                  <div>
                    <label className="text-[13px] font-medium text-gray-700 mb-2 block">Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name here..."
                      className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-[14px] placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-gray-700 mb-2 block">Email</label>
                    <input
                      type="email"
                      placeholder="Enter your Email here..."
                      className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-[14px] placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-gray-700 mb-2 block">Phone</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number..."
                      className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-[14px] placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-gray-700 mb-2 block">Message</label>
                    <textarea
                      placeholder="Enter your message..."
                      rows={4}
                      className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-[14px] placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-gray-700 mb-3 block">Services</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
                        <span className="text-[13px] text-gray-600">Sports Rehab</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
                        <span className="text-[13px] text-gray-600">Pain Management</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
                        <span className="text-[13px] text-gray-600">Home Physio</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
                        <span className="text-[13px] text-gray-600">Yoga & Wellness</span>
                      </label>
                    </div>
                  </div>
                  <Button className="w-full h-12 text-[14px] font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl">
                    Send Message
                  </Button>
                </div>
              </div>

              {/* Right - Image with stats */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=500&fit=crop"
                    alt="Healthcare consultation"
                    className="w-full h-[450px] object-cover"
                  />
                </div>
                {/* Floating stats card */}
                <div className="absolute -bottom-6 left-0 md:-left-6 bg-white rounded-2xl p-4 md:p-5 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc1&backgroundColor=b6e3f4" alt="" className="w-9 h-9 rounded-full border-2 border-white" />
                      <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc2&backgroundColor=c0aede" alt="" className="w-9 h-9 rounded-full border-2 border-white" />
                      <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc3&backgroundColor=ffd5dc" alt="" className="w-9 h-9 rounded-full border-2 border-white" />
                      <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc4&backgroundColor=d1d4f9" alt="" className="w-9 h-9 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900">20+ Daily New Clients</p>
                      <p className="text-[12px] text-gray-500">Join our growing family</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>






        {/* GRID MOTION SECTION - Visual Showcase */}
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


        {/* FINAL CTA - Theme Gradient Background with RetroGrid */}
        <section className="relative py-32 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 overflow-hidden">
          {/* RetroGrid Background */}
          <RetroGrid className="opacity-30" />

          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />

          <div className="final-cta max-w-[1200px] mx-auto px-6 lg:px-12 text-center relative z-10">
            {/* <p className="text-[13px] te/xt-white/70 mb-3">Start Your Journey</p> */}
            <h2 className="text-[36px] md:text-[48px] font-medium text-white mb-6 leading-tight tracking-tight">
              Ready to Transform<br />Your Health?
            </h2>
            <p className="text-[16px] text-white/80 mb-12 max-w-2xl mx-auto">
              Join 10,000+ patients who achieved their health goals with H2H Healthcare. Book your appointment today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-10 text-base font-bold bg-white text-blue-600 hover:bg-gray-100 shadow-xl shadow-black/10 font-[family-name:var(--font-poppins)]" asChild>
                <Link href="/booking">
                  Book Appointment
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-base font-bold bg-transparent text-white border-2 border-white/50 hover:bg-white/10 hover:border-white font-[family-name:var(--font-poppins)]" asChild>
                <Link href={`tel:${APP_CONFIG.phone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  {APP_CONFIG.phone}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* DOWNLOAD APP SECTION - Future Scope */}
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

        {/* HEAL TO HEALTH - Brand Ending Section */}
        <section className="relative py-20 bg-white overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
            {/* <p className="text-[13px] text-cyan-500 mb-4">Our Promise</p> */}
            <h2 className="text-[42px] md:text-[56px] font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              From{' '}
              <Highlighter action="crossed-off" color="#ef4444" strokeWidth={2}>
                Heal
              </Highlighter>
              {' '}to{' '}
              <Highlighter action="highlight" color="#a5f3fc">
                Health
              </Highlighter>
            </h2>
            <p className="text-[17px] text-gray-500 max-w-2xl mx-auto mb-10">
              We don&apos;t just treat symptoms — we transform lives. Your journey from healing to lasting health starts here.
            </p>

            {/* Dock with quick actions */}
            <div className="flex justify-center mb-8">
              <Dock className="bg-gray-100 border border-gray-200">
                <DockIcon className="bg-cyan-500 text-white rounded-full p-2">
                  <Calendar className="h-6 w-6" />
                </DockIcon>
                <DockIcon className="bg-teal-500 text-white rounded-full p-2">
                  <Video className="h-6 w-6" />
                </DockIcon>
                <DockIcon className="bg-blue-500 text-white rounded-full p-2">
                  <Phone className="h-6 w-6" />
                </DockIcon>
                <DockIcon className="bg-purple-500 text-white rounded-full p-2">
                  <Heart className="h-6 w-6" />
                </DockIcon>
                <DockIcon className="bg-orange-500 text-white rounded-full p-2">
                  <HomeIcon className="h-6 w-6" />
                </DockIcon>
              </Dock>
            </div>

            <p className="text-[13px] text-gray-400">
              <Highlighter action="box" color="#06b6d4" strokeWidth={1}>
                H2H Healthcare
              </Highlighter>
              {' '}— Trusted by thousands across India 🇮🇳
            </p>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
}
