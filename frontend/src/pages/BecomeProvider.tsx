import React, { useState, useContext } from 'react';
import { FaBusinessTime, FaHotel, FaPlane, FaCar, FaMapMarkerAlt, FaPhone, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import providerApi from '../services/providerApi';
import type { BecomeProviderFormData } from '../types/provider';

const BecomeProvider: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, refreshUser } = useContext(AuthContext);
  
  // No automatic redirect - let users see the form and handle submission logic

  const [formData, setFormData] = useState<BecomeProviderFormData>({
    company_name: '',
    business_type: 'hotel',
    description: '',
    address: '',
    business_phone: '',
    business_email: '',
    website: '',
    bank_account: {
      account_number: '',
      bank_name: '',
      account_holder: ''
    },
    agree_terms: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <FaBusinessTime className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Đăng nhập để trở thành Provider
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Bạn cần đăng nhập để đăng ký trở thành đối tác kinh doanh
            </p>
          </div>
          <div className="space-y-4">
            <Link
              to="/auth/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đăng nhập
            </Link>
            <Link
              to="/auth/register"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đăng ký tài khoản mới
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const providerTypes: { value: 'hotel' | 'tour' | 'transport'; label: string; icon: React.ElementType; description: string }[] = [
    { 
      value: 'hotel', 
      label: 'Khách sạn / Homestay', 
      icon: FaHotel,
      description: 'Cung cấp dịch vụ lưu trú, phòng nghỉ'
    },
    { 
      value: 'tour', 
      label: 'Tour du lịch', 
      icon: FaPlane,
      description: 'Tổ chức các chuyến du lịch, tour trọn gói'
    },
    { 
      value: 'transport', 
      label: 'Vận chuyển', 
      icon: FaCar,
      description: 'Dịch vụ di chuyển, thuê xe, taxi'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Submit provider registration (backend will handle role checking and upgrade)
      const result = await providerApi.becomeProvider(formData);
      
      if (result.success) {
        // Refresh user data to get updated role
        await refreshUser();
        
        setSuccess(true);
        
        // Redirect to success page or dashboard after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setError(result.message || 'Có lỗi xảy ra khi đăng ký');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Nâng cấp thành công!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Tài khoản của bạn đã được nâng cấp thành Provider thành công. Bạn có thể bắt đầu quản lý dịch vụ của mình ngay bây giờ.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Đang chuyển hướng đến trang profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <FaBusinessTime className="mx-auto h-12 w-12 text-indigo-600" />
              <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
                Trở thành đối tác Provider
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Đăng ký để cung cấp dịch vụ du lịch cho khách hàng của Tripook
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Provider Type Selection */}
              <div>
                <label className="text-base font-medium text-gray-900">
                  Loại hình kinh doanh
                </label>
                <p className="text-sm leading-5 text-gray-500">
                  Chọn loại dịch vụ bạn muốn cung cấp
                </p>
                <fieldset className="mt-4">
                  <legend className="sr-only">Loại Provider</legend>
                  <div className="space-y-4">
                    {providerTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div key={type.value} className="flex items-center">
                          <input
                            id={type.value}
                            name="business_type"
                            type="radio"
                            value={type.value}
                            checked={formData.business_type === type.value}
                            onChange={handleInputChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <label htmlFor={type.value} className="ml-3 flex items-center cursor-pointer">
                            <Icon className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              </div>

              {/* Business Information */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                    Tên doanh nghiệp *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    id="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="VD: Khách sạn ABC"
                  />
                </div>

                <div>
                  <label htmlFor="business_phone" className="block text-sm font-medium text-gray-700">
                    Số điện thoại *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="business_phone"
                      id="business_phone"
                      required
                      value={formData.business_phone}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0901234567"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Địa chỉ kinh doanh *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="business_email" className="block text-sm font-medium text-gray-700">
                  Email kinh doanh *
                </label>
                <input
                  type="email"
                  name="business_email"
                  id="business_email"
                  required
                  value={formData.business_email}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="business@company.com"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website (nếu có)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobe className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://website-cua-ban.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Mô tả doanh nghiệp *
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Mô tả về doanh nghiệp, dịch vụ cung cấp, kinh nghiệm..."
                />
              </div>

              {/* Bank Account Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin thanh toán</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="account_number" className="block text-sm font-medium text-gray-700">
                      Số tài khoản ngân hàng *
                    </label>
                    <input
                      type="text"
                      name="account_number"
                      id="account_number"
                      required
                      value={formData.bank_account.account_number}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bank_account: { ...prev.bank_account, account_number: e.target.value }
                      }))}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="VD: 0123456789012"
                    />
                  </div>

                  <div>
                    <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700">
                      Tên ngân hàng *
                    </label>
                    <input
                      type="text"
                      name="bank_name"
                      id="bank_name"
                      required
                      value={formData.bank_account.bank_name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bank_account: { ...prev.bank_account, bank_name: e.target.value }
                      }))}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="VD: Vietcombank, Techcombank"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="account_holder" className="block text-sm font-medium text-gray-700">
                    Tên chủ tài khoản *
                  </label>
                  <input
                    type="text"
                    name="account_holder"
                    id="account_holder"
                    required
                    value={formData.bank_account.account_holder}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bank_account: { ...prev.bank_account, account_holder: e.target.value }
                    }))}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Tên chủ tài khoản như trên thẻ ngân hàng"
                  />
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="border-t border-gray-200 pt-6">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agree_terms"
                      name="agree_terms"
                      type="checkbox"
                      checked={formData.agree_terms}
                      onChange={(e) => setFormData(prev => ({ ...prev, agree_terms: e.target.checked }))}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agree_terms" className="font-medium text-gray-700">
                      Tôi đồng ý với các điều khoản và điều kiện *
                    </label>
                    <p className="text-gray-500">
                      Bằng cách đăng ký, bạn đồng ý tuân thủ{' '}
                      <button type="button" className="text-indigo-600 hover:text-indigo-500 underline bg-transparent border-0 p-0">
                        điều khoản dịch vụ
                      </button>{' '}
                      và{' '}
                      <button type="button" className="text-indigo-600 hover:text-indigo-500 underline bg-transparent border-0 p-0">
                        chính sách bảo mật
                      </button>{' '}
                      của Tripook.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <div className="flex justify-end">
                  <Link
                    to="/"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                  >
                    Hủy bỏ
                  </Link>
                  <button
                    type="submit"
                    disabled={loading || !formData.agree_terms}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang gửi...' : 'Gửi đăng ký'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeProvider;