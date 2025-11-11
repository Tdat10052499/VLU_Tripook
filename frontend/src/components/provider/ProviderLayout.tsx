import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProviderLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      path: '/provider',
      icon: '📊',
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/provider/services',
      icon: '🏪',
      label: 'Quản lý dịch vụ'
    },
    {
      path: '/provider/bookings',
      icon: '📅',
      label: 'Đặt chỗ'
    },
    {
      path: '/provider/profile',
      icon: '👤',
      label: 'Hồ sơ'
    },
    {
      path: '/provider/settings',
      icon: '⚙️',
      label: 'Cài đặt'
    }
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Check if user is provider
  if (user?.role !== 'provider') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Check if provider is approved
  if (user?.accountStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">⏳ Đang chờ duyệt</h2>
          <p className="text-gray-600 mb-4">
            Tài khoản provider của bạn đang chờ admin phê duyệt. 
            Vui lòng kiểm tra email để nhận thông báo khi được duyệt.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (user?.accountStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Tài khoản bị từ chối</h2>
          <p className="text-gray-600 mb-4">
            Rất tiếc, tài khoản provider của bạn đã bị từ chối. 
            Vui lòng liên hệ admin để biết thêm chi tiết.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">Tripook Provider</h1>
          <p className="text-sm text-gray-600 mt-1">{user?.companyName || user?.fullName || user?.email}</p>
          <p className="text-xs text-gray-500 mt-1">{user?.businessType}</p>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive(item.path, item.exact)
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          
          {/* Trang chủ Website Link */}
          <Link
            to="/"
            className="flex items-center px-4 py-3 mb-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 border-t mt-4 pt-4"
          >
            <span className="text-xl mr-3">🏠</span>
            <span className="font-medium">Trang chủ Website</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProviderLayout;
