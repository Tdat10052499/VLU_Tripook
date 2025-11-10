import React, { useState, useRef } from 'react';
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
  FaImage,
  FaEye,
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaGripVertical,
  FaExclamationCircle
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
  const descriptionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Tên dịch vụ là bắt buộc';
    if (!formData.category.trim()) errors.category = 'Danh mục là bắt buộc';
    if (!formData.description.trim()) errors.description = 'Mô tả là bắt buộc';
    if (formData.description.length < 50) errors.description = 'Mô tả phải có ít nhất 50 ký tự';
    if (!formData.location.address.trim()) errors.address = 'Địa chỉ là bắt buộc';
    if (!formData.location.city.trim()) errors.city = 'Thành phố là bắt buộc';
    if (formData.pricing.base_price <= 0) errors.price = 'Giá phải lớn hơn 0';
    if (formData.capacity.max_guests < formData.capacity.min_guests) {
      errors.capacity = 'Số khách tối đa phải lớn hơn số khách tối thiểu';
    }
    if (formData.images.length === 0) errors.images = 'Vui lòng thêm ít nhất 1 hình ảnh';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Clear validation error for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    
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
    
    // Validate file size (max 10MB per file)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} quá lớn. Kích thước tối đa là 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
      
      // Create preview URLs
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...newPreviews]);
      
      // Clear validation error
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers for image reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...formData.images];
    const newPreviews = [...imagePreview];
    
    const draggedImage = newImages[draggedIndex];
    const draggedPreview = newPreviews[draggedIndex];

    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    newPreviews.splice(draggedIndex, 1);
    newPreviews.splice(index, 0, draggedPreview);

    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreview(newPreviews);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Rich text editor functions
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    descriptionRef.current?.focus();
  };

  const handleDescriptionChange = () => {
    if (descriptionRef.current) {
      const content = descriptionRef.current.innerHTML;
      setFormData(prev => ({ ...prev, description: content }));
      
      // Clear validation error
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.description;
        return newErrors;
      });
    }
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
    
    // Validate form
    if (!validateForm()) {
      setError('Vui lòng kiểm tra lại các trường thông tin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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
      formData.images.forEach((image) => {
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
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
              <FaExclamationCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {Object.keys(validationErrors).length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start">
                <FaExclamationCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-2">Vui lòng kiểm tra các trường sau:</p>
                  <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                    {Object.values(validationErrors).map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
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
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="VD: Khách sạn Hạ Long View"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
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
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    validationErrors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="VD: Khách sạn 4 sao, Tour phiêu lưu"
                />
                {validationErrors.category && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả chi tiết * (tối thiểu 50 ký tự)
              </label>
              
              {/* Rich Text Editor Toolbar */}
              <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 border border-gray-300 rounded-t-md">
                <button
                  type="button"
                  onClick={() => applyFormat('bold')}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="Bold"
                >
                  <FaBold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('italic')}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="Italic"
                >
                  <FaItalic className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  type="button"
                  onClick={() => applyFormat('insertUnorderedList')}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="Bullet List"
                >
                  <FaListUl className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('insertOrderedList')}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="Numbered List"
                >
                  <FaListOl className="h-4 w-4" />
                </button>
              </div>

              {/* Editable Content Area */}
              <div
                ref={descriptionRef}
                contentEditable
                onInput={handleDescriptionChange}
                className={`min-h-[150px] px-3 py-2 border border-t-0 rounded-b-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                style={{ whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: formData.description || '<p class="text-gray-400">Mô tả chi tiết về dịch vụ, tiện ích, vị trí...</p>' }}
              />
              
              <div className="mt-1 flex justify-between items-center">
                {validationErrors.description ? (
                  <p className="text-sm text-red-600">{validationErrors.description}</p>
                ) : (
                  <p className="text-sm text-gray-500">{formData.description.replace(/<[^>]*>/g, '').length} / 50 ký tự tối thiểu</p>
                )}
              </div>
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FaImage className="mr-2 h-5 w-5 text-gray-600" />
                Hình ảnh * ({formData.images.length} ảnh)
              </h3>
              {formData.images.length > 0 && (
                <p className="text-sm text-gray-500">Kéo thả để sắp xếp lại</p>
              )}
            </div>
            
            <div>
              <input
                ref={fileInputRef}
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
              <label
                htmlFor="images"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  validationErrors.images 
                    ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className={`w-8 h-8 mb-4 ${validationErrors.images ? 'text-red-500' : 'text-gray-500'}`} />
                  <p className={`mb-2 text-sm ${validationErrors.images ? 'text-red-600' : 'text-gray-500'}`}>
                    <span className="font-semibold">Click để upload</span> hoặc kéo thả
                  </p>
                  <p className={`text-xs ${validationErrors.images ? 'text-red-500' : 'text-gray-500'}`}>
                    PNG, JPG, GIF (MAX. 10MB mỗi ảnh)
                  </p>
                </div>
              </label>
              {validationErrors.images && (
                <p className="mt-2 text-sm text-red-600">{validationErrors.images}</p>
              )}
            </div>

            {/* Image Preview with Drag & Drop */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreview.map((preview, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
                  >
                    {/* Drag Handle */}
                    <div className="absolute top-1 left-1 p-1.5 bg-white bg-opacity-90 rounded shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaGripVertical className="w-3 h-3 text-gray-600" />
                    </div>
                    
                    {/* Image Badge */}
                    {index === 0 && (
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full z-10">
                        Ảnh chính
                      </div>
                    )}
                    
                    {/* Image */}
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-indigo-400 transition-colors"
                    />
                    
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute bottom-1 right-1 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      title="Xóa ảnh"
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
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center px-6 py-2 border border-indigo-600 rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaEye className="mr-2 h-4 w-4" />
              Xem trước
            </button>
            
            <div className="flex space-x-4">
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
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Preview Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Xem trước dịch vụ</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaTimes className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6 space-y-6">
              {/* Service Images Gallery */}
              {imagePreview.length > 0 && (
                <div className="space-y-4">
                  <img
                    src={imagePreview[0]}
                    alt="Main preview"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {imagePreview.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {imagePreview.slice(1, 5).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Preview ${idx + 2}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Service Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{formData.name || 'Tên dịch vụ'}</h1>
                  {formData.is_active ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Đang hoạt động
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      Chưa kích hoạt
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-600">{formData.category}</p>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-2">
                <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-900">{formData.location.address}</p>
                  <p className="text-gray-600">{formData.location.city}, {formData.location.country}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Giá từ</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {formData.pricing.base_price.toLocaleString('vi-VN')} {formData.pricing.currency}
                    </p>
                    <p className="text-sm text-gray-600">
                      {pricingTypes[formData.service_type].find(pt => pt.value === formData.pricing.pricing_type)?.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Sức chứa</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.capacity.min_guests} - {formData.capacity.max_guests} khách
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mô tả</h3>
                <div 
                  className="text-gray-700 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.description || '<p class="text-gray-400">Chưa có mô tả</p>' }}
                />
              </div>

              {/* Amenities */}
              {formData.amenities.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Tiện ích</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.amenities.map((amenityValue) => {
                      const amenity = commonAmenities.find(a => a.value === amenityValue);
                      if (!amenity) return null;
                      const IconComponent = amenity.IconComponent;
                      return (
                        <div key={amenityValue} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          {IconComponent ? (
                            <IconComponent className="h-5 w-5 text-indigo-600" />
                          ) : (
                            <span className="text-lg">{amenity.icon}</span>
                          )}
                          <span className="text-sm text-gray-700">{amenity.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Contact */}
              {(formData.contact.phone || formData.contact.email) && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Thông tin liên hệ</h3>
                  <div className="space-y-2">
                    {formData.contact.phone && (
                      <p className="text-gray-700">📞 {formData.contact.phone}</p>
                    )}
                    {formData.contact.email && (
                      <p className="text-gray-700">✉️ {formData.contact.email}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Preview Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Đóng xem trước
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateService;