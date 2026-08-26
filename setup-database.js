const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function setupDatabase() {
  console.log('🔍 Checking if sensor_data table exists...');
  
  // Try to query the table
  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .limit(1);

  if (error && error.message.includes('does not exist')) {
    console.log('❌ Table does not exist. You need to create it in Supabase SQL Editor.');
    console.log('\n📋 SQL to create the table:');
    console.log('='.repeat(60));
    console.log(`
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

ALTER TABLE sensor_data REPLICA IDENTITY FULL;
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for sensor_data" ON sensor_data
FOR ALL USING (true);
    `);
    console.log('='.repeat(60));
    console.log('\n🔗 Go to: https://supabase.com/dashboard/project/fpeblbnyiyaqyxwvvctk/sql/new');
    console.log('📝 Copy the SQL above, paste it, and click RUN');
    return false;
  } else if (error) {
    console.error('❌ Error:', error.message);
    return false;
  } else {
    console.log('✅ Table exists!');
    console.log(`📊 Current records: ${data.length > 0 ? data.length : 'empty'}`);
    return true;
  }
}

setupDatabase();
