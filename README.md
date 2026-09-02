# Heart Disease Monitoring Dashboard 🫀

A modern, real-time heart disease monitoring and classification dashboard built with Next.js, Supabase, and advanced data visualization tools. This application receives data from ESP32 sensors, stores it in Supabase, and provides real-time analytics with heart disease risk assessment.

## Features ✨

- **Real-time Data Monitoring**: Live updates from ESP32 sensors via Supabase real-time subscriptions
- **Heart Disease Risk Assessment**: Automated risk classification based on vital signs
- **Advanced Data Visualization**: Interactive charts showing heart rate, SpO2, and other vital parameters
- **Historical Data Analysis**: Complete history with filtering and trend analysis
- **Modern UI/UX**: Beautiful, responsive design with dark mode support
- **Vital Signs Tracking**:
  - Heart Rate (BPM)
  - Blood Oxygen Saturation (SpO2)
  - Blood Pressure (Systolic/Diastolic)
  - Body Temperature
  - ECG Values

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database & Real-time**: Supabase
- **Data Visualization**: Chart.js, React Chart.js 2
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites 📋

- Node.js 18+ installed
- A Supabase account and project
- ESP32 device (for sending sensor data)

## Getting Started 🚀

### 1. Clone the repository

\`\`\`bash
cd c:\\Users\\adity\\OneDrive\\Desktop\\Puneet_RP
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up Supabase

#### Create a table in your Supabase project:

\`\`\`sql
CREATE TABLE sensor_data (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  heart_rate INTEGER,
  ecg_value DECIMAL,
  spo2 INTEGER,
  temperature DECIMAL,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER
);

-- Enable real-time
ALTER TABLE sensor_data REPLICA IDENTITY FULL;
\`\`\`

#### Enable Real-time in Supabase Dashboard:
1. Go to your Supabase project dashboard
2. Navigate to Database → Replication
3. Enable replication for the `sensor_data` table

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=https://fpeblbnyiyaqyxwvvctk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
\`\`\`

To get your Supabase credentials:
1. Go to your Supabase project settings
2. Navigate to API settings
3. Copy the project URL and anon/public key

### 5. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Live demo and doctors view

After the original `sensor_data` table exists, run `supabase-patient-fields.sql` once in the Supabase SQL Editor. It adds `patient_id` and `patient_name` and backfills existing readings so the doctors view has populated history.

For a clean demo dataset with realistic historical dates, run `supabase-demo-history.sql` after that migration. It resets demo data, so do not run it when the table contains real device or clinical data. The historical seed readings are spread across older dates; live simulator readings are always inserted as new current-time database rows.

Open `/` for the live monitoring dashboard and `/doctor` for the unauthenticated doctors dashboard. In a second terminal, run `npm run demo:once` to send one live reading, or `npm run demo:live` to send a new reading every 10 seconds. The main dashboard displays the current patient name, and both pages subscribe to Supabase realtime INSERT events, so values update automatically.

## ESP32 Integration 📡

Your ESP32 should send data to Supabase using the Supabase REST API. Here's a sample ESP32 code snippet:

\`\`\`cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";
const char* supabaseUrl = "https://fpeblbnyiyaqyxwvvctk.supabase.co/rest/v1/sensor_data";
const char* supabaseKey = "your_supabase_anon_key";

void sendToSupabase(int heartRate, float spo2, float temp) {
  HTTPClient http;
  http.begin(supabaseUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization", String("Bearer ") + supabaseKey);
  
  String jsonData = "{\\"heart_rate\\":" + String(heartRate) + 
                    ",\\"spo2\\":" + String(spo2) + 
                    ",\\"temperature\\":" + String(temp) + "}";
  
  int httpResponseCode = http.POST(jsonData);
  http.end();
}
\`\`\`

## Project Structure 📁

\`\`\`
Puneet_RP/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx             # Main dashboard page
│   └── globals.css          # Global styles
├── components/
│   ├── Header.tsx           # Dashboard header
│   ├── StatsCards.tsx       # Vital signs cards
│   ├── RealTimeChart.tsx    # Real-time charts
│   ├── RiskAssessment.tsx   # Heart disease risk assessment
│   └── HistoricalData.tsx   # Historical data table
├── lib/
│   ├── supabase.ts          # Supabase client & types
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
└── package.json
\`\`\`

## Features Explained 🔍

### Real-time Monitoring
The dashboard automatically subscribes to database changes using Supabase real-time. When new data arrives from your ESP32, it instantly updates:
- Live vital signs cards
- Real-time charts
- Risk assessment
- Historical data table

### Heart Disease Risk Assessment
The system analyzes current readings and calculates risk based on:
- **Heart Rate**: Normal (60-100 bpm)
- **Blood Pressure**: Normal (≤120/80 mmHg)
- **SpO2**: Normal (≥95%)
- **Temperature**: Normal (36.5-37.5°C)

Risk levels: Low → Moderate → High → Critical

### Data Visualization
- **Heart Rate Chart**: Line graph showing BPM trends
- **SpO2 Chart**: Blood oxygen saturation over time
- **Stats Cards**: Current readings with normal/abnormal indicators
- **Historical Table**: Complete data history with risk classification

## Customization 🎨

### Modify Table Name
If your Supabase table has a different name, update it in `app/page.tsx`:

\`\`\`typescript
.from('your_table_name') // Change 'sensor_data' to your table name
\`\`\`

### Adjust Risk Thresholds
Modify risk calculation in `lib/utils.ts`:

\`\`\`typescript
export function calculateHeartDiseaseRisk(data: SensorData): HeartDiseaseRisk {
  // Customize thresholds here
}
\`\`\`

### Add More Vital Signs
1. Update Supabase table schema
2. Add fields to `SensorData` interface in `lib/supabase.ts`
3. Add new stat card in `components/StatsCards.tsx`
4. Create new chart in `components/RealTimeChart.tsx`

## Build for Production 🏗️

\`\`\`bash
npm run build
npm start
\`\`\`

## Deploy 🌐

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify
1. Build the project: \`npm run build\`
2. Deploy the \`.next\` folder to Netlify
3. Configure environment variables

## Troubleshooting 🔧

### Real-time not working
- Ensure table replication is enabled in Supabase
- Check that RLS policies allow reading from the table
- Verify WebSocket connection in browser console

### No data showing
- Confirm ESP32 is sending data to correct endpoint
- Check Supabase table has data
- Verify environment variables are set correctly

### Charts not rendering
- Ensure dependencies are installed: \`npm install\`
- Check browser console for errors
- Verify Chart.js is properly imported

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is open source and available under the MIT License.

## Support 💬

For issues and questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include error logs and screenshots

## Acknowledgments 🙏

- Built with ❤️ for healthcare monitoring
- Powered by Supabase real-time infrastructure
- Charts by Chart.js
- Icons by Lucide

---

**Note**: This dashboard is for monitoring and educational purposes. Always consult healthcare professionals for medical decisions.
