import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import Services from './components/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Trips from './pages/Trips';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderDashboardHome from './pages/ProviderDashboardHome';
import ProviderServices from './pages/ProviderServices';
import ProviderBookings from './pages/ProviderBookings';
import ProviderProfile from './pages/ProviderProfile';
import CreateService from './pages/CreateService';
import Login from './components/auth/Login';
// import Register from './components/auth/Register'; // Not used - using SimpleRegisterWrapper instead
import SimpleRegisterWrapper from './components/auth/SimpleRegisterWrapper';
import RegistrationWizard from './components/auth/RegistrationWizard';
import ProviderPendingWrapper from './components/auth/ProviderPendingWrapper';
import AdminProviderApproval from './pages/AdminProviderApproval';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <main className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/detail/:serviceId" element={<ServiceDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<SimpleRegisterWrapper />} />
              <Route path="/auth/register-wizard" element={<RegistrationWizard />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/trips" 
                element={
                  <ProtectedRoute>
                    <Trips />
                  </ProtectedRoute>
                } 
              />

              {/* Provider Dashboard Routes */}
              <Route 
                path="/provider" 
                element={
                  <ProtectedRoute>
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<ProviderDashboardHome />} />
                <Route path="services" element={<ProviderServices />} />
                <Route path="services/create" element={<CreateService />} />
                <Route path="bookings" element={<ProviderBookings />} />
                <Route path="profile" element={<ProviderProfile />} />
              </Route>
              
              {/* Provider Status & Admin Routes */}
              <Route path="/provider/pending" element={<ProviderPendingWrapper />} />
              
              <Route 
                path="/admin/providers" 
                element={
                  <ProtectedRoute>
                    <AdminProviderApproval />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;