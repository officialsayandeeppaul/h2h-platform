'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { Header, Footer } from '@/components/layout';

const CONTACT_EMAIL = 'official.sayandeeppaul@gmail.com';

const SAYANDEEP = {
  name: 'Sayandeep Paul',
  role: 'Lead · delivery & client contact',
  image: '/our-team/sayandeeppaul.jpg',
} as const;

const TEAM_SECONDARY = [
  {
    name: 'Rishav Goswami',
    role: 'Backend & integrations',
    image: '/our-team/rishav.jpg',
    line:
      'I own the server side and the glue—APIs, integrations, deploys—and I care that nothing falls over when traffic shows up for real.',
  },
  {
    name: 'Sayantan Pandey',
    role: 'Frontend & UI',
    image: '/our-team/sayantan.jpg',
    line:
      'I run the whole frontend: what people see, tap, and scroll through—layouts, flows, responsiveness, and polish so the product feels finished, not held together with hope.',
  },
] as const;

export function DigitalHealthServiceDetail() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero — soft cyan / mint wash like rest of site */}
        <section className="relative overflow-hidden border-b border-cyan-100/80 bg-gradient-to-br from-cyan-50/90 via-white to-emerald-50/50">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,#06b6d408_1px,transparent_1px),linear-gradient(to_bottom,#06b6d408_1px,transparent_1px)] [background-size:48px_48px]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-[920px] px-6 pb-14 pt-10 sm:pb-20 sm:pt-14">
            <Link
              href="/services"
              className="mb-10 inline-flex items-center gap-2 text-[14px] text-gray-500 transition-colors hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Link>

            <p className="text-[13px] font-medium text-cyan-700">Web &amp; product engineering · freelance team</p>

            <div className="mt-5 flex items-start gap-4">
              <div className="mt-1 h-12 w-1 shrink-0 rounded-full bg-gradient-to-b from-cyan-500 to-teal-500" />
              <h1 className="text-[1.85rem] font-semibold leading-[1.18] tracking-tight text-gray-900 sm:text-[2.15rem] md:text-[2.45rem]">
                We ship software for teams who know what they need built
              </h1>
            </div>

            <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-gray-700">
              No agency theatre—just engineers. Web apps, internal tools, integrations, whatever needs a careful build from
              brief to launch and after. We&apos;ve shipped in different domains; what matters is a clear problem and a
              serious timeline.
            </p>
            <p className="mt-4 max-w-[58ch] text-[14px] leading-relaxed italic text-gray-500">
              (Real words, typed here—scroll down and I&apos;ll talk to you in first person. No brochure drone mode.)
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Project%20inquiry`}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-cyan-500 px-8 text-[14px] font-medium text-white shadow-sm transition-colors hover:bg-cyan-600"
              >
                <Mail className="h-4 w-4" />
                Business inquiry
              </a>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-cyan-200 bg-white/80 px-8 text-[14px] font-medium text-cyan-800 backdrop-blur-sm transition-colors hover:bg-cyan-50"
              >
                Contact form
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-gray-500">
              Direct line:{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-cyan-700 underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </section>

        <section className="border-b border-gray-100 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[920px] px-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-cyan-500" />
              <h2 className="text-[22px] font-semibold text-gray-900 sm:text-[26px]">Who we are</h2>
            </div>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-gray-600">
              We&apos;re a tight freelance unit—three engineers, one lead on scope and delivery. We&apos;ve shipped in
              fast-moving product environments: real deadlines, real users, no time for fluff. Heal to Health is one
              product we&apos;ve helped power; we&apos;re not married to one industry—if your brief is clear and the work
              is real, we can talk.
            </p>
          </div>
        </section>

        <section className="border-b border-gray-100 bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-[1000px] px-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-cyan-500" />
              <h2 className="text-[22px] font-semibold text-gray-900 sm:text-[26px]">Lead</h2>
            </div>
            <p className="mt-2 text-[14px] text-gray-600">
              I&apos;m who you ping when something actually has to get decided—not routed through three layers of maybe.
            </p>

            <article className="mt-10 overflow-hidden rounded-2xl border border-cyan-100/80 bg-white shadow-[0_8px_40px_-12px_rgba(6,182,212,0.15)]">
              <div className="grid md:grid-cols-[min(280px,100%)_1fr] lg:grid-cols-[300px_1fr]">
                <div className="relative aspect-[4/5] min-h-[260px] w-full md:min-h-0 md:aspect-auto">
                  <Image
                    src={SAYANDEEP.image}
                    alt={SAYANDEEP.name}
                    fill
                    className="object-cover object-center md:object-top"
                    sizes="(max-width: 768px) 100vw, 300px"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                  <h3 className="text-[1.35rem] font-semibold text-gray-900 sm:text-[1.5rem]">{SAYANDEEP.name}</h3>
                  <p className="mt-1 text-[13px] font-medium text-cyan-700">{SAYANDEEP.role}</p>
                  <div className="mt-6 space-y-4 text-[15px] leading-[1.75] text-gray-700">
                    <p>
                      I run delivery end to end: your brief becomes something we can ship, milestones stay visible, and
                      I&apos;m still around when production does something rude. I stay hands-on—build, fix, tighten—not
                      “strategy” slides that age in a drawer.
                    </p>
                    <p>
                      For scope, updates, and handoff, you get me. Not a rotating cast of account people—one thread, one
                      standard. Could be a consumer app, an internal tool, a greenfield build—doesn&apos;t matter; you
                      still talk to the same person.
                    </p>
                    <p className="text-[14px] text-gray-600">
                      Fourth wall: I wrote this. The email below is mine—I read what lands there.
                    </p>
                  </div>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50/50 px-5 py-2.5 text-[13px] font-medium text-cyan-900 transition-colors hover:bg-cyan-100/80"
                  >
                    <Mail className="h-4 w-4 text-cyan-600" />
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="border-b border-gray-100 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[1000px] px-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-cyan-500" />
              <h2 className="text-[22px] font-semibold text-gray-900 sm:text-[26px]">Engineering</h2>
            </div>
            <p className="mt-2 text-[14px] text-gray-600">
              Same crew, same bar—backend and frontend in their own words.
            </p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {TEAM_SECONDARY.map((m) => (
                <article
                  key={m.name}
                  className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm ring-1 ring-cyan-50"
                >
                  <div className="relative aspect-[16/11] w-full">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, 480px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-cyan-50/30 p-6">
                    <h3 className="text-[16px] font-semibold text-gray-900">{m.name}</h3>
                    <p className="mt-0.5 text-[12px] font-medium text-cyan-700">{m.role}</p>
                    <p className="mt-3 text-[14px] leading-relaxed text-gray-600">{m.line}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-gray-100 bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-[640px] px-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-cyan-500" />
              <h2 className="text-[22px] font-semibold text-gray-900 sm:text-[26px]">What we take on</h2>
            </div>
            <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-gray-700">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                User-facing products and serious internal tools—the kind that still work after launch, not brochureware.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                Access, roles, and handling data with care when the stakes are high.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                Plugging into what you already run when that&apos;s smarter than reinventing the wheel.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                Iteration after go-live—we stick around when the roadmap shifts or something needs tuning.
              </li>
            </ul>
          </div>
        </section>

        <section className="border-b border-gray-100 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[1000px] px-6">
            <div className="mb-10 text-center sm:text-left">
              <div className="mx-auto flex items-center justify-center gap-3 sm:mx-0 sm:justify-start">
                <div className="h-8 w-1 rounded-full bg-cyan-500" />
                <h2 className="text-[22px] font-semibold text-gray-900 sm:text-[26px]">How engagements run</h2>
              </div>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  n: '01',
                  t: 'Brief',
                  d: 'Goal, users, timeline, constraints—written down so everyone agrees what “done” looks like.',
                },
                {
                  n: '02',
                  t: 'Plan & build',
                  d: 'Milestones and working demos at each step—no surprises buried until the last week.',
                },
                {
                  n: '03',
                  t: 'Ship',
                  d: 'Checks, staging, then production—then we watch how real people use it.',
                },
                {
                  n: '04',
                  t: 'Support',
                  d: 'Fixes and the next slice of work—products keep evolving after day one.',
                },
              ].map((s) => (
                <div
                  key={s.n}
                  className="rounded-xl border border-cyan-100/60 bg-gradient-to-b from-white to-cyan-50/40 p-5 shadow-sm"
                >
                  <span className="font-mono text-[12px] font-semibold text-cyan-600">{s.n}</span>
                  <h3 className="mt-2 text-[15px] font-semibold text-gray-900">{s.t}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-gray-100 bg-gray-50 py-14 sm:py-16">
          <div className="mx-auto max-w-[640px] px-6 text-center sm:text-left">
            <p className="text-[15px] leading-relaxed text-gray-600">
              Small team, straight talk, zero layers between you and whoever&apos;s actually building. If you&apos;ve got
              a real scope and want people who&apos;ve shipped under pressure—not slideware—we&apos;re easy to reach.
            </p>
          </div>
        </section>

        {/* CTA — same family as services page testimonial strip */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-teal-500 py-16 text-white sm:py-20">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]"
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-[520px] px-6 text-center">
            <h2 className="text-[24px] font-medium tracking-tight sm:text-[28px]">Start with an email</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/85">
              Drop a few lines about what you&apos;re trying to ship—we&apos;ll come back with next steps.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Project%20inquiry`}
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-[14px] font-medium text-gray-900 shadow-md transition-colors hover:bg-gray-50"
            >
              <Mail className="h-4 w-4 text-cyan-600" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
