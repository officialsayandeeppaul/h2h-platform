'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Key, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { AuthCheckSkeleton } from '@/components/admin/AdminSkeletons';

export default function AdminLoginPage() {
  const router = useRouter();
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [maskedOtpEmail, setMaskedOtpEmail] = useState('');

  useEffect(() => {
    checkSetupStatus();
  }, []);

  async function checkSetupStatus() {
    try {
      const res = await fetch('/api/admin/setup');
      const data = await res.json();
      setNeedsSetup(data.needsSetup);

      if (!data.needsSetup) {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        if (authData.user && ['super_admin', 'location_admin'].includes(authData.user.role)) {
          router.push('/super-admin');
        }
      }
    } catch (err) {
      console.error('Failed to check setup status:', err);
    } finally {
      setLoading(false);
    }
  }

  async function requestOtp() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-otp', secretKey, email }),
      });
      const data = await res.json();
      if (data.requiresOtp || data.success) {
        setOtpStep(true);
        setMaskedOtpEmail(data.maskedOtpEmail || '');
      } else {
        setError(data.error || 'Failed to send verification code');
      }
    } catch {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmSetup() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm', secretKey, email, otp }),
      });
      const data = await res.json();
      if (data.success && !data.requiresOtp) {
        window.location.href = '/login?redirect=/super-admin';
      } else {
        setError(data.error || 'Setup failed');
      }
    } catch {
      setError('Setup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    if (!otpStep) {
      await requestOtp();
      return;
    }
    await confirmSetup();
  }

  function handleGoogleLogin() {
    window.location.href = '/login?redirect=/super-admin';
  }

  if (loading) {
    return <AuthCheckSkeleton />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-cyan-950 to-teal-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/logo-caps.webp"
              alt="Heal to Health"
              className="h-14 sm:h-16 w-auto object-contain drop-shadow-lg"
            />
          </Link>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Admin Portal</h1>
          <p className="text-cyan-100/70 mt-2 text-sm">
            {needsSetup ? 'First-time setup required' : 'Sign in to manage H2H Healthcare'}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl border border-cyan-100/40">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {needsSetup ? (
            <form onSubmit={handleSetup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Key size={16} className="inline mr-1 text-cyan-700" />
                  Secret Key
                </label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter the super admin secret key"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 outline-none"
                  required
                  disabled={otpStep}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Mail size={16} className="inline mr-1 text-cyan-700" />
                  Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 outline-none"
                  required
                  disabled={otpStep}
                />
                <p className="text-xs text-slate-500 mt-1">Must already be registered via Google login</p>
              </div>

              {otpStep && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <ShieldCheck size={16} className="inline mr-1 text-cyan-700" />
                    Verification Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit code"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg tracking-[0.35em] text-center text-lg font-semibold focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 outline-none"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Code sent to {maskedOtpEmail || 'the security email'}
                  </p>
                  <button
                    type="button"
                    onClick={requestOtp}
                    disabled={submitting}
                    className="mt-2 text-xs text-cyan-700 hover:underline disabled:opacity-50"
                  >
                    Resend code
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || (otpStep && otp.length !== 6)}
                className="w-full py-3 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 disabled:opacity-50 font-medium inline-flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting
                  ? otpStep
                    ? 'Verifying...'
                    : 'Sending code...'
                  : otpStep
                    ? 'Verify & Create Super Admin'
                    : 'Send Verification Code'}
              </button>

              {otpStep && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setOtp('');
                    setError('');
                  }}
                  className="w-full text-sm text-slate-500 hover:text-slate-700"
                >
                  ← Edit email / secret
                </button>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-slate-600 text-sm">
                Sign in with Google. You must be an approved admin.
              </p>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center py-3 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-xs text-slate-500">
                <Link href="/" className="text-cyan-700 hover:underline">← Back to main site</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
