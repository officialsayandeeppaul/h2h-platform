/**
 * Clinic Center Model
 */

export interface ClinicCenter {
  id: string;
  location_id: string;
  name: string;
  slug: string;
  address: string;
  pincode?: string;
  phone?: string;
  email?: string;
  facilities: string[];
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export const CLINIC_CENTER_TABLE = 'clinic_centers';

export const CLINIC_CENTER_SQL = `
CREATE TABLE IF NOT EXISTS clinic_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  pincode TEXT,
  phone TEXT,
  email TEXT,
  facilities JSONB DEFAULT '[]'::JSONB,
  rating DECIMAL(2, 1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clinic_centers_location ON clinic_centers(location_id);
CREATE INDEX IF NOT EXISTS idx_clinic_centers_slug ON clinic_centers(slug);
`;
