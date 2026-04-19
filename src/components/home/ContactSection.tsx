'use client';

import Image from "next/image";
import { MARKETING_IMAGES } from "@/constants/marketing-images";
import { ContactMessageForm } from '@/components/shared/ContactMessageForm';

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
          <ContactMessageForm />

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={MARKETING_IMAGES.contactUs}
                alt="Professional consultation at H2H Healthcare"
                width={600}
                height={450}
                className="w-full h-[450px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 left-0 md:-left-6 bg-white rounded-2xl p-4 md:p-5 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <Image src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc1&backgroundColor=b6e3f4" alt="Doctor avatar" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white" loading="lazy" />
                  <Image src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc2&backgroundColor=c0aede" alt="Doctor avatar" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white" loading="lazy" />
                  <Image src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc3&backgroundColor=ffd5dc" alt="Doctor avatar" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white" loading="lazy" />
                  <Image src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc4&backgroundColor=d1d4f9" alt="Doctor avatar" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white" loading="lazy" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-gray-900">We respond quickly</p>
                  <p className="text-[12px] text-gray-500">Typical reply within one business day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
