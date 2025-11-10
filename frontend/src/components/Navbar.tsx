import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold hover:text-primary-200 transition-colors"
            >
              Tripook
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="hover:text-primary-200 transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              Trang chủ
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="hover:text-primary-200 transition-colors px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  {user?.picture && (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-primary-200">
                    Welcome, {user?.name || user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth/login"
                  className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-white text-primary-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;