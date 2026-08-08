/**
 * H2H Healthcare - Email Service
 * Sends appointment confirmation emails to patients and doctors
 */

import nodemailer from 'nodemailer';
import { buildInvoiceEmailSection } from '@/lib/invoice';
import type { InvoiceData } from '@/lib/invoice';
import {
  emailDetailsTable,
  emailParagraph,
  emailRawBlock,
  escapeEmailHtml,
  wrapH2HEmail,
} from '@/lib/email-layout';

// Create transporter - uses env vars for SMTP config
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('SMTP credentials not configured. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

interface AppointmentEmailData {
  appointmentId: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  doctorEmail: string;
  serviceName: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  mode: 'online' | 'offline' | 'home_visit';
  amount: number;
  locationName?: string;
  locationCity?: string;
  googleMeetLink?: string | null;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  /** When set, embeds a Razorpay-style tax invoice in the patient email body */
  invoicePayload?: InvoiceData | null;
}

const EMAIL_FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getModeLabel(mode: string): string {
  const labels: Record<string, string> = {
    online: 'Online Video Consultation',
    offline: 'Clinic Visit',
    home_visit: 'Home Visit',
  };
  return labels[mode] || mode;
}

function buildPatientEmailHTML(data: AppointmentEmailData): string {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://healtohealth.in'}/patient/appointments`;
  const detailRows = [
    { label: 'Service', value: escapeEmailHtml(data.serviceName) },
    { label: 'Doctor', value: `Dr. ${escapeEmailHtml(data.doctorName)}` },
    { label: 'Date', value: escapeEmailHtml(formatDate(data.appointmentDate)) },
    { label: 'Time', value: `${escapeEmailHtml(formatTime(data.startTime))} - ${escapeEmailHtml(formatTime(data.endTime))}` },
    { label: 'Mode', value: escapeEmailHtml(getModeLabel(data.mode)) },
  ];
  if (data.locationName && data.mode !== 'online') {
    detailRows.push({
      label: 'Location',
      value: escapeEmailHtml(
        `${data.locationName}${data.locationCity ? ', ' + data.locationCity : ''}`
      ),
    });
  }
  detailRows.push({ label: 'Amount Paid', value: escapeEmailHtml(formatCurrency(data.amount)) });
  if (data.razorpayPaymentId) {
    detailRows.push({
      label: 'Payment ID',
      value: `<span style="font-family:monospace;font-size:13px;">${escapeEmailHtml(data.razorpayPaymentId)}</span>`,
    });
  }

  return wrapH2HEmail({
    preview: `Payment successful — ${data.serviceName} confirmed`,
    title: 'Payment Successful | H2H Healthcare',
    bodyRowsHtml: [
      emailParagraph(`Hello ${escapeEmailHtml(data.patientName)},`),
      emailParagraph(
        `Your payment of <strong>${escapeEmailHtml(formatCurrency(data.amount))}</strong> has been received and your appointment is confirmed.`
      ),
      emailDetailsTable(detailRows),
      data.googleMeetLink
        ? emailParagraph(
            `Video consultation link: <a href="${escapeEmailHtml(data.googleMeetLink)}" style="color:#0891b2;">${escapeEmailHtml(data.googleMeetLink)}</a>`
          )
        : '',
      data.invoicePayload
        ? emailRawBlock(
            `<p style="margin:0 0 12px;font-size:15px;font-weight:500;color:#0c4a6e;font-family:Poppins,Helvetica,Arial,sans-serif;">Your tax invoice</p>${buildInvoiceEmailSection(data.invoicePayload)}`
          )
        : '',
      emailParagraph(
        `You can view this appointment anytime in your <a href="${escapeEmailHtml(dashboardUrl)}" style="color:#0891b2;">patient dashboard</a>.`
      ),
    ].join(''),
    cta: data.googleMeetLink
      ? { label: 'Join Video Call', href: data.googleMeetLink }
      : { label: 'View in Dashboard', href: dashboardUrl },
    tip: 'This is an automated confirmation email. Please do not reply directly to this message.',
  });
}

function buildDoctorEmailHTML(data: AppointmentEmailData): string {
  const detailRows = [
    { label: 'Patient', value: escapeEmailHtml(data.patientName) },
    { label: 'Patient email', value: escapeEmailHtml(data.patientEmail) },
    { label: 'Service', value: escapeEmailHtml(data.serviceName) },
    { label: 'Date', value: escapeEmailHtml(formatDate(data.appointmentDate)) },
    { label: 'Time', value: `${escapeEmailHtml(formatTime(data.startTime))} - ${escapeEmailHtml(formatTime(data.endTime))}` },
    { label: 'Mode', value: escapeEmailHtml(getModeLabel(data.mode)) },
  ];
  if (data.locationName && data.mode !== 'online') {
    detailRows.push({
      label: 'Location',
      value: escapeEmailHtml(
        `${data.locationName}${data.locationCity ? ', ' + data.locationCity : ''}`
      ),
    });
  }
  detailRows.push({ label: 'Fee', value: escapeEmailHtml(formatCurrency(data.amount)) });

  return wrapH2HEmail({
    preview: `New appointment: ${data.patientName} — ${data.serviceName}`,
    title: 'New Appointment | H2H Healthcare',
    bodyRowsHtml: [
      emailParagraph(`Hello Dr. ${escapeEmailHtml(data.doctorName)},`),
      emailParagraph(
        'A new appointment has been confirmed. Here are the patient and session details:'
      ),
      emailDetailsTable(detailRows),
      data.googleMeetLink
        ? emailParagraph(
            `Video link: <a href="${escapeEmailHtml(data.googleMeetLink)}" style="color:#0891b2;">${escapeEmailHtml(data.googleMeetLink)}</a>`
          )
        : '',
    ].join(''),
    cta: data.googleMeetLink
      ? { label: 'Join Video Call', href: data.googleMeetLink }
      : {
          label: 'Open Doctor Portal',
          href: `${process.env.NEXT_PUBLIC_APP_URL || 'https://healtohealth.in'}/doctor`,
        },
    tip: 'This is an automated doctor notification. Please do not reply to this email.',
  });
}

// ─── Reminder Emails ───────────────────────────────────────────────

export interface ReminderEmailData {
  appointmentId: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  serviceName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  googleMeetLink: string;
  reminderType: '3hr' | '1.5hr' | '30min';
}

function getReminderLabel(type: string): string {
  switch (type) {
    case '3hr': return '3 hours';
    case '1.5hr': return '1 hour 30 minutes';
    case '30min': return '30 minutes';
    default: return type;
  }
}

function buildReminderEmailHTML(data: ReminderEmailData): string {
  const label = getReminderLabel(data.reminderType);

  return wrapH2HEmail({
    preview: `Your appointment starts in ${label}`,
    title: 'Appointment Reminder | H2H Healthcare',
    bodyRowsHtml: [
      emailParagraph(`Hello ${escapeEmailHtml(data.patientName)},`),
      emailParagraph(
        `This is a friendly reminder that your appointment starts in <strong>${escapeEmailHtml(label)}</strong>. Please be ready for your consultation.`
      ),
      emailDetailsTable([
        { label: 'Service', value: escapeEmailHtml(data.serviceName) },
        { label: 'Doctor', value: `Dr. ${escapeEmailHtml(data.doctorName)}` },
        { label: 'Date', value: escapeEmailHtml(formatDate(data.appointmentDate)) },
        {
          label: 'Time',
          value: `${escapeEmailHtml(formatTime(data.startTime))} - ${escapeEmailHtml(formatTime(data.endTime))}`,
        },
      ]),
      emailParagraph(
        'Quick tips: use a stable internet connection, test your camera/mic, find a quiet well-lit space, and keep any reports handy.'
      ),
    ].join(''),
    cta: { label: 'Join Video Consultation', href: data.googleMeetLink },
    tip: 'This is an automated reminder. Please do not reply to this email.',
  });
}

export async function sendReminderEmail(data: ReminderEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('SMTP not configured. Skipping reminder email.');
    return false;
  }

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@h2hhealthcare.com';
  const label = getReminderLabel(data.reminderType);

  try {
    await transporter.sendMail({
      from: `"H2H Healthcare" <${fromAddress}>`,
      to: data.patientEmail,
      subject: `⏰ Reminder: Your appointment starts in ${label} - ${data.serviceName}`,
      html: buildReminderEmailHTML(data),
    });
    console.log(`✅ Reminder (${data.reminderType}) sent to ${data.patientEmail} for appointment ${data.appointmentId}`);
    return true;
  } catch (err) {
    console.error(`Failed to send ${data.reminderType} reminder to ${data.patientEmail}:`, err);
    return false;
  }
}

