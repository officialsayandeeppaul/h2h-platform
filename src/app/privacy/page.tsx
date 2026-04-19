import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageShell } from '@/components/layout';
import { APP_CONFIG } from '@/constants/config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How H2H Healthcare collects, uses, and protects your personal information when you use healtohealth.in and related services.',
  alternates: { canonical: '/privacy' },
};

const LAST_UPDATED = '17 April 2026';

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p className="text-[14px] text-gray-500 border-l-2 border-cyan-500/40 pl-4">
        This policy explains how {APP_CONFIG.name} (“H2H”, “we”, “us”) handles information when you visit{' '}
        <a href={APP_CONFIG.url}>{APP_CONFIG.url.replace(/^https?:\/\//, '')}</a>, use our booking or patient
        features, or contact us. It is meant to be clear and practical; it is not legal advice. For specific concerns,
        contact us using the details at the end.
      </p>

      <section>
        <h2>1. Who is responsible?</h2>
        <p>
          The operator of this website and related digital services is {APP_CONFIG.name}. For privacy-related requests,
          email{' '}
          <a href={`mailto:${APP_CONFIG.email}`}>{APP_CONFIG.email}</a> or use the contact options on our{' '}
          <Link href="/contact">Contact</Link> page.
        </p>
      </section>

      <section>
        <h2>2. What information we collect</h2>
        <p>Depending on how you use H2H, we may process:</p>
        <ul>
          <li>
            <strong className="text-gray-800">Account and profile data:</strong> name, email, phone number, and similar
            details you provide when you register or update your profile.
          </li>
          <li>
            <strong className="text-gray-800">Booking and care coordination:</strong> appointment preferences, location,
            service type, messages you send to clinics or support, and related scheduling information.
          </li>
          <li>
            <strong className="text-gray-800">Health-related information:</strong> information you or your clinicians
            upload or enter where the product allows (for example symptoms, notes, or documents you choose to share).
            Treat this as sensitive: only share what is needed for your care.
          </li>
          <li>
            <strong className="text-gray-800">Payment data:</strong> payments are handled by payment partners; we
            typically receive confirmation of payment status, not your full card number.
          </li>
          <li>
            <strong className="text-gray-800">Technical and usage data:</strong> IP address, device/browser type, pages
            viewed, and similar diagnostics to secure the site and improve performance. We may use cookies or similar
            technologies as described below.
          </li>
          <li>
            <strong className="text-gray-800">Communications:</strong> content you send via contact forms, chat widgets,
            or email to our team.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How we use your information</h2>
        <p>We use personal data to:</p>
        <ul>
          <li>Provide, operate, and improve booking, telehealth, and account features;</li>
          <li>Coordinate appointments with clinicians and centres in our network;</li>
          <li>Send service messages (confirmations, reminders, security notices) and, where allowed, marketing you can opt out of;</li>
          <li>Detect abuse, fraud, and technical issues; comply with law; and defend legal claims;</li>
          <li>Analyse aggregated usage to improve the product (where we can, we use summaries rather than identifiable detail).</li>
        </ul>
      </section>

      <section>
        <h2>4. Legal bases (India)</h2>
        <p>
          We process personal data where necessary to perform our contract with you (for example to complete a booking),
          where we have a legitimate interest that is not overridden by your rights (for example securing our systems),
          where you have given consent (for example optional marketing or non-essential cookies), or where the law
          requires it. Health-related information is treated with additional care and only used for purposes connected to
          care delivery, compliance, or what you have agreed to.
        </p>
      </section>

      <section>
        <h2>5. Sharing with others</h2>
        <p>We do not sell your personal information. We may share data with:</p>
        <ul>
          <li>
            <strong className="text-gray-800">Service providers</strong> who host our infrastructure, send email/SMS,
            process payments, provide analytics, or support customer service—under contracts that require protection of
            your data;
          </li>
          <li>
            <strong className="text-gray-800">Clinicians and partner centres</strong> you book with, so they can deliver
            your session;
          </li>
          <li>
            <strong className="text-gray-800">Authorities</strong> when required by law or to protect rights, safety, or
            security.
          </li>
        </ul>
        <p>
          Some providers may process data outside India. Where that happens, we rely on appropriate safeguards and
          agreements required by applicable law.
        </p>
      </section>

      <section>
        <h2>6. Retention</h2>
        <p>
          We keep information only as long as needed for the purposes above, including legal, tax, and healthcare record
          requirements. When data is no longer needed, we delete or anonymise it in line with our internal schedules and
          applicable law.
        </p>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>
          We use technical and organisational measures designed to protect your data (access controls, encryption in
          transit where appropriate, and vendor due diligence). No online service is perfectly secure; please use a
          strong password and do not share OTPs or login details with anyone.
        </p>
      </section>

      <section>
        <h2>8. Your choices and rights</h2>
        <p>Depending on applicable law, you may have the right to:</p>
        <ul>
          <li>Access or correct your personal data;</li>
          <li>Withdraw consent where processing is consent-based;</li>
          <li>Object to or restrict certain processing;</li>
          <li>Request deletion where legally permitted;</li>
          <li>Lodge a complaint with a data protection authority.</li>
        </ul>
        <p>
          To exercise these rights, contact <a href={`mailto:${APP_CONFIG.email}`}>{APP_CONFIG.email}</a>. We may need
          to verify your identity before fulfilling a request.
        </p>
      </section>

      <section>
        <h2>9. Cookies and similar technologies</h2>
        <p>
          We use cookies and similar tools for essential site operation, preferences, analytics, and (where you agree)
          marketing. You can control cookies through your browser settings; blocking some cookies may limit certain
          features.
        </p>
      </section>

      <section>
        <h2>10. Children</h2>
        <p>
          Our services are not directed at children without parental involvement. If you believe a minor has provided
          data improperly, contact us and we will take appropriate steps.
        </p>
      </section>

      <section>
        <h2>11. Third-party links</h2>
        <p>
          The site may link to other websites or embed tools (for example chat). Their privacy practices are governed
          by their own policies; please read them before sharing information.
        </p>
      </section>

      <section>
        <h2>12. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. We will post the new version on this page and adjust the “Last
          updated” date. For material changes, we will provide notice as required by law or through the product.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          Questions about privacy: <a href={`mailto:${APP_CONFIG.email}`}>{APP_CONFIG.email}</a>
          <br />
          General enquiries: <Link href="/contact">Contact page</Link>
        </p>
      </section>
    </LegalPageShell>
  );
}
