'use client';

import { SensorData } from '@/lib/supabase';
import { formatDateTime } from '@/lib/utils';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { useRef } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RealTimeChartProps {
  data: SensorData[];
}

export default function RealTimeChart({ data }: RealTimeChartProps) {
  const chartRef = useRef(null);

  // Take last 20 data points for real-time visualization
  const recentData = data.slice(0, 20).reverse();

  const heartRateData = {
    labels: recentData.map((d) => formatDateTime(d.created_at)),
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: recentData.map((d) => d.heart_rate || 0),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const ecgData = {
    labels: recentData.map((d) => formatDateTime(d.created_at)),
    datasets: [
      {
        label: 'ECG Value (V)',
        data: recentData.map((d) => d.ecg_value || 0),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Heart Rate Monitor
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Calculated from raw sensor value
          </span>
        </div>
        <div className="h-64">
          <Line ref={chartRef} data={heartRateData} options={options} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            ECG Value Over Time
          </h2>
        </div>
        <div className="h-64">
          <Line data={ecgData} options={options} />
        </div>
      </div>
    </div>
  );
}
