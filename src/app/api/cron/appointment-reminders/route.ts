/**
 * H2H Healthcare - Appointment Reminder Cron Job
 * 
 * Automatically sends reminder emails to patients with online appointments.
 * Sends 3 reminders per appointment:
 *   - 3 hours before
 *   - 1.5 hours before  
 *   - 30 minutes before
 * 
 * This endpoint should be called every 10 minutes by a cron scheduler.
 * Uses appointment metadata to track which reminders have been sent.
 * 
 * Security: Protected by CRON_SECRET env var.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendReminderEmail, type ReminderEmailData } from '@/lib/email';

// Reminder windows in minutes before appointment
const REMINDER_WINDOWS = [
  { type: '3hr' as const, minutesBefore: 180, windowStart: 190, windowEnd: 170 },
  { type: '1.5hr' as const, minutesBefore: 90, windowStart: 100, windowEnd: 80 },
  { type: '30min' as const, minutesBefore: 30, windowStart: 40, windowEnd: 20 },
];

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();
    const now = new Date();
    
    // Get current date and time in IST (Asia/Kolkata)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);
    const todayIST = istNow.toISOString().split('T')[0];
    const currentMinutesIST = istNow.getUTCHours() * 60 + istNow.getUTCMinutes();

    // Fetch today's confirmed online appointments with google_meet_link
    const { data: appointments, error } = await (adminClient
      .from('appointments') as any)
      .select(`
        id,
        appointment_date,
        start_time,
        end_time,
        mode,
        status,
        google_meet_link,
        metadata,
        patient:patient_id(id, full_name, email),
        doctor:doctor_id(id, user_id),
        service:service_id(id, name)
      `)
      .eq('appointment_date', todayIST)
      .eq('mode', 'online')
      .eq('status', 'confirmed')
      .not('google_meet_link', 'is', null);

    if (error) {
      console.error('Failed to fetch appointments for reminders:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No online appointments today',
        processed: 0,
        sent: 0,
      });
    }

    let totalSent = 0;
    let totalSkipped = 0;
    const results: any[] = [];

    for (const apt of appointments) {
      // Parse appointment start time to minutes since midnight
      const [startH, startM] = (apt.start_time || '09:00').split(':').map(Number);
      const appointmentMinutes = startH * 60 + startM;
      const minutesUntilAppointment = appointmentMinutes - currentMinutesIST;

      // Skip if appointment already passed
      if (minutesUntilAppointment < 0) continue;

      // Get already-sent reminders from metadata
      const sentReminders: string[] = apt.metadata?.sent_reminders || [];

      // Get doctor name
      let doctorName = 'Doctor';
      if (apt.doctor?.user_id) {
        const { data: doctorUser } = await adminClient
          .from('users')
          .select('full_name')
          .eq('id', apt.doctor.user_id)
          .single();
        if (doctorUser) {
          doctorName = ((doctorUser as any).full_name || 'Doctor').replace(/^Dr\.?\s*/i, '');
        }
      }

      for (const window of REMINDER_WINDOWS) {
        // Check if this reminder is within its send window
        const inWindow = minutesUntilAppointment <= window.windowStart && 
                         minutesUntilAppointment >= window.windowEnd;

        if (!inWindow) continue;

        // Check if already sent
        const reminderKey = `${window.type}`;
        if (sentReminders.includes(reminderKey)) {
          totalSkipped++;
          continue;
        }

        // Patient must have an email
        const patientEmail = apt.patient?.email;
        if (!patientEmail) {
          totalSkipped++;
          continue;
        }

        // Send reminder
        const emailData: ReminderEmailData = {
          appointmentId: apt.id,
          patientName: apt.patient?.full_name || 'Patient',
          patientEmail,
          doctorName,
          serviceName: apt.service?.name || 'Consultation',
          appointmentDate: apt.appointment_date,
          startTime: apt.start_time,
          endTime: apt.end_time,
          googleMeetLink: apt.google_meet_link,
          reminderType: window.type,
        };

        const sent = await sendReminderEmail(emailData);

        if (sent) {
          // Mark reminder as sent in metadata
          const updatedReminders = [...sentReminders, reminderKey];
          const updatedMetadata = {
            ...(apt.metadata || {}),
            sent_reminders: updatedReminders,
          };

          await (adminClient.from('appointments') as any)
            .update({ metadata: updatedMetadata })
            .eq('id', apt.id);

          // Also update our local copy so subsequent windows don't re-send
          sentReminders.push(reminderKey);

          totalSent++;
          results.push({
            appointmentId: apt.id,
            patient: apt.patient?.full_name,
            reminderType: window.type,
            status: 'sent',
          });
        } else {
          results.push({
            appointmentId: apt.id,
            patient: apt.patient?.full_name,
            reminderType: window.type,
            status: 'failed',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${appointments.length} appointments`,
      date: todayIST,
      currentTimeIST: `${Math.floor(currentMinutesIST / 60)}:${(currentMinutesIST % 60).toString().padStart(2, '0')}`,
      processed: appointments.length,
      sent: totalSent,
      skipped: totalSkipped,
      results,
    });
  } catch (error) {
    console.error('Reminder cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
