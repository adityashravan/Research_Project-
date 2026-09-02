const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Generate realistic random sensor data
const patients = [
    ['DEMO-001', 'Aarav Sharma'], ['DEMO-002', 'Diya Patel'],
    ['DEMO-003', 'Kabir Rao'], ['DEMO-004', 'Meera Nair']
];

function generateRandomData() {
  const patient = patients[Math.floor(Math.random() * patients.length)];
  return {
    patient_id: patient[0], patient_name: patient[1],
    heart_rate: Math.floor(Math.random() * (100 - 60) + 60), // 60-100 bpm
    ecg_value: parseFloat((Math.random() * 0.5 + 0.7).toFixed(2)), // 0.7-1.2 V
    spo2: Math.floor(Math.random() * (100 - 94) + 94), // 94-100%
    temperature: parseFloat((Math.random() * 1.5 + 36.5).toFixed(1)), // 36.5-38°C
    blood_pressure_systolic: Math.floor(Math.random() * (140 - 110) + 110), // 110-140 mmHg
    blood_pressure_diastolic: Math.floor(Math.random() * (90 - 70) + 70) // 70-90 mmHg
  };
}

async function insertData() {
  const data = generateRandomData();
  
  console.log('📊 Inserting data:', {
    'Heart Rate': `${data.heart_rate} bpm`,
    'ECG': `${data.ecg_value} V`,
    'SpO2': `${data.spo2}%`,
    'Temperature': `${data.temperature}°C`,
    'Blood Pressure': `${data.blood_pressure_systolic}/${data.blood_pressure_diastolic} mmHg`
  });
  
  const { error } = await supabase
    .from('sensor_data')
    .insert([data]);

  if (error) {
    console.error('❌ Error:', error.message);
    return false;
  } else {
    console.log('✅ Data inserted successfully!\n');
    return true;
  }
}

async function runContinuously() {
  console.log('🚀 Starting continuous data insertion...');
  console.log('📍 Sending data every 3 seconds');
  console.log('⏹️  Press Ctrl+C to stop\n');
  console.log('='.repeat(70));
  
  // Insert first data immediately
  await insertData();
  
  // Then insert every 10 seconds
  setInterval(async () => {
    await insertData();
  }, 10000);
}

async function runOnce() {
  console.log('🎯 Running single data insertion...\n');
  const success = await insertData();
  
  if (success) {
    console.log('✨ Check your frontend to see the new data!');
    console.log('🌐 Frontend: http://localhost:3001\n');
  }
  
  process.exit(success ? 0 : 1);
}

// Check command line argument
const mode = process.argv[2];

if (mode === 'continuous' || mode === 'c') {
  runContinuously();
} else if (mode === 'once' || mode === 'o' || !mode) {
  runOnce();
} else {
  console.log('Usage:');
  console.log('  node simulate-sensor.js          (insert once)');
  console.log('  node simulate-sensor.js once     (insert once)');
  console.log('  node simulate-sensor.js continuous  (insert every 3s)');
}
