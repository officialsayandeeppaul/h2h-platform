'use client';

/**
 * Themed placeholders while code-split chunks load.
 * Same tone as the real section so scroll never hits empty white gaps.
 */
export function SectionShell({
  tone = 'light',
  className = '',
  minHeight = '28rem',
}: {
  tone?: 'light' | 'dark' | 'slate';
  className?: string;
  minHeight?: string;
}) {
  const bg =
    tone === 'dark'
      ? 'bg-gray-950'
      : tone === 'slate'
        ? 'bg-slate-50'
        : 'bg-white';

  return (
    <div
      className={`${bg} ${className}`}
      style={{ minHeight }}
      aria-hidden
    >
      <div className="mx-auto max-w-[1200px] px-6 py-16 lg:px-12">
        <div
          className={`mb-4 h-3 w-28 rounded-full ${
            tone === 'dark' ? 'bg-white/10' : 'bg-slate-200/80'
          }`}
        />
        <div
          className={`mb-3 h-8 w-[min(100%,28rem)] rounded-lg ${
            tone === 'dark' ? 'bg-white/10' : 'bg-slate-200/70'
          }`}
        />
        <div
          className={`h-4 w-[min(100%,36rem)] rounded-md ${
            tone === 'dark' ? 'bg-white/5' : 'bg-slate-100'
          }`}
        />
      </div>
    </div>
  );
}
