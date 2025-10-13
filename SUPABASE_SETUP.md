# Supabase Table Setup Guide

## Step 1: Create the Database Table

Go to your Supabase project dashboard and run this SQL:

\`\`\`sql
-- Create the sensor_data table
CREATE TABLE IF NOT EXISTS sensor_data (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  heart_rate INTEGER,
  ecg_value DECIMAL,
  spo2 INTEGER,
  temperature DECIMAL,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER
);

-- Enable real-time replication
ALTER TABLE sensor_data REPLICA IDENTITY FULL;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS sensor_data_created_at_idx ON sensor_data (created_at DESC);
\`\`\`

## Step 2: Enable Real-time

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk
2. Navigate to **Database** → **Replication**
3. Find **sensor_data** table in the list
4. Toggle the switch to **enable** replication for this table

## Step 3: Set Row Level Security (RLS) Policies

\`\`\`sql
-- Enable RLS on the table
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (for the dashboard)
CREATE POLICY "Allow public read access" ON sensor_data
  FOR SELECT
  USING (true);

-- Allow anonymous insert access (for ESP32 to send data)
CREATE POLICY "Allow public insert access" ON sensor_data
  FOR INSERT
  WITH CHECK (true);
\`\`\`

## Step 4: Test with Sample Data (Optional)

Insert some test data to verify the dashboard works:

\`\`\`sql
INSERT INTO sensor_data (heart_rate, spo2, temperature, blood_pressure_systolic, blood_pressure_diastolic)
VALUES 
  (75, 98, 36.8, 120, 80),
  (82, 97, 37.0, 125, 82),
  (68, 99, 36.6, 118, 78),
  (95, 96, 37.2, 135, 88),
  (72, 98, 36.9, 122, 81);
\`\`\`

## Verification

After setup, you should be able to:
- ✅ See data in the Supabase table editor
- ✅ Real-time updates enabled in Database → Replication
- ✅ RLS policies configured for read/insert
- ✅ Dashboard shows data when you run \`npm run dev\`

## Quick Links

- **Your Project**: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk
- **SQL Editor**: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/sql
- **Table Editor**: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/editor/17301
- **Replication Settings**: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/database/replication
