'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Search,
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
  const [searchQuery, setSearchQuery] = useState('');

  const pageTitle = getPageTitle(pathname);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left - Page Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-[15px] font-medium text-gray-900">
          {pageTitle}
        </h1>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-sm mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 bg-gray-50 border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-[13px] rounded-lg"
          />
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <Bell className="h-[18px] w-[18px]" />
        </Button>

        {/* Help */}
        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <HelpCircle className="h-[18px] w-[18px]" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-9 gap-2 px-2 hover:bg-gray-100 ml-1 rounded-lg"
            >
              <img
                src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(user?.fullName || user?.email || 'User')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                alt={user?.fullName || 'User'}
                className="h-8 w-8 rounded-full"
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
