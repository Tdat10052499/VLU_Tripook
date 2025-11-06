import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaDollarSign,
  FaStar
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import providerApi from '../services/providerApi';

interface Service {
  _id: string;
  name: string;
  service_type: 'accommodation' | 'tour' | 'transportation';
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
  };
  pricing: {
    base_price: number;
    currency: string;
  };
  images: string[];
  is_active: boolean;
  created_at: string;
}

const ProviderServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await providerApi.getServices();
      if (response.success) {
        setServices(response.data);
      }
    } catch (err: any) {
      setError('Không thể tải danh sách dịch vụ');
      console.error('Services error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = useCallback(() => {
    let filtered = services;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.location.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType && filterType !== 'all') {
      filtered = filtered.filter(service => service.service_type === filterType);
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, filterType]);

  useEffect(() => {
    filterServices();
  }, [filterServices]);

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        const response = await providerApi.deleteService(serviceId);
        if (response.success) {
          setServices(services.filter(s => s._id !== serviceId));
        }
      } catch (err: any) {
        setError('Không thể xóa dịch vụ');
      }
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const response = await providerApi.updateService(serviceId, { is_active: !currentStatus });
      if (response.success) {
        setServices(services.map(s => 
          s._id === serviceId ? { ...s, is_active: !currentStatus } : s
        ));
      }
    } catch (err: any) {
      setError('Không thể cập nhật trạng thái dịch vụ');
    }
  };

  const getServiceTypeLabel = (type: string) => {
    const labels = {
      accommodation: 'Lưu trú',
      tour: 'Tour du lịch',
      transportation: 'Vận chuyển'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getServiceTypeColor = (type: string) => {
    const colors = {
      accommodation: 'bg-blue-100 text-blue-800',
      tour: 'bg-green-100 text-green-800',
      transportation: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý dịch vụ</h1>
          <p className="text-gray-600">Quản lý tất cả dịch vụ của bạn</p>
        </div>
        <Link
          to="/provider/services/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Thêm dịch vụ mới
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Type filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tất cả loại dịch vụ</option>
              <option value="accommodation">Lưu trú</option>
              <option value="tour">Tour du lịch</option>
              <option value="transportation">Vận chuyển</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            Tổng: <span className="font-semibold ml-1">{filteredServices.length}</span> dịch vụ
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredServices.length === 0 ? (
          <div className="p-12 text-center">
            <FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dịch vụ nào</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Không tìm thấy dịch vụ với bộ lọc hiện tại'
                : 'Bạn chưa có dịch vụ nào. Hãy tạo dịch vụ đầu tiên!'
              }
            </p>
            <Link
              to="/provider/services/new"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Thêm dịch vụ mới
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <div key={service._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceTypeColor(service.service_type)}`}>
                        {getServiceTypeLabel(service.service_type)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.is_active ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1 h-3 w-3" />
                        {service.location.city}
                      </div>
                      <div className="flex items-center">
                        <FaDollarSign className="mr-1 h-3 w-3" />
                        {service.pricing.base_price.toLocaleString()} {service.pricing.currency}
                      </div>
                      <div className="flex items-center">
                        <FaStar className="mr-1 h-3 w-3 text-yellow-400" />
                        4.5 (23 đánh giá)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleServiceStatus(service._id, service.is_active)}
                      className={`p-2 rounded-md ${
                        service.is_active 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-green-600 hover:bg-green-50'
                      } transition-colors`}
                      title={service.is_active ? 'Tạm dừng' : 'Kích hoạt'}
                    >
                      <FaEye className="h-4 w-4" />
                    </button>

                    <Link
                      to={`/provider/services/${service._id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Chỉnh sửa"
                    >
                      <FaEdit className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Xóa"
                    >
                      <FaTrash className="h-4 w-4" />
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

export default ProviderServices;