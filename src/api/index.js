import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8077/api',
});

// Request interceptor: attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: just clear token from localStorage
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // just clear token
      localStorage.removeItem('token');
      // optionally reload or redirect
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
