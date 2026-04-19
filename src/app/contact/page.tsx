'use client';

import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Header, Footer } from '@/components/layout';
import { Highlighter } from '@/components/ui/highlighter';
import { ContactMessageForm } from '@/components/shared/ContactMessageForm';
import { APP_CONFIG, BOOKING_RULES } from '@/constants/config';
import { Clock, MapPin, Phone, Mail, ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';

const Silk = dynamic(() => import('@/components/ui/silk'), { ssr: false });

const phoneTel = `tel:${APP_CONFIG.phone.replace(/\s/g, '')}`;

const faqs = [
  {
    question: 'What does H2H Healthcare offer?',
    answer:
      'Sports rehabilitation, physiotherapy, pain management, therapeutic yoga, and related services—online, in clinic, or at home where we operate. Absolute Performance (academies & teams) is coordinated separately via our performance inbox.',
  },
  {
    question: 'How do I book a visit?',
    answer: `Use Book Appointment on this site to pick a service, location, and slot. For home visits, choose home if your pin code is in range. You can also call ${APP_CONFIG.phone} for help.`,
  },
  {
    question: 'Where do you operate?',
    answer:
      'We work with patients and partners across major Indian cities—see our Locations page for centres and coverage. Home-visit availability depends on city and clinician capacity.',
  },
  {
    question: 'How much does a session cost?',
    answer:
      'Fees depend on the service, city tier, and whether the session is clinic, online, or home. Prices are shown in the booking flow and on each service page—no hidden charges beyond what you confirm at checkout.',
  },
  {
    question: 'Do you accept insurance or corporate tie-ups?',
    answer:
      'Coverage varies by insurer, policy, and location. Tell us your provider when you book or email support—we’ll confirm what’s possible for that visit. Corporate and academy programmes are handled case by case.',
  },
  {
    question: 'Do you offer online or video consultations?',
    answer:
      'Yes, where the service allows it you can book an online slot in the same flow as clinic visits. You will see which modes are available for each service before you confirm.',
  },
  {
    question: 'How do home visits work?',
    answer:
      'Choose a home visit when booking if your area is served. A clinician travels to you; timing and travel rules follow city and capacity. If home is not available for your pin code, the booking flow will show clinic or online options instead.',
  },
  {
    question: 'Can I cancel or reschedule?',
    answer: `You can cancel or reschedule from your account or by contacting support. Our standard notice windows are ${BOOKING_RULES.cancellationHours} hours to cancel and ${BOOKING_RULES.rescheduleHours} hours to reschedule—exact rules are shown at booking and in your confirmation.`,
  },
  {
    question: 'What should I bring to my first session?',
    answer:
      'Bring a valid ID, any recent scans or reports you have, a list of medications, and comfortable clothing for movement. If you are unsure, mention it when you book and we will tell you anything specific for that service.',
  },
  {
    question: 'How do academies or teams work with H2H?',
    answer:
      'Screening, on-field cover, and injury-prevention programmes for federations and academies are coordinated through our Absolute Performance channel. Email the performance inbox listed on our Contact page with your organisation and needs.',
  },
  {
    question: 'How is my information used?',
    answer:
      'We use your details only to provide care, manage bookings, and meet legal obligations. See our Privacy Policy for how data is stored and your choices; never share passwords or OTPs with anyone claiming to be staff.',
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <div className="max-w-[1200px] mt-24 mx-auto px-6">
          <div className="text-center mb-16">
            {/* <p className="text-[13px] font-medium text-cyan-600 mb-4">Contact Us</p> */}
            <h1 className="text-[36px] md:text-[48px] font-medium text-gray-900 tracking-tight leading-tight mb-6">
              We&apos;re here to{' '}
              <Highlighter action="highlight" color="#87CEFA" isView>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">
                  help
                </span>
              </Highlighter>
            </h1>
            <p className="text-[15px] text-gray-500 max-w-xl mx-auto leading-relaxed">
              Questions about physio, sports rehab, pain care, or booking? Reach us by email or phone—same details as across the rest of {APP_CONFIG.name}.
            </p>
          </div>

          {/* Contact Info Cards + Image Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Left - Image */}
            <div className="relative rounded-2xl overflow-hidden h-[400px] lg:h-auto">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80"
                alt="Contact support"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-[18px] font-medium mb-2">Talk to the team</p>
                <p className="text-white/80 text-[14px]">
                  Clear answers on services, slots, and what to expect—no runaround.
                </p>
              </div>
            </div>

            {/* Right - Contact Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Office Hours */}
              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="text-[14px] font-medium text-gray-900 mb-2">Office hours</h3>
                <p className="text-[13px] text-gray-500">Mon - Sat (IST)</p>
                <p className="text-[13px] text-gray-500">8:00 am - 8:00 pm</p>
                <p className="text-[11px] text-gray-400 mt-2">Clinic slots may vary by location</p>
              </div>

              {/* Our Address */}
              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="text-[14px] font-medium text-gray-900 mb-2">Locations</h3>
                <p className="text-[13px] text-gray-500">Clinics &amp; partners</p>
                <p className="text-[13px] text-gray-500 mb-2">across India</p>
                <Link href="/locations" className="text-[12px] font-medium text-cyan-600 hover:text-cyan-700">
                  View all locations
                </Link>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-[14px] font-medium text-gray-900 mb-2">Email</h3>
                <a href={`mailto:${APP_CONFIG.email}`} className="text-[13px] text-cyan-600 hover:underline break-all">
                  {APP_CONFIG.email}
                </a>
                <p className="text-[11px] text-gray-400 mt-2">Academies &amp; performance</p>
                <a href={`mailto:${APP_CONFIG.performanceEmail}`} className="text-[12px] text-gray-500 hover:text-cyan-600 break-all">
                  {APP_CONFIG.performanceEmail}
                </a>
              </div>

              {/* Phone */}
              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-[14px] font-medium text-gray-900 mb-2">Phone</h3>
                <a href={phoneTel} className="text-[13px] text-cyan-600 hover:underline">
                  {APP_CONFIG.phone}
                </a>
                <p className="text-[11px] text-gray-400 mt-2">Toll-free · India</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - FAQ Header */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-6">
                <MessageCircle className="h-4 w-4 text-gray-600" />
                <span className="text-[13px] font-medium text-gray-700">FAQ</span>
              </div>
              <h2 className="text-[28px] md:text-[36px] font-medium text-gray-900 tracking-tight leading-tight mb-4">
                Have more{' '}
                <Highlighter action="underline" color="#22d3d1" isView>
                  questions?
                </Highlighter>
              </h2>
              <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
                Booking, pricing, coverage, and what we treat—straight answers on the right. Send a message below and our team will pick it up from the support queue—we usually reply within one business day.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-[16px] font-medium text-gray-900 mb-1">Send us a message</h3>
                  <p className="text-[13px] text-gray-500">
                    Tell us what you need—we route every submission to our support team.
                  </p>
                </div>
                <ContactMessageForm className="bg-gray-50 border-gray-100" />
                <p className="text-[13px] text-gray-500">
                  Need a slot instead?{' '}
                  <Link href="/booking" className="font-medium text-cyan-600 hover:text-cyan-700">
                    Book an appointment
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Right - FAQ Accordion */}
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className={`bg-gray-50 rounded-xl overflow-hidden transition-all ${openFaq === index ? 'ring-1 ring-cyan-200' : ''}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-[14px] font-medium text-gray-900 pr-4">{faq.question}</span>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === index ? 'bg-cyan-500 text-white' : 'bg-white text-gray-600'}`}>
                      <ChevronDown className={`h-4 w-4 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5">
                      <p className="text-[14px] text-gray-500 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Silk Background CTA Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <Silk 
            speed={3} 
            scale={1.2} 
            color="#0891b2" 
            noiseIntensity={1.2} 
            rotation={0} 
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-[28px] md:text-[40px] font-medium text-white tracking-tight mb-4">
            Ready to Start Your{' '}
            <span className="text-cyan-300">Recovery Journey?</span>
          </h2>
          <p className="text-[15px] text-white/80 max-w-xl mb-8">
            Book sports rehab, physio, or pain care in a few clicks—or call {APP_CONFIG.phone} if you prefer talking first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="h-12 px-8 text-[14px] font-medium bg-white hover:bg-gray-100 text-gray-900 rounded-full"
              asChild
            >
              <Link href="/booking">
                Book Appointment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              className="h-12 px-8 text-[14px] font-medium bg-transparent border border-white/50 text-white hover:bg-white/10 rounded-full"
              asChild
            >
              <Link href={phoneTel}>
                Call {APP_CONFIG.phone}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
