import axios, { InternalAxiosRequestConfig } from 'axios';
import { Trip, Activity, ApiResponse } from '../types';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      Cookies.remove('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const tripService = {
  getTrips: async (): Promise<ApiResponse<Trip[]>> => {
    const response = await api.get('/trips');
    return response.data;
  },

  getTrip: async (id: string): Promise<ApiResponse<Trip>> => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  createTrip: async (tripData: Partial<Trip>): Promise<ApiResponse<Trip>> => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },

  updateTrip: async (id: string, tripData: Partial<Trip>): Promise<ApiResponse<Trip>> => {
    const response = await api.put(`/trips/${id}`, tripData);
    return response.data;
  },

  deleteTrip: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },
};

export const activityService = {
  getActivities: async (tripId: string): Promise<ApiResponse<Activity[]>> => {
    const response = await api.get(`/trips/${tripId}/activities`);
    return response.data;
  },

  createActivity: async (tripId: string, activityData: Partial<Activity>): Promise<ApiResponse<Activity>> => {
    const response = await api.post(`/trips/${tripId}/activities`, activityData);
    return response.data;
  },

  updateActivity: async (tripId: string, activityId: string, activityData: Partial<Activity>): Promise<ApiResponse<Activity>> => {
    const response = await api.put(`/trips/${tripId}/activities/${activityId}`, activityData);
    return response.data;
  },

  deleteActivity: async (tripId: string, activityId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/trips/${tripId}/activities/${activityId}`);
    return response.data;
  },
};

// Authentication API
export const authAPI = {
  login: async (loginIdentifier: string, password: string, rememberMe: boolean = false, recaptchaToken?: string) => {
    const response = await api.post('/auth/login', { 
      login: loginIdentifier, 
      password, 
      remember_me: rememberMe,
      recaptcha_token: recaptchaToken
    });
    return response.data;
  },

  simpleLogin: async (loginIdentifier: string, password: string, rememberMe: boolean = false) => {
    const response = await api.post('/auth/simple-login', { 
      login: loginIdentifier, 
      password, 
      remember_me: rememberMe
    });
    return response.data;
  },
  
  register: async (userData: any, recaptchaToken?: string) => {
    const requestData = {
      ...userData,
      recaptcha_token: recaptchaToken
    };
    const response = await api.post('/auth/register', requestData);
    return response.data;
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

export default api;