import axios from 'axios';

// Ensure all API calls correctly route through the /api proxy prefix
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to ensure /api prefix and attach JWT token
api.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith('http')) {
    if (!config.url.startsWith('/api') && !config.url.startsWith('api')) {
      const cleanUrl = config.url.startsWith('/') ? config.url : `/${config.url}`;
      config.url = `/api${cleanUrl}`;
    }
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
