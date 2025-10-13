import { SensorData } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Activity, Droplet, Heart, Thermometer } from 'lucide-react';

interface StatsCardsProps {
  data: SensorData | null;
}

export default function StatsCards({ data }: StatsCardsProps) {
  // Calculate heart rate from raw_value (you can adjust this formula based on your sensor)
  const heartRate = data?.raw_value ? Math.round(data.raw_value / 25) : null;
  
  const stats = [
    {
      label: 'Heart Rate',
      value: heartRate !== null ? heartRate : '--',
      unit: 'bpm',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      normal: heartRate !== null ? heartRate >= 60 && heartRate <= 100 : null,
    },
    {
      label: 'Raw Sensor Value',
      value: data?.raw_value !== undefined ? data.raw_value : '--',
      unit: '',
      icon: Activity,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      normal: null,
    },
    {
      label: 'Voltage',
      value: data?.voltage !== undefined ? data.voltage.toFixed(6) : '--',
      unit: 'V',
      icon: Droplet,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      normal: null,
    },
    {
      label: 'SpO2',
      value: '--',
      unit: '%',
      icon: Thermometer,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      normal: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.unit}
                </span>
              </div>
              {stat.normal !== null && (
                <div className="mt-2">
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full font-medium',
                      stat.normal
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    )}
                  >
                    {stat.normal ? 'Normal' : 'Abnormal'}
                  </span>
                </div>
              )}
            </div>
            <div className={cn('p-3 rounded-lg', stat.bgColor)}>
              <stat.icon className={cn('w-6 h-6', stat.color)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
