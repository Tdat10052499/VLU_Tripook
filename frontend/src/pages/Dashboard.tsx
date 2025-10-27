import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Please log in to access your dashboard</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">My Trips</h3>
          <p className="text-gray-600">No trips yet. Start planning your first adventure!</p>
          <button className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded">
            Create Trip
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Bookmarks</h3>
          <p className="text-gray-600">Save your favorite destinations and activities.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Profile</h3>
          <p className="text-gray-600">Manage your account settings and preferences.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;