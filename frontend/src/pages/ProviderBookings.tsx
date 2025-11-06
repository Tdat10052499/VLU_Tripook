import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaCalendarAlt,
  FaUser,
  FaDollarSign,
  FaEye,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaClock,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import providerApi from '../services/providerApi';

interface Booking {
  _id: string;
  user_id: string;
  service_id: string;
  service_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  check_in: string;
  check_out?: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  guests: number;
  special_requests?: string;
}

const ProviderBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await providerApi.getBookings();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err: any) {
      setError('Không thể tải danh sách đặt chỗ');
      console.error('Bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = useCallback(() => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

  useEffect(() => {
    filterBookings();
  }, [filterBookings]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await providerApi.updateBookingStatus(bookingId, newStatus);
      if (response.success) {
        setBookings(bookings.map(b => 
          b._id === bookingId ? { ...b, status: newStatus as any } : b
        ));
      }
    } catch (err: any) {
      setError('Không thể cập nhật trạng thái đặt chỗ');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      cancelled: 'Đã hủy',
      completed: 'Hoàn thành'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thất bại',
      refunded: 'Đã hoàn tiền'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý đặt chỗ</h1>
          <p className="text-gray-600">Xem và xử lý các đặt chỗ từ khách hàng</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng, dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            Tổng: <span className="font-semibold ml-1">{filteredBookings.length}</span> đặt chỗ
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đặt chỗ nào</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Không tìm thấy đặt chỗ với bộ lọc hiện tại'
                : 'Chưa có khách hàng nào đặt dịch vụ của bạn'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{booking.service_name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                        {getPaymentStatusLabel(booking.payment_status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <FaUser className="mr-2 h-3 w-3" />
                          <span className="font-medium">{booking.customer_name}</span>
                        </div>
                        <div className="flex items-center">
                          <FaEnvelope className="mr-2 h-3 w-3" />
                          {booking.customer_email}
                        </div>
                        <div className="flex items-center">
                          <FaPhone className="mr-2 h-3 w-3" />
                          {booking.customer_phone}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 h-3 w-3" />
                          Check-in: {formatDate(booking.check_in)}
                        </div>
                        {booking.check_out && (
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 h-3 w-3" />
                            Check-out: {formatDate(booking.check_out)}
                          </div>
                        )}
                        <div className="flex items-center">
                          <FaDollarSign className="mr-2 h-3 w-3" />
                          {booking.total_amount.toLocaleString()} VND
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetails(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Xem chi tiết"
                    >
                      <FaEye className="h-4 w-4" />
                    </button>

                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          title="Xác nhận"
                        >
                          <FaCheck className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Từ chối"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'completed')}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                        title="Hoàn thành"
                      >
                        <FaClock className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Chi tiết đặt chỗ</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Dịch vụ</label>
                    <p className="text-sm text-gray-900">{selectedBooking.service_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mã đặt chỗ</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedBooking._id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Khách hàng</label>
                    <p className="text-sm text-gray-900">{selectedBooking.customer_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Số khách</label>
                    <p className="text-sm text-gray-900">{selectedBooking.guests} người</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Check-in</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedBooking.check_in)}</p>
                  </div>
                  {selectedBooking.check_out && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Check-out</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedBooking.check_out)}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tổng tiền</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedBooking.total_amount.toLocaleString()} VND
                  </p>
                </div>

                {selectedBooking.special_requests && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Yêu cầu đặc biệt</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                      {selectedBooking.special_requests}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          updateBookingStatus(selectedBooking._id, 'confirmed');
                          setShowDetails(false);
                        }}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                      >
                        Xác nhận đặt chỗ
                      </button>
                      <button
                        onClick={() => {
                          updateBookingStatus(selectedBooking._id, 'cancelled');
                          setShowDetails(false);
                        }}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                  {selectedBooking.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking._id, 'completed');
                        setShowDetails(false);
                      }}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
                    >
                      Đánh dấu hoàn thành
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderBookings;