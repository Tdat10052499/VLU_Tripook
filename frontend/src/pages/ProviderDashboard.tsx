import React, { useState, useContext } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  FaHome, 
  FaServicestack, 
  FaCalendarAlt, 
  FaUser, 
  FaCog, 
  FaChartBar,
  FaBars,
  FaTimes,
  FaBusinessTime,
  FaBell,
  FaSignOutAlt
} from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const ProviderDashboard: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { path: '/provider/dashboard', icon: FaHome, label: 'Trang chủ', exact: true },
    { path: '/provider/services', icon: FaServicestack, label: 'Quản lý dịch vụ' },
    { path: '/provider/bookings', icon: FaCalendarAlt, label: 'Đặt chỗ' },
    { path: '/provider/statistics', icon: FaChartBar, label: 'Thống kê' },
    { path: '/provider/profile', icon: FaUser, label: 'Hồ sơ' },
    { path: '/provider/settings', icon: FaCog, label: 'Cài đặt' }
  ];

  const isActiveRoute = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isSidebarOpen ? (
                  <FaTimes className="h-5 w-5" />
                ) : (
                  <FaBars className="h-5 w-5" />
                )}
              </button>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                <Link to="/" className="flex items-center">
                  <FaBusinessTime className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">Tripook Provider</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <FaBell className="h-5 w-5" />
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.provider_info?.company_name || user?.name}
                  </div>
                  <div className="text-xs text-gray-500">Provider Dashboard</div>
                </div>
                
                <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'P'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full pt-16">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path, item.exact);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-900 border-r-2 border-indigo-500'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <FaSignOutAlt className="mr-3 h-5 w-5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64 pt-16">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderDashboard;