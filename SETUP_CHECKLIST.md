# ✅ Setup Checklist & Launch Guide

## 📋 Pre-Launch Verification

### 1. ✅ Dependencies Installed
```bash
npm install
```
**Status**: ✅ COMPLETE (node_modules exists)

### 2. ✅ Environment Variables Configured
**File**: `.env.local`

Required variables:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`: https://fpeblbnyiyaqyxwvvctk.supabase.co
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Configured

**Status**: ✅ COMPLETE

### 3. 🔄 Database Table Check
**Table**: `mic_data`

Expected columns:
- `id` (int8) - Primary key
- `timestamp` (timestamptz) - Auto-generated
- `raw_value` (int4) - Sensor reading
- `voltage` (float8) - Voltage value

**Action Required**: Verify table exists in Supabase dashboard

### 4. ⚠️ Real-time Replication (CRITICAL)
**Status**: ⚠️ NEEDS MANUAL CONFIGURATION

**Steps**:
1. Go to: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/database/replication
2. Find `mic_data` in the table list
3. Toggle the switch to **ENABLE** real-time
4. Confirm changes

**Why**: Without real-time enabled, dashboard won't auto-update when ESP32 posts new data

### 5. 📊 Test Data Verification
**Action**: Check if `mic_data` table has data

**Options to add test data**:
```bash
# Option 1: Run Node.js simulator
node simulate-sensor.js

# Option 2: Run Windows batch file
simulate.bat

# Option 3: Use ESP32 with actual sensor
# Upload store_micdata_db.ino to ESP32
```

## 🚀 Launch Steps

### Step 1: Start Development Server
```bash
npm run dev
```

**Expected Output**:
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### Step 2: Open Browser
Navigate to: **http://localhost:3000**

### Step 3: Verify Dashboard Loading

**What you should see**:
1. ✅ Header with "Heart Disease Monitor" title
2. ✅ Stats cards showing metrics (or "--" if no data)
3. ✅ Charts section
4. ✅ Risk assessment panel
5. ✅ Historical data table

**If you see "Loading health data..."**:
- Check browser console (F12) for errors
- Verify Supabase connection
- Ensure `mic_data` table has data

### Step 4: Test Real-time Updates

1. Keep dashboard open in browser
2. Insert data using one of these methods:

**Method A: Simulate sensor data**
```bash
node simulate-sensor.js
```

**Method B: Direct SQL insert** (in Supabase SQL Editor):
```sql
INSERT INTO mic_data (raw_value, voltage)
VALUES (1850, 1.5);
```

**Method C: ESP32 hardware**
- Upload Arduino sketch
- Configure WiFi credentials
- Power on ESP32

3. **Expected Result**: Dashboard should update automatically within 1-2 seconds

## 🔍 Troubleshooting Guide

### Problem 1: "npm run dev" fails
**Symptoms**:
- Module not found errors
- Package errors

**Solutions**:
```bash
# Reinstall dependencies
del /s /q node_modules
del package-lock.json
npm install

# Clear Next.js cache
rmdir /s /q .next
npm run dev
```

### Problem 2: Blank page or infinite loading
**Symptoms**:
- Page shows "Loading health data..." forever
- Blank white screen

**Solutions**:
1. **Check browser console** (F12):
   - Look for red error messages
   - Common: "Failed to fetch" = Supabase connection issue

2. **Verify environment variables**:
   ```bash
   type .env.local
   ```
   - Ensure no extra spaces or quotes
   - URL should start with https://
   - Key should be a long JWT token

3. **Test Supabase connection**:
   - Open Supabase dashboard
   - Go to Table Editor → mic_data
   - Try to view data manually

### Problem 3: Data showing but not updating
**Symptoms**:
- Dashboard loads initial data
- New data doesn't appear automatically
- Need to refresh page to see updates

**Solution**:
⚠️ **Real-time replication is disabled!**

**Fix**:
1. Go to: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/database/replication
2. Find `mic_data` table
3. Enable real-time replication
4. Refresh dashboard

### Problem 4: Health metrics look wrong
**Symptoms**:
- Heart rate = 75 bpm but sensor shows 1878
- Temperature = 37.5°C from voltage 1.5V
- Values don't match expected ranges

**Explanation**:
The mapping formulas are **examples** and need calibration for your specific sensor.

**Solution**:
Edit `app/page.tsx` and adjust formulas:

```typescript
// Find these two locations in the file:

