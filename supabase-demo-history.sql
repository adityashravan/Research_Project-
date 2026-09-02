-- Demo reset: run this once in Supabase SQL Editor.
-- This removes the current demo readings and creates realistic history.
-- Do not run this if sensor_data contains real clinical/device data.

TRUNCATE TABLE public.sensor_data RESTART IDENTITY;

INSERT INTO public.sensor_data
  (patient_id, patient_name, created_at, heart_rate, ecg_value, spo2,
   temperature, blood_pressure_systolic, blood_pressure_diastolic)
VALUES
  ('DEMO-001', 'Aarav Sharma', now() - interval '4 days', 74, 0.86, 98, 36.8, 120, 80),
  ('DEMO-001', 'Aarav Sharma', now() - interval '2 days', 78, 0.91, 97, 37.0, 122, 81),
  ('DEMO-002', 'Diya Patel',   now() - interval '5 days', 82, 0.97, 97, 37.1, 125, 82),
  ('DEMO-002', 'Diya Patel',   now() - interval '1 day',  79, 0.92, 98, 36.9, 121, 80),
  ('DEMO-003', 'Kabir Rao',    now() - interval '6 days', 88, 1.04, 96, 37.3, 130, 85),
  ('DEMO-003', 'Kabir Rao',    now() - interval '3 days',  85, 1.01, 96, 37.2, 128, 84),
  ('DEMO-004', 'Meera Nair',   now() - interval '7 days',  68, 0.79, 99, 36.6, 115, 75),
  ('DEMO-004', 'Meera Nair',   now() - interval '2 days',  71, 0.83, 98, 36.7, 117, 77);
