# 🏗️ Project Structure & Organization

## 📁 Current Directory Structure

```
Puneet_RP/
├── 📱 app/                          # Next.js App Router
│   ├── analytics/                   # Analytics page (not currently used)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css                  # Global styles with Tailwind
│   ├── layout.tsx                   # Root layout with metadata
│   └── page.tsx                     # Main dashboard (HOME)
│
├── 🧩 components/                   # React components
│   ├── Header.tsx                   # Dashboard header
│   ├── StatsCards.tsx               # Health metrics cards (HR, SpO2, Temp, ECG)
│   ├── RealTimeChart.tsx            # Real-time line charts
│   ├── RiskAssessment.tsx           # Heart disease risk calculator
│   ├── HistoricalData.tsx           # Data table with history
│   └── RawSensorData.tsx            # Raw sensor value display
│
├── 📚 lib/                          # Utilities and configuration
│   ├── supabase.ts                  # Supabase client & TypeScript types
│   └── utils.ts                     # Helper functions (risk calculation, cn)
│
├── 🗄️ Database Scripts/             # Supabase setup & test scripts
│   ├── setup-database.js            # Check table existence
│   ├── create-table.js              # Create sensor_data table
│   ├── insert-sample-data.js        # Insert test data
│   ├── simulate-sensor.js           # Node.js sensor simulator
│   ├── simulate.bat                 # Windows batch to run simulator
│   └── supabase-setup.sql           # SQL table definitions
│
├── 🔧 Configuration Files/
│   ├── .env.local                   # Environment variables (SECRET - not in git)
│   ├── .env.local.example           # Example env template
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.ts           # Tailwind CSS config
│   ├── tsconfig.json                # TypeScript configuration
│   ├── postcss.config.js            # PostCSS config
│   ├── package.json                 # Dependencies & scripts
│   └── .gitignore                   # Git ignore rules
│
├── 🤖 Hardware/
│   └── store_micdata_db.ino         # ESP32 Arduino code for sensor
│
├── 📖 Documentation/
│   ├── README.md                    # Main project documentation
│   ├── QUICKSTART.md                # Quick setup guide
│   ├── READY_TO_GO.md               # Final setup status
│   ├── SUPABASE_SETUP.md            # Database setup guide
│   ├── DATA_MAPPING.md              # Sensor data to health metrics mapping
│   ├── FIXED_NO_FAKE_DATA.md        # Changelog for fake data removal
│   ├── FIX_MIC_DATA.md              # mic_data table fixes
│   ├── VERIFICATION_CHECKLIST.md    # Setup verification steps
│   └── PROJECT_STRUCTURE.md         # This file
│
└── 🚫 Generated/
    ├── .next/                       # Next.js build output
    └── node_modules/                # NPM dependencies
```

## 🎯 Key Files Explained

### Frontend Core
- **`app/page.tsx`**: Main dashboard with real-time data fetching and WebSocket subscriptions
- **`app/layout.tsx`**: Root layout wrapper with metadata
- **`app/globals.css`**: Global styles including Tailwind utilities and custom card styles

### Components (Modular UI)
- **`Header.tsx`**: Top navigation with logo and title
- **`StatsCards.tsx`**: 4 metric cards showing current vitals
- **`RealTimeChart.tsx`**: Line graphs for heart rate and oxygen trends
- **`RiskAssessment.tsx`**: Risk level visualization with score
- **`HistoricalData.tsx`**: Paginated table of all sensor readings
- **`RawSensorData.tsx`**: Display raw sensor values (raw_value, voltage)

### Library & Utils
- **`lib/supabase.ts`**: Supabase client initialization and TypeScript interfaces
- **`lib/utils.ts`**: `calculateHeartDiseaseRisk()`, `cn()` utility functions

### Database
Current table: **`mic_data`** with columns:
- `id` (primary key)
- `timestamp` (auto-generated)
- `raw_value` (sensor analog reading 0-4095)
- `voltage` (converted 0-3.3V)

