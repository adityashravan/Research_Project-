import { SensorData } from '@/lib/supabase';
import { calculateHeartDiseaseRisk, cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface RiskAssessmentProps {
  data: SensorData | null;
}

export default function RiskAssessment({ data }: RiskAssessmentProps) {
  if (!data) {
    return (
      <div className="card h-full">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Risk Assessment
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Waiting for data...</p>
      </div>
    );
  }

  const risk = calculateHeartDiseaseRisk(data);

  const riskConfig = {
    low: {
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      icon: CheckCircle,
      label: 'Low Risk',
      description: 'All vitals are within normal range',
    },
    moderate: {
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      icon: AlertCircle,
      label: 'Moderate Risk',
      description: 'Some vitals require attention',
    },
    high: {
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      icon: AlertTriangle,
      label: 'High Risk',
      description: 'Multiple abnormal readings detected',
    },
    critical: {
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      icon: XCircle,
      label: 'Critical Risk',
      description: 'Immediate medical attention may be needed',
    },
  };

  const config = riskConfig[risk.level];
  const Icon = config.icon;

  return (
    <div className="card h-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Heart Disease Risk Assessment
      </h2>

      <div
        className={cn(
          'rounded-xl p-6 border-2 mb-4',
          config.bgColor,
          config.borderColor
        )}
      >
        <div className="flex items-center space-x-3 mb-3">
          <Icon className={cn('w-8 h-8', config.color)} />
          <div>
            <h3 className={cn('text-2xl font-bold', config.color)}>
              {config.label}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {config.description}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Risk Score
            </span>
            <span className={cn('text-lg font-bold', config.color)}>
              {risk.score}/10
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={cn(
                'h-3 rounded-full transition-all duration-500',
                risk.level === 'low' && 'bg-green-500',
                risk.level === 'moderate' && 'bg-yellow-500',
                risk.level === 'high' && 'bg-orange-500',
                risk.level === 'critical' && 'bg-red-500'
              )}
              style={{ width: `${(risk.score / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {risk.factors.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Contributing Factors:
          </h4>
          <ul className="space-y-2">
            {risk.factors.map((factor, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <span className={cn('mt-1', config.color)}>•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> This is an automated assessment based on current
          readings. Please consult a healthcare professional for accurate diagnosis.
        </p>
      </div>
    </div>
  );
}
