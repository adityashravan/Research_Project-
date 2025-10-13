import { SensorData } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Activity, Zap } from 'lucide-react';

interface RawSensorDataProps {
  data: SensorData | null;
}

export default function RawSensorData({ data }: RawSensorDataProps) {
  if (!data) {
    return null;
  }

  const rawStats = [
    {
      label: 'Raw Value',
      value: data.raw_value || '--',
      unit: '',
      icon: Activity,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      label: 'Voltage',
      value: data.voltage ? data.voltage.toFixed(6) : '--',
      unit: 'V',
      icon: Zap,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {rawStats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </p>
                {stat.unit && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.unit}
                  </span>
                )}
              </div>
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
