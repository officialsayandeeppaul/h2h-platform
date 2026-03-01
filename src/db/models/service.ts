/**
 * Service Model
 */

import { ServiceCategoryType } from './enums';

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategoryType;
  description?: string;
  duration_minutes: number;
  tier1_price: number;
  tier2_price: number;
  online_available: boolean;
  offline_available: boolean;
  home_visit_available: boolean;
  is_active: boolean;
  created_at: string;
}

export const SERVICE_TABLE = 'services';

export const SERVICE_SQL = `
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'pain_relief_physiotherapy',
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  tier1_price DECIMAL(10, 2) NOT NULL DEFAULT 1000,
  tier2_price DECIMAL(10, 2) NOT NULL DEFAULT 800,
  online_available BOOLEAN DEFAULT true,
  offline_available BOOLEAN DEFAULT true,
  home_visit_available BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
`;
