/**
 * Doctor Model
 */

import { ConsultationModeType, DayOfWeekType } from './enums';

export interface Doctor {
  id: string;
  user_id?: string;
  location_id?: string;
  specializations: string[];
  qualifications: string[];
  experience_years: number;
  bio?: string;
  google_calendar_id?: string;
  google_meet_enabled: boolean;
  consultation_fee: number;
  rating: number;
  total_reviews: number;
  is_active: boolean;
  created_at: string;
}

export interface DoctorAvailability {
  id: string;
  doctor_id: string;
  center_id?: string;
  day_of_week: DayOfWeekType;
  start_time: string;
  end_time: string;
  mode: ConsultationModeType;
  is_available: boolean;
}

export interface DoctorService {
  doctor_id: string;
  service_id: string;
}

export const DOCTOR_TABLE = 'doctors';
export const DOCTOR_AVAILABILITY_TABLE = 'doctor_availability';
export const DOCTOR_SERVICES_TABLE = 'doctor_services';

export const DOCTOR_SQL = `
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  specializations TEXT[] DEFAULT '{}'::TEXT[],
  qualifications TEXT[] DEFAULT '{}'::TEXT[],
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  google_calendar_id TEXT,
  google_meet_enabled BOOLEAN DEFAULT true,
  consultation_fee DECIMAL(10, 2) DEFAULT 1000,
  rating DECIMAL(2, 1) DEFAULT 5.0,
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL DEFAULT 0,
  start_time TIME NOT NULL DEFAULT '09:00',
  end_time TIME NOT NULL DEFAULT '18:00',
  is_available BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS doctor_services (
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_doctors_user ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_location ON doctors(location_id);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor ON doctor_availability(doctor_id);
`;
