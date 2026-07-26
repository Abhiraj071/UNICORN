import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const AuthContext = createContext();

// Create configured axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/api/')) {
    config.url = config.url.replace(/^\/api/, '');
  }
  const token = localStorage.getItem('unicorn_user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check if URL contains token query param (e.g. from Google OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');

      if (urlToken) {
        localStorage.setItem('unicorn_user_token', urlToken);
        // Clean up token from URL without refresh
        urlParams.delete('token');
        const cleanSearch = urlParams.toString();
        const newUrl = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : '') + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      }

      const token = localStorage.getItem('unicorn_user_token');

      try {
        const { data } = await api.get('/auth/profile', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setUser(data);
      } catch (err) {
        // If token invalid, clear it
        localStorage.removeItem('unicorn_user_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();

    // Keep-alive ping every 14 minutes to prevent Render free tier cold starts
    const keepAlive = setInterval(() => {
      api.get('/health').catch(() => {});
    }, 14 * 60 * 1000);

    return () => clearInterval(keepAlive);
  }, []);

  const login = async (emailOrPhone, password) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { emailOrPhone, password });
      if (data.token) {
        localStorage.setItem('unicorn_user_token', data.token);
      }
      setUser(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      
      const customError = new Error(message);
      if (err.response?.data?.unverified) {
        customError.unverified = true;
        customError.email = err.response.data.email;
        customError.otp = err.response.data.otp;
      }
      throw customError;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
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
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('unicorn_user_token');
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    setError(null);
    try {
      const { data } = await api.put('/auth/profile', userData);
      if (data.token) {
        localStorage.setItem('unicorn_user_token', data.token);
      }
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
      if (data.token) {
        localStorage.setItem('unicorn_user_token', data.token);
      }
      setUser(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const forgotPasswordSendOtp = async (phoneOrEmail) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/forgot-password/send', { phoneOrEmail });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send verification code.';
      setError(message);
      throw new Error(message);
    }
  };

  const forgotPasswordReset = async (phoneOrEmail, otp, newPassword) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/forgot-password/reset', { phoneOrEmail, otp, newPassword });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password.';
      setError(message);
      throw new Error(message);
    }
  };

  const verifyRegisterOtp = async (email, otp) => {
    setError(null);
    try {
      const { data } = await api.post('/auth/register/verify', { email, otp });
      if (data.token) {
        localStorage.setItem('unicorn_user_token', data.token);
      }
      setUser(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Email verification failed.';
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
      forgotPasswordSendOtp,
      forgotPasswordReset,
      verifyRegisterOtp,
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
