import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageShell } from '@/components/layout';
import { APP_CONFIG, BOOKING_RULES } from '@/constants/config';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms and conditions for using H2H Healthcare websites, booking, and digital services in India.',
  alternates: { canonical: '/terms' },
};

const LAST_UPDATED = '17 April 2026';

export default function TermsOfServicePage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <p className="text-[14px] text-gray-500 border-l-2 border-cyan-500/40 pl-4">
        These terms govern your use of {APP_CONFIG.name}&apos;s website at{' '}
        <a href={APP_CONFIG.url}>{APP_CONFIG.url.replace(/^https?:\/\//, '')}</a> and related digital services
        (including booking and patient features). By accessing or using the services, you agree to these terms. If you
        do not agree, please do not use the services.
      </p>

      <section>
        <h2>1. Who we are</h2>
        <p>
          {APP_CONFIG.name} operates a platform to help you discover, book, and coordinate physiotherapy, sports
          rehabilitation, pain care, yoga, and related services with affiliated clinicians and centres. We may update or
          expand features over time.
        </p>
      </section>

      <section>
        <h2>2. Eligibility and accounts</h2>
        <p>
          You must be legally able to enter a contract in India (or act with a parent/guardian’s consent where
          required). You are responsible for the accuracy of information you provide and for keeping your login
          credentials confidential. Notify us promptly at{' '}
          <a href={`mailto:${APP_CONFIG.email}`}>{APP_CONFIG.email}</a> if you suspect unauthorised access.
        </p>
      </section>

      <section>
        <h2>3. Medical disclaimer</h2>
        <p>
          H2H is a technology and coordination platform. It does not replace professional medical judgment. Clinicians
          you book are responsible for clinical decisions.{' '}
          <strong className="text-gray-800">
            For medical emergencies, call local emergency services or go to the nearest hospital—do not rely on this
            website or app as an emergency service.
          </strong>{' '}
          Content on the site is for general information and is not a diagnosis or treatment plan.
        </p>
      </section>

      <section>
        <h2>4. Bookings, fees, and payments</h2>
        <p>
          When you book through H2H, you agree to the fees, modes (clinic, online, home where available), and policies
          shown at checkout. Payments may be processed by third-party providers; their terms may also apply. You are
          responsible for providing valid payment details and for any taxes or charges shown.
        </p>
      </section>

      <section>
        <h2>5. Cancellation and rescheduling</h2>
        <p>
          Standard notice periods: at least <strong className="text-gray-800">{BOOKING_RULES.cancellationHours} hours</strong>{' '}
          before the appointment to cancel, and at least{' '}
          <strong className="text-gray-800">{BOOKING_RULES.rescheduleHours} hours</strong> to reschedule, unless a
          different rule is shown for a specific service or promotion. Fees, refunds, or credits follow the policy
          displayed at booking and applicable law. We may refuse service for repeated no-shows or abuse of scheduling.
        </p>
      </section>

      <section>
        <h2>6. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Violate any law or infringe others’ rights;</li>
          <li>Upload malware, scrape the site in a way that harms performance, or attempt unauthorised access;</li>
          <li>Harass staff, clinicians, or other users, or submit false or misleading information;</li>
          <li>Use the services to distribute spam or unauthorised commercial messages.</li>
        </ul>
        <p>We may suspend or terminate access for violations.</p>
      </section>

      <section>
        <h2>7. Intellectual property</h2>
        <p>
          H2H names, logos, branding, and site content (except user content and third-party materials) are owned by us or
          our licensors. You may not copy, modify, or distribute them without permission except as allowed by law or for
          personal, non-commercial viewing.
        </p>
      </section>

      <section>
        <h2>8. Third-party services</h2>
        <p>
          The platform may link to or integrate third-party tools (maps, chat, payments, video). We are not responsible
          for their content or practices; use them at your own risk and read their terms.
        </p>
      </section>

      <section>
        <h2>9. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by applicable law in India, {APP_CONFIG.name} and its affiliates are not liable
          for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or
          goodwill, arising from your use of the services. Our total liability for any claim relating to these terms or
          the services is limited to the amount you paid to us for the specific booking or transaction giving rise to the
          claim in the three (3) months before the claim, or INR 5,000, whichever is greater, except where the law
          does not allow such a cap (for example fraud or wilful misconduct).
        </p>
        <p>
          Some jurisdictions do not allow certain limitations; in those cases our liability is limited to the maximum
          permitted by law.
        </p>
      </section>

      <section>
        <h2>10. Indemnity</h2>
        <p>
          You will defend and indemnify {APP_CONFIG.name} and its officers and staff against claims, damages, and costs
          arising from your misuse of the services, your content, or your breach of these terms, to the extent permitted
          by law.
        </p>
      </section>

      <section>
        <h2>11. Changes to the services or terms</h2>
        <p>
          We may modify the services or these terms. We will post updated terms on this page and update the “Last
          updated” date. Continued use after changes become effective constitutes acceptance, except where the law
          requires explicit consent.
        </p>
      </section>

      <section>
        <h2>12. Governing law and disputes</h2>
        <p>
          These terms are governed by the laws of India. Courts at Mumbai, Maharashtra shall have exclusive jurisdiction,
          subject to any mandatory consumer protections where you reside.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          Questions about these terms: <a href={`mailto:${APP_CONFIG.email}`}>{APP_CONFIG.email}</a>
          <br />
          <Link href="/contact">Contact page</Link> · Phone: {APP_CONFIG.phone}
        </p>
      </section>
    </LegalPageShell>
  );
}
