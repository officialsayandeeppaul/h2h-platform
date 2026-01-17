export const APP_CONFIG = {
  name: 'H2H Healthcare',
  tagline: 'Your Partner in Sports Rehab, Pain Management & Wellness',
  description: 'Comprehensive healthcare platform specializing in Sports Rehabilitation, Pain Management, Physiotherapy, and Yoga services across India.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://healtohealth.in',
  email: 'support@healtohealth.in',
  phone: '+91 1800 123 4567',
  social: {
    facebook: 'https://facebook.com/healtohealth',
    instagram: 'https://instagram.com/healtohealth',
    twitter: 'https://twitter.com/healtohealth',
    linkedin: 'https://linkedin.com/company/healtohealth',
    youtube: 'https://youtube.com/@healtohealth',
  },
} as const;

export const TIME_SLOTS = {
  morning: { start: '09:00', end: '12:00', label: 'Morning' },
  afternoon: { start: '12:00', end: '16:00', label: 'Afternoon' },
  evening: { start: '16:00', end: '20:00', label: 'Evening' },
} as const;

export const SLOT_DURATION_MINUTES = 30;

export const BOOKING_RULES = {
  minAdvanceHours: 2,
  maxAdvanceDays: 30,
  cancellationHours: 24,
  rescheduleHours: 12,
} as const;

export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
} as const;

export const FILE_UPLOAD = {
  maxSizeMB: 10,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  prescriptionPath: 'prescriptions',
  avatarPath: 'avatars',
  documentsPath: 'documents',
} as const;

export const NOTIFICATION_TEMPLATES = {
  booking_confirmation: 'Your appointment has been booked successfully.',
  payment_success: 'Payment received! Your appointment is confirmed.',
  appointment_reminder: 'Reminder: You have an appointment tomorrow.',
  appointment_cancelled: 'Your appointment has been cancelled.',
  prescription_uploaded: 'Your prescription has been uploaded by the doctor.',
} as const;

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
