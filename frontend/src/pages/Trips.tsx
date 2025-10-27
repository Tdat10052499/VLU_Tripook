import React from 'react';
import Header from '../components/Header';

const Trips: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Trips</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Trips page coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Trips;