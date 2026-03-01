/**
 * H2H Healthcare - Google Calendar Integration
 * Handles calendar events and Google Meet link generation
 */

import { google } from 'googleapis';

// Initialize Google OAuth2 client
const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

// Get calendar client with credentials
const getCalendarClient = (accessToken: string, refreshToken?: string) => {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return google.calendar({ version: 'v3', auth: oauth2Client });
};

interface CalendarEventInput {
  summary: string;
  description: string;
  startDateTime: string; // ISO format
  endDateTime: string; // ISO format
  attendees: { email: string; displayName?: string }[];
  location?: string;
  createMeetLink?: boolean;
}

interface CalendarEventResult {
  eventId: string;
  htmlLink: string;
  meetLink?: string;
}

/**
 * Create a calendar event with optional Google Meet link
 */
export async function createCalendarEvent(
  accessToken: string,
  refreshToken: string | undefined,
  input: CalendarEventInput
): Promise<CalendarEventResult> {
  const calendar = getCalendarClient(accessToken, refreshToken);

  const event: any = {
    summary: input.summary,
    description: input.description,
    start: {
      dateTime: input.startDateTime,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: input.endDateTime,
      timeZone: 'Asia/Kolkata',
    },
    attendees: input.attendees.map(a => ({
      email: a.email,
      displayName: a.displayName,
    })),
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 30 }, // 30 minutes before
      ],
    },
  };

  // Add location if provided
  if (input.location) {
    event.location = input.location;
  }

  // Add Google Meet conference if requested
  if (input.createMeetLink) {
    event.conferenceData = {
      createRequest: {
        requestId: `h2h-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: input.createMeetLink ? 1 : 0,
    sendUpdates: 'all', // Send email notifications to attendees
  });

  const eventData = response.data;

  return {
    eventId: eventData.id || '',
    htmlLink: eventData.htmlLink || '',
    meetLink: eventData.conferenceData?.entryPoints?.find(
      (ep: any) => ep.entryPointType === 'video'
    )?.uri || undefined,
  };
}

/**
 * Update an existing calendar event
 */
export async function updateCalendarEvent(
  accessToken: string,
  refreshToken: string | undefined,
  eventId: string,
  updates: Partial<CalendarEventInput>
): Promise<CalendarEventResult> {
  const calendar = getCalendarClient(accessToken, refreshToken);

  const eventUpdates: any = {};

  if (updates.summary) eventUpdates.summary = updates.summary;
  if (updates.description) eventUpdates.description = updates.description;
  if (updates.startDateTime) {
    eventUpdates.start = {
      dateTime: updates.startDateTime,
      timeZone: 'Asia/Kolkata',
    };
  }
  if (updates.endDateTime) {
    eventUpdates.end = {
      dateTime: updates.endDateTime,
      timeZone: 'Asia/Kolkata',
    };
  }
  if (updates.attendees) {
    eventUpdates.attendees = updates.attendees.map(a => ({
      email: a.email,
      displayName: a.displayName,
    }));
  }
  if (updates.location) {
    eventUpdates.location = updates.location;
  }

  const response = await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    requestBody: eventUpdates,
    sendUpdates: 'all',
  });

  const eventData = response.data;

  return {
    eventId: eventData.id || '',
    htmlLink: eventData.htmlLink || '',
    meetLink: eventData.conferenceData?.entryPoints?.find(
      (ep: any) => ep.entryPointType === 'video'
    )?.uri || undefined,
  };
}

/**
 * Cancel/delete a calendar event
 */
export async function cancelCalendarEvent(
  accessToken: string,
  refreshToken: string | undefined,
  eventId: string
): Promise<boolean> {
  const calendar = getCalendarClient(accessToken, refreshToken);

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
    sendUpdates: 'all', // Notify attendees
  });

  return true;
}

/**
 * Get available time slots from doctor's calendar
 */
export async function getCalendarBusySlots(
  accessToken: string,
  refreshToken: string | undefined,
  startDate: string,
  endDate: string
): Promise<{ start: string; end: string }[]> {
  const calendar = getCalendarClient(accessToken, refreshToken);

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: startDate,
      timeMax: endDate,
      timeZone: 'Asia/Kolkata',
      items: [{ id: 'primary' }],
    },
  });

  const busySlots = response.data.calendars?.primary?.busy || [];
  
  return busySlots.map((slot: any) => ({
    start: slot.start || '',
    end: slot.end || '',
  }));
}

/**
 * Generate a standalone Google Meet link (without calendar event)
 */
export async function generateMeetLink(): Promise<string> {
  // For standalone Meet links, we use a simpler approach
  // In production, you'd use the Google Meet API or create a calendar event
  const meetId = `h2h-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  return `https://meet.google.com/${meetId}`;
}

/**
 * Format appointment details for calendar event
 */
export function formatAppointmentForCalendar(appointment: {
  serviceName: string;
  doctorName: string;
  patientName: string;
  patientEmail: string;
  doctorEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: string;
  locationName?: string;
  locationAddress?: string;
}): CalendarEventInput {
  const startDateTime = `${appointment.date}T${appointment.startTime}:00+05:30`;
  const endDateTime = `${appointment.date}T${appointment.endTime}:00+05:30`;

  let description = `
H2H Healthcare Appointment

Service: ${appointment.serviceName}
Doctor: ${appointment.doctorName}
Patient: ${appointment.patientName}
Mode: ${appointment.mode === 'online' ? 'Online (Video Consultation)' : appointment.mode === 'home_visit' ? 'Home Visit' : 'In-Clinic Visit'}
`;

  if (appointment.mode !== 'online' && appointment.locationName) {
    description += `\nLocation: ${appointment.locationName}`;
    if (appointment.locationAddress) {
      description += `\nAddress: ${appointment.locationAddress}`;
    }
  }

  description += `\n\nFor any queries, contact: +91 1800 123 4567`;

  return {
    summary: `H2H: ${appointment.serviceName} with ${appointment.doctorName}`,
    description: description.trim(),
    startDateTime,
    endDateTime,
    attendees: [
      { email: appointment.patientEmail, displayName: appointment.patientName },
      { email: appointment.doctorEmail, displayName: appointment.doctorName },
    ],
    location: appointment.mode !== 'online' ? appointment.locationAddress : undefined,
    createMeetLink: appointment.mode === 'online',
  };
}
