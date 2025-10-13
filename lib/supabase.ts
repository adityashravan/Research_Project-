import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SensorData {
  id: number;
  timestamp: string;
  raw_value: number;
  voltage: number;
  // Computed/derived fields for display
  heart_rate?: number;
  ecg_value?: number;
  spo2?: number;
  temperature?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  [key: string]: any;
}

export interface HeartDiseaseRisk {
  level: 'low' | 'moderate' | 'high' | 'critical';
  score: number;
  factors: string[];
}
