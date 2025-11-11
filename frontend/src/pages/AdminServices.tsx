import React, { useEffect, useState, useCallback } from 'react';
import { getServices } from '../services/adminApi';

interface Service {
  _id: string;
  name: string;
  providerId: string;
  category: string;
  price: number;
  status: string;
  createdAt: string;
}

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getServices(page, 20);
      if (response.success) {
        setServices(response.services || []);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading services...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Services</h1>
        <p className="text-gray-600 mt-2">View all services in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Service Name</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Category</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Price</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Status</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-semibold text-gray-800">{service.name}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {service.category}
                  </span>
                </td>
                <td className="py-4 px-6 text-green-600 font-semibold">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(service.price)}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    service.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {service.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {new Date(service.createdAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
