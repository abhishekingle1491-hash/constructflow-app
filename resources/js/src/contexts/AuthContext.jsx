import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const csrf = () => axiosClient.get('/sanctum/csrf-cookie');

  const getUser = async () => {
    try {
      const { data } = await axiosClient.get('/user');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  },);

  const login = async (credentials) => {
    await csrf();
    try {
      await axiosClient.post('/login', credentials);
      await getUser();
      setErrors({});
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const register = async (userData) => {
    await csrf();
    try {
      await axiosClient.post('/register', userData);
      await getUser();
      setErrors({});
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const logout = async () => {
    await axiosClient.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, errors, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);