import React, { useEffect, useState, useCallback } from 'react';
import { getTrips } from '../services/adminApi';

interface Trip {
  _id: string;
  name: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

const AdminTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);

  const loadTrips = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTrips(page, 20);
      if (response.success) {
        setTrips(response.trips || []);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading trips...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Trips</h1>
        <p className="text-gray-600 mt-2">View all trips in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Trip Name</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Destination</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Start Date</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">End Date</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Status</th>
              <th className="text-left py-4 px-6 text-gray-700 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-semibold text-gray-800">{trip.name}</td>
                <td className="py-4 px-6">{trip.destination}</td>
                <td className="py-4 px-6 text-gray-600">
                  {trip.startDate ? new Date(trip.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {trip.endDate ? new Date(trip.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    trip.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : trip.status === 'planning'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {trip.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {new Date(trip.createdAt).toLocaleDateString('vi-VN')}
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

export default AdminTrips;
