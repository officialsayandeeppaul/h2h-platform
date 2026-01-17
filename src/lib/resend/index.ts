import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'H2H Healthcare <noreply@healtohealth.in>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

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
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">H2H Healthcare</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Your Partner in Wellness</p>
  </div>
  
  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
    <h2 style="color: #0066cc; margin-top: 0;">Booking Confirmed! ✓</h2>
    
    <p>Hi ${data.patientName},</p>
    
    <p>Your appointment has been successfully booked. Here are the details:</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Service:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Doctor:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.doctorName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Date:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Time:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.time}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Location:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Amount:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #0066cc;">₹${data.amount}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.paymentLink}" style="background: #0066cc; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Complete Payment</a>
    </div>
    
    <p style="color: #666; font-size: 14px;">Please complete the payment to confirm your appointment. If you have any questions, feel free to contact us.</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="margin: 0; color: #666; font-size: 14px;">© ${new Date().getFullYear()} H2H Healthcare. All rights reserved.</p>
    <p style="margin: 10px 0 0; color: #999; font-size: 12px;">
      <a href="https://healtohealth.in" style="color: #0066cc;">Website</a> | 
      <a href="mailto:support@healtohealth.in" style="color: #0066cc;">Support</a>
    </p>
  </div>
</body>
</html>
    `.trim(),
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
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Payment Successful! ✓</h1>
  </div>
  
  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
    <p>Hi ${data.patientName},</p>
    
    <p>Great news! Your payment of <strong>₹${data.amount}</strong> has been received and your appointment is now confirmed.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #0066cc;">Appointment Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Service:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Doctor:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.doctorName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Date:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Time:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.time}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Location:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.location}</td>
        </tr>
      </table>
    </div>
    
    ${data.meetLink ? `
    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 10px; font-weight: bold;">📹 Online Consultation Link</p>
      <a href="${data.meetLink}" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Join Video Call</a>
    </div>
    ` : ''}
    
    ${data.receiptUrl ? `
    <p style="text-align: center;">
      <a href="${data.receiptUrl}" style="color: #0066cc;">Download Receipt</a>
    </p>
    ` : ''}
    
    <p style="color: #666; font-size: 14px;">We look forward to seeing you! If you need to reschedule, please do so at least 24 hours before your appointment.</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="margin: 0; color: #666; font-size: 14px;">© ${new Date().getFullYear()} H2H Healthcare</p>
  </div>
</body>
</html>
    `.trim(),
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
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">⏰ Appointment Reminder</h1>
  </div>
  
  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
    <p>Hi ${data.patientName},</p>
    
    <p>This is a friendly reminder that you have an appointment scheduled for <strong>tomorrow</strong>.</p>
    
    <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Service:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Doctor:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.doctorName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Date:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Time:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.time}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Location:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.location}</td>
        </tr>
      </table>
    </div>
    
    ${data.meetLink ? `
    <div style="text-align: center; margin: 20px 0;">
      <a href="${data.meetLink}" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Join Video Call</a>
    </div>
    ` : ''}
    
    <p style="color: #666; font-size: 14px;">Please arrive 10 minutes early for in-person appointments. For online consultations, ensure you have a stable internet connection.</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="margin: 0; color: #666; font-size: 14px;">© ${new Date().getFullYear()} H2H Healthcare</p>
  </div>
</body>
</html>
    `.trim(),
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
