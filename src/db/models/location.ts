/**
 * Location Model
 */

import { LocationTierType } from './enums';

export interface Location {
  id: string;
  name: string;
  city: string;
  address: string;
  tier: LocationTierType;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
}

export const LOCATION_TABLE = 'locations';

export const LOCATION_SQL = `
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 1,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
`;
