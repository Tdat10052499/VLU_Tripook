import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Tripook
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your ultimate travel planning companion
        </p>
        
        {!isAuthenticated && (
          <Link
            to="/auth/login"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg text-lg inline-block"
          >
            Get Started
          </Link>
        )}
        
        {isAuthenticated && (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Ready to plan your next trip?</h2>
            <Link 
              to="/dashboard"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded inline-block"
            >
              Start Planning
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;