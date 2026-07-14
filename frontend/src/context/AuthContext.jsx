import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Create configured axios instance
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const updateProfile = async (userData) => {
    setError(null);
    try {
      const { data } = await api.put('/auth/profile', userData);
      setUser(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const sendOtp = async (phoneOrEmail) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/otp/send', { phoneOrEmail });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const verifyOtp = async (phoneOrEmail, otp) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/otp/verify', { phoneOrEmail, otp });
      setUser(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      updateProfile,
      sendOtp,
      verifyOtp,
      api
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
