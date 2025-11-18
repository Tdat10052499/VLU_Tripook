import React, { useEffect, useState, useCallback } from 'react';
import { getLoginStats, getRegistrationStats, getProviderStats } from '../services/adminApi';
import StatCard from '../components/admin/StatCards';
import DonutChart from '../components/admin/DonutChart';
import {
  LoginTrendChart,
  RegistrationTrendChart,
  UserProviderComparison,
  CombinedAnalyticsChart,
} from '../components/admin/DashboardCharts';

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

  // Prepare data for DonutChart
  const providerStatusData = [
    { name: 'Active', value: providerStats?.stats?.active || 0, color: '#10B981' },
    { name: 'Pending', value: providerStats?.stats?.pending || 0, color: '#F59E0B' },
    { name: 'Rejected', value: providerStats?.stats?.rejected || 0, color: '#EF4444' },
  ];

  // Prepare data for CombinedAnalyticsChart
  const combinedData = (loginStats?.stats || []).map((loginItem: any, index: number) => {
    const regItem = registrationStats?.stats?.[index] || {};
    return {
      date: loginItem.date,
      logins: loginItem.count || 0,
      registrations: regItem.count || 0,
      uniqueUsers: loginItem.unique_users || 0,
    };
  });

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

      {/* Stats Cards Row */}
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

      {/* Second Row: User/Provider Stats + Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
        <DonutChart
          data={providerStatusData}
          title="Provider Status"
          centerLabel="Providers"
        />
      </div>

      {/* Login Trend Chart */}
      <div className="mb-8">
        <LoginTrendChart data={loginStats?.stats || []} />
      </div>

      {/* Registration Trend Chart */}
      <div className="mb-8">
        <RegistrationTrendChart data={registrationStats?.stats || []} />
      </div>

      {/* User vs Provider Comparison */}
      <div className="mb-8">
        <UserProviderComparison
          users={registrationStats?.totals?.users || 0}
          providers={registrationStats?.totals?.providers || 0}
        />
      </div>

      {/* Combined Analytics Chart */}
      <div className="mb-8">
        <CombinedAnalyticsChart data={combinedData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
