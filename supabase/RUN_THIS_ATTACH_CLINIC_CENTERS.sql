-- Attach Kolkata + Bhubaneswar clinic centers to doctors (fixes Online-only booking)
-- Run in: Supabase PRODUCTION → SQL Editor
-- Safe to re-run.

BEGIN;

-- 1) Locations for the two centers
INSERT INTO public.locations (id, name, city, address, tier, latitude, longitude, phone, email, is_active)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'H2H Kolkata',
  'Kolkata',
  '275/1 Bidhanpally Road, near Sonali Park, Basdroni, Kolkata - 700084',
  2, 22.4758, 88.3575, '+91 62916 15560', 'official@healtohealth.in', TRUE
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address,
  is_active = TRUE;

INSERT INTO public.locations (id, name, city, address, tier, latitude, longitude, phone, email, is_active)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'H2H Bhubaneswar',
  'Bhubaneswar',
  'Motive Physiocare & Physical Fitness Clinic, S-4/96, Neeladri Vihar, CS PUR, Bhubaneswar',
  2, 20.2961, 85.8245, '+91 62916 15560', 'official@healtohealth.in', TRUE
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address,
  is_active = TRUE;

-- 2) Clinic centers
INSERT INTO public.clinic_centers (
  id, location_id, name, slug, address, pincode, phone, email,
  facilities, rating, total_reviews, is_featured, is_active
)
VALUES (
  'c1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'H2H Kolkata — Basdroni',
  'h2h-kolkata-basdroni',
  '275/1 Bidhanpally Road, near Sonali Park, Basdroni',
  '700084',
  '+91 62916 15560',
  'official@healtohealth.in',
  '["Parking","Wheelchair Access","Treatment Rooms","Rehab Equipment"]'::jsonb,
  4.9, 0, TRUE, TRUE
)
ON CONFLICT (id) DO UPDATE SET
  location_id = EXCLUDED.location_id,
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  address = EXCLUDED.address,
  pincode = EXCLUDED.pincode,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  facilities = EXCLUDED.facilities,
  rating = EXCLUDED.rating,
  is_featured = TRUE,
  is_active = TRUE;

INSERT INTO public.clinic_centers (
  id, location_id, name, slug, address, pincode, phone, email,
  facilities, rating, total_reviews, is_featured, is_active
)
VALUES (
  'c2222222-2222-2222-2222-222222222221',
  '22222222-2222-2222-2222-222222222222',
  'H2H × Motive Physiocare',
  'h2h-bhubaneswar-motive',
  'Motive Physiocare & Physical Fitness Clinic, S-4/96, Neeladri Vihar, CS PUR',
  '751021',
  '+91 62916 15560',
  'official@healtohealth.in',
  '["Parking","Wheelchair Access","Gym","Physio Lab"]'::jsonb,
  4.8, 0, TRUE, TRUE
)
ON CONFLICT (id) DO UPDATE SET
  location_id = EXCLUDED.location_id,
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  address = EXCLUDED.address,
  pincode = EXCLUDED.pincode,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  facilities = EXCLUDED.facilities,
  rating = EXCLUDED.rating,
  is_featured = TRUE,
  is_active = TRUE;

-- 3) Resolve doctors by email (prod IDs may differ from seed UUIDs)
WITH docs AS (
  SELECT d.id AS doctor_id, lower(u.email) AS email
  FROM public.doctors d
  JOIN public.users u ON u.id = d.user_id
  WHERE lower(u.email) IN (
    'sukdebmahanta2@gmail.com',
    'akshatchouhan83@gmail.com',
    '9778570900jitu@gmail.com'
  )
)
UPDATE public.doctors d
SET
  offers_online = TRUE,
  offers_clinic = TRUE,
  location_id = CASE
    WHEN docs.email = 'akshatchouhan83@gmail.com'
      THEN '22222222-2222-2222-2222-222222222222'::uuid
    ELSE '11111111-1111-1111-1111-111111111111'::uuid
  END,
  is_active = TRUE
FROM docs
WHERE d.id = docs.doctor_id;

-- 4) Attach center_id on existing Both/Clinic slots (null or missing)
WITH docs AS (
  SELECT d.id AS doctor_id, lower(u.email) AS email, d.location_id
  FROM public.doctors d
  JOIN public.users u ON u.id = d.user_id
  WHERE lower(u.email) IN (
    'sukdebmahanta2@gmail.com',
    'akshatchouhan83@gmail.com',
    '9778570900jitu@gmail.com'
  )
)
UPDATE public.doctor_availability a
SET
  mode = COALESCE(NULLIF(a.mode, ''), 'both'),
  center_id = CASE
    WHEN docs.email = 'akshatchouhan83@gmail.com'
      THEN 'c2222222-2222-2222-2222-222222222221'::uuid
    ELSE 'c1111111-1111-1111-1111-111111111111'::uuid
  END,
  is_available = TRUE
FROM docs
WHERE a.doctor_id = docs.doctor_id
  AND COALESCE(a.mode, 'both') IN ('both', 'offline');

-- 5) If a doctor has no availability rows, create Mon–Sat Both @ their center
INSERT INTO public.doctor_availability (
  doctor_id, day_of_week, start_time, end_time, is_available, mode, center_id
)
SELECT
  d.id,
  g.dow,
  '09:00'::time,
  '18:00'::time,
  TRUE,
  'both',
  CASE
    WHEN lower(u.email) = 'akshatchouhan83@gmail.com'
      THEN 'c2222222-2222-2222-2222-222222222221'::uuid
    ELSE 'c1111111-1111-1111-1111-111111111111'::uuid
  END
FROM public.doctors d
JOIN public.users u ON u.id = d.user_id
CROSS JOIN generate_series(1, 6) AS g(dow)
WHERE lower(u.email) IN (
  'sukdebmahanta2@gmail.com',
  'akshatchouhan83@gmail.com',
  '9778570900jitu@gmail.com'
)
AND NOT EXISTS (
  SELECT 1 FROM public.doctor_availability a WHERE a.doctor_id = d.id
);

-- 6) Link these doctors to all active services (so category booking finds them)
INSERT INTO public.doctor_services (doctor_id, service_id, is_primary)
SELECT d.id, s.id, FALSE
FROM public.doctors d
JOIN public.users u ON u.id = d.user_id
CROSS JOIN public.services s
WHERE lower(u.email) IN (
  'sukdebmahanta2@gmail.com',
  'akshatchouhan83@gmail.com',
  '9778570900jitu@gmail.com'
)
AND s.is_active = TRUE
AND NOT EXISTS (
  SELECT 1 FROM public.doctor_services ds
  WHERE ds.doctor_id = d.id AND ds.service_id = s.id
);

-- 7) Basic center open hours Mon–Sat (if table exists and empty)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'clinic_center_availability'
  ) THEN
    INSERT INTO public.clinic_center_availability (
      center_id, day_of_week, is_open, open_time, close_time, max_appointments, current_bookings
    )
    SELECT c.id, g.dow, TRUE, '09:00'::time, '18:00'::time, 40, 0
    FROM public.clinic_centers c
    CROSS JOIN generate_series(1, 6) AS g(dow)
    WHERE c.id IN (
      'c1111111-1111-1111-1111-111111111111'::uuid,
      'c2222222-2222-2222-2222-222222222221'::uuid
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.clinic_center_availability a
      WHERE a.center_id = c.id AND a.day_of_week = g.dow
    );
  END IF;
END $$;

COMMIT;

-- Verify
SELECT c.name, c.slug, c.is_active, l.city
FROM public.clinic_centers c
JOIN public.locations l ON l.id = c.location_id
WHERE c.id IN (
  'c1111111-1111-1111-1111-111111111111',
  'c2222222-2222-2222-2222-222222222221'
);

SELECT u.full_name, u.email, a.day_of_week, a.mode, a.center_id, cc.name AS center_name
FROM public.doctor_availability a
JOIN public.doctors d ON d.id = a.doctor_id
JOIN public.users u ON u.id = d.user_id
LEFT JOIN public.clinic_centers cc ON cc.id = a.center_id
WHERE lower(u.email) IN (
  'sukdebmahanta2@gmail.com',
  'akshatchouhan83@gmail.com',
  '9778570900jitu@gmail.com'
)
ORDER BY u.email, a.day_of_week;
