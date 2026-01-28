'use client';

import { Calendar, Video, Phone, Heart, Home as HomeIcon } from "lucide-react";
import { Highlighter } from "@/components/ui/highlighter";
import { Dock, DockIcon } from "@/components/ui/dock";

export function HealToHealthSection() {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
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
  );
}
