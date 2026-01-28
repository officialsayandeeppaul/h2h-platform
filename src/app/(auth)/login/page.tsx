'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AvatarCircles } from '@/components/ui/avatar-circles';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast.success('Registration successful! Please check your email to verify your account.');
    }
    if (searchParams.get('verified') === 'true') {
      toast.success('Email verified! You can now sign in.');
    }
    const error = searchParams.get('error');
    if (error) {
      if (error === 'auth_failed') {
        toast.error('Authentication failed. Please try again.');
      } else if (error === 'invalid_request' || error === 'bad_oauth_state') {
        toast.error('Session expired. Please try signing in again.');
      } else {
        toast.error(searchParams.get('error_description') || 'An error occurred. Please try again.');
      }
    }
  }, [searchParams]);
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email before signing in');
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success('Welcome back!');
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      const supabase = createClient();
      const redirect = searchParams.get('redirect');
      // Always use window.location.origin for OAuth redirects - it's always correct for the current environment
      const baseUrl = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/auth/callback${redirect ? `?next=${encodeURIComponent(redirect)}` : ''}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-[420px]">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/h2hwebsitelogo.png"
              alt="H2H Healthcare"
              className="h-24 w-auto object-contain"
            />
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-semibold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-[15px] text-gray-500">
              Sign in to your account to continue
            </p>
          </div>

          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full h-11 text-[14px] font-medium border-gray-200 hover:bg-gray-50 mb-6"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">or</span>
            </div>
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium text-gray-700">Password*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="h-11 text-[14px] border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[12px]" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end pt-1">
                <Link
                  href="/forgot-password"
                  className="text-[13px] text-cyan-500 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-[14px] font-medium bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 mt-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in to H2H Healthcare
              </Button>
            </form>
          </Form>

          {/* Sign up link */}
          <p className="text-center text-[14px] text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-cyan-500 hover:underline font-medium">
              Sign up
            </Link>
          </p>
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
              Welcome back to H2H Healthcare.
            </h2>
            <p className="text-[16px] text-gray-400 mb-12 max-w-md leading-relaxed">
              Access your appointments, medical records, and personalized health insights all in one place.
            </p>

            {/* Stats Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 mb-4">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="text-[18px] font-semibold text-white mb-2">
                Trusted by thousands of patients
              </h3>
              <p className="text-[14px] text-gray-400 mb-5">
                Join our growing community of patients who trust H2H Healthcare for their wellness journey.
              </p>
              <div className="flex items-center gap-3">
                <AvatarCircles
                  numPeople={10000}
                  avatarUrls={[
                    { imageUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=User1&backgroundColor=b6e3f4', profileUrl: '#' },
                    { imageUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=User2&backgroundColor=c0aede', profileUrl: '#' },
                    { imageUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=User3&backgroundColor=d1d4f9', profileUrl: '#' },
                  ]}
                  className="[&_img]:border-gray-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
