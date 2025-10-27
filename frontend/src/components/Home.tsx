import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  FaPlane, 
  FaMapMarkedAlt, 
  FaUsers, 
  FaStar,
  FaArrowRight,
  FaSearch
} from 'react-icons/fa';
import Header from '../components/Header';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {isAuthenticated 
                ? `Welcome back, ${user?.name || user?.username || 'Traveler'}!` 
                : 'Your Adventure Awaits'
              }
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {isAuthenticated 
                ? 'Ready to plan your next amazing trip? Discover new destinations and create unforgettable memories.'
                : 'Discover amazing destinations, plan perfect trips, and create memories that last a lifetime with Tripook.'
              }
            </p>
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/trips/new"
                  className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  <FaPlane className="mr-2" />
                  Plan New Trip
                </Link>
                <Link
                  to="/trips"
                  className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  <FaMapMarkedAlt className="mr-2" />
                  View My Trips
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/auth/register"
                  className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  Get Started Free
                  <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/explore"
                  className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  <FaSearch className="mr-2" />
                  Explore Destinations
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Tripook?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to plan and manage amazing trips in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaMapMarkedAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Trip Planning</h3>
              <p className="text-gray-600">
                Plan your perfect trip with our intelligent recommendations and customizable itineraries.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collaborative Planning</h3>
              <p className="text-gray-600">
                Plan trips with friends and family. Share itineraries, vote on activities, and stay organized.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaStar className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Curated Experiences</h3>
              <p className="text-gray-600">
                Discover hidden gems and popular attractions with reviews from real travelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">10K+</div>
                <div className="text-gray-600">Happy Travelers</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">50K+</div>
                <div className="text-gray-600">Trips Planned</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">200+</div>
                <div className="text-gray-600">Destinations</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">4.9★</div>
                <div className="text-gray-600">User Rating</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-indigo-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of travelers who trust Tripook for their adventures
            </p>
            <Link
              to="/auth/register"
              className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
            >
              Sign Up Free Today
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold">Tripook</span>
            </div>
            <p className="text-gray-400">
              © 2025 Tripook. All rights reserved. Plan your perfect adventure with us.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;