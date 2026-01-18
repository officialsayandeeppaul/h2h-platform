'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, memo } from 'react';
import { Menu, X, Phone, ChevronDown, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { APP_CONFIG } from '@/constants/config';
import { SERVICE_CATEGORIES } from '@/constants/services';
import { Marquee } from '@/components/ui/magic-components';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services', hasDropdown: true },
  { name: 'Locations', href: '/locations' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* Beta Mode Banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[30px]  bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 overflow-hidden">
        <Marquee className="py-1.5" pauseOnHover={false}>
          <div className="flex items-center gap-8 text-[12px] text-white font-medium">
            <span>We&apos;re currently in Beta Mode</span>
            <span className="text-white/60">•</span>
            <span>New features coming soon</span>
            <span className="text-white/60">•</span>
            <span>Experience the future of healthcare</span>
            <span className="text-white/60">•</span>
            <span>Report bugs and get early access benefits</span>
            <span className="text-white/60">•</span>
          </div>
        </Marquee>
      </div>

      <header className={`fixed top-[30px] left-0 right-0 z-50 transition-[background-color,box-shadow] duration-200 ease-out will-change-[background-color] ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="hidden sm:flex items-baseline gap-1">
              <span className="text-[16px] font-medium text-gray-900 tracking-tight">H2H</span>
              <span className="text-[14px] text-gray-500">Healthcare</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) =>
              item.hasDropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-[14px] text-gray-600 hover:text-gray-900 rounded-lg transition-all">
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52 p-2 bg-white border-gray-100 shadow-xl rounded-xl">
                    {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
                      <DropdownMenuItem key={key} asChild className="rounded-lg cursor-pointer focus:bg-gray-50">
                        <Link href={`/services/${key}`} className="py-2.5 px-3 text-[13px] text-gray-700 hover:text-cyan-600">
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem asChild className="rounded-lg bg-blue-50 mt-2 cursor-pointer focus:bg-blue-100">
                      <Link href="/services" className="py-2.5 px-3 text-[13px] font-medium text-cyan-600">
                        View All →
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-[14px] text-gray-600 hover:text-gray-900 rounded-lg transition-all"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${APP_CONFIG.phone}`}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-[13px] text-gray-500 hover:text-gray-700 rounded-lg transition-all"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">{APP_CONFIG.phone}</span>
            </a>

            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <Button variant="outline" className="text-[13px] font-medium border-cyan-500 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-300" asChild>
                  <Link href="/dashboard">
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" className="text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-100" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button className="text-[13px] font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0  transition-all duration-300" asChild>
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 transition-all duration-200 ease-out transform-gpu ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
            <nav className="flex flex-col p-4 gap-1 max-w-[1200px] mx-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-[14px] text-gray-700 hover:text-cyan-600 hover:bg-gray-50 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-gray-100">
                {user ? (
                  <Button variant="outline" className="w-full justify-center text-[13px] font-medium border-cyan-500 text-cyan-600 hover:bg-cyan-50" asChild>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="w-full justify-center text-[13px] border-gray-200 text-gray-700 hover:bg-gray-50" asChild>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    </Button>
                    <Button className="w-full justify-center text-[13px] font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" asChild>
                      <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>Book Appointment</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
      </div>
    </header>
    </>
  );
}