export async function sendAppointmentConfirmationEmails(data: AppointmentEmailData): Promise<{ patientSent: boolean; doctorSent: boolean }> {
  const transporter = getTransporter();
  const result = { patientSent: false, doctorSent: false };

  if (!transporter) {
    console.warn('Email transporter not configured. Skipping email notifications.');
    return result;
  }

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@h2hhealthcare.com';

  // Send to patient
  if (data.patientEmail) {
    try {
      await transporter.sendMail({
        from: `"H2H Healthcare" <${fromAddress}>`,
        to: data.patientEmail,
        subject: `Payment Successful - ${data.serviceName} | H2H Healthcare`,
        html: buildPatientEmailHTML(data),
      });
      result.patientSent = true;
      console.log(`✅ Patient email sent to ${data.patientEmail}`);
    } catch (err) {
      console.error('Failed to send patient email:', err);
    }
  }

  // Send to doctor
  if (data.doctorEmail) {
    try {
      await transporter.sendMail({
        from: `"H2H Healthcare" <${fromAddress}>`,
        to: data.doctorEmail,
        subject: `New Appointment: ${data.patientName} - ${data.serviceName}`,
        html: buildDoctorEmailHTML(data),
      });
      result.doctorSent = true;
      console.log(`✅ Doctor email sent to ${data.doctorEmail}`);
    } catch (err) {
      console.error('Failed to send doctor email:', err);
    }
  }

  return result;
}
