-- Run once in Supabase SQL Editor. Existing readings remain valid.
ALTER TABLE sensor_data ADD COLUMN IF NOT EXISTS patient_id TEXT;
ALTER TABLE sensor_data ADD COLUMN IF NOT EXISTS patient_name TEXT;

UPDATE sensor_data
SET patient_id = COALESCE(patient_id, 'DEMO-' || LPAD((id % 4 + 1)::text, 3, '0')),
    patient_name = COALESCE(patient_name, CASE (id % 4)
      WHEN 0 THEN 'Aarav Sharma' WHEN 1 THEN 'Diya Patel'
      WHEN 2 THEN 'Kabir Rao' ELSE 'Meera Nair' END);
