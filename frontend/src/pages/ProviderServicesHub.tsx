import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlus, 
  FaList, 
  FaChartLine, 
  FaCalendarAlt, 
  FaComments,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaSearch
} from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';

// Types
interface Service {
  _id: string;
  name: string;
  service_type: string;
  category: string;
  pricing: {
    base_price: number;
    currency: string;
    price_type: string;
  };
  location: {
    city: string;
    address: string;
  };
  status: 'active' | 'inactive' | 'draft' | 'hidden';
  created_at: string;
  total_bookings: number;
  average_rating: number;
}

// Tab components
const ServicesTab: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('auth_token');
      const response = await axios.get('http://localhost:5000/api/provider/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Mock data for development
      setServices([
        {
          _id: '1',
          name: 'Khách sạn Mường Thanh Luxury Nha Trang',
          service_type: 'accommodation',
          category: 'hotel',
          pricing: { base_price: 2500000, currency: 'VND', price_type: 'per_night' },
          location: { city: 'Nha Trang', address: '60 Trần Phú' },
          status: 'active',
          created_at: new Date().toISOString(),
          total_bookings: 156,
          average_rating: 4.8
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) return;
    
    try {
      const token = Cookies.get('auth_token');
      await axios.delete(`http://localhost:5000/api/provider/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Không thể xóa dịch vụ. Vui lòng thử lại.');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
    try {
      const token = Cookies.get('auth_token');
      await axios.patch(
        `http://localhost:5000/api/provider/services/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchServices();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedServices.length === 0) {
      alert('Vui lòng chọn ít nhất một dịch vụ');
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedServices.length} dịch vụ đã chọn?`)) return;
    
    try {
      const token = Cookies.get('auth_token');
      await Promise.all(
        selectedServices.map(id =>
          axios.delete(`http://localhost:5000/api/provider/services/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      setSelectedServices([]);
      fetchServices();
    } catch (error) {
      console.error('Error deleting services:', error);
      alert('Không thể xóa một số dịch vụ. Vui lòng thử lại.');
    }
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    const matchesType = filterType === 'all' || service.service_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800',
      hidden: 'bg-red-100 text-red-800'
    };
    const labels = {
      active: 'Hoạt động',
      inactive: 'Tạm ngưng',
      draft: 'Bản nháp',
      hidden: 'Đã ẩn'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dịch vụ của tôi</h2>
          <p className="text-gray-600 mt-1">Quản lý tất cả dịch vụ của bạn</p>
        </div>
        <Link
          to="/provider/services/create"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FaPlus />
          Tạo dịch vụ mới
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="draft">Bản nháp</option>
              <option value="hidden">Đã ẩn</option>
              <option value="inactive">Tạm ngưng</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tất cả loại</option>
              <option value="accommodation">Lưu trú</option>
              <option value="tour">Tour</option>
              <option value="transport">Vận chuyển</option>
              <option value="activity">Hoạt động</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedServices.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-indigo-50 rounded-lg">
            <span className="text-sm font-medium text-indigo-900">
              Đã chọn {selectedServices.length} dịch vụ
            </span>
            <button
              onClick={handleBulkDelete}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Xóa đã chọn
            </button>
            <button
              onClick={() => setSelectedServices([])}
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Bỏ chọn
            </button>
          </div>
        )}
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Không tìm thấy dịch vụ nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedServices.length === filteredServices.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedServices(filteredServices.map(s => s._id));
                        } else {
                          setSelectedServices([]);
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đặt chỗ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedServices.indexOf(service._id) !== -1}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices([...selectedServices, service._id]);
                          } else {
                            setSelectedServices(selectedServices.filter(id => id !== service._id));
                          }
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.location.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{service.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatPrice(service.pricing.base_price)}</div>
                      <div className="text-xs text-gray-500">{service.pricing.price_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(service.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.total_bookings || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">⭐ {service.average_rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(service.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/provider/services/edit/${service._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleStatusToggle(service._id, service.status)}
                          className={`${service.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                          title={service.status === 'active' ? 'Ẩn dịch vụ' : 'Hiển thị dịch vụ'}
                        >
                          {service.status === 'active' ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Tổng dịch vụ</div>
          <div className="text-2xl font-bold text-gray-900">{services.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Đang hoạt động</div>
          <div className="text-2xl font-bold text-green-600">
            {services.filter(s => s.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Bản nháp</div>
          <div className="text-2xl font-bold text-yellow-600">
            {services.filter(s => s.status === 'draft').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Tổng đặt chỗ</div>
          <div className="text-2xl font-bold text-indigo-600">
            {services.reduce((sum, s) => sum + (s.total_bookings || 0), 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

const FinanceTab: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');
  const [transactions, setTransactions] = useState<any[]>([]);

  // Mock financial data
  const financialStats = {
    totalRevenue: 145800000,
    thisMonth: 28500000,
    lastMonth: 24300000,
    pendingAmount: 5200000,
    completedBookings: 42,
    cancelledBookings: 3,
    averageBookingValue: 3400000
  };

  // Mock transactions data
  const mockTransactions = [
    {
      id: 'TXN001',
      booking_id: 'BK12345',
      service_name: 'Khách sạn Mường Thanh Luxury',
      customer_name: 'Nguyễn Văn A',
      amount: 2500000,
      commission: 250000,
      net_amount: 2250000,
      status: 'completed',
      payment_method: 'vnpay',
      created_at: '2025-11-08T10:30:00',
      settled_at: '2025-11-09T14:20:00'
    },
    {
      id: 'TXN002',
      booking_id: 'BK12346',
      service_name: 'Tour Hạ Long 3N2Đ',
      customer_name: 'Trần Thị B',
      amount: 5800000,
      commission: 580000,
      net_amount: 5220000,
      status: 'completed',
      payment_method: 'credit_card',
      created_at: '2025-11-07T15:45:00',
      settled_at: '2025-11-08T09:10:00'
    },
    {
      id: 'TXN003',
      booking_id: 'BK12347',
      service_name: 'Xe limousine Hà Nội - Hải Phòng',
      customer_name: 'Lê Văn C',
      amount: 850000,
      commission: 85000,
      net_amount: 765000,
      status: 'pending',
      payment_method: 'bank_transfer',
      created_at: '2025-11-09T08:20:00',
      settled_at: null
    },
    {
      id: 'TXN004',
      booking_id: 'BK12348',
      service_name: 'Khách sạn Mường Thanh Luxury',
      customer_name: 'Phạm Thị D',
      amount: 3200000,
      commission: 320000,
      net_amount: 2880000,
      status: 'completed',
      payment_method: 'vnpay',
      created_at: '2025-11-06T11:15:00',
      settled_at: '2025-11-07T16:30:00'
    }
  ];

  React.useEffect(() => {
    // Fetch transactions from API here
    // For now, using mock data
    setTransactions(mockTransactions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã thanh toán' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xử lý' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Thất bại' }
    };
    const style = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      vnpay: 'VNPay',
      credit_card: 'Thẻ tín dụng',
      bank_transfer: 'Chuyển khoản',
      cash: 'Tiền mặt'
    };
    return methodMap[method] || method;
  };

  const handleExport = (format: 'csv' | 'excel') => {
    alert(`Xuất báo cáo ${format.toUpperCase()} - Tính năng đang phát triển`);
  };

  const revenueGrowth = ((financialStats.thisMonth - financialStats.lastMonth) / financialStats.lastMonth * 100).toFixed(1);
  const isGrowthPositive = parseFloat(revenueGrowth) > 0;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tài chính</h2>
          <p className="text-gray-600 mt-1">Quản lý doanh thu và giao dịch</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Xuất CSV
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Financial Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.totalRevenue)}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <FaChartLine className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Doanh thu tháng này</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.thisMonth)}</p>
              <p className={`text-xs mt-1 ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isGrowthPositive ? '↑' : '↓'} {Math.abs(parseFloat(revenueGrowth))}% so với tháng trước
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <FaChartLine className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Chờ thanh toán</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.pendingAmount)}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <FaChartLine className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Giá trị TB/Booking</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.averageBookingValue)}</p>
              <p className="text-xs text-gray-500 mt-1">{financialStats.completedBookings} bookings hoàn thành</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <FaChartLine className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Biểu đồ doanh thu</h3>
          <div className="flex space-x-2">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeFilter(period)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  timeFilter === period
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period === 'week' ? 'Tuần' : period === 'month' ? 'Tháng' : 'Năm'}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <FaChartLine className="text-gray-400 text-4xl mx-auto mb-2" />
            <p className="text-gray-500">Biểu đồ doanh thu theo {timeFilter === 'week' ? 'tuần' : timeFilter === 'month' ? 'tháng' : 'năm'}</p>
            <p className="text-sm text-gray-400 mt-1">(Tích hợp Chart.js hoặc Recharts)</p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lịch sử giao dịch</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã GD
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoa hồng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thực nhận
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phương thức
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.service_name}</div>
                    <div className="text-xs text-gray-500">Booking: {transaction.booking_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    -{formatCurrency(transaction.commission)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {formatCurrency(transaction.net_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPaymentMethodLabel(transaction.payment_method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{transactions.length}</span> trong tổng số <span className="font-medium">{transactions.length}</span> giao dịch
          </div>
          <div className="flex space-x-2">
            <button
              disabled
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-400 cursor-not-allowed"
            >
              Trước
            </button>
            <button
              disabled
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-400 cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalendarTab: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // Mock services for dropdown
  const services = [
    { id: 'all', name: 'Tất cả dịch vụ' },
    { id: '1', name: 'Khách sạn Mường Thanh Luxury' },
    { id: '2', name: 'Tour Hạ Long 3N2Đ' },
    { id: '3', name: 'Xe limousine Hà Nội - Hải Phòng' }
  ];

  // Mock blocked dates
  const blockedDates = ['2025-11-15', '2025-11-16', '2025-11-22'];
  const bookedDates = ['2025-11-10', '2025-11-11', '2025-11-18', '2025-11-25'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    const monthStr = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    return `${year}-${monthStr}-${dayStr}`;
  };

  const isDateBlocked = (dateKey: string) => blockedDates.indexOf(dateKey) !== -1;
  const isDateBooked = (dateKey: string) => bookedDates.indexOf(dateKey) !== -1;
  const isDateSelected = (dateKey: string) => selectedDates.indexOf(dateKey) !== -1;

  const toggleDateSelection = (dateKey: string) => {
    if (isDateBooked(dateKey)) {
      alert('Ngày này đã có booking, không thể chặn!');
      return;
    }
    if (selectedDates.indexOf(dateKey) !== -1) {
      setSelectedDates(selectedDates.filter(d => d !== dateKey));
    } else {
      setSelectedDates([...selectedDates, dateKey]);
    }
  };

  const handleBlockDates = () => {
    if (selectedDates.length === 0) {
      alert('Vui lòng chọn ít nhất một ngày');
      return;
    }
    alert(`Đã chặn ${selectedDates.length} ngày cho dịch vụ`);
    setSelectedDates([]);
  };

  const handleUnblockDates = () => {
    if (selectedDates.length === 0) {
      alert('Vui lòng chọn ít nhất một ngày đã bị chặn');
      return;
    }
    alert(`Đã mở ${selectedDates.length} ngày`);
    setSelectedDates([]);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lịch dịch vụ</h2>
          <p className="text-gray-600 mt-1">Quản lý lịch và tình trạng khả dụng</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleBlockDates}
            disabled={selectedDates.length === 0}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedDates.length > 0
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Chặn {selectedDates.length > 0 ? `(${selectedDates.length})` : ''}
          </button>
          <button
            onClick={handleUnblockDates}
            disabled={selectedDates.length === 0}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedDates.length > 0
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Mở chặn {selectedDates.length > 0 ? `(${selectedDates.length})` : ''}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar - Service Selection & Legend */}
        <div className="col-span-3 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Chọn dịch vụ</h3>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {services.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Chú thích</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Khả dụng</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-100 border-2 border-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Đã đặt</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-100 border-2 border-red-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Đã chặn</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Đang chọn</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Thống kê</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày đã chặn:</span>
                <span className="font-semibold text-gray-900">{blockedDates.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày đã booking:</span>
                <span className="font-semibold text-gray-900">{bookedDates.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày khả dụng:</span>
                <span className="font-semibold text-gray-900">
                  {daysInMonth - blockedDates.length - bookedDates.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="col-span-9">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FaCalendarAlt className="text-gray-600" />
              </button>
              <h3 className="text-xl font-semibold text-gray-900">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FaCalendarAlt className="text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Week day headers */}
              {weekDays.map(day => (
                <div key={day} className="text-center font-semibold text-gray-700 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square"></div>
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dateKey = formatDateKey(year, month, day);
                const isBlocked = isDateBlocked(dateKey);
                const isBooked = isDateBooked(dateKey);
                const isSelected = isDateSelected(dateKey);
                const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                let bgColor = 'bg-white hover:bg-gray-50';
                let borderColor = 'border-gray-200';
                let textColor = 'text-gray-900';

                if (isBlocked) {
                  bgColor = 'bg-red-100';
                  borderColor = 'border-red-500';
                  textColor = 'text-red-900';
                } else if (isBooked) {
                  bgColor = 'bg-blue-100';
                  borderColor = 'border-blue-500';
                  textColor = 'text-blue-900';
                } else if (isSelected) {
                  bgColor = 'bg-yellow-100';
                  borderColor = 'border-yellow-500';
                  textColor = 'text-yellow-900';
                } else {
                  bgColor = 'bg-green-50 hover:bg-green-100';
                  borderColor = 'border-green-200';
                }

                if (isToday) {
                  borderColor = 'border-indigo-600 border-2';
                }

                return (
                  <button
                    key={day}
                    onClick={() => toggleDateSelection(dateKey)}
                    className={`aspect-square border-2 ${borderColor} ${bgColor} rounded-lg p-2 transition-colors cursor-pointer flex flex-col items-center justify-center`}
                  >
                    <span className={`text-sm font-medium ${textColor}`}>{day}</span>
                    {isToday && <span className="text-xs text-indigo-600 font-semibold">Hôm nay</span>}
                  </button>
                );
              })}
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                💡 <strong>Hướng dẫn:</strong> Click vào ngày để chọn. Sau đó nhấn nút "Chặn" hoặc "Mở chặn" ở góc trên bên phải.
                Bạn không thể chặn ngày đã có booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'reviews' | 'qa'>('reviews');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [replyText, setReplyText] = useState<{[key: string]: string}>({});

  // Mock reviews data
  const mockReviews = [
    {
      id: 'REV001',
      service_name: 'Khách sạn Mường Thanh Luxury',
      customer_name: 'Nguyễn Văn A',
      customer_avatar: '',
      rating: 5,
      content: 'Khách sạn rất đẹp và sạch sẽ. Nhân viên phục vụ nhiệt tình. View nhìn ra biển tuyệt vời!',
      created_at: '2025-11-08T10:30:00',
      reply: null,
      images: []
    },
    {
      id: 'REV002',
      service_name: 'Tour Hạ Long 3N2Đ',
      customer_name: 'Trần Thị B',
      customer_avatar: '',
      rating: 4,
      content: 'Tour tổ chức khá ổn. Tuy nhiên thời gian có hơi gấp. Hướng dẫn viên nhiệt tình.',
      created_at: '2025-11-07T15:45:00',
      reply: {
        content: 'Cảm ơn bạn đã đánh giá. Chúng tôi sẽ cải thiện lịch trình cho phù hợp hơn!',
        created_at: '2025-11-08T09:20:00'
      },
      images: []
    },
    {
      id: 'REV003',
      service_name: 'Xe limousine Hà Nội - Hải Phòng',
      customer_name: 'Lê Văn C',
      customer_avatar: '',
      rating: 3,
      content: 'Xe khá cũ, điều hòa không mát lắm. Tài xế lái an toàn.',
      created_at: '2025-11-06T08:20:00',
      reply: null,
      images: []
    }
  ];

  // Mock Q&A data
  const mockQAs = [
    {
      id: 'QA001',
      service_name: 'Khách sạn Mường Thanh Luxury',
      customer_name: 'Phạm Thị D',
      question: 'Khách sạn có cho phép mang thú cưng không ạ?',
      created_at: '2025-11-09T14:30:00',
      answer: null
    },
    {
      id: 'QA002',
      service_name: 'Tour Hạ Long 3N2Đ',
      customer_name: 'Hoàng Văn E',
      question: 'Tour có bao gồm chi phí ăn uống không?',
      created_at: '2025-11-08T11:15:00',
      answer: {
        content: 'Tour đã bao gồm toàn bộ chi phí ăn uống theo chương trình.',
        created_at: '2025-11-08T16:40:00'
      }
    },
    {
      id: 'QA003',
      service_name: 'Xe limousine Hà Nội - Hải Phòng',
      customer_name: 'Võ Thị F',
      question: 'Xe có wifi không ạ?',
      created_at: '2025-11-07T09:00:00',
      answer: {
        content: 'Có ạ, tất cả xe của chúng tôi đều có wifi miễn phí.',
        created_at: '2025-11-07T10:20:00'
      }
    }
  ];

  const [reviews] = useState(mockReviews);
  const [qas] = useState(mockQAs);

  const filteredReviews = filterRating === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === filterRating);

  const handleReply = (id: string, type: 'review' | 'qa') => {
    const text = replyText[id];
    if (!text || text.trim() === '') {
      alert('Vui lòng nhập nội dung phản hồi');
      return;
    }
    alert(`Đã gửi phản hồi cho ${type === 'review' ? 'review' : 'câu hỏi'} #${id}`);
    setReplyText({ ...replyText, [id]: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length * 100).toFixed(0)
  }));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Phản hồi khách hàng</h2>
        <p className="text-gray-600 mt-1">Quản lý reviews và Q&A từ khách hàng</p>
      </div>

      {/* Section Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveSection('reviews')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeSection === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveSection('qa')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeSection === 'qa'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Q&A ({qas.length})
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      {activeSection === 'reviews' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Rating Summary Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">{avgRating}</div>
                {renderStars(Math.round(parseFloat(avgRating)))}
                <p className="text-sm text-gray-600 mt-2">{reviews.length} đánh giá</p>
              </div>
              
              <div className="space-y-2 mt-4">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center text-sm">
                    <span className="w-8 text-gray-700">{rating}★</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right text-gray-600">{count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo rating
                </label>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="5">5 sao</option>
                  <option value="4">4 sao</option>
                  <option value="3">3 sao</option>
                  <option value="2">2 sao</option>
                  <option value="1">1 sao</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="col-span-9 space-y-4">
            {filteredReviews.map(review => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {review.customer_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.customer_name}</div>
                      <div className="text-sm text-gray-500">{formatDate(review.created_at)}</div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                <div className="mb-2 text-sm text-gray-600">
                  <span className="font-medium">Dịch vụ:</span> {review.service_name}
                </div>

                <p className="text-gray-700 mb-4">{review.content}</p>

                {review.reply ? (
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-600">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-gray-900 mr-2">Phản hồi của bạn:</span>
                      <span className="text-sm text-gray-500">{formatDate(review.reply.created_at)}</span>
                    </div>
                    <p className="text-gray-700">{review.reply.content}</p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <textarea
                      value={replyText[review.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                      placeholder="Nhập phản hồi của bạn..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleReply(review.id, 'review')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Gửi phản hồi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Q&A Section */}
      {activeSection === 'qa' && (
        <div className="space-y-4">
          {qas.map(qa => (
            <div key={qa.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {qa.customer_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{qa.customer_name}</div>
                      <div className="text-sm text-gray-500">{formatDate(qa.created_at)}</div>
                    </div>
                    {!qa.answer && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Chưa trả lời
                      </span>
                    )}
                  </div>

                  <div className="mb-2 text-sm text-gray-600">
                    <span className="font-medium">Dịch vụ:</span> {qa.service_name}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-900 font-medium mb-1">❓ Câu hỏi:</p>
                    <p className="text-gray-700">{qa.question}</p>
                  </div>

                  {qa.answer ? (
                    <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-600">
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-gray-900 mr-2">✅ Trả lời của bạn:</span>
                        <span className="text-sm text-gray-500">{formatDate(qa.answer.created_at)}</span>
                      </div>
                      <p className="text-gray-700">{qa.answer.content}</p>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={replyText[qa.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [qa.id]: e.target.value })}
                        placeholder="Nhập câu trả lời..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleReply(qa.id, 'qa')}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Gửi trả lời
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProviderServicesHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'finance' | 'calendar' | 'feedback'>('services');

  const tabs = [
    { id: 'services' as const, label: 'Dịch vụ của tôi', icon: FaList },
    { id: 'finance' as const, label: 'Tài chính', icon: FaChartLine },
    { id: 'calendar' as const, label: 'Lịch dịch vụ', icon: FaCalendarAlt },
    { id: 'feedback' as const, label: 'Phản hồi', icon: FaComments }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        return <ServicesTab />;
      case 'finance':
        return <FinanceTab />;
      case 'calendar':
        return <CalendarTab />;
      case 'feedback':
        return <FeedbackTab />;
      default:
        return <ServicesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProviderServicesHub;
