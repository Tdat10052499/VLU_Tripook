import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import Cookies from 'js-cookie';

interface ProviderInfo {
  company_name: string;
  business_type: 'hotel' | 'tour' | 'transport';
  description: string;
  address: string;
  business_phone: string;
  business_email: string;
  website: string;
  bank_account: {
    account_number: string;
    bank_name: string;
    account_holder: string;
  };
  vnpay_info: {
    merchant_id: string;
  };
  approved_at: string;
  is_active: boolean;
}

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  picture?: string;
  is_verified: boolean;
  role: 'user' | 'provider' | 'admin';
  provider_info?: ProviderInfo;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginIdentifier: string, password: string, rememberMe?: boolean, recaptchaToken?: string) => Promise<void>;
  register: (userData: any, recaptchaToken?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isProvider: () => boolean;
  isActiveProvider: () => boolean;
  isAdmin: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  checkAuth: async () => {},
  refreshUser: async () => {},
  isProvider: () => false,
  isActiveProvider: () => false,
  isAdmin: () => false
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (loginIdentifier: string, password: string, rememberMe: boolean = false, recaptchaToken?: string): Promise<void> => {
    try {
      // Use simple login endpoint without reCAPTCHA
      const response = await authAPI.simpleLogin(loginIdentifier, password, rememberMe);
      
      if (response.success) {
        const { token, user, remember_me } = response.data;
        
        // Store token in cookies with appropriate expiration
        const expirationDays = remember_me ? 30 : 1;
        Cookies.set('auth_token', token, { expires: expirationDays });
        
        setUser(user);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error details:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (userData: any, recaptchaToken?: string): Promise<void> => {
    try {
      const response = await authAPI.register(userData, recaptchaToken);
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  const logout = (): void => {
    Cookies.remove('auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuth = async (): Promise<void> => {
    try {
      const token = Cookies.get('auth_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await authAPI.getProfile();
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        // Token might be invalid, remove it
        Cookies.remove('auth_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Token might be invalid, remove it
      Cookies.remove('auth_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const token = Cookies.get('auth_token');
      
      if (!token) {
        return;
      }

      const response = await authAPI.getProfile();
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Helper functions for role checking
  const isProvider = (): boolean => {
    return user?.role === 'provider';
  };

  const isActiveProvider = (): boolean => {
    return user?.role === 'provider' && user?.provider_info?.is_active === true;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    refreshUser,
    isProvider,
    isActiveProvider,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};