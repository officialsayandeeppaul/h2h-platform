import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const smsNumber = process.env.TWILIO_SMS_NUMBER;

const client = twilio(accountSid, authToken);

interface SendWhatsAppParams {
  to: string;
  message: string;
}

interface SendSMSParams {
  to: string;
  message: string;
}

export async function sendWhatsApp({ to, message }: SendWhatsAppParams) {
  try {
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    
    const result = await client.messages.create({
      body: message,
      from: whatsappNumber,
      to: formattedTo,
    });

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return { success: false, error };
  }
}

export async function sendSMS({ to, message }: SendSMSParams) {
  try {
    const result = await client.messages.create({
      body: message,
      from: smsNumber,
      to,
    });

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error };
  }
}

export const notificationTemplates = {
  bookingConfirmation: (data: { 
    patientName: string; 
    serviceName: string; 
    doctorName: string; 
    date: string; 
    time: string; 
    location: string;
    amount: number;
  }) => `
Hi ${data.patientName}! 🏥

Your appointment has been booked successfully!

📋 Service: ${data.serviceName}
👨‍⚕️ Doctor: ${data.doctorName}
📅 Date: ${data.date}
⏰ Time: ${data.time}
📍 Location: ${data.location}
💰 Amount: ₹${data.amount}

Please complete the payment to confirm your booking.

Thank you for choosing H2H Healthcare!
`.trim(),

  paymentSuccess: (data: {
    patientName: string;
    serviceName: string;
    date: string;
    time: string;
    meetLink?: string;
  }) => `
Hi ${data.patientName}! ✅

Payment received! Your appointment is confirmed.

📋 Service: ${data.serviceName}
📅 Date: ${data.date}
⏰ Time: ${data.time}
${data.meetLink ? `🔗 Meet Link: ${data.meetLink}` : ''}

We look forward to seeing you!

- H2H Healthcare Team
`.trim(),

  appointmentReminder: (data: {
    patientName: string;
    serviceName: string;
    doctorName: string;
    date: string;
    time: string;
    location: string;
    meetLink?: string;
  }) => `
Hi ${data.patientName}! ⏰

Reminder: You have an appointment tomorrow!

📋 Service: ${data.serviceName}
👨‍⚕️ Doctor: ${data.doctorName}
📅 Date: ${data.date}
⏰ Time: ${data.time}
📍 Location: ${data.location}
${data.meetLink ? `🔗 Meet Link: ${data.meetLink}` : ''}

See you soon!
- H2H Healthcare
`.trim(),

  appointmentCancelled: (data: {
    patientName: string;
    serviceName: string;
    date: string;
    reason?: string;
  }) => `
Hi ${data.patientName},

Your appointment has been cancelled.

📋 Service: ${data.serviceName}
📅 Date: ${data.date}
${data.reason ? `📝 Reason: ${data.reason}` : ''}

If you didn't request this cancellation, please contact us.

- H2H Healthcare Team
`.trim(),

  prescriptionUploaded: (data: {
    patientName: string;
    doctorName: string;
    downloadLink: string;
  }) => `
Hi ${data.patientName}! 📄

${data.doctorName} has uploaded your prescription.

Download here: ${data.downloadLink}

For any queries, please contact us.

- H2H Healthcare
`.trim(),
};

export async function sendBookingConfirmation(
  phone: string,
  data: Parameters<typeof notificationTemplates.bookingConfirmation>[0]
) {
  const message = notificationTemplates.bookingConfirmation(data);
  return sendWhatsApp({ to: phone, message });
}

export async function sendPaymentSuccessNotification(
  phone: string,
  data: Parameters<typeof notificationTemplates.paymentSuccess>[0]
) {
  const message = notificationTemplates.paymentSuccess(data);
  return sendWhatsApp({ to: phone, message });
}

export async function sendAppointmentReminder(
  phone: string,
  data: Parameters<typeof notificationTemplates.appointmentReminder>[0]
) {
  const message = notificationTemplates.appointmentReminder(data);
  return sendWhatsApp({ to: phone, message });
}
