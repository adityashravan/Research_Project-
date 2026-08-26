'use client';

import { SensorData } from '@/lib/supabase';
import { calculateHeartDiseaseRisk, cn, formatDateTime } from '@/lib/utils';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface HistoricalDataProps {
  data: SensorData[];
}

export default function HistoricalData({ data }: HistoricalDataProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayData = data.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Historical Data
          </h2>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {data.length} total records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Heart Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ECG
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                SpO2
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Temp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                BP
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Risk Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {displayData.map((record, index) => {
              const risk = calculateHeartDiseaseRisk(record);
              return (
                <tr
                  key={record.id || index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {record.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatDateTime(record.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {record.heart_rate || '--'} <span className="text-gray-500">bpm</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {record.ecg_value !== undefined ? record.ecg_value : '--'} <span className="text-gray-500">V</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {record.spo2 !== undefined ? record.spo2 : '--'} <span className="text-gray-500">%</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {record.temperature !== undefined ? record.temperature : '--'} <span className="text-gray-500">°C</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {record.blood_pressure_systolic && record.blood_pressure_diastolic ? `${record.blood_pressure_systolic}/${record.blood_pressure_diastolic}` : '--'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={cn(
                        'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                        risk.level === 'low' &&
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                        risk.level === 'moderate' &&
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                        risk.level === 'high' &&
                          'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
                        risk.level === 'critical' &&
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      )}
                    >
                      {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} records
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={cn(
                'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
              )}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={cn(
                'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                  : 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'
              )}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
