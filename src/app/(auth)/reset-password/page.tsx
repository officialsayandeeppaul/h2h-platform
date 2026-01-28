'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    setIsLoading(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsSuccess(true);
      toast.success('Password updated successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/h2hwebsitelogo.png"
              alt="H2H Healthcare"
              className="h-24 w-auto object-contain"
            />
          </Link>

          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-[28px] font-semibold text-gray-900 mb-1">Set new password</h1>
                <p className="text-[15px] text-gray-500">
                  Your new password must be different from previously used passwords.
                </p>
              </div>

              {/* Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[13px] font-medium text-gray-700">New password*</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your new password"
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[13px] font-medium text-gray-700">Confirm password*</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your new password"
                              className="h-11 text-[14px] border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <p className="text-[12px] text-gray-500 mb-4">
                      Password must be at least 8 characters long
                    </p>
                  </div>

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
                <h1 className="text-[28px] font-semibold text-gray-900 mb-1">Password reset successful</h1>
                <p className="text-[15px] text-gray-500">
                  Your password has been successfully reset. You will be redirected to the login page shortly.
                </p>
              </div>

              <Button 
                className="w-full h-11 text-[14px] font-medium bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700"
                onClick={() => router.push('/login')}
              >
                Continue to login
              </Button>
            </>
          )}
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
              Create a strong password.
            </h2>
            <p className="text-[16px] text-gray-400 mb-12 max-w-md leading-relaxed">
              Choose a password that&apos;s hard to guess. Use a mix of letters, numbers, and symbols to keep your account secure.
            </p>

            {/* Tips Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-sm">
              <h3 className="text-[16px] font-semibold text-white mb-4">
                Password tips
              </h3>
              <ul className="space-y-3 text-[14px] text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Use at least 8 characters
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Include uppercase and lowercase letters
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Add numbers and special characters
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Avoid common words or personal info
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
