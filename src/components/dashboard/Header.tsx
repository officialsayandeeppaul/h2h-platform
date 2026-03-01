'use client';

import { useState, useEffect, useCallback } from 'react';
import { DoctorNotificationDrawer } from '@/components/doctor/DoctorNotificationDrawer';
import { PatientNotificationDrawer } from '@/components/patient/PatientNotificationDrawer';

const DOCTOR_SEEN_KEY = 'doctor_seen_appointments';
const RECENT_DAYS = 7;

function loadSeenIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = sessionStorage.getItem(DOCTOR_SEEN_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveSeenIds(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(DOCTOR_SEEN_KEY, JSON.stringify([...ids]));
  } catch {}
}

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Settings,
  LogOut,
  User,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ROLE_LABELS, type UserRole } from '@/lib/auth/roles';

interface UserData {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  avatarUrl: string | null;
}

interface DashboardHeaderProps {
  user?: UserData;
}

// Get page title from pathname
function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) return 'Dashboard';
  
  // Get the last meaningful segment
  const lastSegment = segments[segments.length - 1];
  
  // Format: capitalize and replace hyphens with spaces
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const [patientUpcomingCount, setPatientUpcomingCount] = useState(0);

  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    if (user?.role !== 'doctor') return;
    setSeenIds(loadSeenIds());
  }, [user?.role]);

  const markAsRead = useCallback((id: string) => {
    setSeenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveSeenIds(next);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback((ids: string[]) => {
    setSeenIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      saveSeenIds(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (user?.role !== 'doctor') return;
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/doctor/appointments?pageSize=50');
        const data = await res.json().catch(() => ({}));
        if (!data.success || !Array.isArray(data.data)) return;
        const list = data.data as { id?: string; paymentStatus?: string; createdAt?: string }[];
        const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
        const unread = list.filter(
          (a) =>
            a.id &&
            a.paymentStatus === 'paid' &&
            !seenIds.has(a.id) &&
            new Date(a.createdAt || 0).getTime() >= cutoff
        );
        setUnreadCount(unread.length);
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, [user?.role, seenIds]);

  useEffect(() => {
    if (user?.role !== 'patient') return;
    const fetchUpcoming = async () => {
      try {
        const res = await fetch('/api/bookings?status=pending');
        const data1 = await res.json().catch(() => ({}));
        const res2 = await fetch('/api/bookings?status=confirmed');
        const data2 = await res2.json().catch(() => ({}));
        const list1 = (data1.success && data1.data ? data1.data : []) as { id?: string }[];
        const list2 = (data2.success && data2.data ? data2.data : []) as { id?: string }[];
        const ids = new Set([...list1, ...list2].map((x) => x.id).filter(Boolean));
        setPatientUpcomingCount(ids.size);
      } catch {
        setPatientUpcomingCount(0);
      }
    };
    fetchUpcoming();
    const interval = setInterval(fetchUpcoming, 30000);
    return () => clearInterval(interval);
  }, [user?.role]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left - Page Title */}
      <div className="flex items-center gap-4 pl-12 lg:pl-0">
        <h1 className="text-[15px] font-medium text-gray-900 truncate max-w-[150px] md:max-w-none">
          {pageTitle}
        </h1>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
        {/* Notifications - drawer for doctor */}
        {user?.role === 'doctor' ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationOpen(true)}
              className="relative h-8 w-8 md:h-9 md:w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg overflow-visible flex items-center justify-center gap-0.5"
            >
              <Bell className="h-4 w-4 md:h-[18px] md:w-[18px] shrink-0" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white z-10">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
            <DoctorNotificationDrawer
              open={notificationOpen}
              onOpenChange={setNotificationOpen}
              seenIds={seenIds}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
          </>
        ) : user?.role === 'patient' ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationOpen(true)}
              className="relative h-8 w-8 md:h-9 md:w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg overflow-visible flex items-center justify-center"
            >
              <Bell className="h-4 w-4 md:h-[18px] md:w-[18px] shrink-0" />
              {patientUpcomingCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white">
                  {patientUpcomingCount > 99 ? '99+' : patientUpcomingCount}
                </span>
              )}
            </Button>
            <PatientNotificationDrawer open={notificationOpen} onOpenChange={setNotificationOpen} />
          </>
        ) : (
          <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-9 md:w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <Bell className="h-4 w-4 md:h-[18px] md:w-[18px]" />
          </Button>
        )}

        {/* Help - Hidden on small mobile */}
        <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8 md:h-9 md:w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <HelpCircle className="h-4 w-4 md:h-[18px] md:w-[18px]" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 md:h-9 gap-2 px-1.5 md:px-2 hover:bg-gray-100 ml-0.5 md:ml-1 rounded-lg"
            >
              <img
                src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(user?.fullName || user?.email || 'User')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                alt={user?.fullName || 'User'}
                className="h-7 w-7 md:h-8 md:w-8 rounded-full"
              />
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-[13px] font-medium text-gray-900 leading-none">
                  {user?.fullName || 'User'}
                </span>
                <span className="text-[11px] text-gray-500 leading-none mt-0.5">
                  {user ? ROLE_LABELS[user.role] : 'Patient'}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden lg:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 z-50" sideOffset={8}>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(user?.fullName || user?.email || 'User')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                  alt={user?.fullName || 'User'}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="text-[13px] font-medium text-gray-900">{user?.fullName || 'User'}</p>
                  <p className="text-[11px] text-gray-500 truncate max-w-[160px]">{user?.email}</p>
                  <Badge variant="outline" className="w-fit text-[10px] mt-1 bg-cyan-50 text-cyan-700 border-cyan-200">
                    {user ? ROLE_LABELS[user.role] : 'Patient'}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[13px] text-gray-700 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] text-gray-700 cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-[13px] text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
