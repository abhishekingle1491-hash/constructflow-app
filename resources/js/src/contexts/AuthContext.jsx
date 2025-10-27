import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import the base axios library
import axiosClient from '../api/axiosClient.js'; // Ensure extension

// Get the API root URL. Fallback to the default.
const API_ROOT_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') 
  : 'http://api.constructflow.test';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // 1. THE FIX: Call the correct /sanctum/csrf-cookie endpoint at the ROOT domain.
  // We use the base 'axios' import here, NOT 'axiosClient'.
  const csrf = () => axios.get(`${API_ROOT_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });

  // Fetches the currently authenticated user.
  const getUser = async () => {
    try {
      const { data } = await axiosClient.get('/user');
      setUser(data);
    } catch (error) {
      // If the request fails (e.g., 401), the user is not logged in.
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 2. THE FIX: The empty array [] ensures this runs ONLY ONCE.
  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, []); // <-- This empty array is critical

  // This function handles all errors robustly
  const handleAuthRequest = async (requestFunc) => {
    await csrf(); // Get CSRF cookie before making the state-changing request
    try {
      await requestFunc();
      await getUser(); // Fetch user data to update state on success.
      setErrors({}); // Clear any old errors.
    } catch (error) {
      if (error.response) {
        // The server responded with a status code
        switch (error.response.status) {
          case 422: // Validation Error
            setErrors(error.response.data.errors);
            break;
          case 419: // CSRF Token Mismatch / Session Expired
            setErrors({ message: 'Your session has expired. Please refresh the page and try again.' });
            break;
          default: // Other server errors (500, 404, etc.)
            setErrors({ message: 'An unexpected error occurred. Please try again later.' });
            break;
        }
      } else {
        // Network error or server is down
        setErrors({ message: 'Could not connect to the server. Please check your network.' });
      }
    }
  };

  const login = async (credentials) => {
    await handleAuthRequest(() => axiosClient.post('/login', credentials));
  };

  const register = async (userData) => {
    await handleAuthRequest(() => axiosClient.post('/register', userData));
  };

  const logout = async () => {
    await axiosClient.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, errors, login, register, logout, setErrors }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the context.
export const useAuth = () => useContext(AuthContext);
