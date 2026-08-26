const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const sampleData = [
  {
    heart_rate: 72,
    ecg_value: 0.85,
    spo2: 98,
    temperature: 36.8,
    blood_pressure_systolic: 120,
    blood_pressure_diastolic: 80
  },
  {
    heart_rate: 78,
    ecg_value: 0.92,
    spo2: 97,
    temperature: 37.0,
    blood_pressure_systolic: 118,
    blood_pressure_diastolic: 78
  },
  {
    heart_rate: 85,
    ecg_value: 1.05,
    spo2: 96,
    temperature: 37.2,
    blood_pressure_systolic: 125,
    blood_pressure_diastolic: 82
  },
  {
    heart_rate: 68,
    ecg_value: 0.78,
    spo2: 99,
    temperature: 36.6,
    blood_pressure_systolic: 115,
    blood_pressure_diastolic: 75
  },
  {
    heart_rate: 92,
    ecg_value: 1.15,
    spo2: 95,
    temperature: 37.5,
    blood_pressure_systolic: 130,
    blood_pressure_diastolic: 85
  },
  {
    heart_rate: 75,
    ecg_value: 0.88,
    spo2: 98,
    temperature: 36.9,
    blood_pressure_systolic: 122,
    blood_pressure_diastolic: 81
  },
  {
    heart_rate: 81,
    ecg_value: 0.95,
    spo2: 97,
    temperature: 37.1,
    blood_pressure_systolic: 119,
    blood_pressure_diastolic: 79
  },
  {
    heart_rate: 70,
    ecg_value: 0.82,
    spo2: 98,
    temperature: 36.7,
    blood_pressure_systolic: 117,
    blood_pressure_diastolic: 77
  }
];

async function insertSampleData() {
  console.log('🚀 Inserting sample data into Supabase...');
  
  const { data, error } = await supabase
    .from('sensor_data')
    .insert(sampleData)
    .select();

  if (error) {
    console.error('❌ Error inserting data:', error.message);
    process.exit(1);
  } else {
    console.log('✅ Sample data inserted successfully!');
    console.log(`📊 Inserted ${sampleData.length} records`);
    console.log('\n🌐 Check your frontend at http://localhost:3000');
  }
}

insertSampleData();
