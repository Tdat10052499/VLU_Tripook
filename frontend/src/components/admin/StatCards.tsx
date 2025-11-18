import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle, trend }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color} hover:shadow-lg transition-shadow duration-300`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center mt-2 text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="mr-1">{trend.isPositive ? '↗' : '↘'}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div className="text-5xl ml-4 opacity-80">{icon}</div>
    </div>
  </div>
);

export default StatCard;
