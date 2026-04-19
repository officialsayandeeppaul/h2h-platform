'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Exactly 10 digits, Indian mobile range (starts with 6–9) */
const INDIAN_MOBILE_10 = /^[6-9]\d{9}$/;

/** Keep only digits, max 10; strip leading 91 / 0 so users can paste +91… */
function normalizePhoneTenDigits(raw: string): string {
  let d = raw.replace(/\D/g, '');
  if (d.length >= 12 && d.startsWith('91')) d = d.slice(-10);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return d.slice(0, 10);
}

type ContactMessageFormProps = {
  className?: string;
};

export function ContactMessageForm({ className }: ContactMessageFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const errorMsg = fieldErrors.name || fieldErrors.email || fieldErrors.phone || fieldErrors.message || '';

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const u = data?.user;
        if (u) {
          if (u.email) {
            setLoggedInEmail(u.email);
            setEmail(u.email);
          }
          if (u.full_name) setName(u.full_name);
          if (u.phone) setPhone(normalizePhoneTenDigits(String(u.phone)));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const n = name.trim();
    if (!n) errs.name = 'Name is required';
    else if (n.length < 2) errs.name = 'Name must be at least 2 characters';
    const e = email.trim();
    if (!e) errs.email = 'Email is required';
    else if (!EMAIL_REGEX.test(e)) errs.email = 'Please enter a valid email address';
    const p = phone.trim();
    if (p.length > 0 && (p.length !== 10 || !INDIAN_MOBILE_10.test(p))) {
      errs.phone = 'Enter exactly 10 digits (6–9 first digit), or leave blank';
    }
    const m = message.trim();
    if (!m) errs.message = 'Message is required';
    else if (m.length < 10) errs.message = 'Message must be at least 10 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFieldErrors({});
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim().length === 10 ? phone.trim() : undefined,
          message: message.trim(),
          services: [],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to send message. Please try again.');
        setStatus('idle');
        return;
      }
      toast.success("Message sent successfully! We'll get back to you soon.");
      setName('');
      setEmail(loggedInEmail ?? '');
      setPhone('');
      setMessage('');
      setStatus('idle');
    } catch {
      toast.error('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  const inputBase =
    'w-full p-3.5 rounded-xl bg-gray-50 border text-gray-900 text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-all disabled:opacity-70';

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm',
        className
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-[13px] font-medium text-gray-700 mb-2 block">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="Your name"
            autoComplete="name"
            className={cn(
              inputBase,
              fieldErrors.name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500'
            )}
            disabled={status === 'submitting'}
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-gray-700 mb-2 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: '' }));
            }}
            placeholder={loggedInEmail ? undefined : 'you@example.com'}
            readOnly={!!loggedInEmail}
            autoComplete="email"
            className={cn(
              inputBase,
              loggedInEmail ? 'bg-gray-100 cursor-not-allowed' : '',
              fieldErrors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500'
            )}
            disabled={status === 'submitting'}
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-gray-700 mb-2 block">Phone</label>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            value={phone}
            onChange={(e) => {
              setPhone(normalizePhoneTenDigits(e.target.value));
              setFieldErrors((prev) => ({ ...prev, phone: '' }));
            }}
            placeholder="10-digit mobile (optional)"
            autoComplete="tel"
            className={cn(
              inputBase,
              fieldErrors.phone
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500'
            )}
            disabled={status === 'submitting'}
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-gray-700 mb-2 block">Message</label>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setFieldErrors((prev) => ({ ...prev, message: '' }));
            }}
            placeholder="How can we help?"
            rows={4}
            className={cn(
              inputBase,
              'resize-none',
              fieldErrors.message
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500'
            )}
            disabled={status === 'submitting'}
          />
        </div>
        {errorMsg && <p className="text-[13px] text-red-600">{errorMsg}</p>}
        <Button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full h-12 text-[14px] font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl transition-colors duration-150"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Sending...
            </>
          ) : (
            'Send message'
          )}
        </Button>
      </form>
    </div>
  );
}
