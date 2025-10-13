# Enable Real-time for mic_data Table

## Quick Fix Steps:

### 1. Enable Real-time Replication for mic_data

Go to your Supabase Replication settings:
👉 https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/database/replication

Find **mic_data** in the table list and toggle it to **ENABLE** real-time.

### 2. Verify RLS Policies (If needed)

Go to SQL Editor:
👉 https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/sql

Run this to ensure the dashboard can read data:

\`\`\`sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'mic_data';

-- If RLS is enabled and you have no read policy, add this:
CREATE POLICY IF NOT EXISTS "Allow public read access" ON mic_data
  FOR SELECT USING (true);
\`\`\`

### 3. Verify Table Structure

Make sure your mic_data table has these columns (or similar):
- `id` (primary key)
- `created_at` (timestamp)
- `heart_rate` (integer or numeric)
- `spo2` (integer or numeric)
- `temperature` (numeric/decimal)
- `blood_pressure_systolic` (integer or numeric)
- `blood_pressure_diastolic` (integer or numeric)

If your columns have different names, let me know and I'll update the code!

### 4. Check Your ESP32 Data Format

Make sure ESP32 is sending data in this format:

\`\`\`json
{
  "heart_rate": 75,
  "spo2": 98,
  "temperature": 36.8,
  "blood_pressure_systolic": 120,
  "blood_pressure_diastolic": 80
}
\`\`\`

## After Completing Steps:

1. Refresh your browser at http://localhost:3000
2. Check browser console (F12) for any errors
3. Data should appear automatically!

## Troubleshooting:

**Still no data showing?**
- Open browser console (F12) and check for errors
- Verify mic_data table has data: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/editor/17301
- Make sure real-time is enabled in Replication settings
- Check that column names match what the code expects
