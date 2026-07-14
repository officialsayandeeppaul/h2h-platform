'use client';

import { Calendar, Phone, Video, Check } from 'lucide-react';
import type { CalBookingChannel } from '@/lib/cal/config';
import { cn } from '@/lib/utils';

const CHANNELS: {
  id: CalBookingChannel;
  title: string;
  description: string;
  icon: typeof Calendar;
}[] = [
  {
    id: 'calendar',
    title: 'Clinic visit',
    description: 'In-person at our centre',
    icon: Calendar,
  },
  {
    id: 'video',
    title: 'Video consult',
    description: 'Online audio & video',
    icon: Video,
  },
  {
    id: 'phone',
    title: 'Phone callback',
    description: 'We call your mobile',
    icon: Phone,
  },
];

interface ConsultationChannelPickerProps {
  value: CalBookingChannel | null;
  onChange: (channel: CalBookingChannel) => void;
}

export function ConsultationChannelPicker({
  value,
  onChange,
}: ConsultationChannelPickerProps) {
  return (
    <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-3">
      {CHANNELS.map((ch) => {
        const Icon = ch.icon;
        const selected = value === ch.id;
        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => onChange(ch.id)}
            className={cn('schedule-channel-card', selected && 'is-selected')}
          >
            {selected && (
              <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-3 w-3" />
              </span>
            )}
            <span className="schedule-channel-icon">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-gray-900">{ch.title}</span>
            <span className="mt-0.5 text-[11px] text-gray-500 leading-snug">
              {ch.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
