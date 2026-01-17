import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { ROLES, ROLE_DASHBOARDS, canAccessRoute, type UserRole } from '@/lib/auth/roles';
import { headers } from 'next/headers';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user role from metadata
  const userRole = (user.user_metadata?.role as UserRole) || ROLES.PATIENT;
  
  // Get current path from headers
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Check if user can access the current route
  if (pathname && !canAccessRoute(userRole, pathname)) {
    redirect(ROLE_DASHBOARDS[userRole]);
  }

  // User data to pass to sidebar and header
  const userData = {
    id: user.id,
    email: user.email!,
    fullName: user.user_metadata?.full_name || null,
    role: userRole,
    avatarUrl: user.user_metadata?.avatar_url || null,
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Fixed Sidebar - h-screen */}
      <DashboardSidebar user={userData} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Header */}
        <DashboardHeader user={userData} />
        
        {/* Scrollable Content with animated grid pattern */}
        <main className="flex-1 overflow-y-auto relative">
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.1}
            duration={3}
            repeatDelay={1}
            className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] fill-cyan-500/30 stroke-cyan-500/30"
          />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
