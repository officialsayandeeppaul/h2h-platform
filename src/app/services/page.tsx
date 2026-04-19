'use client';

import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { ArrowRight } from "lucide-react";
import {
  ServiceSectionVisual,
  type ServiceVisualId,
} from "@/components/services/ServiceSectionVisual";

const services = [
  {
    id: 'pain_relief_physiotherapy',
    title: 'Pain Relief & Physiotherapy Care',
    description:
      'Help for back pain, neck pain, sports niggles, and everyday aches—using hands-on physio and movement you can actually stick to.',
    details:
      'We start by listening: how pain shows up, what makes it worse, and what you want to do again. Then we combine hands-on treatment, simple exercises, and home tips so you move more freely—with fewer big words and more real progress.',
    color: 'red',
  },
  {
    id: 'advanced_rehabilitation',
    title: 'Advanced Rehabilitation & Recovery',
    description:
      'Structured support after surgery, stroke, or a serious injury—so you rebuild strength and confidence step by step.',
    details:
      'Whether you’re recovering from a joint replacement, a neurological setback, or a long hospital stay, we set clear, realistic goals—like walking farther, climbing stairs, or getting back to work—and adjust your plan as you improve.',
    color: 'blue',
  },
  {
    id: 'nutrition_lifestyle',
    title: 'Nutrition & Lifestyle Care',
    description:
      'Practical eating and lifestyle guidance—no fad diets, just habits that fit your routine and your health goals.',
    details:
      'Our nutritionists help with everyday meals: more energy, steadier weight, better blood sugar, or fuel for sport. You’ll get ideas you can cook at home, not a rigid rulebook—because food should work for your family and your schedule.',
    color: 'green',
  },
  {
    id: 'mental_wellness',
    title: 'Mental Wellness & Performance Care',
    description:
      'Support for stress, nerves, focus, and motivation—in sport, at work, or when life feels heavy.',
    details:
      'You’ll work with people who get pressure and recovery. We focus on simple tools: sleep, breathing, confidence, and balance—explained in plain language, with space to ask anything without judgement.',
    color: 'purple',
  },
  {
    id: 'therapeutic_yoga',
    title: 'Therapeutic Yoga & Wellness',
    description:
      'Gentle yoga that respects pain and stiffness—breath, stretching, and strength at the level that’s right for you.',
    details:
      'Perfect if you’re healing from an injury, managing a long-term condition, or new to yoga. We slow things down, offer options for every body, and never push you into poses that don’t feel safe.',
    color: 'teal',
  },
  {
    id: 'sports_performance',
    title: 'Sports Performance & Athlete Development',
    description:
      'Train smarter for your game—fitness, injury prevention, and coaching through our H2H Absolute Performance programme.',
    details:
      'For players, students, and clubs: we look at how you move, where you’re vulnerable, and how to get stronger and faster without breaking down. From preseason to coming back after time off, we’re on your side.',
    color: 'orange',
  },
  {
    id: 'digital_health',
    title: 'Digital Health & Web Solutions',
    description:
      'Freelance web and product engineering—apps, internal tools, integrations. Clear scopes, direct line to the people building.',
    details:
      'We ship and iterate software for Heal to Health and other serious scopes: user-facing products, admin tools, and delivery you can sustain after launch—domain-agnostic when the problem is clear.',
    color: 'cyan',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-8">
              {/* <p className="text-[13px] text-cyan-600 font-medium mb-3">Our Services</p> */}
              <h1 className="text-[36px] md:text-[48px] font-medium text-gray-900 tracking-tight leading-tight mb-6">
                Care that fits{' '}
                <Highlighter action="highlight" color="#06b6d4" isView>
                  <span className="text-white">your real life</span>
                </Highlighter>
              </h1>
              <p className="text-[15px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
                From pain and rehab to nutrition, yoga, and sports—we explain things clearly and build a plan around you. No corporate jargon; just honest guidance you can understand and use.
              </p>
            </div>
          </div>
        </section>

        {/* Individual Service Sections - Alternating Layout */}
        {services.map((service, index) => (
          <section 
            key={service.id} 
            className={`py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="grid lg:grid-cols-2 lg:items-stretch gap-12 lg:gap-20">
                {/* Content Side - Always on left for even, right for odd */}
                <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-1 h-10 rounded-full bg-cyan-500" />
                    <h2 className="text-[28px] md:text-[36px] font-semibold text-gray-900 tracking-tight">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-[16px] text-gray-700 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
                    {service.details}
                  </p>
                  
                  <Link 
                    href={`/services/${service.id}`} 
                    className="inline-flex items-center gap-2 text-[14px] font-medium transition-colors text-cyan-600 hover:text-cyan-700"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Illustration-only panel — no stock photos */}
                <ServiceSectionVisual
                  serviceId={service.id as ServiceVisualId}
                  title={service.title}
                  className={index % 2 === 1 ? 'lg:order-1' : undefined}
                />
              </div>
            </div>
          </section>
        ))}

        {/* Testimonials Section - Dark */}
        <section className="py-24 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-[100px]" />
          
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <p className="text-[13px] text-cyan-400 font-medium mb-3">Testimonials</p>
              <h2 className="text-[32px] md:text-[44px] font-medium text-white tracking-tight mb-4">
                What Our{' '}
                <span className="text-cyan-400">Patients Say</span>
              </h2>
              <p className="text-[15px] text-gray-400 max-w-xl mx-auto">
                Everyday people—athletes, parents, and grandparents—sharing what changed for them
              </p>
            </div>
            
            {/* Custom Testimonial Cards (Tweet-style) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <img 
                    src="https://api.dicebear.com/9.x/lorelei/svg?seed=rahul&backgroundColor=b6e3f4" 
                    alt="Rahul Kumar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-[14px]">Rahul Kumar</span>
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                      </svg>
                    </div>
                    <span className="text-gray-500 text-[13px]">@rahul_athlete</span>
                  </div>
                </div>
                <p className="text-gray-300 text-[14px] leading-relaxed mb-4">
                  After my ACL injury, I thought my cricket career was over. The team at <span className="text-cyan-400">@H2HHealthcare</span> got me back on the field in record time. Their sports rehab program is world-class! 🏏
                </p>
                <div className="flex items-center gap-4 text-gray-500 text-[12px]">
                  <span>Sports Rehabilitation</span>
                  <span>•</span>
                  <span>Mumbai</span>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <img 
                    src="https://api.dicebear.com/9.x/lorelei/svg?seed=priya&backgroundColor=c0aede" 
                    alt="Priya Sharma"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-[14px]">Priya Sharma</span>
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                      </svg>
                    </div>
                    <span className="text-gray-500 text-[13px]">@priya_wellness</span>
                  </div>
                </div>
                <p className="text-gray-300 text-[14px] leading-relaxed mb-4">
                  Living with chronic back pain for 5 years was exhausting. <span className="text-cyan-400">@H2HHealthcare</span> pain management team changed my life. I can finally play with my kids again! 💚
                </p>
                <div className="flex items-center gap-4 text-gray-500 text-[12px]">
                  <span>Pain Management</span>
                  <span>•</span>
                  <span>Delhi</span>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <img 
                    src="https://api.dicebear.com/9.x/lorelei/svg?seed=amit&backgroundColor=d1d4f9" 
                    alt="Amit Mehta"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-[14px]">Amit Mehta</span>
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                      </svg>
                    </div>
                    <span className="text-gray-500 text-[13px]">@amit_senior</span>
                  </div>
                </div>
                <p className="text-gray-300 text-[14px] leading-relaxed mb-4">
                  My father needed physiotherapy but couldn't travel. <span className="text-cyan-400">@H2HHealthcare</span> home visits were a blessing. Professional, caring, and so convenient! Highly recommend 🙏
                </p>
                <div className="flex items-center gap-4 text-gray-500 text-[12px]">
                  <span>Home Physiotherapy</span>
                  <span>•</span>
                  <span>Bangalore</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-cyan-500 to-teal-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
            <h2 className="text-[32px] md:text-[44px] font-medium text-white tracking-tight mb-6">
              Not sure where to start?
            </h2>
            <p className="text-[15px] text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
              Tell us what’s going on—we’ll suggest the right service and answer your questions. Book a free consultation and take it one easy step at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="h-12 px-8 text-[14px] font-medium bg-white hover:bg-gray-100 text-gray-900 rounded-full"
                asChild
              >
                <Link href="/booking">
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                className="h-12 px-8 text-[14px] font-medium bg-transparent border border-white/50 text-white hover:bg-white/10 rounded-full"
                asChild
              >
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
