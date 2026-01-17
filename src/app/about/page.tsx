'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Header, Footer } from '@/components/layout';
import { Highlighter } from '@/components/ui/highlighter';
import { StripedPattern } from '@/components/ui/striped-pattern';
import { ArrowRight, ArrowUpRight, Play, CheckCircle2, ChevronsRight } from 'lucide-react';

const teamMembers = [
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Chief Medical Officer',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80',
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'Head Physiotherapist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80',
  },
  {
    name: 'Dr. Amit Patel',
    role: 'Sports Rehab Specialist',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80',
  },
  {
    name: 'Dr. Sneha Reddy',
    role: 'Pain Management Expert',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80',
  },
];

const groundTeam = [
  { name: 'Rahul Verma', role: 'Field Physiotherapist', color: 'bg-cyan-100 text-cyan-700' },
  { name: 'Anita Singh', role: 'Home Care Coordinator', color: 'bg-teal-100 text-teal-700' },
  { name: 'Vikram Joshi', role: 'Sports Therapist', color: 'bg-purple-100 text-purple-700' },
  { name: 'Meera Patel', role: 'Yoga Instructor', color: 'bg-pink-100 text-pink-700' },
  { name: 'Arjun Nair', role: 'Rehab Specialist', color: 'bg-orange-100 text-orange-700' },
  { name: 'Kavita Sharma', role: 'Patient Relations', color: 'bg-green-100 text-green-700' },
  { name: 'Suresh Kumar', role: 'Geriatric Care Expert', color: 'bg-blue-100 text-blue-700' },
  { name: 'Deepa Menon', role: 'Cardiac Rehab Nurse', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Ravi Krishnan', role: 'Equipment Technician', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Priyanka Das', role: 'Wellness Coach', color: 'bg-red-100 text-red-700' },
  { name: 'Arun Gupta', role: 'Mobility Specialist', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Neha Reddy', role: 'Patient Advocate', color: 'bg-violet-100 text-violet-700' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Hero Section - Similar to Homepage */}
          <div className="grid grid-cols-1 mt-12 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left Content */}
            <div>
              {/* <p className="text-[13px] font-medium text-cyan-600 mb-4">
                About H2H Healthcare
              </p> */}
              <h2 className="text-[32px] md:text-[44px] font-medium text-gray-900 tracking-tight leading-[1.15] mb-6">
                Your Partner in{' '}
                <Highlighter action="highlight" color="#87CEFA" isView>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">
                    Recovery & Wellness
                  </span>
                </Highlighter>
              </h2>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-8 max-w-md">
                We bring quality physiotherapy, pain management, and rehabilitation services to your doorstep. Whether you're recovering from an injury or seeking better mobility, our team is here to help.
              </p>

              {/* Happy Patients */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex -space-x-2">
                  <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Patient1&backgroundColor=b6e3f4" alt="" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Patient2&backgroundColor=c0aede" alt="" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Patient3&backgroundColor=d1d4f9" alt="" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Patient4&backgroundColor=ffd5dc" alt="" className="w-10 h-10 rounded-full border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center text-[11px] font-medium text-white">+500</div>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-gray-900">Happy Patients</p>
                  <p className="text-[12px] text-gray-500">Join our growing family</p>
                </div>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium px-4 py-2 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                  Expert Care
                </span>
                <span className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium px-4 py-2 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                  Home Visits
                </span>
              </div>
            </div>

            {/* Right Image with Play Button */}
            <div className="relative">
              <div className="relative h-[350px] md:h-[400px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&q=80"
                  alt="Healthcare professional with stethoscope"
                  className="w-full h-full object-cover"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="h-16 w-16 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center shadow-lg transition-colors">
                    <Play className="h-6 w-6 text-white ml-1" fill="white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid - Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-20">
            {/* Left - Single Video Story Card */}
            <div className="md:col-span-4">
              <div className="relative h-[420px] rounded-2xl overflow-hidden bg-gray-900 group cursor-pointer">
                <video
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&q=80"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="https://videos.pexels.com/video-files/5319980/5319980-sd_540_960_25fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[12px] text-cyan-400 font-medium mb-2">Success Story</p>
                  <p className="text-[16px] text-white font-medium leading-tight mb-1">Rahul&apos;s Journey Back to Sports</p>
                  <p className="text-[13px] text-gray-300 mb-2">From injury to victory - a 6-month transformation</p>
                  <p className="text-[11px] text-gray-400">2.3K views</p>
                </div>
              </div>
            </div>

            {/* Middle Stats Cards */}
            <div className="md:col-span-4 flex flex-col gap-4">
              {/* Stat Card 1 */}
              <div className="flex-1 bg-cyan-50 rounded-2xl p-6 flex flex-col justify-center">
                <p className="text-[36px] md:text-[42px] font-medium text-gray-900 tracking-tight">
                  500+
                </p>
                <p className="text-[14px] font-medium text-gray-900 mb-2">
                  Patients Served
                </p>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Helping patients recover and regain mobility every day.
                </p>
              </div>

              {/* Stat Card 2 */}
              <div className="flex-1 bg-gray-50 rounded-2xl p-6 flex flex-col justify-center">
                <p className="text-[36px] md:text-[42px] font-medium text-gray-900 tracking-tight">
                  50+
                </p>
                <p className="text-[14px] font-medium text-gray-900 mb-2">
                  Expert Therapists
                </p>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Certified professionals dedicated to your recovery.
                </p>
              </div>
            </div>

            {/* Right Image with Button */}
            <div className="md:col-span-4 relative">
              <div className="relative h-[350px] md:h-full rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=800&fit=crop&q=80"
                  alt="Team collaboration"
                  className="w-full h-full object-cover grayscale"
                />
                {/* About Us Button */}
                <div className="absolute bottom-4 right-4">
                  <Button 
                    className="h-10 px-5 text-[13px] font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-full"
                    asChild
                  >
                    <Link href="/contact">
                      About us
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <p className="text-[12px] font-medium text-cyan-600 uppercase tracking-wider mb-3">
                OUR MISSION
              </p>
              <h2 className="text-[28px] md:text-[32px] font-medium text-gray-900 tracking-tight leading-tight mb-4">
                Healthcare That Comes to You
              </h2>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
                H2H stands for "Home to Health" — we believe quality physiotherapy shouldn't require long commutes or waiting rooms. Whether you're recovering from surgery, managing chronic pain, or working on mobility, our team brings personalized care directly to your home.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-cyan-50 text-cyan-700 text-[12px] font-medium px-3 py-1.5 rounded-full">
                  Expert Doctors
                </span>
                <span className="bg-teal-50 text-teal-700 text-[12px] font-medium px-3 py-1.5 rounded-full">
                  24/7 Support
                </span>
                <span className="bg-gray-100 text-gray-700 text-[12px] font-medium px-3 py-1.5 rounded-full">
                  Home Visits
                </span>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[350px] rounded-2xl overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop&q=80"
                alt="Healthcare professional"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Values Section with Striped Pattern */}
          <div className="relative">
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <StripedPattern 
                width={50} 
                height={50} 
                direction="right" 
                className="text-cyan-100/40" 
              />
            </div>
            <div className="relative bg-gradient-to-br from-gray-50/90 to-white/90 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                {/* <p className="text-[12px] font-medium text-cyan-600 uppercase tracking-wider mb-3">
                  Our Values
                </p> */}
                <h2 className="text-[28px] md:text-[32px] font-medium text-gray-900 tracking-tight">
                  What Drives Us Forward
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Value 1 */}
                <div className="bg-gray-900 rounded-2xl p-6 text-white">
                  <div className="h-12 w-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-[18px] font-medium mb-2">Patient-First Care</h3>
                  <p className="text-[14px] text-gray-400 leading-relaxed">
                    Every treatment plan is personalized. We listen, understand, and design recovery programs that fit your life and goals.
                  </p>
                </div>

                {/* Value 2 */}
                <div className="bg-cyan-500 rounded-2xl p-6 text-white">
                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-[18px] font-medium mb-2">Clinical Excellence</h3>
                  <p className="text-[14px] text-white/80 leading-relaxed">
                    Our physiotherapists average 10+ years of experience. We use evidence-based methods trusted by IPL teams and elite athletes.
                  </p>
                </div>

                {/* Value 3 */}
                <div className="bg-teal-600 rounded-2xl p-6 text-white">
                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-[18px] font-medium mb-2">Home-First Approach</h3>
                  <p className="text-[14px] text-white/80 leading-relaxed">
                    No travel, no waiting rooms. Our therapists come to you — at home, office, or training facility across 8+ cities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Meet Our Team Section - 4 Cards */}
          <div className="mt-20">
            <div className="text-center mb-12">
              {/* <p className="text-[12px] font-medium text-cyan-600 uppercase tracking-wider mb-3">
                Meet our team
              </p> */}
              <h2 className="text-[28px] md:text-[32px] font-medium text-gray-900 tracking-tight mb-4">
                Get to Know the{' '}
                <Highlighter action="underline" color="#22d3d1" isView>
                  People Behind the Progress
                </Highlighter>
              </h2>
              <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">
                50+ certified physiotherapists, sports medicine experts, and rehabilitation specialists dedicated to your recovery.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-medium text-gray-900">{member.name}</p>
                      <p className="text-[12px] text-gray-500">{member.role}</p>
                    </div>
                    <button className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <ChevronsRight className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Group Photo Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-[28px] md:text-[32px] font-medium text-gray-900 tracking-tight mb-4">
                Trusted by Champions, Built for Everyone
              </h2>
              <p className="text-[15px] text-gray-500 max-w-2xl mx-auto mb-6">
                From Mumbai Indians to Chennai Super Kings, from professional cricketers to your grandmother — we treat everyone with the same world-class care.
              </p>
              {/* <Button 
                className="h-11 px-6 text-[14px] font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-full"
                asChild
              >
                <Link href="/contact">
                  About Us
                </Link>
              </Button> */}
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop&q=80"
                alt="Our team working together"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>

        </div>
      </main>

      {/* Ground Team Section - Dark Theme */}
      <section className="relative py-24 bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Team Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop&q=80"
                  alt="Our ground team"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
              </div>
              {/* Floating glow */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-[80px]" />
            </div>

            {/* Right - Content */}
            <div>
              {/* <p className="text-[13px] text-cyan-400 mb-3">Our Ground Team</p> */}
              <h2 className="text-[32px] md:text-[40px] font-medium text-white mb-6 leading-tight tracking-tight">
                The Heroes Who{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Visit Your Home</span>
              </h2>
              <p className="text-[15px] text-gray-400 mb-8 leading-relaxed">
                Our field team of physiotherapists, yoga instructors, and care coordinators bring healing to your doorstep every day. They're not just healthcare providers — they're your partners in recovery.
              </p>

              {/* Team Members Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {groundTeam.slice(0, 4).map((member, index) => (
                  <div key={index} className="bg-gray-900/60 backdrop-blur rounded-xl p-4 border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${member.name.replace(' ', '')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc`}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-[13px] font-medium text-white">{member.name}</p>
                        <p className="text-[11px] text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                className="h-11 px-6 text-[14px] font-medium bg-cyan-500 hover:bg-cyan-600 text-white rounded-full"
                asChild
              >
                <Link href="/booking">
                  Book a Home Visit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Scrolling Team Rows */}
          <div className="mt-16 space-y-4 overflow-hidden">
            {/* Row 1 - Scroll Left */}
            <div className="flex animate-scroll-left gap-4">
              {[...groundTeam, ...groundTeam].map((member, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 flex items-center gap-3 bg-gray-900/60 backdrop-blur border border-gray-700/50 rounded-full px-4 py-2 hover:border-cyan-500/30 transition-colors"
                >
                  <img 
                    src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${member.name.replace(' ', '')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc`}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-[13px] font-medium text-white whitespace-nowrap">{member.name}</p>
                    <p className="text-[11px] text-gray-500 whitespace-nowrap">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 - Scroll Right */}
            <div className="flex animate-scroll-right gap-4">
              {[...groundTeam.slice(6), ...groundTeam.slice(0, 6), ...groundTeam.slice(6), ...groundTeam.slice(0, 6)].map((member, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 flex items-center gap-3 bg-gray-900/60 backdrop-blur border border-gray-700/50 rounded-full px-4 py-2 hover:border-teal-500/30 transition-colors"
                >
                  <img 
                    src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${member.name.replace(' ', '')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc`}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-[13px] font-medium text-white whitespace-nowrap">{member.name}</p>
                    <p className="text-[11px] text-gray-500 whitespace-nowrap">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
