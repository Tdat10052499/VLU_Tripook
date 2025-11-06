import React, { useState, useEffect, useContext } from 'react';
import { 
  FaServicestack, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaPlus
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import providerApi, { type DashboardStats } from '../services/providerApi';

const ProviderDashboardHome: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await providerApi.getDashboard();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err: any) {
        setError('Không thể tải dữ liệu dashboard');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Tổng dịch vụ',
      value: stats?.total_services || 0,
      icon: FaServicestack,
      color: 'blue',
      change: '+12%',
      changeType: 'increase' as const
    },
    {
      title: 'Đặt chỗ tháng này',
      value: stats?.recent_bookings || 0,
      icon: FaCalendarAlt,
      color: 'green',
      change: '+8%',
      changeType: 'increase' as const
    },
    {
      title: 'Tổng đặt chỗ',
      value: stats?.total_bookings || 0,
      icon: FaUsers,
      color: 'purple',
      change: '+15%',
      changeType: 'increase' as const
    },
    {
      title: 'Doanh thu tháng',
      value: '45,200,000₫',
      icon: FaDollarSign,
      color: 'yellow',
      change: '+5%',
      changeType: 'increase' as const
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50',
      yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white p-6">
        <h1 className="text-2xl font-bold mb-2">
          Chào mừng trở lại, {user?.provider_info?.company_name || user?.name}!
        </h1>
        <p className="text-indigo-100">
          Provider từ {stats?.provider_since || 'N/A'} • Trạng thái: {' '}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            stats?.account_status === 'active' 
              ? 'bg-green-500 text-white' 
              : 'bg-yellow-500 text-white'
          }`}>
            {stats?.account_status === 'active' ? 'Hoạt động' : 'Chờ duyệt'}
          </span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses = getColorClasses(card.color).split(' ');
          
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  </p>
                  <div className="flex items-center">
                    {card.changeType === 'increase' ? (
                      <FaArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <FaArrowDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs font-medium ${
                      card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">so với tháng trước</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[2]}`}>
                  <Icon className={`h-6 w-6 ${colorClasses[1]}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Đặt chỗ mới từ Nguyễn Văn A</p>
                <p className="text-xs text-gray-500">2 giờ trước</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FaServicestack className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Dịch vụ "Tour Hạ Long 2N1Đ" được cập nhật</p>
                <p className="text-xs text-gray-500">4 giờ trước</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FaEye className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">125 lượt xem dịch vụ hôm nay</p>
                <p className="text-xs text-gray-500">1 ngày trước</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link
              to="/provider/services/new"
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <FaPlus className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Thêm dịch vụ mới</p>
                <p className="text-xs text-gray-500">Tạo dịch vụ tour, khách sạn hoặc vận chuyển</p>
              </div>
            </Link>

            <Link
              to="/provider/bookings"
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Quản lý đặt chỗ</p>
                <p className="text-xs text-gray-500">Xem và cập nhật trạng thái đặt chỗ</p>
              </div>
            </Link>

            <Link
              to="/provider/statistics"
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaDollarSign className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Báo cáo doanh thu</p>
                <p className="text-xs text-gray-500">Xem thống kê chi tiết và báo cáo</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboardHome;