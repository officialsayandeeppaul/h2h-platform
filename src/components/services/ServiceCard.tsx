'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export type ServiceCardData = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt?: string;
};

export function ServiceCardSkeleton() {
  return (
    <article
      className="flex min-h-[280px] flex-col overflow-hidden rounded-md border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
      aria-hidden
    >
      <Skeleton className="h-40 w-full rounded-none bg-slate-200" />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <Skeleton className="h-5 w-3/4 bg-slate-200" />
        <Skeleton className="h-4 w-full bg-slate-100" />
        <Skeleton className="h-4 w-2/3 bg-slate-100" />
        <Skeleton className="mt-auto h-4 w-24 bg-slate-100" />
      </div>
    </article>
  );
}

export function ServiceCard({ service }: { service: ServiceCardData }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <article className="group flex min-h-[280px] flex-col overflow-hidden rounded-md border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(8,47,73,0.10)]">
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        {!loaded && (
          <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-none bg-slate-200" />
        )}
        <Image
          src={service.image}
          alt={service.imageAlt || service.title}
          width={800}
          height={480}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`h-40 w-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h2 className="text-lg font-medium leading-7 tracking-tight text-slate-900">
          {service.title}
        </h2>
        <p className="mt-2 flex-grow text-sm leading-6 text-slate-600">
          {service.description}
        </p>
        <Link
          href={service.href}
          className="mt-4 inline-flex items-center gap-2 text-sm font-normal text-cyan-600 transition-colors hover:text-cyan-700"
        >
          Learn more
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
