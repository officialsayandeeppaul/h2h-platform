'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { openQuickBooking } from '@/components/booking/QuickBookingDialog';
import { Button } from '@/components/ui/button';

function OpenFromQuery() {
  const searchParams = useSearchParams();
  const service = searchParams.get('service');

  useEffect(() => {
    openQuickBooking({ service });
  }, [service]);

  return null;
}

/** Deep link — opens the shared Quick Booking modal hosted in Header. */
export default function QuickBookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50/40">
      <Header />
      <main className="mx-auto max-w-lg px-6 pt-32 pb-20 text-center">
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-cyan-700 mb-2">
          H2H Healthcare
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Quick Booking</h1>
        <p className="text-sm text-gray-500 mb-6">
          Prefer full booking with a doctor?{' '}
          <Link href="/booking" className="text-cyan-700 hover:underline">
            Book with doctor
          </Link>
        </p>
        <Button
          type="button"
          className="bg-gradient-to-r from-blue-600 to-cyan-600"
          onClick={() => openQuickBooking()}
        >
          Open Quick Booking
        </Button>
        <Suspense fallback={null}>
          <OpenFromQuery />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
