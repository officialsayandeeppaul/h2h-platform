'use client';

import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Header, Footer } from '@/components/layout';
import { Highlighter } from '@/components/ui/highlighter';
import { Clock, MapPin, Phone, Mail, ChevronDown, ArrowUpRight, MessageCircle, ArrowRight } from 'lucide-react';

const Silk = dynamic(() => import('@/components/ui/silk'), { ssr: false });

const faqs = [
  {
    question: 'What services does H2H Healthcare provide?',
    answer: 'We offer physiotherapy, sports rehabilitation, pain management, yoga therapy, and home-based healthcare services. Our team of certified professionals brings quality care directly to your doorstep.',
  },
  {
    question: 'How do I book a home visit?',
    answer: 'You can book a home visit through our website by clicking the "Book Appointment" button, or call us directly at +91 1800 123 4567. Our team will schedule a convenient time for your session.',
  },
  {
    question: 'What areas do you serve?',
    answer: 'We currently serve major cities including Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and Ahmedabad. We\'re expanding to more cities soon.',
  },
  {
    question: 'What are your consultation fees?',
    answer: 'Our consultation fees vary based on the type of service and session duration. Basic consultations start from ₹500. Contact us for detailed pricing based on your specific needs.',
  },
  {
    question: 'Do you accept health insurance?',
    answer: 'Yes, we work with several health insurance providers. Please contact us with your insurance details, and we\'ll help you understand your coverage options.',
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
              We're Here to{' '}
              <Highlighter action="highlight" color="#87CEFA" isView>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">
                  Help You
                </span>
              </Highlighter>
            </h1>
            <p className="text-[15px] text-gray-500 max-w-xl mx-auto">
              Have questions about our services? Need to schedule an appointment? Our team is ready to assist you with personalized care and support.
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
                <p className="text-white text-[18px] font-medium mb-2">Happy to help you!</p>
                <p className="text-white/80 text-[14px]">
                  Our dedicated support team is available to assist you with any questions about our healthcare services.
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
                <h3 className="text-[14px] font-medium text-gray-900 mb-2">Office Hours</h3>
                <p className="text-[13px] text-gray-500">Monday - Saturday</p>
                <p className="text-[13px] text-gray-500">8:00 am to 8:00 pm</p>
              </div>

              {/* Our Address */}
              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="text-[14px] font-medium text-gray-900 mb-2">Our Address</h3>
                <p className="text-[13px] text-gray-500">Mumbai, Maharashtra</p>
                <p className="text-[13px] text-gray-500">India</p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-[14px] font-medium text-gray-900 mb-2">Email Us</h3>
                <p className="text-[13px] text-gray-500">support@h2h.health</p>
                <p className="text-[13px] text-gray-500">info@h2h.health</p>
              </div>

              {/* Phone */}
              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-[14px] font-medium text-gray-900 mb-2">Get in Touch</h3>
                <p className="text-[13px] text-gray-500">+91 1800 123 4567</p>
                <p className="text-[13px] text-gray-500">+91 98765 43210</p>
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
                Find answers to commonly asked questions about our services, booking process, and healthcare options. Can't find what you're looking for?
              </p>

              {/* Can't find answers card */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-[16px] font-medium text-gray-900 mb-2">Can't find answers?</h3>
                <p className="text-[14px] text-gray-500 mb-4">
                  We're here to help you out whenever you need! Get in touch with our dedicated support team for personalized assistance anytime.
                </p>
                <Button 
                  className="h-10 px-5 text-[13px] font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-full"
                  asChild
                >
                  <Link href="/booking">
                    Contact us
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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
            Book your first consultation today and experience healthcare that comes to you. Our team is ready to help you feel better.
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
              <Link href="tel:+911800123456">
                Call Us Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
