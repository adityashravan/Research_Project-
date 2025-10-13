# 🚀 Quick Start Checklist

## ✅ Completed Steps

- [x] Project structure created
- [x] Dependencies installed
- [x] Environment variables configured (.env.local)
- [x] Development server started at http://localhost:3000

## 📋 Next Steps to Complete Setup

### 1. Set Up Supabase Database Table

**Open your Supabase SQL Editor:**
👉 https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/sql

**Run this SQL command:**

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

-- Enable RLS
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for the dashboard)
CREATE POLICY "Allow public read access" ON sensor_data
  FOR SELECT USING (true);

-- Allow public insert access (for ESP32)
CREATE POLICY "Allow public insert access" ON sensor_data
  FOR INSERT WITH CHECK (true);
\`\`\`

### 2. Enable Real-time Replication

1. Go to: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/database/replication
2. Find **sensor_data** in the table list
3. Toggle the switch to **ENABLE** replication

### 3. Add Test Data (Optional)

Run this in SQL Editor to add sample data:

\`\`\`sql
INSERT INTO sensor_data (heart_rate, spo2, temperature, blood_pressure_systolic, blood_pressure_diastolic)
VALUES 
  (75, 98, 36.8, 120, 80),
  (82, 97, 37.0, 125, 82),
  (68, 99, 36.6, 118, 78),
  (95, 96, 37.2, 135, 88),
  (72, 98, 36.9, 122, 81);
\`\`\`

### 4. View Your Dashboard

🌐 **Open in browser:** http://localhost:3000

You should see:
- ✨ Modern dashboard with gradient background
- 📊 Vital signs cards (Heart Rate, SpO2, BP, Temperature)
- 📈 Real-time charts
- 🏥 Heart disease risk assessment
- 📋 Historical data table

### 5. Configure Your ESP32 (When Ready)

Use this code to send data from ESP32:

\`\`\`cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* supabaseUrl = "https://fpeblbnyiyaqyxwvvctk.supabase.co/rest/v1/sensor_data";
const char* supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwZWJsYm55aXlhcXl4d3Z2Y3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNjE0ODIsImV4cCI6MjA3MDkzNzQ4Mn0.EYGLRj-0n3R8KvKQTOHKHUXinxrKyw3Y_awtrJ60cYs";

void sendToSupabase(int heartRate, int spo2, float temp, int bpSys, int bpDia) {
  HTTPClient http;
  http.begin(supabaseUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization", String("Bearer ") + supabaseKey);
  
  String jsonData = "{";
  jsonData += "\\"heart_rate\\":" + String(heartRate) + ",";
  jsonData += "\\"spo2\\":" + String(spo2) + ",";
  jsonData += "\\"temperature\\":" + String(temp) + ",";
  jsonData += "\\"blood_pressure_systolic\\":" + String(bpSys) + ",";
  jsonData += "\\"blood_pressure_diastolic\\":" + String(bpDia);
  jsonData += "}";
  
  int httpResponseCode = http.POST(jsonData);
  Serial.println("Response code: " + String(httpResponseCode));
  http.end();
}
\`\`\`

## 🎯 Summary

**What's Running:**
- ✅ Next.js dev server: http://localhost:3000
- ✅ Environment configured with your Supabase credentials

**What You Need to Do:**
1. ⏳ Create the database table (SQL above)
2. ⏳ Enable real-time replication
3. ⏳ Add test data (optional)
4. ⏳ Open http://localhost:3000 in your browser

**Status Check:**
- Server running: ✅
- Database table: ⏳ (Complete Step 1)
- Real-time enabled: ⏳ (Complete Step 2)
- Dashboard accessible: ✅ (Open browser)

## 🆘 Troubleshooting

**If dashboard shows "Loading health data..." forever:**
- Make sure you've created the database table
- Check that real-time is enabled
- Add some test data to the table

**If real-time updates don't work:**
- Verify replication is enabled in Database → Replication
- Check browser console for WebSocket errors

## 📚 Additional Resources

- Full Setup Guide: See `SUPABASE_SETUP.md`
- Complete Documentation: See `README.md`
- Your Supabase Dashboard: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk

---

**Need help?** Check the browser console (F12) for any error messages.
