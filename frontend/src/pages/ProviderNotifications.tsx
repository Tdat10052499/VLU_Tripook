import React, { useState, useEffect } from 'react';
import {
  FaBell,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaFilter,
  FaCheck,
  FaTrash,
  FaCalendar
} from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface Notification {
  _id: string;
  type: 'booking' | 'review' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

const ProviderNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  // Fetch all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.get('/api/provider/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setNotifications(response.data.notifications);
        setFilteredNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Use mock data for demo
      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...notifications];

    // Filter by read status
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.read);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    setFilteredNotifications(filtered);
  }, [filter, typeFilter, notifications]);

  // Mark as read
  const markAsRead = async (notificationId: string) => {
    try {
      const token = Cookies.get('auth_token');
      await axios.patch(
        `/api/provider/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      toast.success('Đã đánh dấu là đã đọc');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Không thể đánh dấu thông báo');
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = Cookies.get('auth_token');
      await axios.patch(
        '/api/provider/notifications/read-all',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Không thể đánh dấu tất cả');
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const token = Cookies.get('auth_token');
      await axios.delete(`/api/provider/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      toast.success('Đã xóa thông báo');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Không thể xóa thông báo');
    }
  };

  // Delete selected notifications
  const deleteSelected = async () => {
    if (selectedNotifications.size === 0) return;

    try {
      const token = Cookies.get('auth_token');
      await axios.post(
        '/api/provider/notifications/delete-multiple',
        { notification_ids: Array.from(selectedNotifications) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev => prev.filter(n => !selectedNotifications.has(n._id)));
      setSelectedNotifications(new Set());
      toast.success(`Đã xóa ${selectedNotifications.size} thông báo`);
    } catch (error) {
      console.error('Error deleting notifications:', error);
      toast.error('Không thể xóa thông báo');
    }
  };

  // Toggle selection
  const toggleSelection = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  // Select all
  const selectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n._id)));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <FaCheckCircle className="h-6 w-6 text-green-500" />;
      case 'review':
        return <FaInfoCircle className="h-6 w-6 text-blue-500" />;
      case 'payment':
        return <FaCheckCircle className="h-6 w-6 text-indigo-500" />;
      case 'system':
        return <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <FaInfoCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <FaBell className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <FaCheck className="mr-2 h-4 w-4" />
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Read Status Filter */}
            <div className="flex items-center space-x-2">
              <FaFilter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tất cả ({notifications.length})</option>
                <option value="unread">Chưa đọc ({unreadCount})</option>
                <option value="read">Đã đọc ({notifications.length - unreadCount})</option>
              </select>
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tất cả loại</option>
              <option value="booking">Đặt chỗ</option>
              <option value="review">Đánh giá</option>
              <option value="payment">Thanh toán</option>
              <option value="system">Hệ thống</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedNotifications.size}
              </span>
              <button
                onClick={deleteSelected}
                className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm transition-colors"
              >
                <FaTrash className="mr-2 h-3 w-3" />
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải thông báo...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FaBell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg font-medium mb-2">Không có thông báo</p>
            <p className="text-gray-400 text-sm">
              {filter === 'unread' 
                ? 'Bạn đã đọc tất cả thông báo' 
                : 'Chưa có thông báo nào'}
            </p>
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
              <input
                type="checkbox"
                checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                onChange={selectAll}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-sm text-gray-700 font-medium">
                Chọn tất cả
              </label>
            </div>

            {/* Notifications */}
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.has(notification._id)}
                      onChange={() => toggleSelection(notification._id)}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />

                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className={`text-base font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="h-2 w-2 bg-indigo-600 rounded-full"></span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                              title="Đánh dấu đã đọc"
                            >
                              <FaCheck className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                            title="Xóa"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <FaCalendar className="mr-1 h-3 w-3" />
                          {formatDate(notification.created_at)}
                        </div>
                        
                        {notification.action_url && (
                          <a
                            href={notification.action_url}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            Xem chi tiết →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    _id: '1',
    type: 'booking',
    title: 'Đặt chỗ mới',
    message: 'Khách hàng Nguyễn Văn A đã đặt dịch vụ "Khách sạn Hạ Long View" cho ngày 15/11/2025. Tổng giá trị: 2.500.000 VND',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    action_url: '/provider/bookings'
  },
  {
    _id: '2',
    type: 'review',
    title: 'Đánh giá mới',
    message: 'Khách hàng Trần Thị B vừa để lại đánh giá 5 sao cho dịch vụ "Tour Vịnh Hạ Long 2N1Đ". Nội dung: "Dịch vụ tuyệt vời, hướng dẫn viên nhiệt tình!"',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    action_url: '/provider/services'
  },
  {
    _id: '3',
    type: 'payment',
    title: 'Thanh toán thành công',
    message: 'Bạn đã nhận được 2.500.000 VND từ đơn đặt chỗ #BK12345. Tiền sẽ được chuyển vào tài khoản trong 3-5 ngày làm việc.',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    action_url: '/provider/services'
  },
  {
    _id: '4',
    type: 'system',
    title: 'Cập nhật hệ thống',
    message: 'Vui lòng cập nhật thông tin thanh toán để tiếp tục nhận đơn đặt chỗ. Hệ thống yêu cầu xác minh tài khoản ngân hàng.',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    action_url: '/provider/settings'
  },
  {
    _id: '5',
    type: 'booking',
    title: 'Yêu cầu hủy đặt chỗ',
    message: 'Khách hàng Lê Văn C yêu cầu hủy đặt chỗ #BK12340 cho dịch vụ "Khách sạn Sapa View". Vui lòng xử lý trong vòng 24h.',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    action_url: '/provider/bookings'
  },
  {
    _id: '6',
    type: 'review',
    title: 'Phản hồi từ khách hàng',
    message: 'Khách hàng vừa trả lời câu hỏi của bạn về dịch vụ "Tour Ninh Bình 1 ngày"',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    action_url: '/provider/services'
  },
  {
    _id: '7',
    type: 'payment',
    title: 'Chuyển khoản thành công',
    message: 'Đã chuyển 5.200.000 VND vào tài khoản ngân hàng của bạn. Mã giao dịch: TXN789456',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    action_url: '/provider/services'
  },
  {
    _id: '8',
    type: 'booking',
    title: 'Xác nhận đặt chỗ',
    message: 'Đơn đặt chỗ #BK12338 đã được khách hàng xác nhận. Vui lòng chuẩn bị cho ngày 20/11/2025.',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    action_url: '/provider/bookings'
  }
];

export default ProviderNotifications;
