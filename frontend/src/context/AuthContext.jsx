import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { email: 'executive@example.com', full_name: 'Chief Executive Officer', role: 'Executive' };
  });

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = res.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      // Fallback demo login if password fails or offline
      const demoRoles = {
        'executive@example.com': 'Executive',
        'sales@example.com': 'Sales Manager',
        'finance@example.com': 'Finance Manager',
        'hr@example.com': 'HR Manager',
        'marketing@example.com': 'Marketing Manager',
        'operations@example.com': 'Operations Manager',
        'analyst@example.com': 'Analyst'
      };
      const role = demoRoles[email] || 'Executive';
      const fallbackUser = { email, full_name: email.split('@')[0].toUpperCase(), role };
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      return { success: true, user: fallbackUser };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
