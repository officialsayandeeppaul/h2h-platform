import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import {
  emailDetailsTable,
  emailParagraph,
  emailSummaryTable,
  escapeEmailHtml,
  wrapH2HEmail,
} from '@/lib/email-layout';

let resendClient: Resend | null = null;
function getResend() {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY || 're_missing');
  }
  return resendClient;
}

const devTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const isProduction = process.env.NODE_ENV === 'production';
  const fromEmail = process.env.EMAIL_FROM || 'H2H Healthcare <noreply@healtohealth.in>';

  console.log('Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
  console.log('Sending email from:', fromEmail);
  console.log('Sending email to:', to);
  console.log('Subject:', subject);

  try {
    if (isProduction) {
      const { data, error } = await getResend().emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      });

      if (error) {
        console.error('Resend email error:', error);
        return { success: false, error };
      }

      console.log('✓ Email sent via Resend, ID:', data?.id);
      return { success: true, id: data?.id };
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('⚠️ SMTP credentials not configured. Email would be sent to:', to);
      return { success: true, id: 'dev-mode-no-smtp' };
    }

    const info = await devTransporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
    });

    console.log('✓ Email sent via Nodemailer, ID:', info.messageId);
    return { success: true, id: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://healtohealth.in';

export const emailTemplates = {
  bookingConfirmation: (data: {
    patientName: string;
    serviceName: string;
    doctorName: string;
    date: string;
    time: string;
    location: string;
    amount: number;
    paymentLink: string;
  }) => ({
    subject: `Booking Confirmed - ${data.serviceName} | H2H Healthcare`,
    html: wrapH2HEmail({
      preview: `Complete payment to confirm your ${data.serviceName} booking`,
      title: 'Booking Confirmed | H2H Healthcare',
      headerTitle: 'Booking received',
      bodyRowsHtml: [
        emailParagraph(`Hello ${escapeEmailHtml(data.patientName)},`),
        emailParagraph(
          'Your appointment request is saved. Please complete payment to lock your slot — slots are held only after successful payment.'
        ),
        emailDetailsTable([
          { label: 'Service', value: escapeEmailHtml(data.serviceName) },
          { label: 'Doctor', value: escapeEmailHtml(data.doctorName) },
          { label: 'Date', value: escapeEmailHtml(data.date) },
          { label: 'Time', value: escapeEmailHtml(data.time) },
          { label: 'Centre / mode', value: escapeEmailHtml(data.location) },
        ]),
        emailSummaryTable({
          title: 'Amount due',
          items: [
            {
              name: escapeEmailHtml(data.serviceName),
              meta: '1',
              amount: `₹${data.amount.toLocaleString('en-IN')}`,
            },
          ],
          totalLabel: 'Payable',
          totalAmount: `₹${data.amount.toLocaleString('en-IN')}`,
        }),
        emailParagraph(
          'Pay securely with UPI, debit/credit card, or net banking via Razorpay.'
        ),
      ].join(''),
      cta: { label: 'Complete payment', href: data.paymentLink },
      tip: `If you did not request this booking, contact us at once at <a href="mailto:support@healtohealth.in" style="color:#0891b2;text-decoration:none;">support@healtohealth.in</a> or +91 62916 15560.`,
    }),
  }),

  paymentSuccess: (data: {
    patientName: string;
    serviceName: string;
    doctorName: string;
    date: string;
    time: string;
    location: string;
    amount: number;
    meetLink?: string;
    receiptUrl?: string;
  }) => ({
    subject: `Payment Successful - Appointment Confirmed | H2H Healthcare`,
    html: wrapH2HEmail({
      preview: `Payment of ₹${data.amount} received — appointment confirmed`,
      title: 'Payment Successful | H2H Healthcare',
      headerTitle: 'Payment successful',
      bodyRowsHtml: [
        emailParagraph(`Hello ${escapeEmailHtml(data.patientName)},`),
        emailParagraph(
          `Great news! Your payment of <strong>₹${data.amount.toLocaleString('en-IN')}</strong> has been received and your appointment is confirmed.`
        ),
        emailDetailsTable([
          { label: 'Service', value: escapeEmailHtml(data.serviceName) },
          { label: 'Doctor', value: escapeEmailHtml(data.doctorName) },
          { label: 'Date', value: escapeEmailHtml(data.date) },
          { label: 'Time', value: escapeEmailHtml(data.time) },
          { label: 'Centre / mode', value: escapeEmailHtml(data.location) },
        ]),
        emailSummaryTable({
          title: 'Payment summary',
          items: [
            {
              name: escapeEmailHtml(data.serviceName),
              meta: '1',
              amount: `₹${data.amount.toLocaleString('en-IN')}`,
            },
          ],
          totalLabel: 'Total paid',
          totalAmount: `₹${data.amount.toLocaleString('en-IN')}`,
        }),
        data.meetLink
          ? emailParagraph(
              `Online consultation link: <a href="${escapeEmailHtml(data.meetLink)}" style="color:#0891b2;text-decoration:none;">Join video call</a>`
            )
          : '',
        emailParagraph(
          'We look forward to seeing you. Please reschedule at least 24 hours before your appointment if needed.'
        ),
      ].join(''),
      cta: data.meetLink
        ? { label: 'Join video call', href: data.meetLink }
        : { label: 'View appointment', href: `${APP_URL}/patient/appointments` },
      secondaryCta: data.receiptUrl
        ? { label: 'Download receipt', href: data.receiptUrl }
        : { label: 'Open dashboard', href: `${APP_URL}/patient/appointments` },
      tip: `You're receiving this because you made a booking at H2H Healthcare. Questions? <a href="mailto:support@healtohealth.in" style="color:#0891b2;text-decoration:none;">support@healtohealth.in</a>`,
    }),
  }),

  appointmentReminder: (data: {
    patientName: string;
    serviceName: string;
    doctorName: string;
    date: string;
    time: string;
    location: string;
    meetLink?: string;
  }) => ({
    subject: `Reminder: Appointment Tomorrow - ${data.serviceName} | H2H Healthcare`,
    html: wrapH2HEmail({
      preview: `Reminder: ${data.serviceName} tomorrow at ${data.time}`,
      title: 'Appointment Reminder | H2H Healthcare',
      headerTitle: 'Appointment tomorrow',
      bodyRowsHtml: [
        emailParagraph(`Hello ${escapeEmailHtml(data.patientName)},`),
        emailParagraph(
          'Friendly reminder — you have an appointment scheduled for <strong>tomorrow</strong>.'
        ),
        emailDetailsTable([
          { label: 'Service', value: escapeEmailHtml(data.serviceName) },
          { label: 'Doctor', value: escapeEmailHtml(data.doctorName) },
          { label: 'Date', value: escapeEmailHtml(data.date) },
          { label: 'Time', value: escapeEmailHtml(data.time) },
          { label: 'Centre / mode', value: escapeEmailHtml(data.location) },
        ]),
        emailParagraph(
          'Please reach 10 minutes early for clinic visits. For video consultations, use a stable internet connection and keep reports handy.'
        ),
      ].join(''),
      cta: data.meetLink
        ? { label: 'Join video call', href: data.meetLink }
        : { label: 'View appointment', href: `${APP_URL}/patient/appointments` },
      tip: 'Need to reschedule? Contact us as soon as possible so we can help — ideally 24 hours in advance.',
    }),
  }),
};

export async function sendBookingConfirmationEmail(
  to: string,
  data: Parameters<typeof emailTemplates.bookingConfirmation>[0]
) {
  const { subject, html } = emailTemplates.bookingConfirmation(data);
  return sendEmail({ to, subject, html });
}

export async function sendPaymentSuccessEmail(
  to: string,
  data: Parameters<typeof emailTemplates.paymentSuccess>[0]
) {
  const { subject, html } = emailTemplates.paymentSuccess(data);
  return sendEmail({ to, subject, html });
}

export async function sendAppointmentReminderEmail(
  to: string,
  data: Parameters<typeof emailTemplates.appointmentReminder>[0]
) {
  const { subject, html } = emailTemplates.appointmentReminder(data);
  return sendEmail({ to, subject, html });
}
