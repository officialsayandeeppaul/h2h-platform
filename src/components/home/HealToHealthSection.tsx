'use client';

import { Calendar, Video, Phone, Heart, Home as HomeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Highlighter } from '@/components/ui/highlighter';
import { Dock, DockIcon } from '@/components/ui/dock';
import { BookingScheduleDialog } from '@/components/scheduling/BookingScheduleDialog';
import type { CalBookingChannel } from '@/lib/cal/config';

export function HealToHealthSection() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialChannel, setInitialChannel] = useState<CalBookingChannel | null>(null);

  const openBooking = (channel: CalBookingChannel) => {
    setInitialChannel(channel);
    setDialogOpen(true);
  };

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-[42px] md:text-[56px] font-bold text-gray-900 mb-6 leading-tight tracking-tight">
          From{' '}
          <Highlighter action="crossed-off" color="#e5e7eb" strokeWidth={2}>
            Heal
          </Highlighter>
          {' '}to{' '}
          <Highlighter action="highlight" color="#a5f3fc">
            Health
          </Highlighter>
        </h2>
        <p className="text-[17px] text-gray-500 max-w-2xl mx-auto mb-10">
          From acute injury to long-term pain—we focus on what you can do next, not buzzwords.
        </p>

        <div className="flex justify-center mb-8">
          <Dock className="bg-gray-100 border border-gray-200" disableMagnification>
            <DockIcon
              className="bg-cyan-500 text-white rounded-full p-2"
              role="button"
              tabIndex={0}
              aria-label="Book clinic visit"
              onClick={() => openBooking('calendar')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openBooking('calendar');
                }
              }}
            >
              <Calendar className="h-6 w-6" />
            </DockIcon>
            <DockIcon
              className="bg-teal-500 text-white rounded-full p-2"
              role="button"
              tabIndex={0}
              aria-label="Book video call"
              onClick={() => openBooking('video')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openBooking('video');
                }
              }}
            >
              <Video className="h-6 w-6" />
            </DockIcon>
            <DockIcon
              className="bg-blue-500 text-white rounded-full p-2"
              role="button"
              tabIndex={0}
              aria-label="Book phone call"
              onClick={() => openBooking('phone')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openBooking('phone');
                }
              }}
            >
              <Phone className="h-6 w-6" />
            </DockIcon>
            <DockIcon
              className="bg-purple-500 text-white rounded-full p-2"
              role="button"
              tabIndex={0}
              aria-label="About H2H Healthcare"
              onClick={() => router.push('/about')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push('/about');
                }
              }}
            >
              <Heart className="h-6 w-6" />
            </DockIcon>
            <DockIcon
              className="bg-orange-500 text-white rounded-full p-2"
              role="button"
              tabIndex={0}
              aria-label="Go to home page"
              onClick={() => router.push('/')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push('/');
                }
              }}
            >
              <HomeIcon className="h-6 w-6" />
            </DockIcon>
          </Dock>
        </div>

        <p className="text-[13px] text-gray-400">
          <span className="font-semibold text-gray-600">H2H Healthcare</span>
          {' '}— Physiotherapy &amp; sports rehab, built in India 🇮🇳
        </p>
      </div>

      <BookingScheduleDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setInitialChannel(null);
        }}
        initialChannel={initialChannel}
      />
    </section>
  );
}
