import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { token, user } = response.data;
        
        // Store token in cookies
        Cookies.set('auth_token', token, { expires: 7 }); // 7 days
        
        setUser(user);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await authAPI.register(name, email, password);
      
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