import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import ProviderPendingStatus from './ProviderPendingStatus';

const ProviderPendingWrapper: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== 'provider') {
    return <Navigate to="/dashboard" replace />;
  }

  if (user.provider_info?.approved_at || user.role === 'provider') {
    // If provider is already approved, redirect to provider dashboard
    return <Navigate to="/provider/dashboard" replace />;
  }

  const userData = {
    fullName: user.name || user.username,
    email: user.email,
    companyName: user.provider_info?.company_name || '',
    businessType: user.provider_info?.business_type || '',
    accountStatus: 'pending' // This should come from backend
  };

  return <ProviderPendingStatus user={userData} />;
};

export default ProviderPendingWrapper;