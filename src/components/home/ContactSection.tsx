'use client';

import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section className="relative py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
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
  );
}
