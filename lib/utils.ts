import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { HeartDiseaseRisk, SensorData } from './supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateHeartDiseaseRisk(data: SensorData): HeartDiseaseRisk {
  const factors: string[] = [];
  let riskScore = 0;

  // Heart Rate Analysis
  if (data.heart_rate) {
    if (data.heart_rate > 100) {
      riskScore += 3;
      factors.push('Elevated heart rate (tachycardia)');
    } else if (data.heart_rate < 60) {
      riskScore += 2;
      factors.push('Low heart rate (bradycardia)');
    }
  }

  // ECG Analysis
  if (data.ecg_value) {
    if (data.ecg_value > 1.2 || data.ecg_value < 0.5) {
      riskScore += 2;
      factors.push('Abnormal ECG reading detected');
    }
  }

  // SpO2 Analysis
  if (data.spo2) {
    if (data.spo2 < 95) {
      riskScore += 3;
      factors.push('Low blood oxygen level (hypoxemia)');
    }
  }

  // Temperature Analysis
  if (data.temperature) {
    if (data.temperature > 37.5) {
      riskScore += 1;
      factors.push('Elevated body temperature');
    } else if (data.temperature < 36.5) {
      riskScore += 1;
      factors.push('Low body temperature');
    }
  }

  // Blood Pressure Analysis
  if (data.blood_pressure_systolic && data.blood_pressure_diastolic) {
    if (data.blood_pressure_systolic > 140 || data.blood_pressure_diastolic > 90) {
      riskScore += 3;
      factors.push('High blood pressure (hypertension)');
    } else if (data.blood_pressure_systolic < 90 || data.blood_pressure_diastolic < 60) {
      riskScore += 2;
      factors.push('Low blood pressure (hypotension)');
    }
  }

  // Determine risk level
  let level: 'low' | 'moderate' | 'high' | 'critical';
  if (riskScore === 0) {
    level = 'low';
  } else if (riskScore <= 3) {
    level = 'moderate';
  } else if (riskScore <= 6) {
    level = 'high';
  } else {
    level = 'critical';
  }

  return { level, score: Math.min(riskScore, 10), factors };
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
