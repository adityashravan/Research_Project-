const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const sampleData = [
  { heart_rate: 72, ecg_value: 0.85, spo2: 98, temperature: 36.8, blood_pressure_systolic: 120, blood_pressure_diastolic: 80 },
  { heart_rate: 78, ecg_value: 0.92, spo2: 97, temperature: 37.0, blood_pressure_systolic: 118, blood_pressure_diastolic: 78 },
  { heart_rate: 85, ecg_value: 1.05, spo2: 96, temperature: 37.2, blood_pressure_systolic: 125, blood_pressure_diastolic: 82 },
  { heart_rate: 68, ecg_value: 0.78, spo2: 99, temperature: 36.6, blood_pressure_systolic: 115, blood_pressure_diastolic: 75 },
  { heart_rate: 92, ecg_value: 1.15, spo2: 95, temperature: 37.5, blood_pressure_systolic: 130, blood_pressure_diastolic: 85 },
  { heart_rate: 75, ecg_value: 0.88, spo2: 98, temperature: 36.9, blood_pressure_systolic: 122, blood_pressure_diastolic: 81 },
  { heart_rate: 81, ecg_value: 0.95, spo2: 97, temperature: 37.1, blood_pressure_systolic: 119, blood_pressure_diastolic: 79 },
  { heart_rate: 70, ecg_value: 0.82, spo2: 98, temperature: 36.7, blood_pressure_systolic: 117, blood_pressure_diastolic: 77 },
  { heart_rate: 88, ecg_value: 1.02, spo2: 96, temperature: 37.3, blood_pressure_systolic: 124, blood_pressure_diastolic: 83 },
  { heart_rate: 76, ecg_value: 0.89, spo2: 97, temperature: 36.9, blood_pressure_systolic: 121, blood_pressure_diastolic: 80 }
];

async function setupProject() {
  console.log('🔍 Step 1: Checking if sensor_data table exists...\n');
  
  const { data: checkData, error: checkError } = await supabase
    .from('sensor_data')
    .select('count')
    .limit(1);

  if (checkError) {
    console.log('❌ Table does not exist yet!\n');
    console.log('📋 STEP 1: Create the table first');
    console.log('='.repeat(70));
    console.log('1. Open: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/sql/new');
    console.log('2. Copy and paste this SQL, then click RUN:\n');
    console.log(`CREATE TABLE sensor_data (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  heart_rate INTEGER,
  ecg_value DECIMAL,
  spo2 INTEGER,
  temperature DECIMAL,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER
);

ALTER TABLE sensor_data REPLICA IDENTITY FULL;
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for sensor_data" ON sensor_data FOR ALL USING (true);`);
    console.log('='.repeat(70));
    console.log('\n3. After running SQL, run this script again: node setup-project.js\n');
    return false;
  }

  console.log('✅ Table exists!\n');
  
  // Check if data already exists
  const { data: existingData, error: countError } = await supabase
    .from('sensor_data')
    .select('*');

  if (existingData && existingData.length > 0) {
    console.log(`📊 Found ${existingData.length} existing records`);
    console.log('⚠️  Skipping data insertion (data already exists)\n');
  } else {
    console.log('📝 Step 2: Inserting sample data...\n');
    
    const { data, error } = await supabase
      .from('sensor_data')
      .insert(sampleData)
      .select();

    if (error) {
      console.error('❌ Error inserting data:', error.message);
      return false;
    }
    
    console.log(`✅ Inserted ${sampleData.length} sample records!\n`);
  }

  console.log('🎉 Database setup complete!\n');
  console.log('📋 Next steps:');
  console.log('='.repeat(70));
  console.log('1. Start the dev server: npm run dev');
  console.log('2. Open browser: http://localhost:3000');
  console.log('3. You should see your sensor data displayed!');
  console.log('='.repeat(70));
  
  return true;
}

setupProject();
