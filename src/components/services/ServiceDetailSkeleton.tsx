'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

/** Full service-detail layout placeholder while content mounts */
export function ServiceDetailPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-white" aria-busy="true" aria-live="polite">
      <div className="h-[94px] border-b border-slate-100 bg-white" />
      <main className="flex-1 pt-24">
        <section className="bg-white py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <Skeleton className="mb-8 h-4 w-36 bg-slate-200" />

            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="mt-2 h-12 w-1 shrink-0 rounded-full bg-cyan-200" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-10 w-full max-w-md bg-slate-200" />
                    <Skeleton className="h-10 w-3/4 max-w-sm bg-slate-200" />
                  </div>
                </div>
                <Skeleton className="h-6 w-4/5 max-w-lg bg-cyan-100" />
                <Skeleton className="h-4 w-full bg-slate-100" />
                <Skeleton className="h-4 w-full bg-slate-100" />
                <Skeleton className="h-4 w-5/6 bg-slate-100" />
                <Skeleton className="h-4 w-full bg-slate-100" />
                <Skeleton className="h-4 w-2/3 bg-slate-100" />
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Skeleton className="h-12 w-full rounded-full bg-cyan-200 sm:w-44" />
                  <Skeleton className="h-12 w-full rounded-full bg-slate-200 sm:w-36" />
                </div>
              </div>

              <div className="relative">
                <Skeleton className="h-[min(400px,55vw)] w-full rounded-2xl bg-slate-200 sm:h-[400px]" />
                <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-cyan-50" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <Skeleton className="mx-auto mb-12 h-8 w-64 bg-slate-200" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-200" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full bg-slate-100" />
                      <Skeleton className="h-4 w-4/5 bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <Skeleton className="mx-auto mb-4 h-8 w-48 bg-slate-200" />
            <Skeleton className="mx-auto mb-12 h-4 w-72 bg-slate-100" />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 text-center">
                  <Skeleton className="h-16 w-16 rounded-2xl bg-cyan-100" />
                  <Skeleton className="h-4 w-28 bg-slate-200" />
                  <Skeleton className="h-3 w-full bg-slate-100" />
                  <Skeleton className="h-3 w-4/5 bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

type LazyServiceImageProps = {
  src: string;
  alt: string;
  objectClass?: string;
};

/** Hero image with skeleton until decode completes */
export function LazyServiceHeroImage({ src, alt, objectClass }: LazyServiceImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      <div className="relative h-[min(400px,55vw)] w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-[400px]">
        {!loaded && (
          <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-2xl bg-slate-200" />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 480px"
          loading="lazy"
          decoding="async"
          className={`${objectClass ?? 'object-cover object-center'} transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
      <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-cyan-100" />
    </div>
  );
}
