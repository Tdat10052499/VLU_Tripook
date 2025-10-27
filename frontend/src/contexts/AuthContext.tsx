import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import Cookies from 'js-cookie';

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
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginIdentifier: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  checkAuth: async () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (loginIdentifier: string, password: string, rememberMe: boolean = false): Promise<void> => {
    try {
      const response = await authAPI.login(loginIdentifier, password, rememberMe);
      
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
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (userData: any): Promise<void> => {
    try {
      const response = await authAPI.register(userData);
      
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

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};