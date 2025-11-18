import React, { useEffect, useState, useCallback } from 'react';
import { getTransactionStats, getTransactions, getTransactionDetail } from '../services/adminApi';
import StatCard from '../components/admin/StatCards';
import DonutChart from '../components/admin/DonutChart';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Hồn Việt Theme Colors
const COLORS = {
  primary: '#0A2342',
  secondary: '#AE8E5B',
  blue: '#3B82F6',
  indigo: '#6366F1',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
};

const AdminTransactions: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: '',
    provider_id: '',
    user_id: '',
  });
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransactionStats(period);
      setStats(data);
    } catch (error) {
      console.error('Error loading transaction stats:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  const loadTransactions = useCallback(async () => {
    try {
      const data = await getTransactions(page, 20, {
        status: filters.status || undefined,
        provider_id: filters.provider_id || undefined,
        user_id: filters.user_id || undefined,
      });
      setTransactions(data.transactions || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }, [page, filters]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleViewDetail = async (bookingId: string) => {
    try {
      const data = await getTransactionDetail(bookingId);
      setSelectedTransaction(data.transaction);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading transaction detail:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Đang tải thống kê giao dịch...</div>
      </div>
    );
  }

  // Prepare chart data
  const statusData = stats?.stats?.statusDistribution
    ? [
        { name: 'Chờ xử lý', value: stats.stats.statusDistribution.pending, color: COLORS.yellow },
        { name: 'Đã xác nhận', value: stats.stats.statusDistribution.confirmed, color: COLORS.green },
        { name: 'Đã hủy', value: stats.stats.statusDistribution.cancelled, color: COLORS.red },
        { name: 'Hoàn thành', value: stats.stats.statusDistribution.completed, color: COLORS.blue },
      ]
    : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">💰 Transaction Analytics</h1>
        <p className="text-gray-600 mt-2">Quản lý và thống kê giao dịch trên nền tảng</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="week">7 ngày qua</option>
          <option value="month">30 ngày qua</option>
          <option value="year">365 ngày qua</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng giao dịch"
          value={stats?.stats?.totalTransactions || 0}
          icon="📊"
          color="border-blue-500"
          subtitle={`Trong ${period === 'week' ? '7 ngày' : period === 'month' ? '30 ngày' : '365 ngày'}`}
        />
        <StatCard
          title="Tổng doanh thu"
          value={`$${(stats?.stats?.totalRevenue || 0).toLocaleString()}`}
          icon="💵"
          color="border-green-500"
        />
        <StatCard
          title="Giá trị TB"
          value={`$${(stats?.stats?.averageTransactionValue || 0).toFixed(2)}`}
          icon="📈"
          color="border-purple-500"
          subtitle="Mỗi giao dịch"
        />
        <StatCard
          title="Tỉ lệ thành công"
          value={`${(stats?.stats?.successRate || 0).toFixed(1)}%`}
          icon="✅"
          color="border-indigo-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Transaction Status Distribution */}
        <DonutChart
          data={statusData}
          title="Trạng thái giao dịch"
          centerLabel="Giao dịch"
        />

        {/* Transaction Timeline */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Xu hướng giao dịch</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats?.timeline || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} stroke="#9CA3AF" />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#6B7280' }} stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#6B7280' }} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="count"
                stroke={COLORS.blue}
                strokeWidth={3}
                name="Số giao dịch"
                dot={{ fill: COLORS.blue, r: 3 }}
                animationDuration={800}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke={COLORS.green}
                strokeWidth={3}
                name="Doanh thu ($)"
                dot={{ fill: COLORS.green, r: 3 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Top Providers</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.topProviders || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} stroke="#9CA3AF" />
              <YAxis
                type="category"
                dataKey="provider_name"
                tick={{ fontSize: 11, fill: '#374151' }}
                stroke="#9CA3AF"
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
              />
              <Bar dataKey="transaction_count" fill={COLORS.secondary} radius={[0, 8, 8, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4">👥 Top Users</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.topUsers || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} stroke="#9CA3AF" />
              <YAxis
                type="category"
                dataKey="user_name"
                tick={{ fontSize: 11, fill: '#374151' }}
                stroke="#9CA3AF"
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
              />
              <Bar dataKey="transaction_count" fill={COLORS.indigo} radius={[0, 8, 8, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">📋 Danh sách giao dịch</h2>
          
          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">Mã GD</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">Ngày</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">User</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">Provider</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">Dịch vụ</th>
                <th className="text-right py-3 px-4 text-gray-700 font-semibold text-sm">Số tiền</th>
                <th className="text-center py-3 px-4 text-gray-700 font-semibold text-sm">Trạng thái</th>
                <th className="text-center py-3 px-4 text-gray-700 font-semibold text-sm">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.booking_id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-gray-600">{txn.transaction_id}</td>
                  <td className="py-3 px-4 text-sm">
                    {txn.booking_date ? new Date(txn.booking_date).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm font-medium text-gray-900">{txn.user.name}</div>
                    <div className="text-xs text-gray-500">{txn.user.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm font-medium text-gray-900">
                      {txn.provider.name || '-'}
                    </div>
                    <div className="text-xs text-gray-500">{txn.provider.company_name}</div>
                  </td>
                  <td className="py-3 px-4 text-sm">{txn.service.name || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-green-600">
                      ${txn.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(txn.status)}`}>
                      {getStatusText(txn.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleViewDetail(txn.booking_id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trong số {pagination.total} giao dịch
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              <span className="px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-blue-600 font-semibold">
                {page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết giao dịch</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Mã giao dịch: <span className="font-mono font-semibold">{selectedTransaction.transaction_id}</span>
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* User & Provider Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">👤</span> Thông tin khách hàng
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Tên:</span> <span className="font-medium">{selectedTransaction.user.name}</span></p>
                    <p><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedTransaction.user.email}</span></p>
                    <p><span className="text-gray-600">SĐT:</span> <span className="font-medium">{selectedTransaction.user.phone || '-'}</span></p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🏢</span> Thông tin Provider
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Tên:</span> <span className="font-medium">{selectedTransaction.provider?.name || '-'}</span></p>
                    <p><span className="text-gray-600">Công ty:</span> <span className="font-medium">{selectedTransaction.provider?.company_name || '-'}</span></p>
                    <p><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedTransaction.provider?.email || '-'}</span></p>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">🎯</span> Thông tin dịch vụ
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Tên dịch vụ:</span> <span className="font-medium">{selectedTransaction.service?.name || '-'}</span></p>
                  <p><span className="text-gray-600">Loại:</span> <span className="font-medium">{selectedTransaction.service?.type || '-'}</span></p>
                  {selectedTransaction.service?.description && (
                    <p className="text-gray-700 mt-2">{selectedTransaction.service.description}</p>
                  )}
                </div>
              </div>

              {/* Booking Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">📅</span> Chi tiết đặt chỗ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p><span className="text-gray-600">Ngày bắt đầu:</span> <span className="font-medium">{selectedTransaction.booking_details?.start_date ? new Date(selectedTransaction.booking_details.start_date).toLocaleDateString('vi-VN') : '-'}</span></p>
                  <p><span className="text-gray-600">Ngày kết thúc:</span> <span className="font-medium">{selectedTransaction.booking_details?.end_date ? new Date(selectedTransaction.booking_details.end_date).toLocaleDateString('vi-VN') : '-'}</span></p>
                  <p><span className="text-gray-600">Số khách:</span> <span className="font-medium">{selectedTransaction.booking_details?.number_of_guests || 1}</span></p>
                  <p><span className="text-gray-600">Mã xác nhận:</span> <span className="font-mono font-medium">{selectedTransaction.booking_details?.confirmation_code || '-'}</span></p>
                </div>
                {selectedTransaction.booking_details?.special_requests && (
                  <div className="mt-3">
                    <p className="text-gray-600 text-sm mb-1">Yêu cầu đặc biệt:</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedTransaction.booking_details.special_requests}</p>
                  </div>
                )}
              </div>

              {/* Financial Info */}
              <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">💰</span> Thông tin thanh toán
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá cơ bản:</span>
                    <span className="font-medium">${selectedTransaction.financial?.price_breakdown?.base_price?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thuế:</span>
                    <span className="font-medium">${selectedTransaction.financial?.price_breakdown?.taxes?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí dịch vụ:</span>
                    <span className="font-medium">${selectedTransaction.financial?.price_breakdown?.fees?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-300 pt-2 mt-2">
                    <span className="font-bold text-gray-800">Tổng cộng:</span>
                    <span className="font-bold text-green-600 text-lg">${selectedTransaction.financial?.total_amount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex gap-4">
                <div className="flex-1 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Trạng thái booking:</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedTransaction.status?.booking_status || '')}`}>
                    {getStatusText(selectedTransaction.status?.booking_status || '')}
                  </span>
                </div>
                <div className="flex-1 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Trạng thái thanh toán:</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedTransaction.status?.payment_status || '')}`}>
                    {getStatusText(selectedTransaction.status?.payment_status || '')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
