import React, { useState, useEffect, useContext } from 'react';
import { 
  FaSave, 
  FaUser, 
  FaBuilding, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe,
  FaCreditCard,
  FaEdit,
  FaCheck
} from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import providerApi from '../services/providerApi';
import type { UpdateProviderData } from '../services/providerApi';

const ProviderProfile: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState<UpdateProviderData>({
    name: '',
    phone: '',
    provider_info: {
      company_name: '',
      description: '',
      business_phone: '',
      business_email: '',
      website: '',
      bank_account: {
        account_number: '',
        bank_name: '',
        account_holder: ''
      }
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        provider_info: {
          company_name: user.provider_info?.company_name || '',
          description: user.provider_info?.description || '',
          business_phone: user.provider_info?.business_phone || '',
          business_email: user.provider_info?.business_email || '',
          website: user.provider_info?.website || '',
          bank_account: {
            account_number: user.provider_info?.bank_account?.account_number || '',
            bank_name: user.provider_info?.bank_account?.bank_name || '',
            account_holder: user.provider_info?.bank_account?.account_holder || ''
          }
        }
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      
      if (parent === 'provider_info') {
        if (grandchild && child === 'bank_account') {
          // Handle nested bank_account fields
          setFormData(prev => ({
            ...prev,
            provider_info: {
              ...prev.provider_info!,
              bank_account: {
                ...prev.provider_info!.bank_account!,
                [grandchild]: value
              }
            }
          }));
        } else {
          // Handle provider_info fields
          setFormData(prev => ({
            ...prev,
            provider_info: {
              ...prev.provider_info!,
              [child]: value
            }
          }));
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await providerApi.updateProfile(formData);
      if (response.success) {
        setSuccess('Cập nhật thông tin thành công!');
        // Clear editing states
        setIsEditing({});
      } else {
        setError(response.message || 'Có lỗi xảy ra');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = (field: string) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getBusinessTypeLabel = (type: string) => {
    const labels = {
      hotel: 'Khách sạn / Chỗ ở',
      tour: 'Tour / Du lịch', 
      transport: 'Vận chuyển'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const renderEditableField = (
    label: string,
    name: string,
    value: string,
    icon: React.ElementType,
    type: 'input' | 'textarea' = 'input',
    placeholder?: string
  ) => {
    const Icon = icon;
    const isEditingField = isEditing[name];
    
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">{label}</label>
          </div>
          <button
            type="button"
            onClick={() => toggleEdit(name)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {isEditingField ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>
        
        {isEditingField ? (
          <div className="space-y-2">
            {type === 'textarea' ? (
              <textarea
                name={name}
                value={value}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={placeholder}
                rows={3}
              />
            ) : (
              <input
                type="text"
                name={name}
                value={value}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={placeholder}
              />
            )}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => toggleEdit(name)}
                className="flex items-center px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                <FaCheck className="mr-1 h-3 w-3" />
                Xong
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
            {value || <span className="text-gray-500 italic">Chưa có thông tin</span>}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-indigo-600">
              {user?.name?.charAt(0)?.toUpperCase() || 'P'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.provider_info?.company_name || user?.name}</h1>
            <p className="text-indigo-100">
              {user?.provider_info?.business_type && getBusinessTypeLabel(user.provider_info.business_type)}
            </p>
            <p className="text-indigo-100 text-sm">
              Provider ID: {user?.email}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderEditableField('Họ và tên', 'name', formData.name || '', FaUser, 'input', 'Nhập họ và tên')}
            {renderEditableField('Số điện thoại', 'phone', formData.phone || '', FaPhone, 'input', 'Nhập số điện thoại')}
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin doanh nghiệp</h2>
          <div className="space-y-4">
            {renderEditableField('Tên công ty', 'provider_info.company_name', formData.provider_info?.company_name || '', FaBuilding, 'input', 'Nhập tên công ty')}
            {renderEditableField('Mô tả doanh nghiệp', 'provider_info.description', formData.provider_info?.description || '', FaEdit, 'textarea', 'Mô tả về doanh nghiệp và dịch vụ')}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderEditableField('Điện thoại kinh doanh', 'provider_info.business_phone', formData.provider_info?.business_phone || '', FaPhone, 'input', 'Số điện thoại doanh nghiệp')}
              {renderEditableField('Email kinh doanh', 'provider_info.business_email', formData.provider_info?.business_email || '', FaEnvelope, 'input', 'Email doanh nghiệp')}
            </div>
            
            {renderEditableField('Website', 'provider_info.website', formData.provider_info?.website || '', FaGlobe, 'input', 'https://website-cua-ban.com')}
          </div>
        </div>

        {/* Bank Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thanh toán</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderEditableField('Số tài khoản', 'provider_info.bank_account.account_number', formData.provider_info?.bank_account?.account_number || '', FaCreditCard, 'input', 'Số tài khoản ngân hàng')}
              {renderEditableField('Tên ngân hàng', 'provider_info.bank_account.bank_name', formData.provider_info?.bank_account?.bank_name || '', FaBuilding, 'input', 'Tên ngân hàng')}
            </div>
            {renderEditableField('Tên chủ tài khoản', 'provider_info.bank_account.account_holder', formData.provider_info?.bank_account?.account_holder || '', FaUser, 'input', 'Tên chủ tài khoản')}
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái tài khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {user?.provider_info?.is_active ? 'Hoạt động' : 'Chờ duyệt'}
              </div>
              <div className="text-sm text-gray-600">Trạng thái</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {user?.provider_info?.approved_at 
                  ? new Date(user.provider_info.approved_at).toLocaleDateString('vi-VN')
                  : 'N/A'
                }
              </div>
              <div className="text-sm text-gray-600">Ngày phê duyệt</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                Provider
              </div>
              <div className="text-sm text-gray-600">Loại tài khoản</div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || Object.values(isEditing).every(v => !v)}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave className="mr-2 h-4 w-4" />
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProviderProfile;