'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QuickBookingForm } from '@/components/booking/QuickBookingForm';
import { cn } from '@/lib/utils';

export const QUICK_BOOKING_EVENT = 'h2h:open-quick-booking';

export type OpenQuickBookingDetail = {
  service?: string | null;
};

/** Open Quick Booking modal from anywhere (navbar, services CTA, etc.). */
export function openQuickBooking(detail?: OpenQuickBookingDetail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(QUICK_BOOKING_EVENT, {
      detail: { service: detail?.service ?? null },
    })
  );
}

type QuickBookingDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialServiceSlug?: string | null;
};

/**
 * Same shell pattern as BookingScheduleDialog — cyan header + white body.
 * Mount once (e.g. in Header) and open via openQuickBooking().
 */
export function QuickBookingDialog({
  open: controlledOpen,
  onOpenChange,
  initialServiceSlug = null,
}: QuickBookingDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [serviceSlug, setServiceSlug] = useState<string | null>(initialServiceSlug);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
      if (!next) setServiceSlug(null);
    },
    [isControlled, onOpenChange]
  );

  useEffect(() => {
    const handler = (event: Event) => {
      const ce = event as CustomEvent<OpenQuickBookingDetail>;
      setServiceSlug(ce.detail?.service ?? null);
      setOpen(true);
    };
    window.addEventListener(QUICK_BOOKING_EVENT, handler);
    return () => window.removeEventListener(QUICK_BOOKING_EVENT, handler);
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'p-0 gap-0 !border-0 !bg-transparent !shadow-none ring-0 outline-none',
          'w-auto max-w-[calc(100%-2rem)] sm:max-w-lg',
          'max-h-[90vh]'
        )}
      >
        <div className="relative flex max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-md text-white/90 hover:bg-white/15 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <span className="text-lg leading-none">×</span>
          </button>

          <div className="shrink-0 bg-gradient-to-br from-cyan-600 via-cyan-600 to-teal-600 px-5 sm:px-6 py-3.5 text-white pr-12">
            <DialogHeader className="text-left space-y-1 p-0">
              <DialogTitle className="text-white text-xl font-medium tracking-tight">
                Quick Booking
              </DialogTitle>
              <DialogDescription className="text-cyan-50 text-sm font-normal">
                Service + name + mobile — no doctor pick needed.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="overflow-y-auto px-5 sm:px-6 py-5">
            {open && (
              <QuickBookingForm
                key={serviceSlug || 'default'}
                initialServiceSlug={serviceSlug}
                variant="modal"
                onSuccess={() => {
                  /* keep modal open to show success state inside form */
                }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
