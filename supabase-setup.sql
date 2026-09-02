-- ===================================================================
-- SENSOR DATA TABLE SETUP FOR RESEARCH PROJECT
-- ===================================================================
-- Copy this entire file and paste it into Supabase SQL Editor
-- Then click RUN (or press Ctrl+Enter)

-- Create the sensor_data table
CREATE TABLE sensor_data (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  heart_rate INTEGER,
  ecg_value DECIMAL,
  spo2 INTEGER,
  temperature DECIMAL,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER
  ,patient_id TEXT
  ,patient_name TEXT
);

-- Enable replication for real-time updates
ALTER TABLE sensor_data REPLICA IDENTITY FULL;

-- Enable Row Level Security
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust for production)
CREATE POLICY "Enable all access for sensor_data" 
ON sensor_data 
FOR ALL 
USING (true);

-- Insert sample data for testing
INSERT INTO sensor_data (heart_rate, ecg_value, spo2, temperature, blood_pressure_systolic, blood_pressure_diastolic)
VALUES 
  (72, 0.85, 98, 36.8, 120, 80),
  (78, 0.92, 97, 37.0, 118, 78),
  (85, 1.05, 96, 37.2, 125, 82),
  (68, 0.78, 99, 36.6, 115, 75),
  (92, 1.15, 95, 37.5, 130, 85),
  (75, 0.88, 98, 36.9, 122, 81),
  (81, 0.95, 97, 37.1, 119, 79),
  (70, 0.82, 98, 36.7, 117, 77),
  (88, 1.02, 96, 37.3, 124, 83),
  (76, 0.89, 97, 36.9, 121, 80);

-- Verify the data was inserted
SELECT COUNT(*) as total_records FROM sensor_data;
SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 5;
