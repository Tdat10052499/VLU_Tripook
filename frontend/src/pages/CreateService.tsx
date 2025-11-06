import React, { useState } from 'react';
import { 
  FaSave, 
  FaTimes,
  FaTrash,
  FaUpload,
  FaMapMarkerAlt,
  FaDollarSign,
  FaStar,
  FaWifi,
  FaCar,
  FaSwimmingPool,
  FaUtensils,
  FaImage
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import providerApi from '../services/providerApi';

interface ServiceFormData {
  name: string;
  service_type: 'accommodation' | 'tour' | 'transportation';
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  pricing: {
    base_price: number;
    currency: string;
    pricing_type: 'per_night' | 'per_person' | 'per_trip' | 'per_hour';
  };
  capacity: {
    min_guests: number;
    max_guests: number;
  };
  amenities: string[];
  images: File[];
  availability: {
    check_in_time: string;
    check_out_time: string;
    cancellation_policy: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  is_active: boolean;
}

const CreateService: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    service_type: 'accommodation',
    description: '',
    category: '',
    location: {
      address: '',
      city: '',
      country: 'Vietnam',
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    pricing: {
      base_price: 0,
      currency: 'VND',
      pricing_type: 'per_night'
    },
    capacity: {
      min_guests: 1,
      max_guests: 2
    },
    amenities: [],
    images: [],
    availability: {
      check_in_time: '14:00',
      check_out_time: '12:00',
      cancellation_policy: 'Miễn phí hủy trong 24h'
    },
    contact: {
      phone: '',
      email: ''
    },
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const serviceTypes = [
    { value: 'accommodation', label: 'Lưu trú', icon: '🏨' },
    { value: 'tour', label: 'Tour du lịch', icon: '✈️' },
    { value: 'transportation', label: 'Vận chuyển', icon: '🚗' }
  ];

  const pricingTypes = {
    accommodation: [
      { value: 'per_night', label: 'Mỗi đêm' },
      { value: 'per_person', label: 'Mỗi người' }
    ],
    tour: [
      { value: 'per_person', label: 'Mỗi người' },
      { value: 'per_trip', label: 'Trọn tour' }
    ],
    transportation: [
      { value: 'per_trip', label: 'Mỗi chuyến' },
      { value: 'per_hour', label: 'Mỗi giờ' },
      { value: 'per_person', label: 'Mỗi người' }
    ]
  };

  const commonAmenities = [
    { value: 'wifi', label: 'Wifi miễn phí', icon: 'FaWifi', IconComponent: FaWifi },
    { value: 'parking', label: 'Chỗ đỗ xe', icon: 'FaCar', IconComponent: FaCar },
    { value: 'pool', label: 'Bể bơi', icon: 'FaSwimmingPool', IconComponent: FaSwimmingPool },
    { value: 'restaurant', label: 'Nhà hàng', icon: 'FaUtensils', IconComponent: FaUtensils },
    { value: 'breakfast', label: 'Ăn sáng', icon: '🍳' },
    { value: 'ac', label: 'Điều hòa', icon: '❄️' },
    { value: 'tv', label: 'Tivi', icon: '📺' },
    { value: 'balcony', label: 'Ban công', icon: '🏞️' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => {
        const parentObj = prev[parent as keyof typeof prev] as any;
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: grandchild ? {
              ...parentObj[child],
              [grandchild]: type === 'number' ? parseFloat(value) || 0 : value
            } : type === 'number' ? parseFloat(value) || 0 : value
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               value
      }));
    }
    setError('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
      
      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append form fields
      submitData.append('service_data', JSON.stringify({
        ...formData,
        images: undefined // Remove images from JSON
      }));
      
      // Append image files
      formData.images.forEach((image, index) => {
        submitData.append(`images`, image);
      });

      const response = await providerApi.createService(submitData);
      if (response.success) {
        navigate('/provider/services');
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tạo dịch vụ');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Không thể tạo dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tạo dịch vụ mới</h1>
              <p className="text-sm text-gray-600 mt-1">Thêm dịch vụ mới để khách hàng có thể đặt chỗ</p>
            </div>
            <Link
              to="/provider/services"
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FaTimes className="mr-2 h-4 w-4" />
              Hủy
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Service Type Selection */}
          <div>
            <label className="text-base font-medium text-gray-900 block mb-4">
              Loại dịch vụ *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {serviceTypes.map((type) => (
                <div key={type.value} className="relative">
                  <input
                    type="radio"
                    id={type.value}
                    name="service_type"
                    value={type.value}
                    checked={formData.service_type === type.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor={type.value}
                    className={`block w-full p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.service_type === type.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-medium text-gray-900">{type.label}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Tên dịch vụ *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="VD: Khách sạn Hạ Long View"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Danh mục *
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="VD: Khách sạn 4 sao, Tour phiêu lưu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Mô tả chi tiết *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mô tả chi tiết về dịch vụ, tiện ích, vị trí..."
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaMapMarkerAlt className="mr-2 h-5 w-5 text-gray-600" />
              Địa điểm
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location.address" className="block text-sm font-medium text-gray-700">
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  name="location.address"
                  required
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Số nhà, đường, phường"
                />
              </div>

              <div>
                <label htmlFor="location.city" className="block text-sm font-medium text-gray-700">
                  Thành phố *
                </label>
                <input
                  type="text"
                  name="location.city"
                  required
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="VD: Hạ Long, Hà Nội, TP.HCM"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaDollarSign className="mr-2 h-5 w-5 text-gray-600" />
              Giá cả
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="pricing.base_price" className="block text-sm font-medium text-gray-700">
                  Giá cơ bản *
                </label>
                <input
                  type="number"
                  name="pricing.base_price"
                  required
                  min="0"
                  value={formData.pricing.base_price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="500000"
                />
              </div>

              <div>
                <label htmlFor="pricing.pricing_type" className="block text-sm font-medium text-gray-700">
                  Đơn vị tính *
                </label>
                <select
                  name="pricing.pricing_type"
                  value={formData.pricing.pricing_type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {pricingTypes[formData.service_type].map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="pricing.currency" className="block text-sm font-medium text-gray-700">
                  Tiền tệ
                </label>
                <select
                  name="pricing.currency"
                  value={formData.pricing.currency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Sức chứa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="capacity.min_guests" className="block text-sm font-medium text-gray-700">
                  Số khách tối thiểu
                </label>
                <input
                  type="number"
                  name="capacity.min_guests"
                  min="1"
                  value={formData.capacity.min_guests}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="capacity.max_guests" className="block text-sm font-medium text-gray-700">
                  Số khách tối đa *
                </label>
                <input
                  type="number"
                  name="capacity.max_guests"
                  min="1"
                  required
                  value={formData.capacity.max_guests}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaStar className="mr-2 h-5 w-5 text-gray-600" />
              Tiện ích
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {commonAmenities.map((amenity) => {
                const IconComponent = amenity.IconComponent;
                return (
                  <div key={amenity.value} className="relative">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity.value}`}
                      checked={formData.amenities.includes(amenity.value)}
                      onChange={() => handleAmenityToggle(amenity.value)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`amenity-${amenity.value}`}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.amenities.includes(amenity.value)
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {IconComponent ? (
                        <IconComponent className="mr-2 h-4 w-4" />
                      ) : (
                        <span className="mr-2 text-lg">{amenity.icon}</span>
                      )}
                      <span className="text-sm">{amenity.label}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaImage className="mr-2 h-5 w-5 text-gray-600" />
              Hình ảnh
            </h3>
            
            <div>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click để upload</span> hoặc kéo thả
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB)</p>
                </div>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Thông tin liên hệ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0901234567"
                />
              </div>

              <div>
                <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="contact@service.com"
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Kích hoạt dịch vụ ngay sau khi tạo
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              to="/provider/services"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave className="mr-2 h-4 w-4" />
              {loading ? 'Đang tạo...' : 'Tạo dịch vụ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;