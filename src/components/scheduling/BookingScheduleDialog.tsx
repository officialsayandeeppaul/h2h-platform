'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  CAL_CHANNEL_LABELS,
  CAL_SERVICE_TAGS,
  isCalChannelConfigured,
  type CalBookingChannel,
} from '@/lib/cal/config';
import { CalBookingEmbed } from '@/components/scheduling/CalBookingEmbed';
import { ContactDetailsStep } from '@/components/scheduling/ContactDetailsStep';
import { ConsultationChannelPicker } from '@/components/scheduling/ConsultationChannelPicker';
import {
  ScheduleSlotFields,
  validateScheduleSlot,
  type ScheduleSlotValues,
} from '@/components/scheduling/ScheduleSlotFields';
import {
  validateContactDetails,
  type ContactDetails,
} from '@/lib/validation/schedule-contact';
import { cn } from '@/lib/utils';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  User,
} from 'lucide-react';

type Step = 'contact' | 'channel' | 'schedule' | 'done';

const EMPTY_CONTACT: ContactDetails = { name: '', email: '', phone: '' };
const EMPTY_SLOT: ScheduleSlotValues = {
  preferredDate: '',
  preferredTime: '',
  notes: '',
};

export interface BookingSchedulePrefill {
  preferredDate?: string;
  preferredTime?: string;
}

interface BookingScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-selects consult type on step 2 (does not skip that step). */
  initialChannel?: CalBookingChannel | null;
  prefill?: BookingSchedulePrefill;
}

const STEP_ORDER: Step[] = ['contact', 'channel', 'schedule'];

const STEP_META: Record<Exclude<Step, 'done'>, { label: string; short: string }> = {
  contact: { label: 'Your details', short: 'Contact' },
  channel: { label: 'Consult type', short: 'Type' },
  schedule: { label: 'Date & time', short: 'Slot' },
};

const btnPrimary =
  'bg-cyan-600 hover:bg-cyan-700 text-white hover:text-white font-medium';
const btnOutline =
  'border-gray-200 bg-white text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 font-medium';

function StepIndicator({ current }: { current: Step }) {
  const idx = STEP_ORDER.indexOf(current);
  if (idx < 0) return null;

  return (
    <div className="flex items-center justify-between gap-1 pt-3 mt-1.5 border-t border-white/15">
      {STEP_ORDER.map((id, i) => {
        const active = i === idx;
        const done = i < idx;
        return (
          <div key={id} className="flex flex-1 flex-col items-center gap-1 min-w-0">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium shrink-0',
                active && 'bg-white text-cyan-700 ring-2 ring-white/40',
                done && 'bg-emerald-400 text-white',
                !active && !done && 'bg-white/20 text-white/70'
              )}
            >
              {done ? '✓' : i + 1}
            </div>
            <span
              className={cn(
                'text-[10px] sm:text-[11px] font-medium text-center truncate w-full',
                active ? 'text-white' : 'text-white/70'
              )}
            >
              {STEP_META[id].short}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function StepHint({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="schedule-step-hint">
      <div className="schedule-step-hint-icon">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function stepDescription(step: Step): string {
  switch (step) {
    case 'contact':
      return 'Step 1 of 3 — quick & free. Press Enter when done.';
    case 'channel':
      return 'Step 2 of 3 — tap one option; next step opens automatically.';
    case 'schedule':
      return 'Step 3 of 3 — pick a date and time, then submit.';
    case 'done':
      return 'All set — we will confirm your booking soon.';
  }
}

export function BookingScheduleDialog({
  open,
  onOpenChange,
  initialChannel = null,
  prefill,
}: BookingScheduleDialogProps) {
  const [step, setStep] = useState<Step>('contact');
  const [contact, setContact] = useState<ContactDetails>(EMPTY_CONTACT);
  const [phoneNormalized, setPhoneNormalized] = useState<string | null>(null);
  const [channel, setChannel] = useState<CalBookingChannel | null>(null);
  const [slot, setSlot] = useState<ScheduleSlotValues>(EMPTY_SLOT);
  const [scheduleMode, setScheduleMode] = useState<'pick' | 'cal'>('pick');
  const [contactErrors, setContactErrors] = useState<
    Partial<Record<keyof ContactDetails, string>>
  >({});
  const [slotErrors, setSlotErrors] = useState<
    Partial<Record<keyof ScheduleSlotValues, string>>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [contactAttempted, setContactAttempted] = useState(false);

  const calReady = channel ? isCalChannelConfigured(channel) : false;

  useEffect(() => {
    if (!open) return;
    setStep('contact');
    setContact(EMPTY_CONTACT);
    setPhoneNormalized(null);
    setChannel(initialChannel);
    setSlot({
      ...EMPTY_SLOT,
      preferredDate: prefill?.preferredDate ?? '',
      preferredTime: prefill?.preferredTime ?? '',
    });
    setScheduleMode('pick');
    setContactErrors({});
    setSlotErrors({});
    setError(null);
    setLoading(false);
    setContactAttempted(false);
  }, [open, initialChannel, prefill?.preferredDate, prefill?.preferredTime]);

  const handleContactChange = (values: ContactDetails) => {
    setContact(values);
    if (contactAttempted || Object.keys(contactErrors).length > 0) {
      const result = validateContactDetails(values);
      setContactErrors(result.errors);
      if (result.valid) setError(null);
    } else {
      setContactErrors({});
      setError(null);
    }
  };

  const goToSchedule = (ch: CalBookingChannel) => {
    setChannel(ch);
    setError(null);
    setStep('schedule');
    setScheduleMode(isCalChannelConfigured(ch) ? 'cal' : 'pick');
  };

  const resetOnClose = (next: boolean) => {
    if (!next) {
      setStep('contact');
      setContact(EMPTY_CONTACT);
      setChannel(null);
      setSlot(EMPTY_SLOT);
    }
    onOpenChange(next);
  };

  const goBack = () => {
    setError(null);
    if (step === 'schedule') setStep('channel');
    else if (step === 'channel') setStep('contact');
  };

  const goContactNext = () => {
    setContactAttempted(true);
    const result = validateContactDetails(contact);
    setContactErrors(result.errors);
    if (!result.valid || !result.phoneNormalized) {
      setError('Please fill name, email, and a valid 10-digit mobile.');
      return;
    }
    setPhoneNormalized(result.phoneNormalized);
    setError(null);
    setContactErrors({});
    setStep('channel');
  };

  const submitManual = async () => {
    if (!channel || !phoneNormalized) return;
    const slotResult = validateScheduleSlot(slot);
    setSlotErrors(slotResult.errors);
    if (!slotResult.valid) {
      setError('Please pick a date and time below.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const message = [
        `Consultation: ${CAL_CHANNEL_LABELS[channel]}`,
        `Contact: ${contact.name.trim()}, ${contact.email.trim()}, +91 ${phoneNormalized}`,
        `Preferred slot: ${slot.preferredDate} ${slot.preferredTime}`,
        slot.notes.trim() ? `Notes: ${slot.notes.trim()}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name.trim(),
          email: contact.email.trim(),
          phone: phoneNormalized,
          message,
          services: ['quick_call_request', CAL_SERVICE_TAGS[channel]],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to submit request.');
      }
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit request.');
    } finally {
      setLoading(false);
    }
  };

  const title =
    step === 'done'
      ? 'Thank you!'
      : step === 'contact'
        ? 'Your contact details'
        : step === 'channel'
          ? 'Choose consult type'
          : 'Pick date & time';

  const isDone = step === 'done';

  return (
    <Dialog open={open} onOpenChange={resetOnClose}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'booking-schedule-dialog',
          'p-0 gap-0 !border-0 !bg-transparent !shadow-none ring-0 outline-none',
          'w-auto max-w-[calc(100%-2rem)] sm:max-w-lg',
          !isDone && 'max-h-[90vh]'
        )}
      >
        <div
          className={cn(
            'booking-schedule-shell relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100',
            !isDone && 'max-h-[90vh]'
          )}
        >
          <button
            type="button"
            onClick={() => resetOnClose(false)}
            className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-md text-white/90 hover:bg-white/15 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <span className="text-lg leading-none">×</span>
          </button>

          <div className="shrink-0 bg-gradient-to-br from-cyan-600 via-cyan-600 to-teal-600 px-5 sm:px-6 py-3.5 text-white pr-12">
            <DialogHeader className="text-left space-y-1 p-0">
              <DialogTitle className="text-white text-xl font-medium tracking-tight">
                {title}
              </DialogTitle>
              <DialogDescription className="text-cyan-50 text-sm font-normal">
                {stepDescription(step)}
              </DialogDescription>
            </DialogHeader>
            {!isDone && <StepIndicator current={step} />}
          </div>

          <div
            className={cn(
              'space-y-3 min-h-0',
              isDone
                ? 'px-5 sm:px-6 py-5'
                : 'overflow-y-auto thin-scrollbar px-5 sm:px-6 py-4'
            )}
          >
            {step === 'contact' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <StepHint icon={<User className="h-4 w-4" />} title="Free contact details">
                  Tell us how to reach you first. No payment required at this step.
                </StepHint>
                <ContactDetailsStep
                  values={contact}
                  onChange={handleContactChange}
                  errors={contactErrors}
                  onSubmit={goContactNext}
                />
              </div>
            )}

            {step === 'channel' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <StepHint icon={<Stethoscope className="h-4 w-4" />} title="Pick consult type">
                  Tap Clinic, Video, or Phone — the next step opens right away.
                </StepHint>
                <ConsultationChannelPicker value={channel} onChange={goToSchedule} />
              </div>
            )}

            {step === 'schedule' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {!channel ? (
                  <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    Please go back and select a consult type first.
                  </p>
                ) : (
                  <>
                    <StepHint icon={<CalendarDays className="h-4 w-4" />} title="Your booking summary">
                      <span className="block">
                        <span className="text-gray-500">Name:</span>{' '}
                        <span className="font-medium text-gray-800">{contact.name}</span>
                      </span>
                      <span className="block">
                        <span className="text-gray-500">Mobile:</span> +91 {phoneNormalized}
                      </span>
                      <span className="block">
                        <span className="text-gray-500">Type:</span>{' '}
                        <span className="font-medium text-cyan-700">
                          {CAL_CHANNEL_LABELS[channel]}
                        </span>
                      </span>
                    </StepHint>

                    {calReady && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={scheduleMode === 'cal' ? 'default' : 'outline'}
                          className={
                            scheduleMode === 'cal' ? btnPrimary : btnOutline
                          }
                          onClick={() => setScheduleMode('cal')}
                        >
                          Live Cal.com calendar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={scheduleMode === 'pick' ? 'default' : 'outline'}
                          className={
                            scheduleMode === 'pick' ? btnPrimary : btnOutline
                          }
                          onClick={() => setScheduleMode('pick')}
                        >
                          Pick time manually
                        </Button>
                      </div>
                    )}

                    {scheduleMode === 'cal' && calReady ? (
                      <CalBookingEmbed
                        channel={channel}
                        guestName={contact.name}
                        guestEmail={contact.email}
                        onBookingSuccess={() => setStep('done')}
                      />
                    ) : (
                      <ScheduleSlotFields
                        values={slot}
                        onChange={(v) => {
                          setSlot(v);
                          if (Object.keys(slotErrors).length) setSlotErrors({});
                        }}
                        errors={slotErrors}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {isDone && (
              <div className="text-center space-y-2 animate-in fade-in">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white text-lg font-medium">
                  ✓
                </div>
                <p className="text-base font-medium text-gray-900">Request received</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We will call or email you on{' '}
                  <span className="font-medium text-gray-800">+91 {phoneNormalized}</span>.
                </p>
              </div>
            )}

            {error && step !== 'done' && (
              <p className="text-sm text-red-600 text-center bg-red-50 border border-red-100 rounded-xl py-2 px-3">
                {error}
              </p>
            )}
          </div>

          <DialogFooter
            className={cn(
              'shrink-0 border-t border-gray-100 flex-row gap-2 bg-white',
              isDone ? 'px-5 sm:px-6 py-3 justify-center' : 'px-5 sm:px-6 py-3'
            )}
          >
            {isDone ? (
              <Button className={cn(btnPrimary, 'w-full sm:w-auto')} onClick={() => resetOnClose(false)}>
                Close
              </Button>
            ) : (
              <>
                {step !== 'contact' && (
                  <Button type="button" variant="outline" className={btnOutline} onClick={goBack}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                <div className="flex-1" />
              {step === 'contact' && (
                <Button
                  type="submit"
                  form="booking-contact-form"
                  className={cn(btnPrimary, 'min-w-[120px]')}
                >
                  Next: Consult type
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
              {step === 'channel' && channel && (
                <Button
                  type="button"
                  className={cn(btnPrimary, 'min-w-[120px]')}
                  onClick={() => goToSchedule(channel)}
                >
                  Next: Date & time
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
                {step === 'schedule' && channel && (scheduleMode === 'pick' || !calReady) && (
                  <Button
                    type="button"
                    className={cn(btnPrimary, 'min-w-[140px]')}
                    disabled={loading}
                    onClick={submitManual}
                  >
                    {loading ? 'Sending…' : 'Submit request'}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
