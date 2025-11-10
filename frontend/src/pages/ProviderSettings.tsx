import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FaSave, FaBuilding, FaCreditCard, FaBell, FaLock } from 'react-icons/fa';

const ProviderSettings: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState<'company' | 'payment' | 'notifications' | 'security'>('company');

  // Company Info State
  const [companyInfo, setCompanyInfo] = useState({
    companyName: user?.provider_info?.company_name || '',
    businessType: (user?.provider_info?.business_type || 'hotel') as 'hotel' | 'tour' | 'transport',
    description: user?.provider_info?.description || '',
    address: user?.provider_info?.address || '',
    businessPhone: user?.provider_info?.business_phone || '',
    businessEmail: user?.provider_info?.business_email || '',
    website: user?.provider_info?.website || ''
  });

  // Payment Settings State
  const [paymentInfo, setPaymentInfo] = useState({
    accountNumber: user?.provider_info?.bank_account?.account_number || '',
    bankName: user?.provider_info?.bank_account?.bank_name || '',
    accountHolder: user?.provider_info?.bank_account?.account_holder || '',
    vnpayMerchantId: user?.provider_info?.vnpay_info?.merchant_id || ''
  });

  // Notification Preferences State
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailBooking: true,
    emailReview: true,
    emailPayment: true,
    pushBooking: true,
    pushReview: false,
    smsBooking: false
  });

  // Security Settings State
  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveCompanyInfo = () => {
    console.log('Saving company info:', companyInfo);
    alert('Thông tin công ty đã được cập nhật!');
  };

  const handleSavePaymentInfo = () => {
    console.log('Saving payment info:', paymentInfo);
    alert('Thông tin thanh toán đã được cập nhật!');
  };

  const handleSaveNotifications = () => {
    console.log('Saving notification preferences:', notificationPrefs);
    alert('Tùy chọn thông báo đã được cập nhật!');
  };

  const handleChangePassword = () => {
    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    console.log('Changing password');
    alert('Mật khẩu đã được thay đổi!');
    setSecurityInfo({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const sections = [
    { id: 'company', icon: FaBuilding, label: 'Thông tin công ty' },
    { id: 'payment', icon: FaCreditCard, label: 'Thanh toán' },
    { id: 'notifications', icon: FaBell, label: 'Thông báo' },
    { id: 'security', icon: FaLock, label: 'Bảo mật' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
        <p className="text-gray-600 mt-1">Quản lý thông tin và tùy chọn của bạn</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <Icon className="mr-3" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-9">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Company Info Section */}
            {activeSection === 'company' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin công ty</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên công ty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={companyInfo.companyName}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loại hình kinh doanh
                      </label>
                      <select
                        value={companyInfo.businessType}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, businessType: e.target.value as 'hotel' | 'tour' | 'transport' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="hotel">Khách sạn</option>
                        <option value="tour">Du lịch</option>
                        <option value="transport">Vận chuyển</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                      value={companyInfo.description}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Mô tả ngắn về công ty của bạn..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        value={companyInfo.businessPhone}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, businessPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={companyInfo.businessEmail}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, businessEmail: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        value={companyInfo.website}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveCompanyInfo}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <FaSave className="mr-2" />
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Section */}
            {activeSection === 'payment' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Cài đặt thanh toán</h2>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin ngân hàng</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                        <input
                          type="text"
                          value={paymentInfo.accountNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ngân hàng</label>
                          <input
                            type="text"
                            value={paymentInfo.bankName}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Chủ tài khoản</label>
                          <input
                            type="text"
                            value={paymentInfo.accountHolder}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, accountHolder: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">VNPay Integration</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
                      <input
                        type="text"
                        value={paymentInfo.vnpayMerchantId}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, vnpayMerchantId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="VNP_MERCHANT_ID"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSavePaymentInfo}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <FaSave className="mr-2" />
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tùy chọn thông báo</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Email Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationPrefs.emailBooking}
                          onChange={(e) => setNotificationPrefs({ ...notificationPrefs, emailBooking: e.target.checked })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-gray-700">Đặt chỗ mới</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationPrefs.emailReview}
                          onChange={(e) => setNotificationPrefs({ ...notificationPrefs, emailReview: e.target.checked })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-gray-700">Đánh giá mới</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationPrefs.emailPayment}
                          onChange={(e) => setNotificationPrefs({ ...notificationPrefs, emailPayment: e.target.checked })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-gray-700">Thanh toán thành công</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Push Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationPrefs.pushBooking}
                          onChange={(e) => setNotificationPrefs({ ...notificationPrefs, pushBooking: e.target.checked })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-gray-700">Đặt chỗ mới</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationPrefs.pushReview}
                          onChange={(e) => setNotificationPrefs({ ...notificationPrefs, pushReview: e.target.checked })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-gray-700">Đánh giá mới</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">SMS Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationPrefs.smsBooking}
                          onChange={(e) => setNotificationPrefs({ ...notificationPrefs, smsBooking: e.target.checked })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-gray-700">Đặt chỗ mới</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveNotifications}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <FaSave className="mr-2" />
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Bảo mật</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      value={securityInfo.currentPassword}
                      onChange={(e) => setSecurityInfo({ ...securityInfo, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={securityInfo.newPassword}
                      onChange={(e) => setSecurityInfo({ ...securityInfo, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      value={securityInfo.confirmPassword}
                      onChange={(e) => setSecurityInfo({ ...securityInfo, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleChangePassword}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <FaLock className="mr-2" />
                      Đổi mật khẩu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSettings;
