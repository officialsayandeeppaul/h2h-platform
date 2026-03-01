'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

const SERVICE_OPTIONS = [
  { id: 'sports_rehab', label: 'Sports Rehab' },
  { id: 'pain_management', label: 'Pain Management' },
  { id: 'home_physio', label: 'Home Physio' },
  { id: 'yoga_wellness', label: 'Yoga & Wellness' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Indian mobile: 10 digits, optionally +91 or 0 prefix
const MOBILE_REGEX = /^(\+91[\s-]?|0)?[6-9]\d{9}$/;

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [services, setServices] = useState<string[]>([]);
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
          if (u.phone) setPhone(u.phone);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const toggleService = (label: string) => {
    setServices((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const n = name.trim();
    if (!n) errs.name = 'Name is required';
    else if (n.length < 2) errs.name = 'Name must be at least 2 characters';
    const e = email.trim();
    if (!e) errs.email = 'Email is required';
    else if (!EMAIL_REGEX.test(e)) errs.email = 'Please enter a valid email address';
    const p = phone.trim();
    if (p && !MOBILE_REGEX.test(p.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit mobile number';
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
          phone: phone.trim() || undefined,
          message: message.trim(),
          services,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to send message. Please try again.');
        setStatus('idle');
        return;
      }
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setName('');
      setEmail(loggedInEmail ?? '');
      setPhone('');
      setMessage('');
      setServices([]);
      setStatus('idle');
    } catch {
      toast.error('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <section className="relative py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-4 leading-tight tracking-tight">
            Stay{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">Connected</span>
            {' '}with Us
          </h2>
          <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">
            Reach out for inquiries, support, or collaboration—we&apos;d love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Contact Form (always visible; success shows toast) */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFieldErrors((prev) => ({ ...prev, name: '' })); }}
                    placeholder="Enter your name here..."
                    className={`w-full p-3.5 rounded-xl bg-gray-50 border text-gray-900 text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-all disabled:opacity-70 ${fieldErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500'}`}
                    disabled={status === 'submitting'}
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors((prev) => ({ ...prev, email: '' })); }}
                    placeholder={loggedInEmail ? undefined : "Enter your Email here..."}
                    readOnly={!!loggedInEmail}
                    className={`w-full p-3.5 rounded-xl bg-gray-50 border text-gray-900 text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-all disabled:opacity-70 ${loggedInEmail ? 'bg-gray-100 cursor-not-allowed' : ''} ${fieldErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500'}`}
                    disabled={status === 'submitting'}
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">Phone</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setFieldErrors((prev) => ({ ...prev, phone: '' })); }}
                    placeholder="10-digit mobile number (optional)"
                    className={`w-full p-3.5 rounded-xl bg-gray-50 border text-gray-900 text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-all disabled:opacity-70 ${fieldErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500'}`}
                    disabled={status === 'submitting'}
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); setFieldErrors((prev) => ({ ...prev, message: '' })); }}
                    placeholder="Enter your message..."
                    rows={4}
                    className={`w-full p-3.5 rounded-xl bg-gray-50 border text-gray-900 text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-all resize-none disabled:opacity-70 ${fieldErrors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500'}`}
                    disabled={status === 'submitting'}
                  />
                </div>
                {/* <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-3 block">Services</label>
                  <div className="grid grid-cols-2 gap-3">
                    {SERVICE_OPTIONS.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services.includes(opt.label)}
                          onChange={() => toggleService(opt.label)}
                          disabled={status === 'submitting'}
                          className="w-4 h-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-[13px] text-gray-600">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div> */}
                {errorMsg && (
                  <p className="text-[13px] text-red-600">{errorMsg}</p>
                )}
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
                    'Send Message'
                  )}
                </Button>
              </form>
          </div>

          {/* Right - Image with stats */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=500&fit=crop"
                alt="Healthcare consultation"
                width={600}
                height={450}
                className="w-full h-[450px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating stats card */}
            <div className="absolute -bottom-6 left-0 md:-left-6 bg-white rounded-2xl p-4 md:p-5 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <Image src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc1&backgroundColor=b6e3f4" alt="Doctor avatar" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white" loading="lazy" />
                  <Image src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc2&backgroundColor=c0aede" alt="Doctor avatar" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white" loading="lazy" />
                  <Image src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc3&backgroundColor=ffd5dc" alt="Doctor avatar" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white" loading="lazy" />
                  <Image src="https://api.dicebear.com/9.x/lorelei/svg?seed=Doc4&backgroundColor=d1d4f9" alt="Doctor avatar" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white" loading="lazy" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-gray-900">20+ Daily New Clients</p>
                  <p className="text-[12px] text-gray-500">Join our growing family</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
