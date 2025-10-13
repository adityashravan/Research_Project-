'use client';

import Header from '@/components/Header';
import HistoricalData from '@/components/HistoricalData';
import RealTimeChart from '@/components/RealTimeChart';
import RiskAssessment from '@/components/RiskAssessment';
import StatsCards from '@/components/StatsCards';
import { SensorData, supabase } from '@/lib/supabase';
import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial historical data
    fetchHistoricalData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('mic_data_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mic_data'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          const rawData = payload.new as any;
          // Calculate heart rate from raw_value
          const newData: SensorData = {
            ...rawData,
            created_at: rawData.timestamp,
            heart_rate: rawData.raw_value ? Math.round(rawData.raw_value / 25) : null,
          };
          setCurrentData(newData);
          setHistoricalData((prev) => [newData, ...prev].slice(0, 100));
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Unsubscribing from realtime');
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHistoricalData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('mic_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching data:', error);
        throw error;
      }

      if (data && data.length > 0) {
        // Calculate heart rate from raw_value
        const mappedData = data.map(item => ({
          ...item,
          created_at: item.timestamp,
          heart_rate: item.raw_value ? Math.round(item.raw_value / 25) : null,
        }));
        setHistoricalData(mappedData);
        setCurrentData(mappedData[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-primary-500 animate-pulse mx-auto mb-4" />
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards - Real Data + Calculated Heart Rate */}
        <StatsCards data={currentData} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Real-time Charts - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <RealTimeChart data={historicalData} />
          </div>

          {/* Risk Assessment - 1 column */}
          <div className="lg:col-span-1">
            <RiskAssessment data={currentData} />
          </div>
        </div>

        {/* Historical Data Table */}
        <div className="mt-6">
          <HistoricalData data={historicalData} />
        </div>
      </main>
    </div>
  );
}
