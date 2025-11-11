import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api/admin';

const getAuthHeaders = () => {
  const token = Cookies.get('auth_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// ==================== LOGIN STATISTICS ====================
export const getLoginStats = async (period: 'day' | 'month' | 'year' = 'day') => {
  const response = await axios.get(`${API_URL}/login-stats?period=${period}`, getAuthHeaders());
  return response.data;
};

// ==================== REGISTRATION STATISTICS ====================
export const getRegistrationStats = async (
  period: 'day' | 'month' | 'year' = 'day',
  role: 'user' | 'provider' | 'all' = 'all'
) => {
  const response = await axios.get(
    `${API_URL}/registration-stats?period=${period}&role=${role}`,
    getAuthHeaders()
  );
  return response.data;
};

// ==================== PROVIDER APPROVAL ====================
export const getPendingProviders = async () => {
  const response = await axios.get(`${API_URL}/pending-providers`, getAuthHeaders());
  return response.data;
};

export const approveProvider = async (providerId: string, approve: boolean, reason?: string) => {
  const response = await axios.post(
    `${API_URL}/approve-provider`,
    { providerId, approve, reason },
    getAuthHeaders()
  );
  return response.data;
};

export const getProviderStats = async () => {
  const response = await axios.get(`${API_URL}/provider-stats`, getAuthHeaders());
  return response.data;
};

export const getProviderDetail = async (providerId: string) => {
  const response = await axios.get(`${API_URL}/provider/${providerId}`, getAuthHeaders());
  return response.data;
};

// ==================== USER MANAGEMENT ====================
export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export const getUsers = async (params: GetUsersParams = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.role) queryParams.append('role', params.role);
  if (params.status) queryParams.append('status', params.status);
  if (params.search) queryParams.append('search', params.search);
  
  const response = await axios.get(
    `${API_URL}/users?${queryParams.toString()}`,
    getAuthHeaders()
  );
  return response.data;
};

export const getUserDetail = async (userId: string) => {
  const response = await axios.get(`${API_URL}/users/${userId}`, getAuthHeaders());
  return response.data;
};

export const updateUser = async (userId: string, data: any) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, data, getAuthHeaders());
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`, getAuthHeaders());
  return response.data;
};

export const blockUser = async (userId: string, block: boolean, reason?: string) => {
  const response = await axios.post(
    `${API_URL}/users/${userId}/block`,
    { block, reason },
    getAuthHeaders()
  );
  return response.data;
};

// ==================== SERVICES & TRIPS ====================
export const getServices = async (page: number = 1, limit: number = 20, providerId?: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (providerId) queryParams.append('providerId', providerId);
  
  const response = await axios.get(
    `${API_URL}/services?${queryParams.toString()}`,
    getAuthHeaders()
  );
  return response.data;
};

export const getTrips = async (page: number = 1, limit: number = 20, userId?: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (userId) queryParams.append('userId', userId);
  
  const response = await axios.get(
    `${API_URL}/trips?${queryParams.toString()}`,
    getAuthHeaders()
  );
  return response.data;
};
