const https = require('https');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

const createTableSQL = `
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

ALTER TABLE sensor_data REPLICA IDENTITY FULL;
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for sensor_data" ON sensor_data;
CREATE POLICY "Enable all access for sensor_data" ON sensor_data FOR ALL USING (true);
`;

async function createTable() {
  console.log('🚀 Creating sensor_data table in Supabase...\n');

  const postData = JSON.stringify({ query: createTableSQL });

  const options = {
    hostname: `${projectRef}.supabase.co`,
    path: '/rest/v1/rpc/exec_sql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Table created successfully!');
          resolve(true);
        } else {
          console.log('⚠️  Response:', res.statusCode);
          console.log('📋 Manual setup required.\n');
          console.log('Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
          console.log('\nPaste this SQL:\n');
          console.log('='.repeat(60));
          console.log(createTableSQL);
          console.log('='.repeat(60));
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.log('⚠️  Could not create table automatically.');
      console.log('\n📋 Please create it manually:\n');
      console.log('Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
      console.log('\nPaste this SQL:\n');
      console.log('='.repeat(60));
      console.log(createTableSQL);
      console.log('='.repeat(60));
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

createTable();
