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
import ProviderLayout from './components/provider/ProviderLayout';
import ProviderDashboardHome from './pages/ProviderDashboardHome';
import ProviderServicesHub from './pages/ProviderServicesHub';
import ProviderBookings from './pages/ProviderBookings';
import ProviderProfile from './pages/ProviderProfile';
import ProviderSettings from './pages/ProviderSettings';
import ProviderNotifications from './pages/ProviderNotifications';
import CreateService from './pages/CreateService';
import Login from './components/auth/Login';
// import Register from './components/auth/Register'; // Not used - using SimpleRegisterWrapper instead
import SimpleRegisterWrapper from './components/auth/SimpleRegisterWrapper';
import RegistrationWizard from './components/auth/RegistrationWizard';
import ProviderPendingWrapper from './components/auth/ProviderPendingWrapper';
import ProviderApprovedSuccess from './components/auth/ProviderApprovedSuccess';
import AdminProviderApproval from './pages/AdminProviderApproval';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProviders from './pages/AdminProviders';
import AdminUsers from './pages/AdminUsers';
import AdminServices from './pages/AdminServices';
import AdminTrips from './pages/AdminTrips';
import AdminTransactions from './pages/AdminTransactions';
import DesignSystemShowcase from './components/DesignSystemShowcase';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <main className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/design-system" element={<DesignSystemShowcase />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/detail/:serviceId" element={<ServiceDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<SimpleRegisterWrapper />} />
              <Route path="/auth/register-wizard" element={<RegistrationWizard />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
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
                    <ProviderLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ProviderDashboardHome />} />
                <Route path="services" element={<ProviderServicesHub />} />
                <Route path="services/create" element={<CreateService />} />
                <Route path="services/edit/:serviceId" element={<CreateService />} />
                <Route path="bookings" element={<ProviderBookings />} />
                <Route path="profile" element={<ProviderProfile />} />
                <Route path="settings" element={<ProviderSettings />} />
                <Route path="notifications" element={<ProviderNotifications />} />
              </Route>
              
              {/* Provider Status & Admin Routes */}
              <Route path="/provider/pending" element={<ProviderPendingWrapper />} />
              <Route path="/provider/approved" element={<ProviderApprovedSuccess />} />
              
              {/* Admin Dashboard Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="providers" element={<AdminProviders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="trips" element={<AdminTrips />} />
                <Route path="transactions" element={<AdminTransactions />} />
              </Route>
              
              {/* Legacy admin route - redirect to new admin dashboard */}
              <Route 
                path="/admin/providers-old" 
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