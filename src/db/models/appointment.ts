/**
 * Appointment Model
 */

import { AppointmentStatusType, PaymentStatusType, ConsultationModeType } from './enums';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id?: string;
  service_id?: string;
  location_id?: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  mode: ConsultationModeType;
  status: AppointmentStatusType;
  payment_status: PaymentStatusType;
  amount: number;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  google_meet_link?: string;
  google_calendar_event_id?: string;
  notes?: string;
  cancellation_reason?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const APPOINTMENT_TABLE = 'appointments';

export const APPOINTMENT_SQL = `
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  mode TEXT NOT NULL DEFAULT 'offline',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  google_meet_link TEXT,
  google_calendar_event_id TEXT,
  notes TEXT,
  cancellation_reason TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
`;