### Configuration
- **`.env.local`**: Contains Supabase URL and anon key (NEVER commit to git)
- **`package.json`**: Dependencies and npm scripts

## 📊 Data Flow Architecture

```
┌─────────────┐
│   ESP32     │  Reads analog sensor (pin 34)
│   Sensor    │  Converts to voltage
└──────┬──────┘
       │ POST /rest/v1/mic_data
       │ {"raw_value": 1878, "voltage": 1.513}
       ↓
┌─────────────┐
│  Supabase   │  PostgreSQL database
│  Database   │  Real-time replication enabled
└──────┬──────┘
       │ WebSocket subscription
       │ INSERT events
       ↓
┌─────────────┐
│   Next.js   │  Receives real-time updates
│  Dashboard  │  Maps sensor data → health metrics
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Browser    │  Displays charts, cards, risk
│     UI      │  Auto-updates on new data
└─────────────┘
```

## 🔄 Data Transformation

Sensor data (`raw_value`, `voltage`) → Health metrics:

```typescript
// In app/page.tsx
const mappedData = {
  heart_rate: Math.round(raw_value / 25),
  ecg_value: raw_value,
  spo2: Math.min(100, Math.round(95 + (voltage * 2))),
  temperature: 36.5 + (voltage * 0.5),
  blood_pressure_systolic: Math.round(100 + (raw_value / 15)),
  blood_pressure_diastolic: Math.round(60 + (raw_value / 30))
}
```

⚠️ **Important**: These are example formulas. Calibrate based on your actual sensor specs!

## 🚀 NPM Scripts

```json
{
  "dev": "next dev",           // Start development server
  "build": "next build",       // Production build
  "start": "next start",       // Start production server
  "lint": "next lint"          // Run ESLint
}
```

## 🔐 Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📦 Key Dependencies

- **Next.js 14**: React framework with App Router
- **@supabase/supabase-js**: Database client with real-time
- **recharts**: Chart library for data visualization
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Type safety

## ⚠️ Known Issues & Solutions

### Issue 1: Real-time not working
**Solution**: Enable real-time replication in Supabase dashboard:
👉 Database → Replication → Enable for `mic_data` table

### Issue 2: No data showing
**Solution**: 
1. Check browser console (F12) for errors
2. Verify `.env.local` has correct credentials
3. Ensure `mic_data` table has data in Supabase

### Issue 3: Table name confusion
**Current**: Using `mic_data` table
**Old docs**: Reference `sensor_data` table
**Solution**: Code now correctly uses `mic_data`

### Issue 4: Inaccurate health metrics
**Solution**: Mapping formulas are examples - calibrate in `app/page.tsx` based on your sensor specifications

## 🎨 Styling Architecture

- **Tailwind CSS**: Utility classes for styling
- **Dark mode**: Full dark mode support with `dark:` variants
- **Custom CSS**: Card styles and animations in `globals.css`
- **Responsive**: Mobile-first design with breakpoints (md, lg)

## 🏃‍♂️ Quick Start

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure environment**:
   - Already set in `.env.local`

3. **Start dev server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   - Navigate to http://localhost:3000

5. **Enable real-time**:
   - Go to Supabase dashboard
   - Enable replication for `mic_data` table

## 🔮 Future Improvements

Suggested folder structure for scaling:

```
app/
  ├── (dashboard)/           # Group dashboard routes
  │   ├── page.tsx
  │   └── analytics/
  ├── api/                   # API routes if needed
  └── hooks/                 # Custom React hooks

components/
  ├── ui/                    # Generic UI components
  ├── charts/                # Chart components
  └── dashboard/             # Dashboard-specific components

lib/
  ├── supabase/              # Supabase utilities
  ├── hooks/                 # Custom hooks
  └── constants/             # Constants and configs

types/                       # Shared TypeScript types
  └── sensor.ts

utils/                       # Helper functions
  ├── calculations.ts
  └── formatting.ts
```

## 📞 Need Help?

- Check browser console for errors (F12)
- Review Supabase logs in dashboard
- Verify network tab shows WebSocket connection
- Ensure ESP32 is posting data correctly
