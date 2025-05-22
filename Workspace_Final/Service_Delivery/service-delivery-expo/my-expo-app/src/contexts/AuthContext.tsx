import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { AUTH_BASE_URL } from '../utils/constants';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored token on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const userData = await AsyncStorage.getItem('user_data'); // Thêm dòng này

        if (token) {
          // Set auth header for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Khôi phục user từ local storage nếu có
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // Nếu không có userData, lấy từ API
            const response = await axios.get(`${AUTH_BASE_URL}/account/profile`);

            // Verify if user is a deliverer
            if (response.data?.data?.role?.name === 'DELIVERER') {
              setUser(response.data.data);
              setIsAuthenticated(true);
              // Lưu vào storage để lần sau dùng
              await AsyncStorage.setItem('user_data', JSON.stringify(response.data.data));
            } else {
              // Not a deliverer, log them out
              await AsyncStorage.removeItem('access_token');
              Alert.alert('Unauthorized', 'This app is only for delivery personnel');
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        await AsyncStorage.removeItem('access_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Authenticate user
      const response = await axios.post(`${AUTH_BASE_URL}/account/auth/login`, {
        username: email,
        password,
      });
      console.log('Login response:', response);

      const { access_token, user } = response.data.data;

      // Check if user is a deliverer
      if (user?.role?.name !== 'DELIVERER') {
        throw new Error('This app is only for delivery personnel');
      }

      // Store token and user data
      await AsyncStorage.setItem('access_token', access_token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user)); // Thêm dòng này
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      setUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      Alert.alert('Login Error', message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Call logout endpoint
      await axios.post(`${AUTH_BASE_URL}/account/auth/logout`);

      // Clear storage and state
      await AsyncStorage.removeItem('access_token');
      delete axios.defaults.headers.common['Authorization'];

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, clear local state
      await AsyncStorage.removeItem('access_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
