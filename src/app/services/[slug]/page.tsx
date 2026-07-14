'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Highlighter } from '@/components/ui/highlighter';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { DigitalHealthServiceDetail } from '@/components/services/DigitalHealthServiceDetail';
import { ServiceReadyCta } from '@/components/services/ServiceReadyCta';
import {
  LazyServiceHeroImage,
  ServiceDetailPageSkeleton,
} from '@/components/services/ServiceDetailSkeleton';
import { SERVICE_PAGE_CONTENT } from '@/constants/service-pages';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = SERVICE_PAGE_CONTENT[slug];
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [slug]);

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex flex-1 items-center justify-center pt-24">
          <div className="text-center">
            <h1 className="mb-4 text-[32px] font-medium text-gray-900">
              Service Not Found
            </h1>
            <p className="mb-8 text-gray-500">
              The service you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild>
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (slug === 'digital_health') {
    return <DigitalHealthServiceDetail />;
  }

  if (!ready) {
    return <ServiceDetailPageSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <Link
              href="/services"
              className="mb-8 inline-flex items-center gap-2 text-[14px] text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Link>

            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-12 w-1 rounded-full bg-cyan-500" />
                  <h1 className="text-[36px] font-medium leading-tight tracking-tight text-gray-900 md:text-[48px]">
                    {service.title}
                  </h1>
                </div>

                <p className="mb-6 text-[20px] font-medium leading-snug tracking-tight text-cyan-700 md:text-[22px]">
                  {service.tagline}
                </p>

                <p className="mb-4 text-[17px] leading-relaxed text-gray-700">
                  {service.intro}
                </p>
                <p className="mb-8 text-[15px] leading-relaxed text-gray-500">
                  {service.details}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    variant="cyan"
                    className="h-12 rounded-full px-8 text-[14px] font-medium"
                    asChild
                  >
                    <Link href={`/booking?service=${slug}`}>
                      Book Appointment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-gray-200 px-8 text-[14px] font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    asChild
                  >
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>

              <LazyServiceHeroImage
                src={service.image}
                alt={`${service.title} at H2H Healthcare`}
                objectClass={service.imageObjectClass}
              />
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-[28px] font-medium tracking-tight text-gray-900 md:text-[36px]">
                <Highlighter action="underline" color="#06b6d4" isView>
                  {service.benefitsTitle}
                </Highlighter>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {service.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-xl bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                    <p className="text-[15px] leading-relaxed text-gray-700">
                      {benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-[28px] font-medium tracking-tight text-gray-900 md:text-[36px]">
                Our Approach
              </h2>
              <p className="mx-auto max-w-xl text-[15px] text-gray-500">
                Four clear stages—so you always know what happens next
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100">
                    <span className="text-[20px] font-medium text-cyan-600">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-[16px] font-medium text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ServiceReadyCta
          title={service.cta.title}
          subtitle={service.cta.subtitle}
          bookingHref={`/booking?service=${slug}`}
        />
      </main>

      <Footer />
    </div>
  );
}
