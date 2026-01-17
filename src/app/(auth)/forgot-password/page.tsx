'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setSentEmail(data.email);
      setIsEmailSent(true);
      toast.success('Password reset email sent!');
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!sentEmail) return;
    
    setIsLoading(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.resetPasswordForEmail(sentEmail, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password reset email resent!');
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-[420px]">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="font-semibold text-lg">H2H Healthcare</span>
          </Link>

          {!isEmailSent ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-[28px] font-semibold text-gray-900 mb-1">Forgot password?</h1>
                <p className="text-[15px] text-gray-500">
                  No worries, we&apos;ll send you reset instructions.
                </p>
              </div>

              {/* Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[13px] font-medium text-gray-700">Email address*</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="h-11 text-[14px] border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-11 text-[14px] font-medium bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reset password
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="mb-8">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <h1 className="text-[28px] font-semibold text-gray-900 mb-1">Check your email</h1>
                <p className="text-[15px] text-gray-500">
                  We sent a password reset link to<br />
                  <span className="font-medium text-gray-900">{sentEmail}</span>
                </p>
              </div>

              <Button 
                className="w-full h-11 text-[14px] font-medium bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 mb-4"
                onClick={() => window.open('https://mail.google.com', '_blank')}
              >
                Open email app
              </Button>

              <p className="text-center text-[14px] text-gray-500">
                Didn&apos;t receive the email?{' '}
                <button 
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-cyan-500 hover:underline font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Click to resend'}
                </button>
              </p>
            </>
          )}

          {/* Back to login link */}
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-[14px] text-gray-500 hover:text-gray-700 mt-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to log in
          </Link>
        </div>
      </div>

      {/* Right Side - Dark Panel */}
      <div className="relative hidden lg:block p-4">
        <div className="h-full w-full rounded-3xl bg-gray-900 relative overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[120px]" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center h-full px-12 xl:px-16">
            <h2 className="text-[36px] xl:text-[42px] font-semibold text-white leading-tight mb-4">
              Reset your password securely.
            </h2>
            <p className="text-[16px] text-gray-400 mb-12 max-w-md leading-relaxed">
              We take your security seriously. Follow the link in your email to create a new password and regain access to your account.
            </p>

            {/* Security Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 mb-4">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-[18px] font-semibold text-white mb-2">
                Your data is protected
              </h3>
              <p className="text-[14px] text-gray-400">
                We use industry-standard encryption to keep your personal health information safe and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
