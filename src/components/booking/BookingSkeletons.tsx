'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Top stepper row — matches booking progress UI */
export function BookingStepperSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm',
        className
      )}
    >
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex min-w-0 flex-1 items-center">
            <div className="flex w-full flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full bg-gray-200/90" />
              <Skeleton className="hidden h-2.5 w-14 rounded sm:block md:w-20" />
            </div>
            {i < 4 && (
              <Skeleton className="mx-0.5 h-[2px] min-w-[8px] flex-1 rounded-full bg-gray-200/70 sm:mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Step: Location — mode cards (online / clinic) */
export function BookingLocationSkeleton() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-10 space-y-3 text-center">
        <Skeleton className="mx-auto h-4 w-32 rounded-full bg-gray-200/90" />
        <Skeleton className="mx-auto h-10 max-w-md rounded-lg bg-gray-200/90" />
        <Skeleton className="mx-auto h-4 max-w-lg rounded-md bg-gray-100" />
      </div>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-14 w-14 rounded-2xl bg-gray-200/80" />
              <Skeleton className="h-6 w-6 rounded-full bg-gray-100" />
            </div>
            <Skeleton className="mb-2 h-6 w-[60%] rounded-md" />
            <Skeleton className="mb-4 h-4 w-full rounded-md bg-gray-100" />
            <Skeleton className="h-4 w-[80%] rounded-md bg-gray-100" />
            <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-[85%] rounded-md bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** City / tier selection grid */
export function BookingCityGridSkeleton() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8 space-y-2 text-center">
        <Skeleton className="mx-auto h-9 max-w-sm rounded-lg bg-gray-200/90" />
        <Skeleton className="mx-auto h-4 max-w-md rounded-md bg-gray-100" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md"
          >
            <Skeleton className="h-32 w-full rounded-none bg-gradient-to-br from-gray-200 to-gray-100" />
            <div className="space-y-2 p-3">
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Step: Service — category chips + card grid */
export function BookingServiceSkeleton() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8 space-y-3 text-center">
        <Skeleton className="mx-auto h-10 max-w-lg rounded-lg bg-gray-200/90" />
        <Skeleton className="mx-auto h-4 max-w-md rounded-md bg-gray-100" />
      </div>
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-lg bg-gray-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <Skeleton className="h-5 w-20 rounded-md bg-gray-100" />
              <Skeleton className="h-5 w-5 rounded-full bg-gray-100" />
            </div>
            <Skeleton className="mb-2 h-5 w-[80%] rounded-md" />
            <Skeleton className="mb-2 h-3 w-full rounded-md bg-gray-100" />
            <Skeleton className="mb-4 h-3 w-[85%] rounded-md bg-gray-100" />
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <Skeleton className="h-3 w-16 rounded-md bg-gray-100" />
              <Skeleton className="h-3 w-12 rounded-md bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Step: Doctor — avatar + text rows */
export function BookingDoctorSkeleton() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-10 space-y-2 text-center">
        <Skeleton className="mx-auto h-10 max-w-md rounded-lg bg-gray-200/90" />
        <Skeleton className="mx-auto h-4 max-w-sm rounded-md bg-gray-100" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <Skeleton className="h-14 w-14 shrink-0 rounded-full bg-gray-200/90" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-4 w-[75%] rounded-md" />
                  <Skeleton className="h-5 w-5 shrink-0 rounded-full bg-gray-100" />
                </div>
                <Skeleton className="h-3 w-full rounded-md bg-gray-100" />
                <div className="flex gap-3 pt-1">
                  <Skeleton className="h-3 w-12 rounded-md bg-gray-100" />
                  <Skeleton className="h-3 w-14 rounded-md bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Right column only — while availability slots are fetching */
export function BookingTimeSlotGridSkeleton() {
  return (
    <div className="grid max-h-[280px] animate-in fade-in grid-cols-4 gap-2 overflow-y-auto p-1 duration-300 sm:grid-cols-5 md:grid-cols-6">
      {Array.from({ length: 18 }).map((_, i) => (
        <Skeleton key={i} className="h-12 rounded-lg bg-gray-100" />
      ))}
    </div>
  );
}

/** Date & time step — full two-column shell (optional full-step loading) */
export function BookingDateTimeSlotsSkeleton() {
  return (
    <div className="grid max-w-4xl animate-in fade-in gap-4 duration-300 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-7 w-24 rounded-full bg-gray-100" />
        </div>
        <div className="flex justify-center">
          <div className="grid w-full max-w-[280px] grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  'aspect-square rounded-md',
                  i % 7 === 0 || i % 7 === 6 ? 'bg-gray-50' : 'bg-gray-100'
                )}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-40 rounded-md bg-gray-100" />
          </div>
          <Skeleton className="h-7 w-16 rounded-full bg-gray-100" />
        </div>
        <BookingTimeSlotGridSkeleton />
      </div>
    </div>
  );
}

/** Full-page initial load (Suspense) — stepper + content shell */
export function BookingPageSuspenseSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1100px] px-6 pb-16 pt-28">
        <BookingStepperSkeleton className="mb-10" />
        <div className="mx-auto max-w-5xl">
          <BookingLocationSkeleton />
        </div>
      </div>
    </div>
  );
}
