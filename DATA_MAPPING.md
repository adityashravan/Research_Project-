# Data Mapping Configuration

## Your mic_data Table Structure

Your Supabase `mic_data` table has the following columns:
- **id** (int8) - Primary key
- **timestamp** (timestamptz) - When the data was recorded
- **raw_value** (int4) - Raw sensor reading
- **voltage** (float8) - Voltage reading

## How Data is Mapped to Health Metrics

The dashboard maps your sensor data to health metrics using these formulas:

### 1. Heart Rate (BPM)
```typescript
heart_rate = Math.round(raw_value / 25)
```
Example: raw_value = 1878 → heart_rate = 75 bpm

### 2. ECG Value
```typescript
ecg_value = raw_value
```
Direct mapping of the raw sensor value

### 3. Blood Oxygen (SpO2)
```typescript
spo2 = Math.min(100, Math.round(95 + (voltage * 2)))
```
Example: voltage = 1.513407 → spo2 = 98%

### 4. Temperature (°C)
```typescript
temperature = 36.5 + (voltage * 0.5)
```
Example: voltage = 1.513407 → temperature = 37.26°C

### 5. Blood Pressure Systolic
```typescript
blood_pressure_systolic = Math.round(100 + (raw_value / 15))
```
Example: raw_value = 1878 → systolic = 225 mmHg

### 6. Blood Pressure Diastolic
```typescript
blood_pressure_diastolic = Math.round(60 + (raw_value / 30))
```
Example: raw_value = 1878 → diastolic = 123 mmHg

## Current Sample Data from Your Table

Based on your screenshot:
```
ID | Timestamp              | raw_value | voltage
1  | 2025-08-16 17:18:52   | 1878      | 1.513407
2  | 2025-08-16 17:18:56   | 1846      | 1.487619
3  | 2025-08-16 17:19:00   | 1900      | 1.531136
```

This will be displayed as:
- **Heart Rate**: ~75 bpm
- **SpO2**: ~98%
- **Temperature**: ~37.3°C
- **BP**: ~225/123 mmHg

## Customizing the Mapping

To adjust how your sensor data maps to health metrics, edit the file:
`c:\Users\adity\OneDrive\Desktop\Puneet_RP\app\page.tsx`

Find these two locations:

### Location 1: fetchHistoricalData function (line ~50-70)
```typescript
const mappedData = data.map(item => ({
  ...item,
  created_at: item.timestamp,
  heart_rate: Math.round(item.raw_value / 25), // Adjust this formula
  ecg_value: item.raw_value,
  spo2: Math.min(100, Math.round(95 + (item.voltage * 2))), // Adjust this
  temperature: 36.5 + (item.voltage * 0.5), // Adjust this
  blood_pressure_systolic: Math.round(100 + (item.raw_value / 15)), // Adjust
  blood_pressure_diastolic: Math.round(60 + (item.raw_value / 30)), // Adjust
}));
```

### Location 2: Real-time update handler (line ~35-50)
```typescript
const newData: SensorData = {
  ...rawData,
  created_at: rawData.timestamp,
  heart_rate: Math.round(rawData.raw_value / 25), // Adjust this formula
  ecg_value: rawData.raw_value,
  spo2: Math.min(100, Math.round(95 + (rawData.voltage * 2))), // Adjust
  temperature: 36.5 + (rawData.voltage * 0.5), // Adjust this
  blood_pressure_systolic: Math.round(100 + (rawData.raw_value / 15)), // Adjust
  blood_pressure_diastolic: Math.round(60 + (rawData.raw_value / 30)), // Adjust
};
```

## Important Notes

⚠️ **These are example mappings!** You should calibrate these formulas based on:
1. Your actual sensor specifications
2. Calibration data from known reference values
3. Medical accuracy requirements

The current formulas are placeholders to demonstrate the dashboard functionality.

## Enabling Real-time Updates

To see live updates as your ESP32 posts data:

1. Go to: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/database/replication
2. Find **mic_data** table
3. Toggle to **ENABLE** real-time replication
4. Data will automatically appear in the dashboard!

## Testing

After saving your changes:
1. The dev server should auto-reload
2. Refresh http://localhost:3000
3. You should see your existing data from the mic_data table
4. New data from ESP32 will appear in real-time!