// Location 1: fetchHistoricalData function
heart_rate: Math.round(item.raw_value / 25),  // ← Adjust this

// Location 2: Real-time subscription callback
heart_rate: Math.round(newData.raw_value / 25),  // ← Adjust this
```

See `DATA_MAPPING.md` for detailed formula documentation.

### Problem 5: "Failed to connect to Supabase"
**Symptoms**:
- Console error: "Failed to fetch"
- Network error in browser DevTools

**Solutions**:
1. **Check internet connection**
2. **Verify Supabase project is active**:
   - Log in to https://supabase.com
   - Check if project is paused (free tier auto-pauses after inactivity)
   - Resume project if needed

3. **Verify credentials**:
   - Go to Supabase dashboard → Settings → API
   - Compare URL and anon key with `.env.local`
   - Update if different

### Problem 6: ESP32 not sending data
**Symptoms**:
- ESP32 connected to WiFi
- Serial monitor shows "Connected!"
- But no data appearing in database

**Solutions**:
1. **Check `store_micdata_db.ino` configuration**:
   ```cpp
   const char* ssid = "YourWiFiSSID";  // ← Update this
   const char* password = "YourWiFiPassword";  // ← Update this
   const char* supabase_url = "https://...";  // ← Update this
   const char* supabase_key = "eyJ...";  // ← Update this
   ```

2. **Verify ESP32 serial output**:
   - Should show: "HTTP Response Code: 201" (success)
   - If 401: Wrong API key
   - If 404: Wrong URL or table name
   - If 400: Wrong JSON format

3. **Test with curl** (from command line):
   ```bash
   curl -X POST "https://fpeblbnyiyaqyxwvvctk.supabase.co/rest/v1/mic_data" ^
     -H "apikey: YOUR_ANON_KEY" ^
     -H "Content-Type: application/json" ^
     -d "{\"raw_value\": 1850, \"voltage\": 1.5}"
   ```

## 🎯 Success Criteria

Your dashboard is working correctly when:

1. ✅ Development server runs without errors
2. ✅ Dashboard loads in browser (http://localhost:3000)
3. ✅ Initial data displays in stats cards
4. ✅ Charts render with data points
5. ✅ Risk assessment shows calculated risk level
6. ✅ Historical data table populates
7. ✅ **New data appears automatically** (real-time working)
8. ✅ Browser console has no red errors

## 📊 Testing Real-time Connection

**Method 1: Browser Console**
1. Open browser console (F12)
2. Look for log messages:
   ```
   Realtime subscription status: SUBSCRIBED
   Real-time update received: { new: {...} }
   ```

**Method 2: Network Tab**
1. Open DevTools → Network tab
2. Filter: WS (WebSocket)
3. Should see active WebSocket connection to Supabase

**Method 3: Insert test data**
```bash
node simulate-sensor.js
```
Watch dashboard - new card should appear within 2 seconds.

## 🔄 Next Steps After Launch

### Immediate
1. Enable real-time replication in Supabase
2. Test with simulated data
3. Verify dashboard updates automatically

### Short-term
1. Configure ESP32 with actual sensor
2. Calibrate health metric formulas
3. Test with live sensor data

### Long-term
1. Add data export features
2. Implement alerts/notifications
3. Add user authentication
4. Deploy to production (Vercel)

## 📞 Quick Reference

### Important URLs
- **Dashboard**: http://localhost:3000
- **Supabase Dashboard**: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk
- **Database Tables**: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/editor
- **Real-time Config**: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/database/replication

### Key Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
node simulate-sensor.js  # Test with simulated data
```

### Key Files to Edit
- **Health metric formulas**: `app/page.tsx` (lines ~55 and ~82)
- **Risk calculation logic**: `lib/utils.ts`
- **UI components**: `components/*.tsx`
- **ESP32 configuration**: `store_micdata_db.ino`

## ✅ Final Launch Command

```bash
npm run dev
```

Then open: **http://localhost:3000** 🚀
