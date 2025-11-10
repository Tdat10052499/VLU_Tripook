import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaTimes, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Notification {
  _id: string;
  type: 'booking' | 'review' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.get('/api/provider/notifications', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 5 } // Get latest 5 for dropdown
      });
      
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Use mock data for demo
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
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
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fetch notifications on mount and when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <FaCheckCircle className="h-5 w-5 text-green-500" />;
      case 'review':
        return <FaInfoCircle className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <FaCheckCircle className="h-5 w-5 text-indigo-500" />;
      case 'system':
        return <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <FaInfoCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        <FaBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Đánh dấu đã đọc
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                <p className="text-sm">Đang tải...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <FaBell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Không có thông báo mới</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification._id);
                      }
                      if (notification.action_url) {
                        setIsOpen(false);
                      }
                    }}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="ml-2 h-2 w-2 bg-indigo-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <Link
                to="/provider/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Xem tất cả thông báo
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    _id: '1',
    type: 'booking',
    title: 'Đặt chỗ mới',
    message: 'Khách hàng Nguyễn Văn A đã đặt dịch vụ "Khách sạn Hạ Long View" cho ngày 15/11/2025',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    action_url: '/provider/bookings'
  },
  {
    _id: '2',
    type: 'review',
    title: 'Đánh giá mới',
    message: 'Khách hàng vừa để lại đánh giá 5 sao cho dịch vụ của bạn',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    action_url: '/provider/services'
  },
  {
    _id: '3',
    type: 'payment',
    title: 'Thanh toán thành công',
    message: 'Bạn đã nhận được 2.500.000 VND từ đơn đặt chỗ #BK12345',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    action_url: '/provider/services'
  },
  {
    _id: '4',
    type: 'system',
    title: 'Cập nhật hệ thống',
    message: 'Vui lòng cập nhật thông tin thanh toán để tiếp tục nhận đơn đặt chỗ',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    action_url: '/provider/settings'
  },
  {
    _id: '5',
    type: 'booking',
    title: 'Yêu cầu hủy đặt chỗ',
    message: 'Khách hàng yêu cầu hủy đặt chỗ #BK12340. Vui lòng xử lý trong vòng 24h',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    action_url: '/provider/bookings'
  }
];

export default NotificationBell;
