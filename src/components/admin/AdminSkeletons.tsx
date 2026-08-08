import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

/** Neutral pulse block — never uses brand teal accent */
function Bone({ className, ...props }: React.ComponentProps<'div'>) {
  return <Skeleton className={cn('bg-gray-200', className)} {...props} />;
}

function PageHeaderBone({ titleWidth = 'w-40', withSubtitle = true }: { titleWidth?: string; withSubtitle?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="space-y-2 min-w-0">
        <Bone className={cn('h-7 sm:h-8 rounded-md', titleWidth)} />
        {withSubtitle && <Bone className="h-4 w-56 sm:w-72 max-w-full rounded-md bg-gray-100" />}
      </div>
      <Bone className="h-9 w-full sm:w-28 rounded-lg shrink-0" />
    </div>
  );
}

function StatCardBone() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-2 flex-1 min-w-0">
          <Bone className="h-3 w-16 bg-gray-100" />
          <Bone className="h-7 w-20" />
        </div>
        <Bone className="h-9 w-9 rounded-lg shrink-0 bg-gray-100" />
      </div>
    </div>
  );
}

function TableShellBone({ rows = 7 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex gap-4 bg-gray-50/80">
        {['w-16', 'w-28', 'w-24', 'w-20', 'w-16', 'w-28'].map((w, i) => (
          <Bone key={i} className={cn('h-3 rounded bg-gray-200/80 hidden sm:block', w, i > 2 && 'lg:block', i > 3 && 'hidden lg:block')} />
        ))}
      </div>
      <div className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3.5 flex items-center gap-4">
            <Bone className="h-4 w-14 shrink-0 bg-gray-100" />
            <div className="flex-1 space-y-1.5 min-w-0">
              <Bone className="h-3.5 w-[40%] max-w-[180px]" />
              <Bone className="h-3 w-[55%] max-w-[220px] bg-gray-100" />
            </div>
            <Bone className="h-3 w-16 hidden md:block bg-gray-100" />
            <Bone className="h-6 w-16 rounded-full shrink-0 bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationRowBone() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-start gap-3">
      <Bone className="h-10 w-10 rounded-full shrink-0 bg-gray-100" />
      <div className="flex-1 min-w-0 space-y-2">
        <Bone className="h-4 w-[35%] max-w-[160px]" />
        <Bone className="h-3 w-[50%] max-w-[220px] bg-gray-100" />
        <Bone className="h-3 w-24 bg-gray-100" />
        <Bone className="h-3 w-full max-w-md bg-gray-100" />
      </div>
      <Bone className="h-8 w-20 rounded-lg shrink-0 hidden sm:block bg-gray-100" />
    </div>
  );
}

type ContentVariant = 'cards' | 'table' | 'dashboard';

/** Full admin shell while auth is verified */
export function AdminLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[240px] flex-col bg-[#1a2e35] border-r border-white/5">
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10">
          <div className="h-11 w-11 rounded-xl bg-white/10 shrink-0 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-28 bg-white/15 rounded animate-pulse" />
            <div className="h-2.5 w-20 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1.5">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className={`h-9 rounded-md animate-pulse ${i === 0 ? 'bg-white/20 w-full' : 'bg-white/10 w-[88%]'}`}
            />
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-2">
          <div className="h-16 rounded-lg bg-white/10 w-full animate-pulse" />
          <div className="h-9 rounded-md bg-white/10 w-full animate-pulse" />
        </div>
      </aside>

      <div className="flex-1 min-w-0 lg:pl-[240px]">
        <header className="sticky top-0 z-30 bg-white/95 border-b border-gray-100 h-14 flex items-center justify-end px-6 gap-3">
          <Bone className="h-9 w-9 rounded-lg bg-gray-100" />
          <Bone className="h-8 w-8 rounded-full bg-gray-100" />
          <Bone className="h-4 w-28 bg-gray-100" />
        </header>
        <main className="p-5 lg:p-6 w-full">
          <DashboardAdminSkeleton />
        </main>
      </div>
    </div>
  );
}

export function DashboardAdminSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      <PageHeaderBone titleWidth="w-36" withSubtitle={false} />
      <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardBone key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[0, 1].map((panel) => (
          <div key={panel} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
              <Bone className="h-5 w-40" />
              <Bone className="h-4 w-16 bg-gray-100" />
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Bone className="h-8 w-8 rounded-lg bg-gray-100 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Bone className="h-3.5 w-[45%]" />
                    <Bone className="h-3 w-[60%] bg-gray-100" />
                  </div>
                  <Bone className="h-6 w-14 rounded-full bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaymentsAdminSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      <PageHeaderBone titleWidth="w-32" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardBone key={i} />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Bone className="h-10 flex-1 rounded-lg" />
        <Bone className="h-10 w-full sm:w-32 rounded-lg bg-gray-100" />
        <Bone className="h-10 w-full sm:w-32 rounded-lg bg-gray-100" />
      </div>
      <TableShellBone rows={6} />
    </div>
  );
}

export function UsersAdminSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      <PageHeaderBone titleWidth="w-48" />
      <div className="flex flex-col sm:flex-row gap-3">
        <Bone className="h-10 flex-1 max-w-md rounded-lg" />
        <Bone className="h-10 w-36 rounded-lg bg-gray-100" />
      </div>
      <TableShellBone rows={8} />
    </div>
  );
}

export function ServicesAdminSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      <PageHeaderBone titleWidth="w-28" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-9 w-24 rounded-lg bg-gray-100" />
        ))}
      </div>
      <TableShellBone rows={6} />
    </div>
  );
}

export function LocationsAdminSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      <PageHeaderBone titleWidth="w-64" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardBone key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <Bone className="h-5 w-2/3" />
            <Bone className="h-3 w-1/2 bg-gray-100" />
            <Bone className="h-3 w-full bg-gray-100" />
            <div className="flex gap-2 pt-2">
              <Bone className="h-8 flex-1 rounded-lg bg-gray-100" />
              <Bone className="h-8 w-8 rounded-lg bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationsAdminSkeleton() {
  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-8 w-44" />
          <Bone className="h-4 w-72 max-w-full bg-gray-100" />
        </div>
        <div className="flex gap-2">
          <Bone className="h-10 w-28 rounded-lg bg-gray-100" />
          <Bone className="h-10 w-24 rounded-lg" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <NotificationRowBone key={i} />
        ))}
      </div>
    </div>
  );
}

export function HelpSupportAdminSkeleton() {
  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeaderBone titleWidth="w-44" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 3 }).map((_, i) => (
          <Bone key={i} className="h-9 w-24 rounded-lg bg-gray-100" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <NotificationRowBone key={i} />
        ))}
      </div>
    </div>
  );
}

export function CallRequestsAdminSkeleton() {
  return <NotificationsAdminSkeleton />;
}

export function ScheduleRequestsAdminSkeleton() {
  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeaderBone titleWidth="w-56" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-9 w-24 rounded-lg bg-gray-100" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/80 flex justify-between">
              <Bone className="h-5 w-32" />
              <Bone className="h-6 w-16 rounded-full bg-gray-100" />
            </div>
            <div className="p-5 space-y-3">
              <Bone className="h-4 w-1/2" />
              <Bone className="h-3 w-2/3 bg-gray-100" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Bone className="h-16 rounded-lg bg-gray-100" />
                <Bone className="h-16 rounded-lg bg-gray-100" />
              </div>
              <div className="flex gap-2 pt-2">
                <Bone className="h-9 w-24 rounded-lg" />
                <Bone className="h-9 w-24 rounded-lg bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsAdminSkeleton() {
  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="space-y-2">
        <Bone className="h-8 w-36" />
        <Bone className="h-4 w-80 max-w-full bg-gray-100" />
      </div>
      <Bone className="h-28 w-full rounded-2xl bg-gray-100" />
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80">
          <Bone className="h-4 w-28" />
        </div>
        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex gap-4">
            <Bone className="h-24 w-24 rounded-full shrink-0 bg-gray-100" />
            <div className="flex-1 space-y-2 pt-2">
              <Bone className="h-4 w-32" />
              <Bone className="h-3 w-48 bg-gray-100" />
            </div>
          </div>
          <Bone className="h-24 w-full rounded-xl bg-gray-100" />
          <Bone className="h-28 w-full rounded-xl bg-gray-100" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Bone className="h-10 rounded-lg" />
            <Bone className="h-10 rounded-lg" />
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/80 flex justify-end">
          <Bone className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** Generic fallback used by older call sites */
export function AdminContentSkeleton({ variant = 'cards' }: { variant?: ContentVariant }) {
  if (variant === 'dashboard') return <DashboardAdminSkeleton />;
  if (variant === 'table') return <PaymentsAdminSkeleton />;
  return <LocationsAdminSkeleton />;
}

/** Generic list rows (notifications, messages, etc.) */
export function ListItemsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <NotificationRowBone key={i} />
      ))}
    </div>
  );
}

/** Stacked cards (schedule / reschedule) */
export function StackedCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <div className="flex justify-between">
            <Bone className="h-4 w-40" />
            <Bone className="h-6 w-16 rounded-full bg-gray-100" />
          </div>
          <Bone className="h-3 w-2/3 bg-gray-100" />
          <Bone className="h-3 w-1/2 bg-gray-100" />
          <div className="flex gap-2 pt-2">
            <Bone className="h-9 w-24 rounded-lg" />
            <Bone className="h-9 w-24 rounded-lg bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AppointmentListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
          <Bone className="h-12 w-12 rounded-lg shrink-0 bg-gray-100" />
          <div className="flex-1 space-y-2">
            <Bone className="h-4 w-2/5 max-w-[160px]" />
            <Bone className="h-3 w-3/5 max-w-[220px] bg-gray-100" />
            <Bone className="h-3 w-1/3 max-w-[120px] bg-gray-100" />
          </div>
          <Bone className="h-8 w-20 rounded-lg shrink-0 hidden sm:block bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function TableBodySkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Bone className="h-4 w-16 shrink-0 bg-gray-100" />
          <Bone className="h-4 flex-1 max-w-xs" />
          <Bone className="h-4 w-24 hidden md:block bg-gray-100" />
          <Bone className="h-4 w-20 hidden lg:block bg-gray-100" />
          <Bone className="h-6 w-16 ml-auto rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function ProfileFormSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <div className="flex justify-between items-center">
        <Bone className="h-8 w-48" />
        <Bone className="h-9 w-28 rounded-lg" />
      </div>
      <Bone className="h-56 rounded-xl bg-gray-100" />
      <Bone className="h-40 rounded-xl bg-gray-100" />
    </div>
  );
}

export function PrescriptionsListSkeleton() {
  return (
    <div className="space-y-4 w-full">
      <Bone className="h-10 w-full max-w-md rounded-lg" />
      <StackedCardsSkeleton count={4} />
    </div>
  );
}

/** Appointments page — header, tabs, 6 stats, filters, table */
export function AppointmentsAdminSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      <PageHeaderBone titleWidth="w-40" />
      <div className="flex gap-2 border-b border-gray-200 pb-px">
        <Bone className="h-10 w-32 rounded-none border-b-2 border-gray-300" />
        <Bone className="h-10 w-44 rounded-none bg-gray-100" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardBone key={i} />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Bone className="h-10 flex-1 rounded-lg" />
        <Bone className="h-10 w-full sm:w-36 rounded-lg bg-gray-100" />
        <Bone className="h-10 w-full sm:w-36 rounded-lg bg-gray-100" />
      </div>
      <TableShellBone rows={7} />
    </div>
  );
}

export function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeaderBone titleWidth="w-48" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardBone key={i} />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardBone key={i} />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <Bone className="h-5 w-40" />
          <Bone className="h-64 w-full rounded-lg bg-gray-100" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <Bone className="h-5 w-36" />
          <Bone className="h-64 w-full rounded-lg bg-gray-100" />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <Bone className="h-5 w-44" />
        <Bone className="h-56 w-full rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

export function AuthCheckSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Bone className="h-16 w-16 rounded-full bg-gray-100" />
          <Bone className="h-6 w-48" />
          <Bone className="h-4 w-64 bg-gray-100" />
        </div>
        <Bone className="h-64 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

export function DoctorCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4"
        >
          <div className="flex items-start gap-3">
            <Bone className="h-14 w-14 rounded-full shrink-0 bg-gray-100" />
            <div className="flex-1 space-y-2 min-w-0">
              <Bone className="h-4 w-3/4" />
              <Bone className="h-3 w-full bg-gray-100" />
              <Bone className="h-3 w-24 bg-gray-100" />
            </div>
          </div>
          <div className="space-y-2">
            <Bone className="h-3 w-full bg-gray-100" />
            <Bone className="h-3 w-2/3 bg-gray-100" />
          </div>
          <div className="flex gap-2">
            <Bone className="h-5 w-16 rounded-full bg-gray-100" />
            <Bone className="h-5 w-20 rounded-full bg-gray-100" />
          </div>
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <Bone className="h-9 flex-1 rounded-lg" />
            <Bone className="h-9 w-9 rounded-lg bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DoctorsAdminSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      <PageHeaderBone titleWidth="w-52" />
      <Bone className="h-10 w-full max-w-md rounded-lg" />
      <DoctorCardsSkeleton count={6} />
    </div>
  );
}

/** Doctor portal — dashboard layout */
export function DoctorDashboardSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-2">
          <Bone className="h-8 w-56" />
          <Bone className="h-4 w-72 max-w-full bg-gray-100" />
        </div>
        <Bone className="h-9 w-28 rounded-lg shrink-0" />
      </div>
      <Bone className="h-3 w-40 bg-gray-100" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardBone key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCardBone />
            <StatCardBone />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <Bone className="h-5 w-44" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Bone className="h-10 w-10 rounded-lg bg-gray-100" />
                <div className="flex-1 space-y-1.5">
                  <Bone className="h-3.5 w-[40%]" />
                  <Bone className="h-3 w-[55%] bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <StatCardBone />
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <Bone className="h-5 w-28" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Bone key={i} className="h-14 w-full rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DoctorAppointmentsSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <PageHeaderBone titleWidth="w-48" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-9 w-24 rounded-lg bg-gray-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Bone className="h-80 rounded-xl bg-gray-100 md:col-span-1" />
        <Bone className="h-80 rounded-xl bg-gray-100 md:col-span-2" />
      </div>
    </div>
  );
}

export function DoctorPatientsSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <PageHeaderBone titleWidth="w-36" />
      <Bone className="h-10 w-full max-w-md rounded-lg" />
      <TableShellBone rows={6} />
    </div>
  );
}

export function DoctorScheduleSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <PageHeaderBone titleWidth="w-40" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardBone key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Bone className="h-80 rounded-xl bg-gray-100" />
        <Bone className="h-80 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}
