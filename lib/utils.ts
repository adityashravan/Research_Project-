import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { HeartDiseaseRisk, SensorData } from './supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateHeartDiseaseRisk(data: SensorData): HeartDiseaseRisk {
  const factors: string[] = [];
  let riskScore = 0;

  // Heart Rate Analysis (calculated from raw_value)
  if (data.heart_rate) {
    if (data.heart_rate > 100) {
      riskScore += 3;
      factors.push('Elevated heart rate (tachycardia) - Possible unusual activity detected');
    } else if (data.heart_rate < 60) {
      riskScore += 2;
      factors.push('Low heart rate (bradycardia) - Monitor closely');
    }
  }

  // Raw sensor value analysis for unusual patterns
  if (data.raw_value) {
    if (data.raw_value > 2500) {
      riskScore += 2;
      factors.push('Unusually high sensor reading detected');
    } else if (data.raw_value < 1000) {
      riskScore += 1;
      factors.push('Low sensor reading - Check sensor placement');
    }
  }

  // Voltage analysis for sensor health
  if (data.voltage) {
    if (data.voltage > 2.0 || data.voltage < 1.0) {
      riskScore += 1;
      factors.push('Unusual voltage level detected');
    }
  }

  // Determine risk level
  let level: 'low' | 'moderate' | 'high' | 'critical';
  if (riskScore === 0) {
    level = 'low';
  } else if (riskScore <= 2) {
    level = 'moderate';
  } else if (riskScore <= 4) {
    level = 'high';
  } else {
    level = 'critical';
  }

  return { level, score: riskScore, factors };
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
