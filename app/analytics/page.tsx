'use client';

import { SensorData, supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Activity, BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [data, setData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    avgHeartRate: 0,
    maxHeartRate: 0,
    minHeartRate: 0,
    avgRawValue: 0,
    avgVoltage: 0,
    totalRecords: 0,
    abnormalReadings: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data: fetchedData, error } = await supabase
        .from('mic_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (error) throw error;

      if (fetchedData && fetchedData.length > 0) {
        const mappedData = fetchedData.map(item => ({
          ...item,
          created_at: item.timestamp,
          heart_rate: item.raw_value ? Math.round(item.raw_value / 25) : null,
        }));
        
        setData(mappedData);
        calculateStats(mappedData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data: SensorData[]) => {
    const heartRates = data.map(d => d.heart_rate).filter(hr => hr !== null) as number[];
    const rawValues = data.map(d => d.raw_value).filter(rv => rv !== undefined) as number[];
    const voltages = data.map(d => d.voltage).filter(v => v !== undefined) as number[];
    
    const abnormal = heartRates.filter(hr => hr < 60 || hr > 100).length;

    setStats({
      avgHeartRate: heartRates.length > 0 ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length) : 0,
      maxHeartRate: heartRates.length > 0 ? Math.max(...heartRates) : 0,
      minHeartRate: heartRates.length > 0 ? Math.min(...heartRates) : 0,
      avgRawValue: rawValues.length > 0 ? Math.round(rawValues.reduce((a, b) => a + b, 0) / rawValues.length) : 0,
      avgVoltage: voltages.length > 0 ? (voltages.reduce((a, b) => a + b, 0) / voltages.length).toFixed(4) as any : 0,
      totalRecords: data.length,
      abnormalReadings: abnormal,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-primary-500 animate-pulse mx-auto mb-4" />
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Average Heart Rate',
      value: stats.avgHeartRate,
      unit: 'bpm',
      icon: Activity,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      trend: stats.avgHeartRate >= 60 && stats.avgHeartRate <= 100 ? 'normal' : 'warning',
    },
    {
      label: 'Max Heart Rate',
      value: stats.maxHeartRate,
      unit: 'bpm',
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      trend: stats.maxHeartRate > 100 ? 'warning' : 'normal',
    },
    {
      label: 'Min Heart Rate',
      value: stats.minHeartRate,
      unit: 'bpm',
      icon: TrendingDown,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: stats.minHeartRate < 60 ? 'warning' : 'normal',
    },
    {
      label: 'Total Records',
      value: stats.totalRecords,
      unit: '',
      icon: BarChart3,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: 'normal',
    },
    {
      label: 'Avg Raw Value',
      value: stats.avgRawValue,
      unit: '',
      icon: Activity,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      trend: 'normal',
    },
    {
      label: 'Avg Voltage',
      value: stats.avgVoltage,
      unit: 'V',
      icon: Activity,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      trend: 'normal',
    },
    {
      label: 'Abnormal Readings',
      value: stats.abnormalReadings,
      unit: `(${((stats.abnormalReadings / stats.totalRecords) * 100).toFixed(1)}%)`,
      icon: Activity,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      trend: stats.abnormalReadings > stats.totalRecords * 0.2 ? 'warning' : 'normal',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive analysis of your health data
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
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
                {stat.trend === 'warning' && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Needs Attention
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

      {/* Time-based Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Heart Rate Distribution
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Normal (60-100 bpm)</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {stats.totalRecords - stats.abnormalReadings} readings
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((stats.totalRecords - stats.abnormalReadings) / stats.totalRecords) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Abnormal</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {stats.abnormalReadings} readings
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.abnormalReadings / stats.totalRecords) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Health Insights
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  Average Heart Rate Status
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stats.avgHeartRate >= 60 && stats.avgHeartRate <= 100
                    ? 'Your average heart rate is within the normal range'
                    : 'Your average heart rate is outside the normal range. Consider consulting a doctor.'}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  Data Collection
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stats.totalRecords} total readings collected. {stats.totalRecords > 100 ? 'Sufficient data for analysis.' : 'Continue monitoring for better insights.'}
                </p>
              </div>
            </div>
            {stats.abnormalReadings > stats.totalRecords * 0.2 && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    Attention Required
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {((stats.abnormalReadings / stats.totalRecords) * 100).toFixed(1)}% of your readings show abnormal values. Please consult a healthcare professional.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
