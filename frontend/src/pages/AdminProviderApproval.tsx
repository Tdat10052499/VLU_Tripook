import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface PendingProvider {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  companyName: string;
  businessType: string;
  businessAddress: string;
  businessLicense: string;
  businessDescription: string;
  accountStatus: string;
  createdAt: string;
  isEmailVerified: boolean;
}

const AdminProviderApproval: React.FC = () => {
  const [pendingProviders, setPendingProviders] = useState<PendingProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    try {
      const response = await fetch('/api/admin/pending-providers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingProviders(data.providers || []);
      } else {
        toast.error('Không thể tải danh sách provider');
      }
    } catch (error) {
      console.error('Error fetching pending providers:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (providerId: string, action: 'approve' | 'reject', reason?: string) => {
    if (processingId) return;
    
    setProcessingId(providerId);
    
    try {
      const response = await fetch('/api/admin/approve-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          providerId,
          action,
          reason
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || `Provider đã được ${action === 'approve' ? 'phê duyệt' : 'từ chối'}`);
        
        // Remove from pending list
        setPendingProviders(prev => prev.filter(p => p._id !== providerId));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error processing provider:', error);
      toast.error('Có lỗi xảy ra khi xử lý');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách provider...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🏢 Quản lý Provider chờ phê duyệt
          </h1>
          <p className="text-gray-600 mt-2">
            Xem xét và phê duyệt các nhà cung cấp dịch vụ mới
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ phê duyệt</p>
                <p className="text-2xl font-bold text-gray-900">{pendingProviders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã xác thực email</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingProviders.filter(p => p.isEmailVerified).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Có giấy phép</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingProviders.filter(p => p.businessLicense).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Provider List */}
        {pendingProviders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có provider chờ phê duyệt</h3>
            <p className="text-gray-500">Tất cả các provider đã được xử lý.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingProviders.map((provider) => (
              <div key={provider._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mr-4">
                          {provider.companyName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          provider.isEmailVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {provider.isEmailVerified ? '✅ Email đã xác thực' : '❌ Chưa xác thực email'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Người đại diện</label>
                          <p className="text-gray-900">{provider.fullName}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                          <p className="text-gray-900">{provider.email}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại</label>
                          <p className="text-gray-900">{provider.phone}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Loại hình kinh doanh</label>
                          <p className="text-gray-900">{provider.businessType}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Mã số kinh doanh</label>
                          <p className="text-gray-900">{provider.businessLicense || 'Chưa cung cấp'}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Ngày đăng ký</label>
                          <p className="text-gray-900">{formatDate(provider.createdAt)}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ kinh doanh</label>
                        <p className="text-gray-900">{provider.businessAddress}</p>
                      </div>

                      {provider.businessDescription && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả dịch vụ</label>
                          <p className="text-gray-900">{provider.businessDescription}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleApproval(provider._id, 'approve')}
                      disabled={processingId === provider._id}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {processingId === provider._id ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Đang xử lý...
                        </div>
                      ) : (
                        '✅ Phê duyệt'
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        const reason = prompt('Lý do từ chối (optional):');
                        handleApproval(provider._id, 'reject', reason || undefined);
                      }}
                      disabled={processingId === provider._id}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ❌ Từ chối
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProviderApproval;