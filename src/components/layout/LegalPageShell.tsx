import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

type LegalPageShellProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalPageShell({ title, lastUpdated, children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main id="main-content" className="flex-1 pt-28 pb-20">
        <div className="max-w-[720px] mx-auto px-6 lg:px-8">
          <h1 className="text-[32px] md:text-[40px] font-medium text-gray-900 tracking-tight leading-tight mb-2">
            {title}
          </h1>
          <p className="text-[13px] text-gray-400 mb-10">Last updated: {lastUpdated}</p>
          <div className="space-y-8 text-[15px] text-gray-600 leading-relaxed [&_h2]:text-[17px] [&_h2]:font-medium [&_h2]:text-gray-900 [&_h2]:pt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-cyan-600 [&_a]:underline hover:[&_a]:text-cyan-700">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
