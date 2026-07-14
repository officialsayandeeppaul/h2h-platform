import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ServiceReadyCtaProps = {
  title?: string;
  subtitle?: string;
  bookingHref?: string;
  contactHref?: string;
  bookLabel?: string;
  contactLabel?: string;
  className?: string;
};

/** COMMON_READY_CTA_01 — shared service-page call-to-action */
export function ServiceReadyCta({
  title = 'Ready to Get Started?',
  subtitle = 'Book your appointment today and take the first step towards recovery',
  bookingHref = '/booking',
  contactHref = '/contact',
  bookLabel = 'Book Appointment',
  contactLabel = 'Contact Us',
  className,
}: ServiceReadyCtaProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-cyan-500 to-teal-500 py-24 text-white',
        className
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center">
        <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.14em] text-white/70">
          H2H Healthcare
        </p>
        <h2 className="mb-4 text-[28px] font-medium tracking-tight text-white md:text-[36px]">
          {title}
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-[15px] leading-relaxed text-white/85">
          {subtitle}
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            className="h-12 rounded-full bg-white px-8 text-[14px] font-medium text-gray-900 hover:bg-gray-100 hover:!text-gray-900 [&_svg]:text-gray-900"
            asChild
          >
            <Link href={bookingHref}>
              {bookLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-full border border-white/50 bg-transparent px-8 text-[14px] font-medium text-white shadow-none hover:bg-white/15 hover:!text-white hover:border-white"
            asChild
          >
            <Link href={contactHref}>{contactLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
