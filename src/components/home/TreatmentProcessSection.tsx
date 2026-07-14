'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Highlighter } from '@/components/ui/highlighter';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { treatmentSteps } from './data';
import { HOMEPAGE_PREVIEW_SLOTS } from '@/lib/scheduling/time-slots';
import { BookingScheduleDialog } from '@/components/scheduling/BookingScheduleDialog';
import { cn } from '@/lib/utils';

const ClientCalendar = dynamic(
  () =>
    import('@/components/ui/client-calendar').then((mod) => ({
      default: mod.ClientCalendar,
    })),
  { ssr: false }
);

function formatDateForInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function TreatmentProcessSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>(HOMEPAGE_PREVIEW_SLOTS[1]);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const prefillDate = selectedDate ? formatDateForInput(selectedDate) : undefined;

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <InteractiveGridPattern
        className="text-cyan-400/20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        width={60}
        height={60}
        squares={[25, 15]}
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-[32px] font-medium text-gray-900 leading-tight mb-3">
              Your Path to{' '}
              <Highlighter action="circle" color="#06b6d4" strokeWidth={2} animationDuration={400} isView>
                <span className="text-cyan-600">Recovery</span>
              </Highlighter>
            </h2>
            <p className="text-[15px] text-gray-500 mb-8">
              A proven{' '}
              <Highlighter action="highlight" color="#dbeafe" animationDuration={300} isView>
                <span className="text-blue-600 font-medium">4-step approach</span>
              </Highlighter>
              {' '}designed for lasting results
            </p>

            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {treatmentSteps.map((item) => (
                <div
                  key={item.step}
                  className="group p-5 sm:p-6 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all duration-200 ease-out"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-${item.color}-100 flex items-center justify-center mb-3`}
                  >
                    <span className={`text-[12px] font-bold text-${item.color}-600`}>
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button
                size="lg"
                className="h-12 px-8 text-[14px] font-medium bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 hover:text-white transition-colors duration-150"
                asChild
              >
                <Link href="/booking">
                  Start Your Recovery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-white rounded-2xl shadow-gray-200/50 border-0 p-6 sm:p-7 w-full max-w-md overflow-hidden font-[family-name:var(--font-poppins)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[16px] font-medium text-gray-900">Book Appointment</h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    Select date &amp; time (AM/PM)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <Image
                      src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc1&backgroundColor=b6e3f4"
                      alt="Doctor avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      loading="lazy"
                    />
                    <Image
                      src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc2&backgroundColor=c0aede"
                      alt="Doctor avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      loading="lazy"
                    />
                    <Image
                      src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc3&backgroundColor=ffd5dc"
                      alt="Doctor avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">
                    Specialists
                  </span>
                </div>
              </div>

              <ClientCalendar
                className="rounded-xl border border-gray-100 p-3 w-full"
                selected={selectedDate}
                onSelect={setSelectedDate}
              />

              <div className="mt-6">
                <p className="text-[12px] font-medium text-gray-700 mb-3">
                  Available Time Slots
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {HOMEPAGE_PREVIEW_SLOTS.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        'py-2.5 px-3 rounded-lg text-[11px] font-medium transition-colors duration-150 ease-out border cursor-pointer',
                        selectedTime === time
                          ? 'bg-cyan-500 text-white border-cyan-500'
                          : 'bg-gray-50 text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 border-gray-100'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-[12px] text-gray-500 truncate">
                      {selectedDate && selectedTime
                        ? `${prefillDate} · ${selectedTime}`
                        : 'Pick date & time'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    type="button"
                    className="h-9 px-4 text-[12px] font-medium bg-cyan-600 hover:bg-cyan-700 text-white shrink-0 cursor-pointer"
                    onClick={() => setScheduleOpen(true)}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingScheduleDialog
        open={scheduleOpen}
        initialChannel="calendar"
        onOpenChange={setScheduleOpen}
        prefill={{
          preferredDate: prefillDate,
          preferredTime: selectedTime,
        }}
      />
    </section>
  );
}
