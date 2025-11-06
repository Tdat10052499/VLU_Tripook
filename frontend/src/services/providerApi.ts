import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const providerAPI = axios.create({
  baseURL: `${API_BASE_URL}/provider`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
providerAPI.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
providerAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      Cookies.remove('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface BecomeProviderData {
  company_name: string;
  business_type: 'hotel' | 'tour' | 'transport';
  description: string;
  address: string;
  business_phone: string;
  business_email: string;
  website?: string;
  bank_account?: {
    account_number: string;
    bank_name: string;
    account_holder: string;
  };
  vnpay_info?: {
    merchant_id: string;
  };
}

export interface UpdateProviderData {
  name?: string;
  phone?: string;
  address?: string;
  provider_info?: {
    company_name?: string;
    description?: string;
    business_phone?: string;
    business_email?: string;
    website?: string;
    bank_account?: {
      account_number: string;
      bank_name: string;
      account_holder: string;
    };
  };
}

export interface DashboardStats {
  total_services: number;
  total_bookings: number;
  recent_bookings: number;
  provider_since: string;
  account_status: string;
}

export const providerService = {
  // Become a provider
  becomeProvider: async (data: BecomeProviderData) => {
    try {
      const response = await providerAPI.post('/become-provider', data);
      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to register as provider'
      };
    }
  },

  // Get provider profile
  getProfile: async () => {
    try {
      const response = await providerAPI.get('/profile');
      return {
        success: true,
        data: response.data.provider
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to get provider profile'
      };
    }
  },

  // Update provider profile
  updateProfile: async (data: UpdateProviderData) => {
    try {
      const response = await providerAPI.put('/profile', data);
      return {
        success: true,
        data: response.data.provider,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to update profile'
      };
    }
  },

  // Get dashboard statistics
  getDashboard: async (): Promise<{ success: boolean; data?: DashboardStats; message?: string }> => {
    try {
      const response = await providerAPI.get('/dashboard');
      return {
        success: true,
        data: response.data.dashboard
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to get dashboard data'
      };
    }
  },

  // Get services
  getServices: async () => {
    try {
      const response = await providerAPI.get('/services');
      return {
        success: true,
        data: response.data.services
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to get services'
      };
    }
  },

  // Update service
  updateService: async (serviceId: string, data: any) => {
    try {
      const response = await providerAPI.put(`/services/${serviceId}`, data);
      return {
        success: true,
        data: response.data.service
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to update service'
      };
    }
  },

  // Delete service
  deleteService: async (serviceId: string) => {
    try {
      const response = await providerAPI.delete(`/services/${serviceId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to delete service'
      };
    }
  },

  // Get bookings
  getBookings: async () => {
    try {
      const response = await providerAPI.get('/bookings');
      return {
        success: true,
        data: response.data.bookings
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to get bookings'
      };
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId: string, status: string) => {
    try {
      const response = await providerAPI.put(`/bookings/${bookingId}/status`, { status });
      return {
        success: true,
        data: response.data.booking
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to update booking status'
      };
    }
  },

  // Create service
  createService: async (serviceData: FormData) => {
    try {
      const response = await providerAPI.post('/services', serviceData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        success: true,
        data: response.data.service
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to create service'
      };
    }
  }
};

export default providerService;