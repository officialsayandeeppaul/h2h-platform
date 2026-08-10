import type { Metadata } from 'next';
import Link from 'next/link';
import { QuickBookingForm } from '@/components/booking/QuickBookingForm';

export const metadata: Metadata = {
  title: 'Quick Booking | H2H Healthcare',
  description: 'Book a service in seconds — just pick a service and share your name and mobile.',
};

type PageProps = {
  searchParams?: Promise<{ service?: string }>;
};

export default async function QuickBookingPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const serviceSlug = params.service || null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50/40 pt-28 pb-16">
      <div className="mx-auto max-w-lg px-6">
        <p className="mb-2 text-center text-[12px] font-medium uppercase tracking-[0.14em] text-cyan-700">
          H2H Healthcare
        </p>
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Quick Booking
        </h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          No doctor pick needed. Prefer a full appointment?{' '}
          <Link href="/booking" className="text-cyan-700 hover:underline">
            Book with doctor
          </Link>
        </p>
        <QuickBookingForm initialServiceSlug={serviceSlug} />
      </div>
    </main>
  );
}
