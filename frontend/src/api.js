import axios from 'axios';

// Centralized axios instance. The base URL falls back to the dev proxy.
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL || ''}/api`,
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
