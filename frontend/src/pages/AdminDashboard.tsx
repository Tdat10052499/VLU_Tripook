import React, { useEffect, useState, useCallback } from 'react';
import { getLoginStats, getRegistrationStats, getProviderStats } from '../services/adminApi';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [loginStats, setLoginStats] = useState<any>(null);
  const [registrationStats, setRegistrationStats] = useState<any>(null);
  const [providerStats, setProviderStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'month' | 'year'>('day');
  const [role, setRole] = useState<'user' | 'provider' | 'all'>('all');

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const [loginData, registrationData, providerData] = await Promise.all([
        getLoginStats(period),
        getRegistrationStats(period, role),
        getProviderStats()
      ]);

      setLoginStats(loginData);
      setRegistrationStats(registrationData);
      setProviderStats(providerData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }, [period, role]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading statistics...</div>
      </div>
    );
  }

  const totalLogins = loginStats?.stats?.reduce((sum: number, item: any) => sum + item.count, 0) || 0;
  const totalRegistrations = registrationStats?.totals?.total || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your platform statistics</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="day">Last 30 Days</option>
            <option value="month">Last 12 Months</option>
            <option value="year">Last 5 Years</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">User Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Users</option>
            <option value="user">Users Only</option>
            <option value="provider">Providers Only</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Logins"
          value={totalLogins}
          icon="🔑"
          color="border-blue-500"
        />
        <StatCard
          title="Total Registrations"
          value={totalRegistrations}
          icon="👥"
          color="border-green-500"
        />
        <StatCard
          title="Pending Providers"
          value={providerStats?.stats?.pending || 0}
          icon="⏳"
          color="border-yellow-500"
        />
        <StatCard
          title="Active Providers"
          value={providerStats?.stats?.active || 0}
          icon="✅"
          color="border-purple-500"
        />
      </div>

      {/* Registration Breakdown */}
      {role === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="User Registrations"
            value={registrationStats?.totals?.users || 0}
            icon="👤"
            color="border-indigo-500"
          />
          <StatCard
            title="Provider Registrations"
            value={registrationStats?.totals?.providers || 0}
            icon="🏪"
            color="border-pink-500"
          />
        </div>
      )}

      {/* Login Statistics Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Login Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Date</th>
                <th className="text-right py-3 px-4 text-gray-700 font-semibold">Logins</th>
              </tr>
            </thead>
            <tbody>
              {loginStats?.stats?.slice(-10).reverse().map((item: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{item.date}</td>
                  <td className="text-right py-3 px-4 font-semibold text-blue-600">
                    {item.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Statistics Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Registration Trends</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Date</th>
                <th className="text-right py-3 px-4 text-gray-700 font-semibold">Total</th>
                {role === 'all' && (
                  <>
                    <th className="text-right py-3 px-4 text-gray-700 font-semibold">Users</th>
                    <th className="text-right py-3 px-4 text-gray-700 font-semibold">Providers</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {registrationStats?.stats?.slice(-10).reverse().map((item: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{item._id}</td>
                  <td className="text-right py-3 px-4 font-semibold text-green-600">
                    {item.count}
                  </td>
                  {role === 'all' && (
                    <>
                      <td className="text-right py-3 px-4 text-indigo-600">{item.users}</td>
                      <td className="text-right py-3 px-4 text-pink-600">{item.providers}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
