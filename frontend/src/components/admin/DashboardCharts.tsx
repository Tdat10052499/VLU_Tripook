import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Hồn Việt Theme Colors
const COLORS = {
  primary: '#0A2342',      // Indigo Blue
  secondary: '#AE8E5B',    // Bronze Gold
  accent: '#FAF3E0',       // Cream
  blue: '#3B82F6',         // Login blue
  purple: '#8B5CF6',       // Unique users purple
  indigo: '#6366F1',       // Users indigo
  pink: '#EC4899',         // Providers pink
  green: '#10B981',        // Success green
  yellow: '#F59E0B',       // Warning yellow
  red: '#EF4444',          // Danger red
};

interface LoginTrendChartProps {
  data: Array<{
    date: string;
    count: number;
    unique_users: number;
  }>;
}

export const LoginTrendChart: React.FC<LoginTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Login Activity Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            stroke="#9CA3AF"
          />
          <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={COLORS.blue}
            strokeWidth={3}
            name="Total Logins"
            dot={{ fill: COLORS.blue, r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="unique_users"
            stroke={COLORS.purple}
            strokeWidth={3}
            name="Unique Users"
            dot={{ fill: COLORS.purple, r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface RegistrationTrendChartProps {
  data: Array<{
    _id: string;
    count: number;
    users: number;
    providers: number;
  }>;
}

export const RegistrationTrendChart: React.FC<RegistrationTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Registration Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.8} />
              <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorProviders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.pink} stopOpacity={0.8} />
              <stop offset="95%" stopColor={COLORS.pink} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="_id"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            stroke="#9CA3AF"
          />
          <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
          />
          <Area
            type="monotone"
            dataKey="users"
            stackId="1"
            stroke={COLORS.indigo}
            fill="url(#colorUsers)"
            name="User Registrations"
            animationDuration={800}
          />
          <Area
            type="monotone"
            dataKey="providers"
            stackId="1"
            stroke={COLORS.pink}
            fill="url(#colorProviders)"
            name="Provider Registrations"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface UserProviderComparisonProps {
  users: number;
  providers: number;
}

export const UserProviderComparison: React.FC<UserProviderComparisonProps> = ({ users, providers }) => {
  const data = [
    { name: 'Users', value: users, fill: COLORS.indigo },
    { name: 'Providers', value: providers, fill: COLORS.secondary },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-bold text-gray-800 mb-4">👥 User vs Provider Registrations</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} stroke="#9CA3AF" />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 14, fill: '#374151', fontWeight: 600 }}
            stroke="#9CA3AF"
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
          />
          <Bar
            dataKey="value"
            radius={[0, 8, 8, 0]}
            animationDuration={800}
            label={{
              position: 'right',
              fill: '#374151',
              fontWeight: 'bold',
              fontSize: 14,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface CombinedAnalyticsProps {
  data: Array<{
    date: string;
    logins: number;
    registrations: number;
    uniqueUsers: number;
  }>;
}

export const CombinedAnalyticsChart: React.FC<CombinedAnalyticsProps> = ({ data }) => {
  const [visibleMetrics, setVisibleMetrics] = React.useState({
    logins: true,
    registrations: true,
    uniqueUsers: true,
  });

  const toggleMetric = (metric: keyof typeof visibleMetrics) => {
    setVisibleMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">📊 Combined Analytics Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => toggleMetric('logins')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              visibleMetrics.logins
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
            }`}
          >
            Logins
          </button>
          <button
            onClick={() => toggleMetric('registrations')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              visibleMetrics.registrations
                ? 'bg-green-100 text-green-700 border-2 border-green-500'
                : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
            }`}
          >
            Registrations
          </button>
          <button
            onClick={() => toggleMetric('uniqueUsers')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              visibleMetrics.uniqueUsers
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
            }`}
          >
            Unique Users
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            stroke="#9CA3AF"
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            stroke="#9CA3AF"
            label={{ value: 'Logins / Users', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            stroke="#9CA3AF"
            label={{ value: 'Registrations', angle: 90, position: 'insideRight', style: { fill: '#6B7280' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
          />
          {visibleMetrics.registrations && (
            <Bar
              yAxisId="right"
              dataKey="registrations"
              fill={COLORS.green}
              name="Daily Registrations"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            />
          )}
          {visibleMetrics.logins && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="logins"
              stroke={COLORS.blue}
              strokeWidth={3}
              name="Daily Logins"
              dot={{ fill: COLORS.blue, r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
          )}
          {visibleMetrics.uniqueUsers && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="uniqueUsers"
              stroke={COLORS.purple}
              strokeWidth={3}
              name="Unique Users"
              dot={{ fill: COLORS.purple, r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
