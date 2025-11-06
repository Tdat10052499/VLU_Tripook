import React from 'react';

interface ProviderPendingStatusProps {
  user: {
    fullName: string;
    email: string;
    companyName?: string;
    businessType?: string;
    accountStatus: string;
  };
}

const ProviderPendingStatus: React.FC<ProviderPendingStatusProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Đăng ký thành công!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Tài khoản nhà cung cấp của bạn đang được xem xét
          </p>
        </div>

        {/* Account Info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Họ tên</label>
              <p className="text-gray-900 font-semibold">{user.fullName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            
            {user.companyName && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tên công ty</label>
                <p className="text-gray-900 font-semibold">{user.companyName}</p>
              </div>
            )}
            
            {user.businessType && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Loại hình kinh doanh</label>
                <p className="text-gray-900">{user.businessType}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">
                Tài khoản đang chờ phê duyệt
              </h3>
              <div className="mt-2 text-yellow-700">
                <p className="text-sm">
                  Tài khoản nhà cung cấp của bạn đang được team Tripook xem xét và phê duyệt. 
                  Quá trình này thường mất từ <strong>24-48 giờ làm việc</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Các bước tiếp theo</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </div>
              <p className="text-gray-700">Chúng tôi sẽ xem xét thông tin doanh nghiệp của bạn</p>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </div>
              <p className="text-gray-700">Xác thực tính hợp lệ của doanh nghiệp</p>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </div>
              <p className="text-gray-700">Gửi email thông báo kết quả phê duyệt</p>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                ✓
              </div>
              <p className="text-gray-700">Kích hoạt tài khoản và truy cập Provider Dashboard</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📞 Cần hỗ trợ?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Email hỗ trợ</p>
              <p className="text-blue-600 font-semibold">support@tripook.com</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Hotline</p>
              <p className="text-blue-600 font-semibold">1900-TRIPOOK</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Giờ làm việc</p>
              <p className="text-gray-900">Thứ 2 - Thứ 6: 8:00 - 17:30</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Thời gian phản hồi</p>
              <p className="text-gray-900">Trong vòng 24 giờ</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            🏠 Về trang chủ
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            📊 Xem Dashboard
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Bạn sẽ nhận được email thông báo khi tài khoản được phê duyệt.
          </p>
          <p className="text-sm text-gray-500">
            Trong thời gian chờ, bạn có thể khám phá các dịch vụ du lịch trên Tripook.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderPendingStatus;