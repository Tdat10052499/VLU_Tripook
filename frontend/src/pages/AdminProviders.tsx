import React, { useEffect, useState } from 'react';
import { getPendingProviders, approveProvider, getProviderDetail } from '../services/adminApi';

interface Provider {
  _id: string;
  name: string;
  email: string;
  businessName: string;
  businessType: string;
  phone: string;
  createdAt: string;
}

const AdminProviders: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const response = await getPendingProviders();
      if (response.success) {
        setProviders(response.providers || []);
      }
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (providerId: string) => {
    try {
      const response = await getProviderDetail(providerId);
      if (response.success) {
        setSelectedProvider(response.provider);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error loading provider details:', error);
      alert('Có lỗi khi tải thông tin provider');
    }
  };

  const handleApprove = async (providerId: string) => {
    if (!window.confirm('Bạn có chắc muốn duyệt provider này?')) return;

    try {
      setProcessing(true);
      const response = await approveProvider(providerId, true);
      if (response.success) {
        alert('Đã duyệt provider thành công!');
        loadProviders();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error approving provider:', error);
      alert('Có lỗi khi duyệt provider');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (providerId: string) => {
    if (!rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    if (!window.confirm('Bạn có chắc muốn từ chối provider này?')) return;

    try {
      setProcessing(true);
      const response = await approveProvider(providerId, false, rejectionReason);
      if (response.success) {
        alert('Đã từ chối provider!');
        loadProviders();
        setShowModal(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error rejecting provider:', error);
      alert('Có lỗi khi từ chối provider');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading providers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Provider Approval</h1>
        <p className="text-gray-600 mt-2">Review and approve pending provider applications</p>
      </div>

      {providers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h2>
          <p className="text-gray-600">No pending provider applications at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold">Name</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold">Business</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold">Type</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold">Applied</th>
                <th className="text-center py-4 px-6 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-gray-800">{provider.name}</div>
                      <div className="text-sm text-gray-600">{provider.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{provider.businessName}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {provider.businessType}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(provider.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleViewDetails(provider._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Provider Details Modal */}
      {showModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Provider Details</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectionReason('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Personal Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <p className="font-medium">{selectedProvider.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium">{selectedProvider.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-medium">{selectedProvider.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <p className="font-medium">{selectedProvider.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Business Name</label>
                    <p className="font-medium">{selectedProvider.businessName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Business Type</label>
                    <p className="font-medium capitalize">{selectedProvider.businessType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Tax Code</label>
                    <p className="font-medium">{selectedProvider.taxCode || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Applied Date</label>
                    <p className="font-medium">
                      {new Date(selectedProvider.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="text-sm text-blue-600">Services</label>
                    <p className="text-2xl font-bold text-blue-700">
                      {selectedProvider.servicesCount}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="text-sm text-green-600">Bookings</label>
                    <p className="text-2xl font-bold text-green-700">
                      {selectedProvider.bookingsCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rejection Reason Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reason for rejection..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleApprove(selectedProvider._id)}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {processing ? 'Processing...' : '✓ Approve Provider'}
                </button>
                <button
                  onClick={() => handleReject(selectedProvider._id)}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {processing ? 'Processing...' : '✕ Reject Provider'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProviders;
